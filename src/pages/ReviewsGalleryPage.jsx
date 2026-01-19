import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const reviews = [
  { name: 'Matteo R.', role: 'Graphic Designer', comment: 'Cercavo un ciano che fosse davvero ciano. Con la stampa DTF di Printora ho finalmente trovato la fedeltà cromatica che serve ai miei progetti.' },
  { name: 'Sofia V.', role: 'Wedding Planner', comment: 'I banner per il matrimonio sono arrivati in 24h, salvando l\'allestimento. Qualità del PVC robusta e stampa nitidissima.' },
  { name: 'Davide B.', role: 'Titolare Ristorante', comment: 'Menu e tovagliette stampati alla perfezione. Il supporto WhatsApp mi ha consigliato la carta antimacchia giusta. Servizio top.' },
  { name: 'Giulia M.', role: 'Illustratrice', comment: 'Stampare le mie art print su tessuto mi preoccupava. Invece i dettagli sono rimasti incredibili, anche le linee più sottili.' },
  { name: 'Alessandro C.', role: 'Marketing Manager', comment: 'Gestiamo fiere in tutta Italia e i Roll-up di Printora sono una garanzia. Solidi, facili da montare e spedizione sempre puntuale.' },
  { name: 'Elena G.', role: 'Etsy Shop Owner', comment: 'Le t-shirt personalizzate sono morbidissime, la stampa si fonde col tessuto. I miei clienti adorano la qualità premium.' },
  { name: 'Marco T.', role: 'Organizzatore Eventi', comment: 'Hanno gestito un ordine urgente di 500 gadget senza battere ciglio. Arrivati prima del previsto e packaging perfetto.' },
  { name: 'Francesca P.', role: 'Architetto', comment: 'La precisione del taglio sui pannelli rigidi è millimetrica. Ottimo per i miei plastici e presentazioni di progetto.' },
  { name: 'Luca S.', role: 'Presidente ASD', comment: 'Maglie tecniche per la squadra stampate benissimo. Hanno resistito a tutta la stagione di lavaggi intensi.' },
  { name: 'Valentina N.', role: 'Visual Merchandiser', comment: 'Le vetrofanie sono brillanti e facili da applicare. Hanno cambiato faccia al negozio con una spesa contenuta.' },
  { name: 'Giovanni L.', role: 'Proprietario Palestra', comment: 'Banner in PVC per l\'esterno resistenti a sole e pioggia da 6 mesi. Ancora come nuovi. Consigliatissimi.' },
  { name: 'Chiara F.', role: 'Fashion Designer', comment: 'Il bianco del DTF è coprente e non crepa. Fondamentale per la mia linea di streetwear su fondi scuri.' },
  { name: 'Roberto D.', role: 'Agenzia Pubblicitaria', comment: 'Partner affidabile per il B2B. Prezzi trasparenti e gestione file impeccabile. Mai un errore in 2 anni.' },
  { name: 'Serena A.', role: 'Fotografa', comment: 'Ho stampato una gigantografia su pannello. Resa dei neri profonda e nessun banding visibile. Qualità museale.' },
  { name: 'Andrea M.', role: 'Startupper', comment: 'Tutto il kit fiera (biglietti, roll-up, desk) fatto con loro. Immagine coordinata perfetta e budget rispettato.' },
  { name: 'Laura B.', role: 'Event Manager', comment: 'La possibilità di verifica file gratuita è una salvezza. Mi hanno corretto un font mancante che avrebbe rovinato tutto.' },
  { name: 'Fabio R.', role: 'Musicista', comment: 'Merchandising per il tour stampato al volo. Magliette e cappellini di qualità superiore a quelli delle major.' },
  { name: 'Martina S.', role: 'Interior Designer', comment: 'Carta da parati personalizzata stampata con definizione eccezionale. Rende l\'ambiente unico.' },
  { name: 'Stefano P.', role: 'Gestore Hotel', comment: 'Segnaletica interna ed esterna rifatta a nuovo. Materiali eleganti che durano nel tempo.' },
  { name: 'Elisa K.', role: 'Artigiana', comment: 'Le etichette per i miei prodotti sono nitide e adesive al punto giusto. Danno quel tocco pro che mancava.' },
];

const galleryItems = [
  {
    src: '/assets/reviews/dtf.webp',
    title: 'Stampa DTF alta qualità',
    tag: 'DTF & Tessile',
  },
  {
    src: '/assets/reviews/porchetta-cappellino.webp',
    title: 'Gadget personalizzati',
    tag: 'Gadget',
  },
  {
    src: '/assets/reviews/giardiniere-verticale.webp',
    title: 'Il Giardiniere - Roll-up',
    tag: 'Espositori',
  },
  {
    src: '/assets/reviews/dtf-2.webp',
    title: 'Dettaglio stampa su tessuto',
    tag: 'Abbigliamento',
  },
  {
    src: '/assets/reviews/il-giardiniere.webp',
    title: 'Il Giardiniere - Branding',
    tag: 'Brand Identity',
  },
  {
    src: '/assets/reviews/gruppo-giva-verticale.webp',
    title: 'Gruppo Giva - Banner',
    tag: 'Grande Formato',
  },
  {
    src: '/assets/reviews/dtf-4.webp',
    title: 'Personalizzazione T-shirt',
    tag: 'DTF Custom',
  },
  {
    src: '/assets/reviews/final-project.webp',
    title: 'Progetto completato',
    tag: 'Merchandising',
  },
  {
    src: '/assets/reviews/trovato-verticale.webp',
    title: 'Trovato - Espositore',
    tag: 'Advertising',
  },
  {
    src: '/assets/reviews/trovato-verticale.webp',
    title: 'Trovato - Espositore',
    tag: 'Advertising',
  },

  {
    src: '/assets/reviews/trovato.webp',
    title: 'Trovato - Branding',
    tag: 'Visual Identity',
  },
  {
    src: '/assets/reviews/gruppo-giva.webp',
    title: 'Gruppo Giva - Logo',
    tag: 'Stampa Digitale',
  },
  {
    src: '/assets/reviews/il-meglio-della-porchetta.webp',
    title: 'Il Meglio della Porchetta',
    tag: 'Allestimento Food',
  },
  {
    src: '/assets/reviews/la-flo.webp',
    title: 'La Flo - Insegna',
    tag: 'Insegne',
  },
];

const ReviewsGalleryPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalReviews = reviews.length;
  // Masonry layout state
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1024) setColumns(4);
      else if (window.innerWidth >= 640) setColumns(3); // Changed from 768 to 640 (sm) for better mobile
      else setColumns(2);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const currentReview = reviews[currentIndex];

  // Desktop-specific manual column distribution for centered bottom row
  let displayedItems = galleryItems;
  let columnArrays = null;

  if (columns === 4) {
    // Manually distribute items into 4 columns with last 2 items in Cols 1 & 2
    const items = [...galleryItems];

    columnArrays = [
      // Column 0 (3 items)
      [items[0], items[4], items[8]],
      // Column 1 (4 items - includes item 12 at bottom)
      [items[1], items[5], items[11], items[12]],
      // Column 2 (4 items - includes item 13 at bottom)  
      [items[2], items[6], items[10], items[13]],
      // Column 3 (3 items)
      [items[3], items[7], items[9]],
    ];
  } else if (columns === 3) {
    // Tablet-specific reordering for balanced 3-column layout
    // Move last item (index 13) to the gap in Col 1 (position shown by arrow)
    const items = [...galleryItems];

    // Custom tablet order: move item 13 to position 7 (Col 1, middle row)
    displayedItems = [
      items[0],  // Col 0
      items[1],  // Col 1
      items[2],  // Col 2 - vertical
      items[3],  // Col 0
      items[4],  // Col 1
      items[5],  // Col 2 - vertical
      items[6],  // Col 0
      items[13], // Col 1 - MOVED HERE (arrow position)
      items[7],  // Col 2
      items[8],  // Col 0 - vertical
      items[9],  // Col 1
      items[10], // Col 2
      items[11], // Col 0
      items[12], // Col 1
    ];
  }

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

  const [activeWorkIndex, setActiveWorkIndex] = useState(0);
  const [isWorkHovered, setIsWorkHovered] = useState(false);
  const totalWorks = galleryItems.length;
  const activeWork = galleryItems[activeWorkIndex] || galleryItems[0];

  useEffect(() => {
    if (totalWorks <= 1 || isWorkHovered) return;
    const timer = setInterval(() => {
      setActiveWorkIndex((prev) => (prev + 1) % totalWorks);
    }, 6000);

    return () => clearInterval(timer);
  }, [totalWorks, isWorkHovered]);

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
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </div>
                  <span className="reviews-pill-short text-[11px] font-medium text-slate-200 whitespace-nowrap">
                    Verificati
                  </span>
                  <span className="hidden lg:inline text-[11px] font-medium text-slate-200 whitespace-nowrap">
                    Clienti verificati
                  </span>
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
                          <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200">
                            {currentReview.role}
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
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-lg md:text-xl font-semibold text-white">
                Altre opinioni in sintesi
              </h3>
              <p className="text-xs md:text-sm text-slate-400 max-w-xl">
                Una panoramica rapida di altre esperienze dei clienti: assistenza, prezzi, facilità di ordine e controllo file.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-200">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1">Valutazione media 4,9/5</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {quickReviews.map((review, idx) => (
              <motion.div
                key={review.name + idx}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
              >
                <div className="absolute -top-8 -right-10 h-20 w-20 rounded-full bg-cyan-500/10 blur-xl group-hover:bg-cyan-500/20 transition-colors duration-300" />
                <div className="relative space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white">{review.name}</p>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-300">
                        {review.role}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 text-yellow-300">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                  <p className="text-[13px] leading-relaxed text-slate-200">
                    &quot;{review.comment}&quot;
                  </p>
                </div>
                <div className="mt-4 h-px w-full bg-gradient-to-r from-cyan-500/40 via-fuchsia-500/30 to-transparent opacity-70" />
              </motion.div>
            ))}
          </div>
        </section >

        {/* Gallery of previous work */}
        < section className="relative py-14" >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 md:mb-8">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Alcuni dei nostri lavori
              </h2>
              <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-400">
                <div className="h-px w-20 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-transparent rounded-full" />
                <span className="uppercase tracking-[0.16em] text-slate-500">
                  Prove visive di lavori reali
                </span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 animate-ping" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
              </span>
              <span>Galleria interattiva</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-6xl px-1 md:px-4">
            {/* Soft background glow behind the masonry board */}
            <div className="pointer-events-none absolute -inset-4 md:-inset-6 rounded-[2.5rem] bg-gradient-to-tr from-cyan-500/15 via-fuchsia-500/12 to-transparent blur-3xl" />

            <div className="flex gap-4 md:gap-5 items-start">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="flex-1 flex flex-col gap-5">
                  {(columnArrays ? columnArrays[colIndex] : displayedItems.filter((_, i) => i % columns === colIndex))
                    .map((item, idx) => (
                      <motion.div
                        key={item.src}
                        className="rounded-3xl overflow-hidden shadow-[0_18px_55px_rgba(15,23,42,0.9)] border border-slate-900/80 bg-slate-950 group relative grayscale hover:grayscale-0 transition-all duration-400 w-full"
                        initial={{ opacity: 0, scale: 0.96, y: 32 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        whileHover={{ y: -6 }}
                      >
                        <picture>
                          <source srcSet={item.src} type="image/webp" />
                          <source srcSet={item.src.replace('.webp', '.jpg')} type="image/jpeg" />
                          <img
                            src={item.src.replace('.webp', '.jpg')}
                            alt={item.title}
                            className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                            style={{ borderRadius: 'inherit' }}
                          />
                        </picture>
                        {/* Overlay on hover for proof-of-work */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <div className="flex flex-col gap-2">
                            <span className="inline-block w-fit rounded-full border border-emerald-400/70 bg-emerald-700/40 px-3 py-1 text-[11px] font-semibold text-emerald-100 shadow backdrop-blur-sm">
                              {item.tag}
                            </span>
                            <button className="inline-flex items-center gap-1 rounded-full bg-cyan-500/95 hover:bg-cyan-400 text-white text-[11px] font-semibold px-4 py-1.5 shadow-lg transition">
                              <span>Visualizza prova</span>
                            </button>
                          </div>
                        </div>
                        {/* Subtle badge for proof */}
                        <span className="absolute top-3 left-3 bg-white/85 text-slate-900 text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full shadow-md uppercase">
                          Prova reale
                        </span>
                      </motion.div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </section >

      </div >
    </div >
  );
};

export default ReviewsGalleryPage;
