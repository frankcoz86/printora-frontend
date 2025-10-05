import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full w-full bg-slate-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-white font-semibold text-lg">Caricamento in corso...</p>
      </motion.div>
    </div>
  );
};

export default Loader;