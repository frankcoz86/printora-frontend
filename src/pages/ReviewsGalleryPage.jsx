import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles, X, ZoomIn } from 'lucide-react';

const reviews = [
  { name: 'Claudia T.', role: 'Brand Manager', comment: 'Abbiamo rifatto tutta l\'immagine aziendale con Printora. Dai biglietti da visita ai roll-up, la coerenza cromatica è perfetta su ogni supporto.' },
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

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Review submission state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRole, setReviewerRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (totalWorks <= 1 || isWorkHovered) return;
    const timer = setInterval(() => {
      setActiveWorkIndex((prev) => (prev + 1) % totalWorks);
    }, 6000);

    return () => clearInterval(timer);
  }, [totalWorks, isWorkHovered]);

  // Lightbox handlers
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const goToPrevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  const goToNextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % galleryItems.length);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevImage();
      if (e.key === 'ArrowRight') goToNextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    // Your latest deployment URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwyf4XKBAsa8vuFVRSNaaVq7FGeEE4pYsneG26BVw5RrdmURE1VWEetpaILGfupzMLC/exec';

    try {
      console.log('Submitting review:', { name: reviewerName, role: reviewerRole, rating, reviewText });

      // Use redirect mode to avoid CORS preflight
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          name: reviewerName,
          role: reviewerRole,
          rating: rating,
          reviewText: reviewText,
        }),
      });

      console.log('Response received');

      // If we got here without error, assume success
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setRating(0);
        setReviewText('');
        setReviewerName('');
        setReviewerRole('');
        setSubmitSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error submitting review:', error);
      setIsSubmitting(false);
      setSubmitError('Si è verificato un errore. Riprova più tardi.');
    }
  };

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

        {/* Review Submission Section */}
        <section className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Background glow effects */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/15 to-amber-500/20 rounded-3xl blur-3xl opacity-60" />

            <div className="relative rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-[0_25px_80px_rgba(15,23,42,0.95)] overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-fuchsia-500/10 to-transparent rounded-full blur-3xl" />

              <div className="relative px-6 py-8 md:px-10 md:py-10 space-y-8">
                {/* Header */}
                <div className="space-y-3 text-center">
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-200">
                    <Sparkles className="w-4 h-4" />
                    <span>Condividi la tua esperienza</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    Lascia una recensione
                  </h3>
                  <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
                    La tua opinione aiuta altri clienti a scegliere con fiducia. Raccontaci la tua esperienza con Printora!
                  </p>
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-6">
                  {/* Star Rating */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-white text-center">
                      Valuta il servizio
                    </label>
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          className="focus:outline-none transition-all duration-200"
                        >
                          <Star
                            className={`w-10 h-10 md:w-12 md:h-12 transition-all duration-200 ${star <= (hoverRating || rating)
                              ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                              : 'fill-slate-700 text-slate-700'
                              }`}
                          />
                        </motion.button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-sm text-cyan-200 font-medium"
                      >
                        {rating === 5 && '⭐ Eccellente!'}
                        {rating === 4 && '👍 Molto buono!'}
                        {rating === 3 && '😊 Buono'}
                        {rating === 2 && '😐 Sufficiente'}
                        {rating === 1 && '😕 Da migliorare'}
                      </motion.p>
                    )}
                  </div>

                  {/* Personal Info Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="reviewerName" className="block text-sm font-medium text-slate-200">
                        Il tuo nome
                      </label>
                      <input
                        type="text"
                        id="reviewerName"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder="es. Marco R."
                        required
                        className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="reviewerRole" className="block text-sm font-medium text-slate-200">
                        Ruolo/Attività
                      </label>
                      <input
                        type="text"
                        id="reviewerRole"
                        value={reviewerRole}
                        onChange={(e) => setReviewerRole(e.target.value)}
                        placeholder="es. Graphic Designer"
                        required
                        className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="space-y-2">
                    <label htmlFor="reviewText" className="block text-sm font-medium text-slate-200">
                      La tua recensione
                    </label>
                    <textarea
                      id="reviewText"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Racconta la tua esperienza: qualità di stampa, tempi di consegna, assistenza clienti..."
                      required
                      rows={5}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all resize-none"
                    />
                    <p className="text-xs text-slate-400">
                      {reviewText.length} caratteri • Minimo 50 caratteri consigliati
                    </p>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={!rating || !reviewText || !reviewerName || !reviewerRole || isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full rounded-xl px-6 py-4 text-base font-semibold transition-all duration-300 ${!rating || !reviewText || !reviewerName || !reviewerRole || isSubmitting
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-amber-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]'
                      }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Invio in corso...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Invia recensione
                      </span>
                    )}
                  </motion.button>

                  {/* Success Message */}
                  <AnimatePresence>
                    {submitSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-xl border border-emerald-500/50 bg-emerald-500/10 px-4 py-3 text-center"
                      >
                        <p className="flex items-center justify-center gap-2 text-sm font-semibold text-emerald-200">
                          <span className="text-lg">✓</span>
                          Grazie per la tua recensione! Sarà pubblicata dopo la verifica.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Error Message */}
                  <AnimatePresence>
                    {submitError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-center"
                      >
                        <p className="flex items-center justify-center gap-2 text-sm font-semibold text-red-200">
                          <span className="text-lg">⚠</span>
                          {submitError}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>


                  {/* Trust badges */}
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10">
                        <span className="text-emerald-300">✓</span>
                      </div>
                      <span>Recensioni verificate</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/10">
                        <span className="text-cyan-300">🔒</span>
                      </div>
                      <span>Dati protetti</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-500/10">
                        <span className="text-fuchsia-300">⚡</span>
                      </div>
                      <span>Pubblicazione rapida</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
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
                        className="rounded-3xl overflow-hidden shadow-[0_18px_55px_rgba(15,23,42,0.9)] border border-slate-900/80 bg-slate-950 group relative grayscale hover:grayscale-0 transition-all duration-400 w-full cursor-pointer"
                        initial={{ opacity: 0, scale: 0.96, y: 32 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        whileHover={{ y: -6 }}
                        onClick={() => {
                          // Find the actual index in the original galleryItems array
                          const actualIndex = galleryItems.findIndex(gi => gi.src === item.src);
                          openLightbox(actualIndex);
                        }}
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
                              <ZoomIn className="w-3.5 h-3.5" />
                              <span>Visualizza ingrandito</span>
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

        {/* Lightbox Overlay */}
        <AnimatePresence>
          {lightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
              onClick={closeLightbox}
            >
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-800 hover:border-cyan-400 transition-all duration-200 group"
                aria-label="Close lightbox"
              >
                <X className="w-6 h-6 group-hover:text-cyan-400 transition-colors" />
              </button>

              {/* Image counter */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-slate-900/80 border border-slate-700 px-4 py-2 text-sm text-white backdrop-blur-sm">
                <span className="font-semibold text-cyan-400">{lightboxIndex + 1}</span>
                <span className="text-slate-400"> / {galleryItems.length}</span>
              </div>

              {/* Previous button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevImage();
                }}
                className="absolute left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-800 hover:border-cyan-400 transition-all duration-200 group"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 group-hover:text-cyan-400 transition-colors" />
              </button>

              {/* Next button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextImage();
                }}
                className="absolute right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-800 hover:border-cyan-400 transition-all duration-200 group"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 group-hover:text-cyan-400 transition-colors" />
              </button>

              {/* Image container */}
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-7xl max-h-[90vh] mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={galleryItems[lightboxIndex].src}
                  alt={galleryItems[lightboxIndex].title}
                  className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-2xl shadow-2xl"
                />

                {/* Image info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent rounded-b-2xl p-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-white">
                      {galleryItems[lightboxIndex].title}
                    </h3>
                    <span className="inline-block w-fit rounded-full border border-emerald-400/70 bg-emerald-700/40 px-3 py-1 text-xs font-semibold text-emerald-100 shadow backdrop-blur-sm">
                      {galleryItems[lightboxIndex].tag}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Keyboard hints */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <kbd className="rounded bg-slate-900/80 border border-slate-700 px-2 py-1 font-mono">←</kbd>
                  <kbd className="rounded bg-slate-900/80 border border-slate-700 px-2 py-1 font-mono">→</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="rounded bg-slate-900/80 border border-slate-700 px-2 py-1 font-mono">ESC</kbd>
                  <span>Close</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div >
    </div >
  );
};

export default ReviewsGalleryPage;
