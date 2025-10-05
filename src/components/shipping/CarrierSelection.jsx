import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Loader2, Info } from 'lucide-react';

const CarrierSelection = ({ selectedCarrier, isCalculating, addressValid }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 shadow-xl min-h-[150px]"
        >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Truck className="text-primary" />
                2. Spedizione
            </h2>
            {isCalculating ? (
                 <div className="flex flex-col items-center justify-center h-full text-gray-400 py-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="font-semibold">Calcolo spedizione...</p>
                 </div>
            ) : selectedCarrier ? (
                <div className="p-4 rounded-lg bg-primary/20 border-2 border-primary shadow-lg shadow-blue-500/10 flex justify-between items-center">
                    <div>
                        <p className="font-bold text-white">{selectedCarrier.name}</p>
                        <p className="text-sm text-gray-300">{selectedCarrier.time}</p>
                    </div>
                    <p className="text-lg font-bold text-blue-300">€{selectedCarrier.price.toFixed(2)}</p>
                </div>
            ) : (
                <div className="text-center py-4 text-gray-400 flex items-center justify-center gap-2 bg-slate-700/30 p-3 rounded-lg">
                    <Info size={18} />
                    <p>{addressValid ? 'Nessun metodo di spedizione disponibile.' : 'Inserisci un indirizzo valido per calcolare la spedizione.'}</p>
                </div>
            )}
        </motion.div>
    );
};

export default CarrierSelection;