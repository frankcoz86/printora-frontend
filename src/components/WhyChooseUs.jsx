import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, DollarSign, Award } from 'lucide-react';

const features = [
  {
    icon: Rocket,
    title: 'Velocità Incredibile',
    description: 'Dall\'idea alla realtà in un lampo! Produzione super-rapida e consegne espresse, senza mai sacrificare l\'eccellenza che meriti.',
  },
  {
    icon: DollarSign,
    title: 'Prezzo Diretto e Trasparente',
    description: 'Niente sorprese, solo chiarezza! Prezzi imbattibili e trasparenti, dalla nostra produzione direttamente a te, senza costi nascosti.',
  },
  {
    icon: Award,
    title: 'Qualità Senza Compromessi',
    description: 'La perfezione è il nostro standard! Materiali top-tier e tecnologie di stampa all\'avanguardia per risultati straordinari che superano ogni aspettativa.',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-slate-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Perché Printora Fa La Differenza</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Siamo il tuo partner ideale per la stampa digitale, offrendo un servizio impeccabile e risultati eccezionali.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="text-center bg-slate-900/50 p-8 rounded-2xl border border-white/10 flex flex-col items-center"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-full">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;