import React, { useEffect, useState, useCallback, useRef } from 'react';
import { gtmPush } from '@/lib/gtm';
import { trackPurchase } from '@/lib/fbPixel';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSupabase } from '@/context/SupabaseContext';
import { useCart } from '@/context/CartContext';
import { toast } from '@/components/ui/use-toast';

// Call the Edge Function using supabase client ⇒ adds Authorization automatically
const markPaid = async (supabase, order_id, session_id, payment_summary = null) => {
  const { data, error } = await supabase.functions.invoke('mark-order-paid', {
    body: { order_id, provider: 'stripe', session_id, payment_summary },
  });
  if (error) throw new Error(error.message || `mark-order-paid failed`);
  return data;
};

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { supabase, saveOrder } = useSupabase();
  const { clearCart } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // run-once guard (prevents StrictMode/remount double-fire)
  const ranRef = useRef(false);
  const purchasePushedRef = useRef(false);

  // Build an order object purely from Stripe data (fallback legacy flow)
  const buildOrderFromStripe = (session, lineItems, sessionId) => {
    const currency = session?.currency?.toUpperCase?.() || 'EUR';
    const total = (session?.amount_total || 0) / 100;
    const subtotal = (session?.amount_subtotal ?? session?.amount_total ?? 0) / 100;
    const vatAmount = (session?.total_details?.amount_tax ?? 0) / 100;
    const shippingPrice = (session?.shipping_cost?.amount_total ?? 0) / 100;

    const cartItems = (lineItems || []).map((li) => {
      const qty = Number(li.quantity || 1);
      const lineTotal = (li.amount_total || 0) / 100;
      const unit = qty ? lineTotal / qty : lineTotal;
      return {
        name: li.description || 'Articolo',
        quantity: qty,
        price: unit,
        total: lineTotal,
        currency,
        details: {},
        product: { id: li.price?.product || undefined },
      };
    });

    const built = {
      shipping_address: {
        email: session?.customer_details?.email || session?.customer_email || undefined,
      },
      billing_info: null,
      cart_items: cartItems,
      print_files: [],
      subtotal,
      shipping_cost: shippingPrice,
      vat_amount: vatAmount,
      total_amount: total,
      carrier_info: null,
      status: session?.payment_status === 'paid' ? 'pagato' : 'in_attesa',
      payment_method: 'Stripe',
      payment_details: { session_id: sessionId, currency },
    };

    built.amount = Math.round((built.total_amount ?? 0) * 100); // integer cents
    return built;
  };

  const processStripeSession = useCallback(
    async (sessionId) => {
      try {
        const SAVED_KEY = `printora_order_${sessionId}`;
        const alreadySaved = localStorage.getItem(SAVED_KEY);
        if (alreadySaved) {
          setOrder(JSON.parse(alreadySaved));
          setLoading(false);
          return;
        }

        // 1) Try to fetch Stripe Session from your backend (optional best-effort)
        let session = null;
        try {
          const API = import.meta.env.VITE_BACKEND_URL;
          const r = await fetch(`${API}/api/checkout-session/${sessionId}`);
          if (r.ok) session = await r.json();
        } catch { }

        // 2) Look for a pre-created order id (set before redirect)
        const orderDataString = sessionStorage.getItem('stripe_order_data');
        const sod = orderDataString ? JSON.parse(orderDataString) : null;

        // Preferred path: order pre-created → just mark PAID
        if (sod?.order_id) {
          try { await markPaid(supabase, sod.order_id, sessionId, session || null); } catch { }
          const finalOrder = {
            id: sod.order_id,
            created_at: new Date().toISOString(),
            total_amount: sod?.orderTotals?.total ?? (session?.amount_total ? session.amount_total / 100 : 0),
            billing_info: sod?.billingInfo ?? null,
          };
          setOrder(finalOrder);
          clearCart();
          sessionStorage.removeItem('stripe_order_data');
          localStorage.setItem(SAVED_KEY, JSON.stringify(finalOrder));
          setLoading(false);
          return;
        }

        // Fallback: create order now from whatever we have
        let orderDetails;
        if (orderDataString) {
          const orderData = JSON.parse(orderDataString);
          const printFiles = (orderData.cart || []).reduce((acc, item) => {
            const d = item.details || {};
            if (d.fileUrl) acc.push({ productName: item.name, fileName: d.fileName, fileUrl: d.fileUrl });
            if (Array.isArray(d.fileUrls)) {
              d.fileUrls.forEach((url, index) =>
                acc.push({ productName: `${item.name} (File ${index + 1})`, fileName: d.fileNames ? d.fileNames[index] : `file_${index + 1}`, fileUrl: url })
              );
            }
            return acc;
          }, []);

          orderDetails = {
            shipping_address: orderData.shippingAddress,
            billing_info: orderData.billingInfo,
            cart_items: orderData.cart,
            print_files: printFiles,
            subtotal: orderData.orderTotals?.productsSubtotal ?? undefined,
            shipping_cost: orderData.orderTotals?.shippingPrice ?? 0,
            vat_amount: orderData.orderTotals?.vatAmount ?? 0,
            total_amount: orderData.orderTotals?.total ?? (session?.amount_total ? session.amount_total / 100 : 0),
            carrier_info: orderData.carrier ? { name: orderData.carrier.name, price: orderData.carrier.price } : null,
            status: 'pagato',
            payment_method: 'Stripe',
            payment_details: { session_id: sessionId, currency: session?.currency?.toUpperCase?.() || 'EUR' },
          };
        } else {
          orderDetails = buildOrderFromStripe(session, session?.line_items || [], sessionId);
        }

        orderDetails.amount = Math.round((orderDetails?.total_amount ?? 0) * 100);
        const { data: savedOrder, error: saveError } = await saveOrder(orderDetails);
        if (saveError) throw new Error(`Pagamento riuscito, ma errore nel salvataggio dell'ordine: ${saveError.message}`);

        const finalOrder = Array.isArray(savedOrder) ? savedOrder[0] : savedOrder;
        setOrder(finalOrder);
        clearCart();
        sessionStorage.removeItem('stripe_order_data');
        localStorage.setItem(SAVED_KEY, JSON.stringify(finalOrder));
      } catch (e) {
        console.error('Payment success processing failed:', e);
        setError(e?.message || "Dati dell'ordine non trovati per la sessione Stripe. Contatta l'assistenza.");
      } finally {
        setLoading(false);
      }
    },
    [saveOrder, clearCart, supabase]
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stripeSessionId = params.get('session_id');
    if (!stripeSessionId) {
      setError('ID sessione di pagamento non trovato.');
      setLoading(false);
      setTimeout(() => navigate('/'), 5000);
      return;
    }
    if (ranRef.current) return;      // 🔒 prevents duplicate processing
    ranRef.current = true;
    processStripeSession(stripeSessionId);
  }, [location.search, navigate, processStripeSession]);

  useEffect(() => {
    if (!order || purchasePushedRef.current) return;

    try {
      // Normalize items from your saved order shape
      const rawItems = order.cart_items || order.items || [];
      const items = rawItems.map((it, idx) => {
        const qty = Number(it?.quantity ?? 1) || 1;
        const unit =
          Number(it?.price) ??
          (Number(it?.total) && qty ? Number(it.total) / qty : 0);

        return {
          item_id: String(it?.product?.id ?? it?.sku ?? it?.id ?? `item_${idx + 1}`),
          item_name: String(it?.name ?? `Item ${idx + 1}`),
          price: Number(unit || 0),
          quantity: qty,
          item_category: it?.category || 'custom',
          item_brand: 'Printora',
        };
      });

      const transactionId = String(
        order?.id ?? order?.order_code ?? order?.payment_details?.session_id ?? Date.now()
      );

      gtmPush({
        event: 'purchase',
        ecommerce: {
          transaction_id: transactionId,
          currency: (order?.payment_details?.currency || 'EUR').toUpperCase(),
          value: Number(order?.total_amount ?? order?.total ?? 0),
          tax: Number(order?.vat_amount ?? 0),
          shipping: Number(order?.shipping_cost ?? 0),
          items,
        },
      });

      // Facebook Pixel Purchase event
      trackPurchase({
        content_ids: items.map(it => it.item_id),
        contents: items.map(it => ({
          id: it.item_id,
          quantity: it.quantity
        })),
        value: Number(order?.total_amount ?? order?.total ?? 0),
        currency: (order?.payment_details?.currency || 'EUR').toUpperCase(),
        num_items: items.reduce((sum, it) => sum + it.quantity, 0)
      });

      purchasePushedRef.current = true;
    } catch { }
  }, [order]);

  const handleDownloadInvoice = () => {
    toast({ title: 'Funzione in arrivo!', description: 'La generazione della fattura sarà presto disponibile.' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Elaborazione del tuo ordine...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <h1 className="mt-4 text-2xl font-bold text-center">Si è verificato un errore</h1>
        <p className="mt-2 text-red-300 text-center">{error}</p>
        <p className="mt-4 text-sm text-slate-400 text-center">
          Se il pagamento è stato addebitato, contatta la nostra assistenza.
        </p>
        <Button asChild className="mt-6"><Link to="/">Torna alla Home</Link></Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Pagamento Riuscito | Printora</title>
        <meta name="description" content="Il tuo ordine è stato confermato con successo. Grazie per aver scelto Printora." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className="w-full max-w-2xl bg-slate-800/50 rounded-2xl shadow-2xl p-8 md:p-12 text-center border border-white/10"
        >
          <CheckCircle className="mx-auto h-16 w-16 text-green-400" />
          <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-white">Pagamento Riuscito!</h1>
          <p className="mt-3 text-gray-300">Grazie per il tuo acquisto. Il tuo ordine è stato confermato.</p>

          <div className="mt-8 text-left bg-slate-900/70 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-cyan-300 mb-4">Riepilogo Ordine</h2>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-400">ID Ordine:</span><span className="font-mono text-white">{order?.id || 'N/D'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Data:</span><span className="text-white">{order?.created_at ? new Date(order.created_at).toLocaleDateString('it-IT') : 'N/D'}</span></div>
              <div className="flex justify-between">
                <span className="text-gray-400">Totale Pagato:</span>
                <span className="font-bold text-lg text-green-400">€
                  {order?.total_amount?.toFixed ? order.total_amount.toFixed(2) : Number(order?.total_amount ?? 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-400">Riceverai a breve un'email di conferma con tutti i dettagli.</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto"><Link to="/">Continua lo Shopping</Link></Button>
            {order?.billing_info && (
              <Button variant="outline" size="lg" onClick={handleDownloadInvoice} className="w-full sm:w-auto">
                <Download className="mr-2 h-5 w-5" />Scarica Fattura
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default PaymentSuccessPage;
