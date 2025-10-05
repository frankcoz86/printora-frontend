import React from 'react';
import { motion } from 'framer-motion';
import { Check, Droplets, Award } from 'lucide-react';
import BannerPriceCalculator from '@/components/BannerPriceCalculator';
import RollupSelector from '@/components/RollupSelector';

const ProductCard = ({ product, onAddToCart }) => {

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };
  
  const accentBorderClass = "hover:border-primary/50";
  const priceColorClass = "text-primary";

  return (
    <motion.div
      variants={cardVariants}
      className={`bg-slate-800/40 rounded-3xl p-6 md:p-8 border border-white/10 ${accentBorderClass} transition-all duration-300 flex flex-col h-full shadow-2xl shadow-black/40`}
    >
      <div className="relative overflow-hidden rounded-2xl mb-4 group">
        <img
          className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
          alt={product.imageAlt}
          src={product.image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
      </div>

      <div className="flex justify-between items-start mb-4">
        <h3 className="text-3xl font-extrabold text-white tracking-tight">{product.name}</h3>
        <div className="flex items-center gap-2 bg-accent/90 backdrop-blur-sm text-accent-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg border border-orange-400/50 shrink-0">
            <Award size={14}/>
            PREZZO PROMO
        </div>
      </div>

      <div className="flex items-end justify-between border-b border-white/10 pb-4">
          <div>
              <p className="text-sm text-rose-400">Listino: <span className="line-through">€{product.list_price.toFixed(2)}</span></p>
              <p className="text-sm text-emerald-300 font-semibold">Prezzo Promo:</p>
              <p className={`text-4xl font-bold ${priceColorClass}`}>€{product.price.toFixed(2)}<span className="text-xl font-medium text-gray-400">/{product.unit}</span></p>
              <p className="text-xs text-gray-400">+ IVA</p>
          </div>
          <div className="text-center">
              <p className="text-xs text-orange-400 font-bold uppercase">Offerta Speciale</p>
          </div>
      </div>

      <div className="space-y-4 flex-grow flex flex-col">
        <p className="text-gray-300 text-sm leading-relaxed flex-grow">{product.description}</p>
        
        <div className="space-y-2 pt-2">
          <h4 className="font-semibold text-white">Caratteristiche Principali:</h4>
          {product.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-400 shrink-0" />
              <span className="text-sm text-gray-300">{feature}</span>
            </div>
          ))}
           <div className="flex items-center space-x-3">
              <Droplets className="w-5 h-5 text-blue-400 shrink-0" />
              <span className="text-sm text-gray-300">Stampa con inchiostri Ecosolvent di alta qualità</span>
            </div>
        </div>

        <div className="flex-grow" />

        {product.type === 'banner' ? (
          <BannerPriceCalculator product={product} onAddToCart={onAddToCart} />
        ) : (
          <RollupSelector product={product} onAddToCart={onAddToCart} />
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;