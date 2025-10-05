import React from 'react';
import { motion } from 'framer-motion';
import { Printer } from 'lucide-react';

const Logo = ({ className }) => {
  return (
    <motion.div
      className={`flex items-center space-x-3 ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="relative flex items-center justify-center w-12 h-12 rounded-xl overflow-hidden shadow-lg">
        {/* Background animato con effetto glassmorphism */}
        <motion.div
          className="absolute inset-0"
          initial={{ backgroundPosition: '0% 0%' }}
          animate={{ backgroundPosition: '100% 100%' }}
          transition={{
            duration: 10,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            background: 'linear-gradient(45deg, #2DD4BF, #3B82F6, #2DD4BF)',
            backgroundSize: '200% 200%',
            filter: 'blur(8px) brightness(1.2)',
            opacity: 0.8,
          }}
        />
        {/* Overlay per l'effetto glassmorphism */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20" />

        <motion.div
          animate={{
            y: [0, -2, 0], // Subtle bounce
            rotate: [0, 0.5, -0.5, 0], // Slight rotation
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5,
          }}
          className="z-10"
        >
          <Printer className="w-8 h-8 text-white" />
        </motion.div>
      </div>
      <div className="hidden md:block">
        <span className="text-2xl font-extrabold text-white tracking-tight">Printora</span>
        <p className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">Stampa Digitale Pro</p>
      </div>
    </motion.div>
  );
};

export default Logo;