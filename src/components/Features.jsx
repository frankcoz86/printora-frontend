import React from 'react';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Star, Zap, CreditCard } from 'lucide-react';

const featuresData = [
  {
    icon: Zap,
    title: 'Prezzi Imbattibili',
    description: 'Offriamo tariffe promozionali per darti la massima qualità senza svuotare il portafoglio.'
  },
  {
    icon: ShieldCheck,
    title: 'Verifica File OMAGGIO',
    description: 'I nostri esperti controllano gratuitamente ogni file per garantire una stampa perfetta.'
  },
  {
    icon: Star,
    title: 'Qualità Professionale',
    description: 'Utilizziamo solo materiali e inchiostri di alta gamma per un risultato che lascia il segno.'
  },
  {
    icon: CreditCard,
    title: 'Pagamenti Sicuri',
    description: 'Transazioni protette con PayPal e le principali carte di credito per la tua tranquillità.'
  }
];

const Features = () => {
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
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Perché Scegliere Printora</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Diamo forma alla tua comunicazione. Esperti nella stampa su PVC per risultati che colpiscono.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresData.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center bg-slate-900/50 p-8 rounded-2xl border border-white/10"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-full">
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

export default Features;