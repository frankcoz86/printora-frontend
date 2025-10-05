import React from 'react';
import { motion } from 'framer-motion';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { useOutletContext } from 'react-router-dom';

const ProductList = () => {
  const { cartHook } = useOutletContext();
  const { addToCart } = cartHook;
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const displayProducts = products.filter(p => p.type === 'banner' || p.type === 'rollup');

  return (
    <section id="products" className="py-12 md:py-20 bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Stampa Professionale, Prezzi PROMO</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Qualità che si vede, convenienza che si sente. Configura e ordina in pochi click.</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto"
        >
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProductList;