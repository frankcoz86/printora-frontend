import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Palette } from 'lucide-react';

/**
 * GraficaOfferBlock
 * Compact violet card injected into BannerPage sidebar
 * between TechnicalSupportCta and BannerPriceCalculatorOffer.
 */
const GraficaOfferBlock = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    className="mb-6 rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-950/50 to-slate-900/80 p-4 shadow-lg shadow-violet-900/20"
  >
    {/* Badge */}
    <p className="flex items-center gap-1.5 text-[10px] font-black tracking-[0.2em] text-violet-400 uppercase mb-2">
      <Palette className="w-3.5 h-3.5" />
      Servizio Grafica Expert
    </p>

    {/* Headline */}
    <h3 className="text-white font-bold text-sm mb-1 leading-snug">
      Non hai la grafica? Il nostro esperto la crea per te.
    </h3>

    {/* Sub */}
    <p className="text-gray-400 text-xs mb-3 leading-relaxed">
      Prezzo fisso <span className="text-violet-300 font-semibold">€15</span> · File CMYK
      pronto in 24h · 1 revisione inclusa · Garanzia rimborso
    </p>

    {/* Checklist mini */}
    <ul className="space-y-1.5 mb-4">
      {[
        'Crea o corregge il file dal tuo brief',
        'Conversione CMYK + risoluzione corretta',
        'Consegna entro 24 ore lavorative',
      ].map((item) => (
        <li key={item} className="flex items-center gap-2 text-gray-300 text-xs">
          <CheckCircle className="w-3.5 h-3.5 text-violet-400 shrink-0" />
          {item}
        </li>
      ))}
    </ul>

    {/* CTA */}
    <Link
      to="/consulenza-grafica"
      className="flex items-center justify-center gap-2 w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-2.5 rounded-lg text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-violet-700/40"
    >
      Scopri come funziona
      <ArrowRight className="w-4 h-4" />
    </Link>
  </motion.div>
);

export default GraficaOfferBlock;
