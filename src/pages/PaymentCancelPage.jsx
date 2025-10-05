import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { XCircle, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PaymentCancelPage = () => {
  return (
    <>
      <Helmet>
        <title>Pagamento Annullato | Printora</title>
        <meta name="description" content="Il processo di pagamento è stato annullato. Il tuo carrello è stato salvato, puoi riprovare quando vuoi." />
      </Helmet>
      <div className="py-20 min-h-screen flex items-center justify-center bg-slate-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <XCircle className="w-24 h-24 text-red-400 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">Pagamento Annullato</h1>
            <p className="text-lg text-gray-300 mb-8">
              Il processo di pagamento è stato interrotto. Non ti preoccupare, il tuo carrello è ancora salvo! Puoi tornare al checkout e riprovare quando vuoi.
            </p>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
            >
                <Link to="/checkout">
                    <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold w-full sm:w-auto">
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Torna al Checkout
                    </Button>
                </Link>
                 <Link to="/" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white w-full">
                        Continua lo Shopping
                    </Button>
                </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PaymentCancelPage;