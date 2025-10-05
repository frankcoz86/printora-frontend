import React from 'react';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { INTEGRATIONS_CONFIG } from '@/config/integrations';

const PAYPAL_CLIENT_ID = "ATF81uitzRR35l2wFyTxBmEg01TOTGW6Ftn7oUIkGdcdCBdDknTei-dyFfWlMWUit6k-3j4137t-8E7b";

const initialOptions = {
  "client-id": PAYPAL_CLIENT_ID,
  currency: "EUR",
  intent: "capture",
  components: "buttons" // keep it simple; remove card-fields
};

export const PayPalProvider = ({ children }) => {
  if (!PAYPAL_CLIENT_ID || PAYPAL_CLIENT_ID === "YOUR_CLIENT_ID") {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900 text-white text-center p-8">
        <div>
          <h1 className="text-2xl font-bold text-red-400 mb-4">Configurazione PayPal Mancante</h1>
          <p>Per abilitare i pagamenti, è necessaria una chiave API valida.</p>
          <p className="mt-2 text-sm text-slate-400">
            Puoi ottenere il tuo ID dal{' '}
            <a
              href="https://developer.paypal.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              sito PayPal Developer
            </a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
};
