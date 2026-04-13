import React, { useState, useEffect } from 'react';
import { ShieldAlert, Fingerprint, ScanEye, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RadarScanner = () => {
  const [scanState, setScanState] = useState(0); // 0: Idle, 1: Scanning, 2: Fixing, 3: Safe
  
  useEffect(() => {
    let timers = [];
    if (scanState === 1) {
      timers.push(setTimeout(() => setScanState(2), 2500));
    } else if (scanState === 2) {
      timers.push(setTimeout(() => setScanState(3), 2000));
    } else if (scanState === 3) {
      timers.push(setTimeout(() => setScanState(0), 4000));
    }
    return () => timers.forEach(clearTimeout);
  }, [scanState]);

  const startScan = () => {
    if (scanState === 0) setScanState(1);
  };

  return (
    <div className="bg-slate-900 border border-blue-500/20 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(59,130,246,0.1)] max-w-2xl mx-auto text-center relative overflow-hidden">
      
      <div className="mb-6 z-10 relative">
        <h3 className="text-xl font-bold text-white">Simulatore Pre-Flight</h3>
        <p className="text-gray-400 text-sm mt-1">Premi il pulsante per vedere quanti errori invisibili nasconde un normale PDF.</p>
      </div>

      {/* Radar Console Area */}
      <div className="relative h-64 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden mb-6 flex flex-col items-center justify-center p-4">
          
          {/* Scanning Line Animation */}
          {scanState === 1 && (
              <motion.div 
                initial={{ top: 0 }} 
                animate={{ top: '100%' }} 
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-1 bg-red-500 w-full shadow-[0_0_20px_rgba(239,68,68,1)] z-20"
              />
          )}

          <AnimatePresence mode="wait">
            {scanState === 0 && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                    <ScanEye className="w-16 h-16 text-slate-700 mb-4" />
                    <div className="text-slate-500 font-mono text-sm">IN ATTESA DI FILE PDF...</div>
                </motion.div>
            )}

            {scanState === 1 && (
                <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center w-full">
                    <Fingerprint className="w-16 h-16 text-yellow-500 mb-4 animate-pulse" />
                    <div className="text-yellow-400 font-mono text-sm mb-4">ANALISI TECNICA IN CORSO...</div>
                    <div className="w-full space-y-2 text-left text-xs font-mono max-w-xs">
                        <div className="text-red-400 flex justify-between"><span>[ERROR] Bleed Margins:</span><span>NOT FOUND</span></div>
                        <div className="text-red-400 flex justify-between"><span>[ERROR] Color Profile:</span><span>RGB Detected</span></div>
                        <div className="text-yellow-400 flex justify-between"><span>[WARN] Image Res:</span><span>72 DPI</span></div>
                    </div>
                </motion.div>
            )}

            {scanState === 2 && (
                <motion.div key="fix" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center w-full">
                    <ShieldAlert className="w-16 h-16 text-blue-500 mb-4 animate-bounce" />
                    <div className="text-blue-400 font-mono text-sm mb-4">INTERVENTO MANUALE ESPERTO PRINTORA...</div>
                    <div className="w-full space-y-2 text-left text-xs font-mono max-w-xs">
                        <div className="text-blue-300 flex justify-between"><span>Fixing Margins...</span><span>ADDED 3mm</span></div>
                        <div className="text-blue-300 flex justify-between"><span>Converting Colors...</span><span>CMYK FOGRA39</span></div>
                        <div className="text-blue-300 flex justify-between"><span>Upscaling Res...</span><span>300 DPI</span></div>
                    </div>
                </motion.div>
            )}

            {scanState === 3 && (
                <motion.div key="safe" initial={{ opacity: 0 }} animate={{ opacity: 1, scale: 1.1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                    <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                    <div className="text-emerald-400 font-mono text-lg font-bold">100% PRINT-READY</div>
                    <div className="text-emerald-500 text-xs font-mono mt-2">Nessun costo extra di re-print generato.</div>
                </motion.div>
            )}
          </AnimatePresence>
      </div>

      <button 
        onClick={startScan}
        disabled={scanState !== 0}
        className={`w-full font-bold uppercase tracking-wider text-sm py-3 px-6 rounded-xl transition-all ${
            scanState === 0 
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
        }`}
      >
        {scanState === 0 ? "Simula Analisi PDF" : "Analisi & Correzione in corso..."}
      </button>

    </div>
  );
};

export default RadarScanner;
