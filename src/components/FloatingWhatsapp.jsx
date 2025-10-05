import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingWhatsapp = () => {
    const phoneNumber = "393792775116";
    const message = "Ciao, come possiamo aiutarti?";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 bg-green-500 text-white h-16 rounded-full flex items-center justify-center shadow-lg z-30 group"
      initial={{ scale: 0, opacity: 0, x: 100 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5, type: 'spring' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="w-16 h-16 flex items-center justify-center">
        <FaWhatsapp size={32} />
      </div>
      <motion.span 
        className="absolute right-full mr-4 px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-lg whitespace-nowrap origin-right hidden md:block"
        initial={{ scaleX: 0, opacity: 0 }}
        whileHover={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        Serve aiuto? Chatta con noi!
      </motion.span>
    </motion.a>
  );
};

export default FloatingWhatsapp;