import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Equal, Gift } from 'lucide-react';

const ValueStack = ({ items, regularPrice, offerPrice, theme = 'emerald' }) => {
  const gradientClass = theme === 'violet' 
    ? 'from-violet-600 to-indigo-600'
    : 'from-blue-600 to-indigo-600';
    
  const textClass = theme === 'violet' ? 'text-violet-400' : 'text-blue-400';
  const borderClass = theme === 'violet' ? 'border-violet-500/20' : 'border-blue-500/20';

  const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className={`bg-slate-900/80 backdrop-blur-md rounded-2xl border ${borderClass} p-6 shadow-2xl relative overflow-hidden`}>
      <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${gradientClass} opacity-10 rounded-full blur-[80px]`}/>
      
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Gift className={`w-5 h-5 ${textClass}`} />
        Ecco Cosa Ottieni Oggi:
      </h3>
      
      <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4 relative z-10">
        {items.map((item, idx) => (
          <motion.div variants={fadeUp} key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/5">
            <span className="text-gray-300 font-medium flex items-start gap-2">
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded bg-white/5 text-gray-400`}>Item {idx + 1}</span>
              {item.name}
            </span>
            <span className="text-gray-500 line-through font-mono text-sm self-start sm:self-auto ml-10 sm:ml-0">
              Valore: €{item.value.toFixed(2)}
            </span>
          </motion.div>
        ))}
        
        <motion.div variants={fadeUp} className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-gray-400 text-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="uppercase tracking-wider font-bold">Valore Totale:</span>
              <span className="text-lg line-through text-red-400/80 font-mono">€{regularPrice.toFixed(2)}</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl px-5 py-3 flex items-center gap-3">
             <div className="text-emerald-400 font-bold uppercase text-xs tracking-wider">
               Prezzo<br/>Oggi:
             </div>
             <div className="text-4xl font-black text-white">€{offerPrice}</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ValueStack;
