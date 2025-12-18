import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, Loader2, AlertTriangle, FileImage, Info } from 'lucide-react';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

const OrderSummary = ({
  orderTotals,
  selectedCarrier,
  isCheckingOut,
  isReadyForPayment,
  handleStripeCheckout,
}) => {
  const { productsSubtotal, shippingPrice, taxableAmount, vatAmount, total } = orderTotals;
  const { cart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 shadow-xl h-fit sticky top-28"
    >
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <CreditCard className="text-primary" />
        2. Riepilogo e Pagamento
      </h2>

      {/* File previews */}
      <div className="space-y-4 mb-6">
        {cart.map(item => (
          (item.details?.fileUrl || (item.details?.fileUrls && item.details.fileUrls.length > 0)) && (
            <div key={item.id} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
              <h4 className="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                <FileImage size={16} /> File di Stampa per:
              </h4>
              <p className="text-xs text-slate-300 truncate mb-2">{item.name}</p>
              <div className="flex flex-wrap gap-2">
                {item.details.fileUrl && (
                  <img src={item.details.fileUrl} alt="Anteprima file" className="w-16 h-16 object-cover rounded-md border-2 border-slate-600" />
                )}
                {item.details.fileUrls && item.details.fileUrls.map((url, index) => (
                  <img key={index} src={url} alt={`Anteprima file ${index + 1}`} className="w-16 h-16 object-cover rounded-md border-2 border-slate-600" />
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-3">
        <div className="flex justify-between text-gray-300">
          <span>Subtotale prodotti</span>
          <span>€{productsSubtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Spedizione ({selectedCarrier ? selectedCarrier.name : 'N/D'})</span>
          <span>€{shippingPrice.toFixed(2)}</span>
        </div>
        <div className="border-t border-slate-700 my-2" />
        <div className="flex justify-between text-gray-300">
          <span>Imponibile</span>
          <span>€{taxableAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>IVA (22%)</span>
          <span>€{vatAmount.toFixed(2)}</span>
        </div>
        <div className="border-t border-slate-600 my-3" />
        <div className="flex justify-between text-white text-2xl font-bold">
          <span>Totale</span>
          <span className="text-blue-300">€{total.toFixed(2)}</span>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8">
        {!isReadyForPayment && (
          <div className="text-center text-sm text-yellow-400 bg-yellow-900/50 p-3 rounded-lg flex items-center justify-center gap-2">
            <AlertTriangle size={16} />
            Completa i dati di spedizione per pagare.
          </div>
        )}

        {isReadyForPayment && (
          isCheckingOut ? (
            <div className="flex items-center justify-center p-4 h-[150px]">
              <Loader2 className="mr-2 h-8 w-8 animate-spin" />
              <span className="text-gray-400">Elaborazione...</span>
            </div>
          ) : (
            <Button
              onClick={handleStripeCheckout}
              disabled={isCheckingOut}
              className="w-full h-[55px] text-lg bg-purple-600 hover:bg-purple-700"
            >
              {`Paga ora €${total.toFixed(2)}`}
            </Button>
          )
        )}
      </div>

      <div className="mt-4 bg-slate-900/60 border border-cyan-400/40 text-xs text-cyan-100 px-4 md:px-2.5 lg:px-4 py-3 rounded-lg flex items-start justify-center gap-2">
        <Info size={16} className="opacity-80 flex-shrink-0 mt-[1px]" />
        <p className="max-w-xs md:max-w-none text-center md:whitespace-nowrap lg:whitespace-normal">
          Durante il periodo delle festività le spedizioni potrebbero subire dei ritardi.
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 mt-3 text-xs text-green-300">
        <ShieldCheck size={14} /> Pagamento sicuro con Stripe
      </div>
    </motion.div>
  );
};

export default OrderSummary;