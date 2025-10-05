import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Flag, ScrollText, Sparkles } from 'lucide-react';

const CallToActionSection = () => {
  const ctaItems = [
    {
      icon: Flag,
      title: 'Stampa Banner',
      description: 'Striscioni in PVC personalizzati per ogni esigenza.',
      link: '/banner',
      color: 'from-emerald-500 to-green-500',
    },
    {
      icon: ScrollText,
      title: 'Stampa Roll-up',
      description: 'Espositori avvolgibili facili da trasportare e montare.',
      link: '/rollup',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Sparkles,
      title: 'Stampa DTF',
      description: 'Personalizzazione tessile con colori brillanti e resistenti.',
      link: '/dtf',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Inizia Subito a Stampare!
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Scegli il prodotto che fa per te e dai forma alla tua comunicazione.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ctaItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="text-center bg-slate-950/50 p-8 rounded-2xl border border-white/10 flex flex-col items-center shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`flex justify-center mb-4 p-4 rounded-full bg-gradient-to-br ${item.color}`}>
                <item.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 mb-6 flex-grow">{item.description}</p>
              <Button asChild size="lg" className={`w-full bg-gradient-to-r ${item.color} text-white font-bold shadow-lg hover:scale-105 transition-transform duration-300`}>
                <Link to={item.link}>
                  Scopri di più
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;