
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { TooltipProvider } from "@/components/ui/tooltip";
import { SupabaseProvider } from '@/context/SupabaseContext';
import { CartProvider } from '@/context/CartContext';
import { PayPalProvider } from '@/context/PayPalContext';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripeClient';
import App from '@/App';

const AppProviders = () => {
  return (
    <Router>
      <HelmetProvider>
        <SupabaseProvider>
          <CartProvider>
            <PayPalProvider>
              <Elements stripe={stripePromise}>
                <TooltipProvider>
                    <App />
                </TooltipProvider>
              </Elements>
            </PayPalProvider>
          </CartProvider>
        </SupabaseProvider>
      </HelmetProvider>
    </Router>
  );
};

export default AppProviders;
