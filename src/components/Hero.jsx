import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Button } from './ui/button';

const Hero = () => {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tighter">
            La Tua Visibilità,
            <span className="block bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
              La Nostra Passione.
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
            Diamo forma alla tua comunicazione. <br /> Esperti nella stampa su PVC per risultati che colpiscono.
          </p>
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4, duration: 0.7 }}
          >
            <Button 
                size="lg" 
                className="bg-slate-800/50 border border-white/20 hover:bg-slate-700/70 hover:border-blue-500 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 group"
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Vedi i Prodotti in Promo
              <ArrowDown className="w-5 h-5 ml-2 transition-transform group-hover:translate-y-1" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;