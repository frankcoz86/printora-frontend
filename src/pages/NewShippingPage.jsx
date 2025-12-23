import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { useSupabase } from '@/context/SupabaseContext';
import { useCart } from '@/context/CartContext';
import { getShippingRate } from '@/config/shippingRates';
import ShippingAddressForm from '@/components/shipping/ShippingAddressForm';
import OrderSummary from '@/components/shipping/OrderSummary';

// Map cart -> canonical invoice items (euros)
function toInvoiceItems(cart) {
  return (cart || []).map(it => {
    const d = it.details || {};
    const variant = [d.dimensions, d.lamination, d.cut].filter(Boolean).join(', ');
    const name = variant ? `${it.name} — ${variant}` : it.name;
    const qty  = Number(it.quantity || 1);
    const unit = Number((it.price ?? (it.total / (it.quantity || 1)) ?? 0));

    // Optional: expose width/height for easier downstream storage
    let width_cm, height_cm;
    const dims = String(d.dimensions || '').trim(); // e.g. "85x200 cm"
    const m = dims.match(/(\d+(?:[.,]\d+)?)\s*x\s*(\d+(?:[.,]\d+)?)/i);
    if (m) {
      width_cm  = parseFloat(m[1].replace(',', '.'));
      height_cm = parseFloat(m[2].replace(',', '.'));
    }

    return { name, quantity: qty, unit_amount: unit, width_cm, height_cm, details: d };
  });
}

/** CORS-safe ping to Apps Script (non-blocking) */
async function fireAppsScript(order, address, printFiles, totals, payMethod, cart, billingInfo) {
  try {
    const appsUrl = import.meta.env.VITE_APPS_SCRIPT_URL;
    if (!appsUrl) return;

    // Normalize optional billing fields
    const sdi =
      (billingInfo?.sdiCode || billingInfo?.recipientCode || '').trim();
    const pec =
      (billingInfo?.pec || billingInfo?.pecAddress || '').trim();

    const payload = {
      event: 'ORDER_CREATED',
      id: order.id,
      order_code: order.order_code,
      created_at: order.created_at,
      planned_drive_path: order.planned_drive_path,

      // include phone & notes (your code already spreads address)
      shipping: {
        ...address,
        country: 'IT',
      },

      // ✅ Send billing with SDI + PEC so Apps Script → FIC uses them
      billing: {
        company: (billingInfo?.companyName || address.company || null) || null,
        vat_number: (billingInfo?.vatId || '').trim() || null,          // already wired
        tax_code: (billingInfo?.codiceFiscale || '').trim() || null,    // already wired
        email: (billingInfo?.billingEmail || '').trim() || null,
        recipient_code: sdi || null,
        sdiCode: sdi || null,// 👈 SDI / Codice Destinatario
        pec: pec || null               // 👈 PEC address
      },

      print_files: printFiles,
      amount: Math.round((totals?.total || 0) * 100),
      payment_method: payMethod || 'card',
      items: toInvoiceItems(cart),

      // totals that Apps Script already uses
      shipping_total: totals?.shippingPrice ?? 0,
      discount_total: 0,
      tax_rate: 22,
      tax_cents: Math.round((totals?.vatAmount ?? 0) * 100),
      amount_total_cents: Math.round((totals?.total ?? 0) * 100),
    };

    fetch(appsUrl, {
      method: 'POST',
      mode: 'no-cors',
      keepalive: true,
      body: JSON.stringify(payload)
    }).catch(() => {});
  } catch {}
}

/** After PayPal capture: tell Apps Script to build & email the invoice */
/** After PayPal capture: tell Apps Script to build & email the invoice */
async function fireAppsScriptPaymentSucceeded(order, address, printFiles, totals, paypalDetails, cart, billingInfo) {
  try {
    const appsUrl = import.meta.env.VITE_APPS_SCRIPT_URL;
    if (!appsUrl) return;

    // ✅ CRITICAL: Normalize billing fields to match Apps Script expectations
    const payload = {
      event: 'PAYMENT_SUCCEEDED',
      id: order.id,
      order_code: order.order_code,
      currency: 'EUR',

      items: toInvoiceItems(cart),
      
      shipping: {
        name: `${address.name} ${address.surname}`.trim(),
        email: address.email,
        company: address.company,
        address: address.address,
        city: address.city,
        province: address.province,
        postcode: address.zip,
        country: 'IT',
        phone: address.phone || '',
        notes: address.notes || '',
      },

 billing: {
   company: (billingInfo?.companyName || address.company || null) || null,
   vat_number: (billingInfo?.vatId || '').trim() || null,
   tax_code: (billingInfo?.codiceFiscale || '').trim() || null,
   email: (billingInfo?.billingEmail || address.email || '').trim() || null,
   // send BOTH keys that Apps Script understands:
   recipient_code: (billingInfo?.sdiCode || billingInfo?.recipientCode || '').trim() || null,
   sdiCode: (billingInfo?.sdiCode || '').trim() || null,
   pec: (billingInfo?.pec || billingInfo?.pecAddress || '').trim() || null
 },

      payment_details: {
        provider: 'paypal',
        id: paypalDetails?.id,
        status: paypalDetails?.status || 'COMPLETED',
        customer_email: address.email,
        amount_total: Math.round(Number(totals.total || 0) * 100),
        total_details: {
          amount_tax:      Math.round(Number(totals.vatAmount || 0) * 100),
          amount_shipping: Math.round(Number(totals.shippingPrice || 0) * 100),
          amount_discount: 0
        },
        line_items: [{
          description: 'Order from Printora',
          quantity: 1,
          amount_total: Math.round(Number(totals.total || 0) * 100),
          currency: 'eur'
        }]
      },

      shipping_total: totals?.shippingPrice ?? 0,
      discount_total: 0,
      tax_rate: 22,
      tax_cents: Math.round((totals?.vatAmount ?? 0) * 100),
      amount_total_cents: Math.round((totals?.total ?? 0) * 100),

      force_build: true,
      force_email: true
    };

    await fetch(appsUrl, { method: 'POST', body: JSON.stringify(payload) });
  } catch {}
}

const NewShippingPage = () => {
  const cartCtx = useCart();
  const outlet = useOutletContext?.() || {};
  const cartHook = outlet.cartHook || cartCtx;

  const { cart = [], getCartSubtotal = () => 0, clearCart = () => {}, getCartWeight = () => 0 } = cartHook;
  const { supabase, saveOrder } = useSupabase();
  const navigate = useNavigate();

  // NEW: include phone & notes in state
  const [address, setAddress] = useState({
    name: '', surname: '', email: '', company: '',
    address: '', city: '', zip: '', province: '',
    phone: '', notes: ''
  });

  const [billingInfo, setBillingInfo] = useState({
    companyName: '',
    vatId: '',
    codiceFiscale: '',  // ← keep in state
    sdiCode: '',
    pec: '',
    billingEmail: ''
  });
  const [selectedCarrier, setSelectedCarrier] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('paypal');

  const [showXmasNotice, setShowXmasNotice] = useState(false);

  useEffect(() => {
    if (address.email) setBillingInfo(p => ({ ...p, billingEmail: address.email }));
  }, [address.email]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setShowXmasNotice(true);
      return;
    }
    try {
      const dismissed = window.localStorage.getItem('printora_xmas_shipping_notice_dismissed');
      if (!dismissed) {
        setShowXmasNotice(true);
      }
    } catch {
      setShowXmasNotice(true);
    }
  }, []);

  // Make company & notes optional (exclude from required set), but phone is now mandatory
  const addressValid = useMemo(() => {
    const { company, notes, ...req } = address;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return Object.values(req).every(v => v && v.trim() !== '') && emailRegex.test(address.email);
  }, [address]);

  const billingInfoValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasReq = billingInfo.codiceFiscale;
    return hasReq && billingInfo.billingEmail && emailRegex.test(billingInfo.billingEmail);
  }, [billingInfo]);

  const isReadyForPayment = useMemo(() => addressValid && billingInfoValid, [addressValid, billingInfoValid]);

  const subtotal = getCartSubtotal();
  const weight = getCartWeight();

  useEffect(() => {
    if (cart.length === 0 && !isCheckingOut) {
      toast({ title: 'Carrello vuoto', description: 'Aggiungi prodotti al carrello prima di procedere.', variant: 'destructive' });
      navigate('/carrello');
    }
  }, [cart, navigate, isCheckingOut]);

  useEffect(() => { setSelectedCarrier(getShippingRate(weight)); }, [weight]);

  const handleCloseXmasNotice = () => {
    setShowXmasNotice(false);
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('printora_xmas_shipping_notice_dismissed', '1');
    } catch {}
  };

  const orderTotals = useMemo(() => {
    const shippingPrice = selectedCarrier ? selectedCarrier.price : 0;
    const taxableAmount = subtotal + shippingPrice;
    const vatAmount = taxableAmount * 0.22;
    const total = taxableAmount + vatAmount;
    return { productsSubtotal: subtotal, shippingPrice, taxableAmount, vatAmount, total };
  }, [subtotal, selectedCarrier]);

  /** Build a clean, deduped print_files array (ignore any data-URL legacy fields) */
  const buildPrintFiles = (items) => {
    const out = [];
    const seen = new Set();
    const pushSafe = (item, pf) => {
      const fid = pf?.driveFileId || pf?.drive_file_id;
      if (!fid) return;
      const key = fid + '|' + (pf.kind || 'client-upload');
      if (seen.has(key)) return;
      seen.add(key);
      out.push({
        productName: item.name,
        fileName: pf.fileName || item.details?.fileName || 'file',
        kind: (pf.kind || item.details?.kind || 'client-upload').toLowerCase(),
        driveFileId: fid,
        driveLink: pf.driveLink || item.details?.driveLink,
        mimeType: pf.mimeType || item.details?.mimeType,
        size: pf.size || item.details?.size,
        productId: item.product?.id,
      });
    };

    items.forEach((item) => {
      const d = item.details || {};
      if (d.driveFileId) pushSafe(item, d);
      (Array.isArray(d.printFiles) ? d.printFiles : []).forEach(p => pushSafe(item, p));
    });
    return out;
  };

  // Saves the order record used by your “Thank you” page (PayPal path)
  const handleSaveOrder = useCallback(async (paymentMethod, paymentDetails) => {
    const printFiles = buildPrintFiles(cart);

    const orderDetails = {
      shipping_address: address,                 // includes phone & notes
      billing_info: billingInfo,
      cart_items: cart,
      print_files: printFiles,
      subtotal: orderTotals.productsSubtotal,
      shipping_cost: orderTotals.shippingPrice,
      vat_amount: orderTotals.vatAmount,
      total_amount: orderTotals.total,
      carrier_info: selectedCarrier ? { name: selectedCarrier.name, price: selectedCarrier.price } : null,
      status: 'pagato',
      payment_method: paymentMethod,
      payment_details: paymentDetails,
    };

    const { data: savedOrder, error } = await saveOrder(orderDetails);
    if (error || !savedOrder) {
      console.error('Error saving order:', error);
      toast({ title: "Errore nel salvataggio dell'ordine", description: 'Non è stato possibile salvare il tuo ordine. Contatta l’assistenza.', variant: 'destructive' });
      navigate('/payment-cancel');
      return null;
    }
    return savedOrder;
  }, [cart, address, billingInfo, orderTotals, selectedCarrier, saveOrder, navigate]);

  /** ---- PayPal ---- */
  const createOrderForPaypal = useCallback((_data, actions) => {
    if (!isReadyForPayment) {
      toast({
        title: 'Dati incompleti',
        description: 'Completa tutti i campi obbligatori per procedere.',
        variant: 'destructive',
      });
    }
    const totalValue = orderTotals.total.toFixed(2);

    const items = cart.map((item) => {
      const qty = Number(item.quantity || 1);
      const perUnit = Number(
        item.price ?? (qty ? (Number(item.total || 0) / qty) : 0)
      );
      return {
        name: String(item.name || '').substring(0, 127),
        unit_amount: { currency_code: 'EUR', value: perUnit.toFixed(2) },
        quantity: String(qty),
        category: 'PHYSICAL_GOODS',
      };
    });

    const purchaseUnit = {
      amount: {
        currency_code: 'EUR',
        value: totalValue,
        breakdown: {
          item_total: { currency_code: 'EUR', value: orderTotals.productsSubtotal.toFixed(2) },
          shipping:   { currency_code: 'EUR', value: orderTotals.shippingPrice.toFixed(2) },
          tax_total:  { currency_code: 'EUR', value: orderTotals.vatAmount.toFixed(2) },
        },
      },
      items,
      shipping: {
        name: { full_name: `${address.name} ${address.surname}`.trim() },
        address: {
          address_line_1: address.address,
          admin_area_2:    address.city,
          admin_area_1:    address.province,
          postal_code:     address.zip,
          country_code:   'IT',
        },
      },
    };

    return actions.order
      .create({
        application_context: { shipping_preference: 'SET_PROVIDED_ADDRESS', user_action: 'PAY_NOW' },
        purchase_units: [purchaseUnit],
      })
      .then((id) => id);
  }, [isReadyForPayment, orderTotals, cart, address]);

  const onApproveOrder = useCallback(async (data, actions) => {
    setIsCheckingOut(true);
    try {
      const details = await actions.order.capture();

      const savedOrder = await handleSaveOrder('PayPal', details);
      if (!savedOrder) throw new Error('Salvataggio ordine fallito');

      const printFiles = buildPrintFiles(cart);

      // Drive folder & file moves
      fireAppsScript(savedOrder, address, printFiles, orderTotals, 'paypal', cart, billingInfo);

      // Build & email invoice
      await fireAppsScriptPaymentSucceeded(savedOrder, address, printFiles, orderTotals, details, cart, billingInfo);

      clearCart();
      navigate(`/payment-success?order_id=${savedOrder.id}&transaction_id=${details.id}`);
    } catch (error) {
      console.error('Error capturing order: ', error);
      toast({ title: 'Errore nella transazione', description: 'Pagamento non completato. Riprova o contatta l’assistenza.', variant: 'destructive' });
      if (!window.location.pathname.includes('payment-cancel')) navigate('/payment-cancel');
    } finally { setIsCheckingOut(false); }
  }, [handleSaveOrder, clearCart, navigate, cart, address, orderTotals, billingInfo]);

  /** ---- Stripe ---- */
  const handleStripeCheckout = async () => {
    if (!isReadyForPayment) {
      toast({ title: 'Dati incompleti', description: 'Completa tutti i campi obbligatori per procedere.', variant: 'destructive' });
      return;
    }
    setIsCheckingOut(true);
    try {
      const printFiles = buildPrintFiles(cart);

      const payload = {
        customer: { first_name: address.name, last_name: address.surname, email: address.email, phone: address.phone || undefined },
        shipping: {
          name: `${address.name} ${address.surname}`,
          email: address.email,
          company: address.company,
          address: address.address,
          city: address.city,
          postcode: address.zip,
          province: address.province,
          country: 'IT',
          // NEW:
          phone: address.phone || '',
          notes: address.notes || '',
        },
        // (Stripe function payload unchanged otherwise)
        items: toInvoiceItems(cart),
        print_files: printFiles,
        amount: Math.round(orderTotals.total * 100),
        currency: 'EUR',
        payment_method: 'card',
        shipping_total: orderTotals.shippingPrice,     // euros
        discount_total: 0,                             // euros
        tax_rate: 22,
        tax_cents: Math.round(orderTotals.vatAmount * 100),
        amount_total_cents: Math.round(orderTotals.total * 100),
      };

      const { data, error } = await supabase.functions.invoke('create-order', { body: payload });
      if (error) throw new Error(error.message || 'create-order failed');
      const order = data?.order;

      const orderData = {
        cart,
        shippingAddress: address,
        billingInfo: billingInfo,
        orderTotals,
        carrier: selectedCarrier,
        order_id: order?.id,
        order_code: order?.order_code,
        planned_drive_path: order?.planned_drive_path,
      };
      sessionStorage.setItem('stripe_order_data', JSON.stringify(orderData));

      // Send ORDER_CREATED (includes billing) to Apps Script
      fireAppsScript(order, address, printFiles, orderTotals, 'card', cart, billingInfo);

      navigate('/stripe-redirect');
    } catch (err) {
      console.error(err);
      toast({ title: "Errore nell'inizializzazione ordine", description: err?.message || 'Impossibile creare l’ordine. Riprova.', variant: 'destructive' });
      setIsCheckingOut(false);
    }
  };

  const onError = (err) => { console.error('PayPal onError', err); toast({ title: 'Errore PayPal', description: 'Si è verificato un errore durante il pagamento.', variant: 'destructive' }); setIsCheckingOut(false); };
  const onCancel = (data) => { console.log('PayPal onCancel', data); toast({ title: 'Pagamento annullato', description: 'Hai annullato il processo di pagamento.' }); setIsCheckingOut(false); };

  return (
    <>
      <Helmet>
        <title>Checkout | Pagamento Sicuro | Printora</title>
        <meta name="description" content="Completa il tuo ordine inserendo i dati di spedizione e fatturazione. Pagamento sicuro con PayPal e Stripe." />
        <meta name="keywords" content="checkout, spedizione, pagamento, fatturazione, printora, paypal, stripe, carta di credito" />
      </Helmet>
      <AnimatePresence>
        {showXmasNotice && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative mx-4 max-w-lg w-full rounded-2xl bg-slate-900/90 border border-amber-400/30 shadow-2xl shadow-amber-500/20 p-6 sm:p-8"
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 12 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
              <button
                type="button"
                onClick={handleCloseXmasNotice}
                className="absolute top-3 right-3 text-slate-300 hover:text-white bg-slate-800/60 rounded-full w-8 h-8 flex items-center justify-center text-sm border border-white/10 transition-colors"
                aria-label="Chiudi avviso spedizioni"
              >
                ×
              </button>

              <p className="text-xs uppercase tracking-[0.2em] text-amber-300 mb-2">
                Avviso spedizioni natalizie
              </p>
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">
                Le consegne potrebbero richiedere più tempo
              </h2>
              <p className="text-sm sm:text-base text-slate-200 mb-4">
                A causa dell'alta richiesta per il periodo di Natale, gli ordini potrebbero richiedere un po' più tempo per essere consegnati. Faremo comunque il possibile per spedire nel minor tempo possibile.
              </p>
              <p className="text-xs text-slate-400 mb-6">
                Ti ringraziamo per la comprensione e la pazienza durante questo periodo di alta richiesta.
              </p>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseXmasNotice}
                  className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium bg-amber-500 text-slate-900 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/30"
                >
                  Ho capito
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to slate-400">Finalizza il tuo Ordine</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2">
              <ShippingAddressForm
                address={address}
                setAddress={setAddress}
                billingInfo={billingInfo}
                setBillingInfo={setBillingInfo}
              />
            </div>
            <div className="lg:col-span-1">
              <OrderSummary
                orderTotals={orderTotals}
                selectedCarrier={selectedCarrier}
                isCheckingOut={isCheckingOut}
                isReadyForPayment={isReadyForPayment}
                handleStripeCheckout={handleStripeCheckout}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};
export default NewShippingPage
