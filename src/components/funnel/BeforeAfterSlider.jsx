import React, { useState, useRef, useEffect } from 'react';
import { MousePointer2, MoveHorizontal } from 'lucide-react';

const BeforeAfterSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);

  const handleMove = (e) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const position = ((clientX - left) / width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  const handleMouseDown = () => {
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
  };

  const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleMove);
    window.removeEventListener('touchmove', handleMove);
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('touchend', handleMouseUp);
  };

  // Prevent drag selection
  useEffect(() => {
    return () => handleMouseUp();
  }, []);

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl w-full max-w-3xl mx-auto mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-emerald-500/10 w-full h-full blur-3xl rounded-full" />
        
        <div className="text-center mb-6 relative z-10">
            <h3 className="text-xl font-bold text-white mb-2">Visualizza la Differenza Reale</h3>
            <p className="text-gray-400 text-sm">Trascina lo slider per vedere l'impatto di un design professionale rispetto a un template gratuito.</p>
        </div>

      <div 
        ref={containerRef}
        className="relative w-full aspect-video rounded-xl overflow-hidden cursor-ew-resize select-none border border-white/10"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* AFTER IMAGE (Underneath, full width) - The PRO Design */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-emerald-900/40 p-6 sm:p-12 flex flex-col justify-center items-start border-l-4 border-emerald-500">
            <div className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-2">Fatto da un Esperto (Printora)</div>
            <h4 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">Grafica che<br/>Cattura Clienti</h4>
            <div className="bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-lg font-bold inline-block border border-emerald-500/40">
                Immagine Nitida - Zero Sgranature
            </div>
        </div>

        {/* BEFORE IMAGE (On top, clipped width) - The Amateur Design */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-yellow-50 p-6 sm:p-12 flex flex-col justify-center items-start border-l-4 border-red-500"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
            <div className="text-red-500 font-bold uppercase tracking-widest text-xs mb-2">Templato Fai-Da-Te (Canva)</div>
            <h4 className="text-3xl sm:text-4xl font-black text-gray-800 mb-4 leading-tight font-serif">GrAFICA <br/><span className="text-gray-600 font-sans">NON CHIARA</span></h4>
            <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold inline-block border border-red-300">
                Immagine Sfocata (Bassa Risoluzione)
            </div>
            <div className="absolute bottom-4 left-4 text-[10px] text-gray-500 font-mono">*Manca il margine di abbondanza</div>
        </div>

        {/* SLIDER HANDLE */}
        <div 
          className="absolute inset-y-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-20 flex items-center justify-center pointer-events-none"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-800">
            <MoveHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between w-full mt-4 text-xs font-bold uppercase tracking-wider">
          <span className="text-red-400">← Fai-da-te (Rischi)</span>
          <span className="text-emerald-400">Servizio Fatto per Te (Sicurezza) →</span>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
