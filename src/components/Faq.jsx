import React from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqData = [
    {
        question: "Quali sono i tempi di produzione e consegna?",
        answer: "I tempi di produzione sono solitamente di 2-3 giorni lavorativi. La consegna avviene in 24/48 ore in tutta Italia. Riceverai una notifica via email con il tracking della spedizione non appena il tuo ordine sarà partito."
    },
    {
        question: "Che tipo di file devo caricare per la stampa?",
        answer: "Accettiamo file in formato PDF, JPG, o TIFF con una risoluzione di almeno 300 dpi per garantire la massima qualità. Assicurati che il file sia in scala 1:1 e che i testi siano convertiti in tracciati per evitare problemi con i font."
    },
    {
        question: "Offrite un servizio di verifica del file?",
        answer: "Certo! La verifica professionale del file è sempre inclusa e gratuita. I nostri operatori controllano le dimensioni e la risoluzione per assicurarsi che il risultato sia perfetto. Non effettuiamo un controllo ortografico dei testi."
    },
    {
        question: "I pagamenti sul sito sono sicuri?",
        answer: "Assolutamente sì. Tutti i pagamenti vengono processati tramite PayPal, leader mondiale nei pagamenti online. Non memorizziamo i dati della tua carta di credito. Puoi pagare con il tuo account PayPal o con qualsiasi carta di credito/debito, garantendo la massima sicurezza e protezione dei tuoi dati."
    },
    {
        question: "Posso annullare o modificare un ordine?",
        answer: "Puoi modificare o annullare un ordine finché non è entrato in fase di produzione. Contattaci il prima possibile tramite WhatsApp o email per verificare lo stato del tuo ordine e richiedere modifiche."
    },
    {
        question: "Come posso contattare l'assistenza clienti?",
        answer: "Puoi contattarci tramite il pulsante WhatsApp presente sul sito, inviando una email a info@printora.it, o compilando il form nella pagina Contatti. Siamo attivi dal Lunedì al Venerdì, dalle 9:00 alle 18:00."
    }
]

const Faq = () => {
  return (
    <section id="faq" className="py-20 bg-slate-900/70">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Domande Frequenti (FAQ)</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Hai dei dubbi? Qui trovi le risposte alle domande più comuni.</p>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
        >
            <Accordion type="single" collapsible className="w-full space-y-4">
                {faqData.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="bg-slate-800/50 border border-white/10 rounded-xl px-6 transition-all hover:border-cyan-400/50">
                        <AccordionTrigger className="text-left font-semibold text-lg text-white hover:no-underline">{item.question}</AccordionTrigger>
                        <AccordionContent className="text-gray-300 pt-2 text-base">
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default Faq;