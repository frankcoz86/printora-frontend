import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStripe } from '@stripe/react-stripe-js';
import { toast } from '@/components/ui/use-toast';
import Loader from '@/components/Loader';

const StripeRedirectPage = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const ranRef = useRef(false);

  useEffect(() => {
    console.log('useEffect triggered, stripe state:', !!stripe);

    if (!stripe) {
      console.log('Stripe not ready yet...');
      return; // wait until Stripe.js is ready
    }

    if (!stripe.redirectToCheckout) {
      console.log('Stripe redirectToCheckout method not available yet...');
      return;
    }

    if (ranRef.current) {
      console.log('Already ran, skipping...');
      return; // prevent Strict Mode double run in dev
    }
    ranRef.current = true;

    console.log('Starting checkout process with Stripe instance:', stripe);

    (async () => {
      try {
        const orderDataString = sessionStorage.getItem('stripe_order_data');
        if (!orderDataString) {
          throw new Error("Dati dell'ordine non trovati. Ritorno al checkout.");
        }

        const orderData = JSON.parse(orderDataString);
        console.log('Order data:', orderData);

        // ---- Build a lean payload (no huge design blobs / base64) ----
        const itemsForStripe = (orderData.cart || []).map((item) => ({
          name: item.name,
          quantity: Number(item.quantity) || 1,
          // store in cents (server can ignore if using single-line-item total)
          unit_amount: Math.round(Number(item.price || 0) * 100),
          // only include http(s) image URLs; never data URIs
          image:
            typeof item.image === 'string' && item.image.startsWith('http')
              ? item.image
              : undefined,
        }));

        const payload = {
          items: itemsForStripe,
          // keep as number; server multiplies by 100
          amount: Number(orderData.orderTotals?.total || 0),
          shippingAddress: {
            email: orderData?.shippingAddress?.email || undefined,
          },
          metadata: {
            item_count: String(itemsForStripe.length || 0),
          },
        };

        console.log('Creating checkout session with lean payload...');

        // Add timeout to the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s
        
        const API = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${API}/api/create-checkout-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        console.log('Response status:', res.status);

        if (!res.ok) {
          const errorText = await res.text();
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { error: errorText || `HTTP ${res.status}` };
          }
          throw new Error(
            errorData.error || `La creazione della sessione di checkout è fallita (${res.status}).`
          );
        }

        const data = await res.json();
        console.log('Checkout session created:', data);

        if (!data?.id) {
          throw new Error('Nessun sessionId ricevuto dal server.');
        }

        console.log('Redirecting to Stripe with session ID:', data.id);

        // Prefer server-provided URL when available
        if (data.url) {
          console.log('Using Stripe session URL:', data.url);
          window.location.href = data.url;
          return;
        }

        // Standard Stripe redirect
        if (stripe && typeof stripe.redirectToCheckout === 'function') {
          console.log('Attempting Stripe.redirectToCheckout...');
          const result = await Promise.race([
            stripe.redirectToCheckout({ sessionId: data.id }),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Redirect timeout after 5 seconds')), 5000)
            ),
          ]);

          console.log('Stripe redirect result:', result);

          if (result?.error) {
            console.warn('Stripe redirect error:', result.error);
            const checkoutUrl = `https://checkout.stripe.com/c/pay/${data.id}`;
            console.log('Falling back to manual redirect:', checkoutUrl);
            window.location.href = checkoutUrl;
          }
        } else {
          // Manual fallback
          const checkoutUrl = `https://checkout.stripe.com/c/pay/${data.id}`;
          console.log('Direct manual redirect to:', checkoutUrl);
          window.location.href = checkoutUrl;
        }

        // If still here, redirect likely failed
        await new Promise((resolve) => setTimeout(resolve, 2000));
        throw new Error('Redirect failed - please try again');
      } catch (err) {
        console.error('Stripe redirect error:', err);

        let errorMessage;
        if (err.name === 'AbortError') {
          errorMessage = 'La richiesta ha impiegato troppo tempo. Riprova.';
        } else if (err.message?.includes('fetch')) {
          errorMessage = 'Errore di connessione al server. Controlla la connessione internet.';
        } else {
          errorMessage = err.message || 'Si è verificato un errore imprevisto.';
        }

        setError(errorMessage);
        setIsProcessing(false);

        toast({
          title: 'Errore di reindirizzamento a Stripe',
          description: errorMessage,
          variant: 'destructive',
        });

        // Prevent repeated failed attempts
        sessionStorage.removeItem('stripe_order_data');

        // Navigate back after showing error
        setTimeout(() => navigate('/checkout'), 5000);
      }
    })();
  }, [stripe, navigate]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      {isProcessing && <Loader />}
      <h1 className="text-2xl font-bold mt-4">
        {isProcessing ? 'Reindirizzamento a Stripe...' : 'Errore'}
      </h1>
      <p className="text-slate-400 mt-2">
        {isProcessing
          ? 'Stai per essere reindirizzato alla pagina di pagamento sicura.'
          : 'Si è verificato un problema con il reindirizzamento.'}
      </p>
      {error && (
        <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-center max-w-md">
          <p className="font-bold">Si è verificato un errore:</p>
          <p className="text-red-300">{error}</p>
          <p className="mt-2 text-sm">Sarai reindirizzato al checkout tra pochi secondi.</p>
          <button
            onClick={() => navigate('/checkout')}
            className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
          >
            Torna al Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default StripeRedirectPage;
