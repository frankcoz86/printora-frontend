import React, { useState } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';

const RoiCalculator = () => {
  const [hourlyRate, setHourlyRate] = useState(25);
  const [hoursSpent, setHoursSpent] = useState(3);

  const diyCost = hourlyRate * hoursSpent;
  const printoraCost = 15;
  const savings = diyCost - printoraCost;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl max-w-2xl mx-auto relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Calculator className="w-32 h-32 text-white" />
      </div>

      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-2">Il Calcolatore del "Tuo Tempo"</h3>
        <p className="text-gray-400 text-sm mb-8">Scopri quanto ti costa realmente fare la grafica da solo.</p>

        <div className="space-y-6 mb-8">
          <div>
            <label className="flex justify-between text-sm font-bold text-gray-300 mb-2">
              <span>Quanto vale un'ora del tuo tempo?</span>
              <span className="text-emerald-400">€{hourlyRate}/h</span>
            </label>
            <input 
              type="range" min="10" max="100" step="5" 
              value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div>
            <label className="flex justify-between text-sm font-bold text-gray-300 mb-2">
              <span>Ore perse a studiare Canva e impaginare:</span>
              <span className="text-emerald-400">{hoursSpent} ore</span>
            </label>
            <input 
              type="range" min="1" max="10" step="1" 
              value={hoursSpent} onChange={(e) => setHoursSpent(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-5 border border-white/5 grid gap-4">
          <div className="flex justify-between items-center text-gray-300 pb-4 border-b border-white/10">
            <span className="font-medium">Costo Occulto (Il tuo tempo):</span>
            <span className="text-xl font-mono text-red-400">€{diyCost}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <strong className="text-white">Costo Printora (Zero sforzo):</strong>
            <span className="text-2xl font-black text-emerald-400 font-mono">€{printoraCost}</span>
          </div>
          
          {savings > 0 ? (
            <div className="pt-2 flex flex-col items-center justify-center text-center">
              <span className="text-sm text-gray-400 mb-1">Cosa perdi se non accetti l'offerta:</span>
              <div className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg font-bold border border-emerald-500/30 flex items-center gap-2">
                Stai sprecando €{savings} di tempo <ArrowRight className="w-4 h-4"/>
              </div>
            </div>
          ) : (
            <div className="pt-2 text-center text-gray-400 text-sm italic">
                Wow, il tuo tempo non vale molto! Ma pensa al risultato finale professionale...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoiCalculator;
