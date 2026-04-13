import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const ScarcityTimer = ({ minutes = 15, theme = 'emerald' }) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;

  const colorConfig = {
    emerald: 'bg-emerald-600/20 border-emerald-500/30 text-emerald-400',
    violet: 'bg-violet-600/20 border-violet-500/30 text-violet-400',
    blue: 'bg-blue-600/20 border-blue-500/30 text-blue-400',
    danger: 'bg-red-600/20 border-red-500/30 text-red-500'
  };

  const currentTheme = timeLeft < 60 ? 'danger' : theme;
  const config = colorConfig[currentTheme] || colorConfig.emerald;

  return (
    <div className={`border-b text-center py-2 px-4 shadow-lg sticky top-0 z-50 backdrop-blur-md ${config} transition-colors duration-500`}>
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm font-bold">
        <span className="flex items-center gap-2 animate-pulse text-white">
          <Clock className="w-5 h-5 text-red-500" />
          ATTENZIONE: Offerta Singola a Tempo Limitato
        </span>
        <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-md border border-white/10 font-mono text-lg tracking-widest text-white shadow-inner">
          <span>{m.toString().padStart(2, '0')}</span>
          <span className="animate-pulse">:</span>
          <span>{s.toString().padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
};

export default ScarcityTimer;
