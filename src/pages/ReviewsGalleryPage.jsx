import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const reviews = [
  { name: 'Giovanni Rossi', comment: 'Avevo dubbi sulla qualità, ma il risultato è stato eccezionale! Consigliato.' },
  { name: 'Francesca Bianchi', comment: 'Servizio clienti rapido e professionale. Mi hanno aiutata in ogni fase.' },
  { name: 'Luca Moretti', comment: 'Temevo tempi di consegna lunghi, invece tutto è arrivato puntuale.' },
  { name: 'Martina Romano', comment: 'La stampa è resistente e i colori sono vivaci. Ottimo lavoro!' },
  { name: 'Alessandro Greco', comment: 'Prezzi trasparenti e nessuna sorpresa al pagamento. Affidabili.' },
  { name: 'Chiara Esposito', comment: 'Avevo paura che la grafica non fosse perfetta, invece è precisa.' },
  { name: 'Paolo Conti', comment: 'Facile ordinare online, sito intuitivo e veloce.' },
  { name: 'Giulia Ricci', comment: 'Mi hanno seguito passo passo, consigliando le scelte migliori.' },
  { name: 'Marco De Luca', comment: 'Ottima comunicazione e aggiornamenti costanti sul mio ordine.' },
  { name: 'Elena Gallo', comment: 'Temevo che la spedizione fosse lenta, invece è stata velocissima.' },
  { name: 'Davide Ferrara', comment: 'Il supporto WhatsApp è stato fondamentale per risolvere i miei dubbi.' },
  { name: 'Sara Marchetti', comment: 'Materiali di qualità superiore rispetto ad altri servizi provati.' },
  { name: 'Simone Barbieri', comment: 'Mi hanno rassicurato sulla sicurezza del pagamento. Tutto ok.' },
  { name: 'Valentina Fontana', comment: 'Avevo bisogno di una stampa urgente, sono stati rapidissimi.' },
  { name: 'Matteo Sanna', comment: 'Molto soddisfatto della resa finale, superano le aspettative.' },
  { name: 'Alessia Rizzo', comment: 'Temevo che il colore non fosse fedele, invece è perfetto.' },
  { name: 'Giorgio Serra', comment: 'Ottimo rapporto qualità/prezzo, consigliato a tutti.' },
  { name: 'Ilaria Basile', comment: 'Risposte veloci e precise ad ogni domanda.' },
  { name: 'Federico Grassi', comment: 'Avevo paura di errori, ma il controllo file è stato accurato.' },
  { name: 'Laura Mancini', comment: 'Il risultato finale è stato superiore alle mie aspettative.' },
];

const galleryImages = [
  '/gallery/1.jpg',
  '/gallery/2.jpg',
  '/gallery/3.jpg',
  '/gallery/4.jpg',
  '/gallery/5.jpg',
  '/gallery/6.jpg',
  '/gallery/7.jpg',
  '/gallery/8.jpg',
  '/gallery/9.jpg',
  '/gallery/10.jpg',
];

const ReviewsGalleryPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalReviews = reviews.length;

  const currentReview = reviews[currentIndex];

  useEffect(() => {
    if (totalReviews <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalReviews);
    }, 7000);
    return () => clearInterval(timer);
  }, [totalReviews]);

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalReviews);
  };

  const quickReviews = reviews.slice(0, 6);

  return (
    <div className="bg-slate-950 py-16">
      <div className="container mx-auto px-4 space-y-20">
        {/* Hero + trust badges */}
        <section className="grid md:grid-cols-[1.6fr,1.1fr] gap-10 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recensioni reali di clienti Printora</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Le prove che rassicurano i tuoi clienti.
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-xl">
              Tutti si chiedono: "Arriverà in tempo? La qualità sarà davvero così buona?".
              Queste recensioni rispondono proprio a questi dubbi: spedizioni puntuali, supporto veloce e stampe professionali.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold">✓</span>
                <span>Puntualità nelle consegne</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold">✓</span>
                <span>Supporto WhatsApp dedicato</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-500/10 text-fuchsia-300 text-xs font-semibold">✓</span>
                <span>Qualità di stampa professionale</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold">✓</span>
                <span>Pagamenti sicuri e trasparenti</span>
              </li>
            </ul>
          </div>

          <motion.div
            className="relative rounded-3xl border border-slate-800 bg-slate-900/70 p-6 md:p-7 shadow-[0_18px_60px_rgba(15,23,42,0.95)] overflow-hidden"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute -top-24 -right-10 h-56 w-56 bg-cyan-500/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-24 -left-16 h-56 w-56 bg-fuchsia-500/25 blur-3xl rounded-full" />
            <div className="relative space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Soddisfazione clienti
                  </p>
                  <p className="mt-1 flex items-baseline gap-1 text-3xl font-extrabold text-white">
                    4,9
                    <span className="text-base font-semibold text-slate-400">/5</span>
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3 py-1 border border-slate-700/70">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-[11px] font-medium text-slate-200 ml-1">Clienti verificati</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-200">
                <div className="rounded-2xl bg-slate-950/60 border border-emerald-500/40 px-3 py-3 space-y-1">
                  <p className="font-semibold text-emerald-200">Spedizioni puntuali</p>
                  <p className="text-[11px] text-slate-400">
                    Lavoriamo con corrieri affidabili per rispettare le date urgenti.
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-950/60 border border-cyan-500/40 px-3 py-3 space-y-1">
                  <p className="font-semibold text-cyan-200">Supporto umano</p>
                  <p className="text-[11px] text-slate-400">
                    Risposte rapide via WhatsApp per qualsiasi dubbio prima dell'ordine.
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Le recensioni qui sotto sono pensate per rispondere alle domande più frequenti dei tuoi clienti.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Review carousel */}
        <section className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Recensioni che parlano dei problemi reali
              </h2>
              <p className="mt-2 text-sm md:text-base text-slate-300 max-w-xl">
                Tempi di consegna, assistenza, qualità di stampa: ogni recensione tocca un'obiezione diversa,
                per dare più sicurezza a chi sta per acquistare.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-slate-100 font-semibold">
                {currentIndex + 1}
              </span>
              <span>di {totalReviews} recensioni</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 via-fuchsia-500/10 to-transparent rounded-3xl blur-3xl -z-10" />
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-[0_20px_70px_rgba(15,23,42,0.95)]">
              <div className="px-6 py-8 md:px-10 md:py-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.4, type: 'spring', stiffness: 140, damping: 22 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/15 border border-cyan-400/40">
                          <Quote className="w-5 h-5 text-cyan-300" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{currentReview.name}</p>
                          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                            Cliente soddisfatto
                          </p>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-1 text-xs text-yellow-300">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-[11px] text-slate-200">Servizio stampa</span>
                      </div>
                    </div>

                    <p className="text-base md:text-lg text-slate-100 leading-relaxed">
                      &quot;{currentReview.comment}&quot;
                    </p>

                    <div className="flex flex-wrap gap-2 text-[11px]">
                      <span className="rounded-full border border-emerald-500/50 bg-emerald-500/10 px-3 py-1 text-emerald-200">
                        Consegna e tempi
                      </span>
                      <span className="rounded-full border border-cyan-500/50 bg-cyan-500/10 px-3 py-1 text-cyan-200">
                        Assistenza clienti
                      </span>
                      <span className="rounded-full border border-fuchsia-500/50 bg-fuchsia-500/10 px-3 py-1 text-fuchsia-200">
                        Qualità di stampa
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <p className="text-[11px] text-slate-400 max-w-xs">
                    Suggerimento: usa questa sezione nelle tue campagne per rassicurare subito i nuovi clienti.
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={goPrev}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-200 hover:border-cyan-400 hover:text-cyan-200 hover:bg-slate-900 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-200 hover:border-cyan-400 hover:text-cyan-200 hover:bg-slate-900 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compact grid of additional reviews */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h3 className="text-lg md:text-xl font-semibold text-white">
              Altre opinioni in sintesi
            </h3>
            <p className="text-xs md:text-sm text-slate-400 max-w-xl">
              Una panoramica rapida di altre esperienze dei clienti: assistenza, prezzi, facilità di ordine e controllo file.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickReviews.map((review, idx) => (
              <motion.div
                key={review.name + idx}
                className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
              >
                <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-cyan-500/10 blur-xl" />
                <div className="relative space-y-2">
                  <p className="text-sm font-semibold text-white">{review.name}</p>
                  <p className="text-[12px] text-slate-300">
                    &quot;{review.comment}&quot;
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Gallery of previous work */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Alcuni dei nostri lavori
              </h2>
              <p className="mt-2 text-sm md:text-base text-slate-300 max-w-xl">
                Utilizza questa sezione per mostrare esempi reali di banner, DTF e altri materiali stampati: aiuta il cliente a visualizzare il risultato finale.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((src, idx) => (
              <motion.div
                key={src + idx}
                className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70 shadow-lg"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
              >
                <img
                  src={src}
                  alt={`Lavoro ${idx + 1}`}
                  className="w-full h-40 md:h-44 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[0.5deg]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="pointer-events-none absolute bottom-3 left-3 text-[11px] font-medium text-slate-100 tracking-wide">
                  Lavoro #{idx + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReviewsGalleryPage;
