import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Star, Zap } from 'lucide-react';

const advantages = [
  {
    icon: DollarSign,
    title: 'Prezzi Imbattibili',
    description: 'Grazie alla nostra filiera diretta e all\'ottimizzazione dei processi, ti offriamo i prezzi più competitivi sul mercato, senza sacrificare la qualità.',
  },
  {
    icon: Star,
    title: 'Qualità Superiore',
    description: 'Utilizziamo solo materiali premium e le più avanzate tecnologie di stampa per garantirti risultati professionali che durano nel tempo.',
  },
  {
    icon: Zap,
    title: 'Servizio Veloce ed Efficiente',
    description: 'Dalla configurazione all\'ordine, dalla produzione alla spedizione, ogni fase è ottimizzata per offrirti rapidità e un supporto clienti sempre disponibile.',
  },
];

const WhyBetter = () => {
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
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Perché Printora è Meglio dei Competitor</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Scopri i vantaggi che ci rendono la scelta ideale per le tue esigenze di stampa.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="text-center bg-slate-950/50 p-8 rounded-2xl border border-white/10 flex flex-col items-center"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-full">
                  <advantage.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{advantage.title}</h3>
              <p className="text-gray-400">{advantage.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyBetter;