import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

const RiskAssessor = () => {
  const [printCost, setPrintCost] = useState(300);

  // Math logic
  const reprintRisk = printCost; // Total loss if file is wrong
  const printoraCost = 15;
  const ratio = Math.round(reprintRisk / printoraCost);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl max-w-2xl mx-auto relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <AlertTriangle className="w-40 h-40 text-red-500" />
      </div>

      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-2">Assicurazione Rischio Stampa</h3>
        <p className="text-gray-400 text-sm mb-8">Usa lo slider per inserire il valore del tuo ordine di stampa.</p>

        <div className="space-y-6 mb-8">
          <div>
            <label className="flex justify-between text-sm font-bold text-gray-300 mb-2">
              <span>Valore Totale Ordine di Stampa:</span>
              <span className="text-blue-400">€{printCost}</span>
            </label>
            <input 
              type="range" min="50" max="2000" step="50" 
              value={printCost} onChange={(e) => setPrintCost(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 flex flex-col items-center justify-center text-center">
                <ShieldAlert className="w-8 h-8 text-red-400 mb-2" />
                <span className="text-sm font-bold text-red-400 mb-1">Rischio Perdita</span>
                <span className="text-3xl font-black text-white font-mono">€{reprintRisk}</span>
                <span className="text-[10px] text-red-500/70 mt-2 uppercase tracking-wide">Se il file è errato</span>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/20 rounded-full blur-xl" />
                <span className="text-sm font-bold text-blue-400 mb-1 relative z-10">Assicurazione Printora</span>
                <span className="text-3xl font-black text-white font-mono relative z-10">€{printoraCost}</span>
                <span className="text-[10px] text-blue-300/70 mt-2 uppercase tracking-wide relative z-10">Zero sorprese. Sempre.</span>
            </div>

        </div>

        <div className="mt-6 bg-slate-800 rounded-lg p-4 text-center border border-white/5">
            <p className="text-sm text-gray-400">
                Stai mettendo a rischio <strong className="text-white">€{printCost}</strong> per risparmiare 
                <strong className="text-blue-400"> €15</strong>? 
                (Un rapporto di 1 a {ratio}).
                <br/>Ne vale davvero la pena?
            </p>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessor;
