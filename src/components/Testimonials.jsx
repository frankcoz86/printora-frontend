import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Marco Rossi',
    company: 'Agenzia Creativa',
    avatar: 'Avatar di un uomo sorridente con occhiali',
    rating: 5,
    text: 'Qualità di stampa eccezionale e tempi di consegna rapidissimi. I banner in PVC che abbiamo ordinato erano perfetti per l\'evento del nostro cliente. Printora è diventato il nostro partner di fiducia!',
  },
  {
    name: 'Giulia Bianchi',
    company: 'T-Shirt Designer',
    avatar: 'Avatar di una donna con capelli ricci',
    rating: 5,
    text: 'Ho provato la stampa DTF con colori fluo e il risultato è stato sbalorditivo. I colori sono incredibilmente brillanti e resistenti ai lavaggi. I miei clienti sono entusiasti!',
  },
  {
    name: 'Alessandro Verdi',
    company: 'Ristorante "La Brace"',
    avatar: 'Avatar di un uomo con la barba',
    rating: 5,
    text: 'Servizio clienti impeccabile. Mi hanno guidato nella scelta del roll-up giusto per il mio locale e il risultato finale ha superato le mie aspettative. Professionali e disponibili.',
  },
];

const StarRating = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`}
      />
    ))}
  </div>
);

const Testimonials = () => {
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
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Cosa Dicono i Nostri Clienti
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            La fiducia dei nostri clienti è la nostra più grande vittoria.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            key={0}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-slate-800/50 rounded-2xl p-8 border border-white/10 shadow-lg flex flex-col"
          >
            <Quote className="w-10 h-10 text-primary/50 mb-4" />
            <p className="text-gray-300 italic flex-grow mb-6">"{testimonials[0].text}"</p>
            <div className="flex items-center mt-auto">
              <img  className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-primary" alt={testimonials[0].avatar} src="https://images.unsplash.com/photo-1625047653825-fa461bf106f4" />
              <div className="flex-grow">
                <p className="font-bold text-white">{testimonials[0].name}</p>
                <p className="text-sm text-gray-400">{testimonials[0].company}</p>
              </div>
              <div className="shrink-0">
                  <StarRating rating={testimonials[0].rating} />
              </div>
            </div>
          </motion.div>
          <motion.div
            key={1}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-800/50 rounded-2xl p-8 border border-white/10 shadow-lg flex flex-col"
          >
            <Quote className="w-10 h-10 text-primary/50 mb-4" />
            <p className="text-gray-300 italic flex-grow mb-6">"{testimonials[1].text}"</p>
            <div className="flex items-center mt-auto">
              <img  className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-primary" alt={testimonials[1].avatar} src="https://images.unsplash.com/photo-1612653847654-c870630994b2" />
              <div className="flex-grow">
                <p className="font-bold text-white">{testimonials[1].name}</p>
                <p className="text-sm text-gray-400">{testimonials[1].company}</p>
              </div>
              <div className="shrink-0">
                  <StarRating rating={testimonials[1].rating} />
              </div>
            </div>
          </motion.div>
          <motion.div
            key={2}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-slate-800/50 rounded-2xl p-8 border border-white/10 shadow-lg flex flex-col"
          >
            <Quote className="w-10 h-10 text-primary/50 mb-4" />
            <p className="text-gray-300 italic flex-grow mb-6">"{testimonials[2].text}"</p>
            <div className="flex items-center mt-auto">
              <img  className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-primary" alt={testimonials[2].avatar} src="https://images.unsplash.com/photo-1676056177598-299c0ac5d68d" />
              <div className="flex-grow">
                <p className="font-bold text-white">{testimonials[2].name}</p>
                <p className="text-sm text-gray-400">{testimonials[2].company}</p>
              </div>
              <div className="shrink-0">
                  <StarRating rating={testimonials[2].rating} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;