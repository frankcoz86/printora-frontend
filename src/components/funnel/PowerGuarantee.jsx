import React from 'react';
import { ShieldCheck } from 'lucide-react';

const PowerGuarantee = () => {
  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-emerald-500/20 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px] pointer-events-none"/>
      
      <div className="shrink-0 relative">
        <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-30 rounded-full animate-pulse"/>
        <div className="relative bg-emerald-500/20 p-4 border border-emerald-500/40 rounded-full">
            <ShieldCheck className="w-12 h-12 text-emerald-400" />
        </div>
      </div>
      
      <div className="text-center sm:text-left relative z-10">
        <h4 className="text-xl font-black text-white uppercase tracking-wide mb-2 flex items-center justify-center sm:justify-start gap-2">
          La Garanzia <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">"Pazzo 110%"</span>
        </h4>
        <p className="text-gray-300 text-sm leading-relaxed">
          Il tuo investimento di €15 è blindato. Se non sei <strong>assolutamente innamorato</strong> del lavoro che facciamo per te, non solo ti rimborsiamo l'intero importo all'istante, ma ti regaliamo anche un coupon da €20 per farti perdonare il disturbo. Il rischio è completamente sulle nostre spalle.
        </p>
      </div>
    </div>
  );
};

export default PowerGuarantee;
