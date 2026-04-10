import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, ArrowRight, Mail, Clock, Share2,
  Copy, BookOpen, FileCheck, ShieldCheck, Star,
  X, ChevronRight, Zap, Users, MessageCircle,
} from 'lucide-react';
import { FaWhatsapp, FaFacebook } from 'react-icons/fa';

/* ─── Constants ──────────────────────────────────────────── */
const WA_CONSULT_URL =
  'https://wa.me/393792775116?text=Consulenza+grafica+%E2%82%AC15';

/* ─── Variants Per Source ────────────────────────────────── */
const VARIANTS = {
  hvco_editor: {
    accentClass: 'text-emerald-400',
    accentBg: 'bg-emerald-500/10 border-emerald-500/20',
    accentBorder: 'border-emerald-500/30',
    glowColor: 'bg-emerald-500/8',
    glowColor2: 'bg-violet-500/8',
    guideName: 'Guida Grafica in 5 Passi',
    guideLabel: 'MINI-GUIDA GRATUITA',
    guideSub: 'Come Creare la Tua Grafica Professionale',
    guideSteps: ['Dimensioni giuste', 'Carica il tuo logo', 'Scegli i colori', 'Aggiungi i testi', 'Controlla e scarica'],
    mockupAccent: 'from-emerald-600 to-teal-800',
    mockupBorder: 'border-emerald-500/30',
    mockupStepColor: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400',
    mockupFooter: 'text-emerald-400',
    mockupShadow: 'shadow-emerald-900/30',
    confirmHeadline: (name) => name ? `Fantastico ${name}! La Guida è in Arrivo 🎉` : 'Fantastico! La Guida è in Arrivo 🎉',
    confirmSub: 'La tua Mini-Guida Grafica in 5 Passi',
    upsellHook: 'Hai già un\'idea per la grafica ma non sei sicuro che il file esca perfetto?',
    shareText: (encoded) => `Ho trovato questa guida gratuita di Printora — spiega come fare la grafica professionale in 5 passi, anche senza esperienza. ${encoded}`,
    shareUrl: 'https://printora.it/guida-editor',
    shareUrlEncoded: 'https%3A%2F%2Fprintora.it%2Fguida-editor',
    testimonials: [
      { letter: 'M', name: 'Marco B.', role: 'Titolare negozio, Treviso', text: 'Non sapevo fare la grafica — la guida me lo ha spiegato in 12 minuti. Ho fatto il banner per i saldi da solo. Incredibile.' },
      { letter: 'L', name: 'Luca R.', role: 'Ristoratore, Napoli', text: 'Pensavo fosse complicato, invece con i 5 passi ho fatto la grafica per il cartello del locale. Stampa perfetta.' },
      { letter: 'G', name: 'Giulia T.', role: 'Titolare boutique, Firenze', text: 'Finalmente una guida chiara senza tecnicismi. Banner per la vetrina fatto in meno di 20 minuti.' },
    ],
    emailSequence: [
      { time: 'Adesso', icon: '📬', label: 'La Mini-Guida Grafica in 5 Passi nella tua inbox' },
      { time: 'Domani', icon: '📖', label: 'L\'errore #1 che rende amatoriale anche la grafica più curata' },
      { time: 'Tra 3 giorni', icon: '💡', label: 'Come scegliere i colori che escono IDENTICI sullo schermo e in stampa' },
      { time: 'Tra 5 giorni', icon: '🎯', label: 'Come altri titolari come te hanno fatto la grafica da soli e risparmiato €200' },
    ],
  },
  hvco_file_stampa: {
    accentClass: 'text-blue-400',
    accentBg: 'bg-blue-500/10 border-blue-500/20',
    accentBorder: 'border-blue-500/30',
    glowColor: 'bg-blue-600/10',
    glowColor2: 'bg-indigo-500/8',
    guideName: 'Checklist Pre-Stampa 7 Punti',
    guideLabel: 'CHECKLIST TECNICA',
    guideSub: '7 Cose da Controllare Prima della Stampa',
    guideSteps: ['Modalità CMYK', 'Risoluzione 100+ dpi', 'Margini al vivo', 'Area sicura', 'Font in curve', 'PDF/X-1a', 'Brief completo'],
    mockupAccent: 'from-blue-600 to-indigo-800',
    mockupBorder: 'border-blue-500/30',
    mockupStepColor: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    mockupFooter: 'text-blue-400',
    mockupShadow: 'shadow-blue-900/30',
    confirmHeadline: (name) => name ? `Perfetto ${name}! La Checklist è in Arrivo 🚀` : 'Perfetto! La Checklist è in Arrivo 🚀',
    confirmSub: 'La tua Checklist Pre-Stampa Professionale in 7 Punti',
    upsellHook: 'Hai il file, hai la checklist — ma preferiresti che lo verificassimo noi prima di spedire in macchina?',
    shareText: (encoded) => `Questa checklist di Printora mi ha salvato da un sacco di ristampe — 7 punti per mandare i file in stampa perfetti. ${encoded}`,
    shareUrl: 'https://printora.it/guida-file-stampa',
    shareUrlEncoded: 'https%3A%2F%2Fprintora.it%2Fguida-file-stampa',
    testimonials: [
      { letter: 'S', name: 'Sofia C.', role: 'Graphic Designer, Roma', text: 'La uso incollata sul monitor. Da quando faccio la spunta su questi 7 punti, zero ristampe in 6 mesi. Vale oro.' },
      { letter: 'P', name: 'Paolo M.', role: 'Art Director, Milano', text: 'Finalmente specifiche tecniche chiare senza dover cercare su 10 siti diversi. La mando a tutti i clienti prima che mi mandino file.' },
      { letter: 'R', name: 'Roberta F.', role: 'Freelance Designer, Torino', text: 'Il punto sul bleed mi ha salvato da un banner da 3 metri. Non ci avevo mai pensato prima. Grazie Printora.' },
    ],
    emailSequence: [
      { time: 'Adesso', icon: '📬', label: 'La Checklist Pre-Stampa in 7 Punti nella tua inbox' },
      { time: 'Domani', icon: '📖', label: 'L\'errore che vediamo ogni giorno — anche da chi è esperto' },
      { time: 'Tra 3 giorni', icon: '💡', label: 'CMYK vs RGB: la spiegazione definitiva in 4 righe senza Wikipedia' },
      { time: 'Tra 5 giorni', icon: '🎯', label: 'Come Sofia ha eliminato i re-print dai costi della sua agenzia' },
    ],
  },
};

/* ─── Animation helpers ──────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};


/* ─── Section 1 — Confirmation Strip (compact) ──────────── */
const ConfirmationHero = ({ v, name }) => (
  <section className="relative bg-slate-950 overflow-hidden pt-8 pb-8 border-b border-white/5">
    <div className="container mx-auto px-4 relative z-10 max-w-3xl">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left"
      >
        {/* Animated checkmark — small */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
          className="shrink-0"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          </div>
        </motion.div>

        <div>
          <motion.p
            variants={fadeUp}
            className="text-white font-extrabold text-lg md:text-xl leading-snug"
          >
            {v.confirmHeadline(name)}
          </motion.p>
          <motion.p variants={fadeUp} className="text-gray-400 text-sm mt-1">
            <span className={`${v.accentClass} font-semibold`}>{v.confirmSub}</span>{' '}
            è in arrivo nella tua email. Controlla spam se non arriva entro&nbsp;5&nbsp;min.
          </motion.p>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─── Section 2 — Tripwire Offer (page centrepiece) ─────── */
const TripwireUpsell = ({ v }) => (
  <section className="relative py-20 bg-slate-950 overflow-hidden">
    {/* Ambient glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-600/8 rounded-full blur-[120px] pointer-events-none" />

    <div className="container mx-auto px-4 max-w-4xl relative z-10">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Offer label */}
        <motion.div variants={fadeUp} className="text-center mb-4">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300">
            <Zap className="w-3 h-3" /> Offerta Speciale — Solo Per Te
          </span>
        </motion.div>

        {/* Primary headline — largest element on the page */}
        <motion.div variants={fadeUp} className="text-center mb-3">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Vuoi che lo faccia{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              un esperto per te?
            </span>
          </h1>
        </motion.div>

        {/* Subheadline — the truth-based hook */}
        <motion.div variants={fadeUp} className="text-center mb-12 max-w-2xl mx-auto">
          <p className="text-gray-300 text-lg leading-relaxed">
            {v.upsellHook}{' '}
            Il nostro esperto grafico lo fa per te in{' '}
            <span className="text-white font-semibold">24 ore</span> —
            con garanzia rimborso totale se non sei soddisfatto.
          </p>
          <p className="text-gray-500 text-sm mt-3">
            Lo so, sembra assurdo a €15. Ma lo facciamo per ogni nuovo cliente perché sappiamo che tornerai a stampare con noi.
          </p>
        </motion.div>

        {/* Offer card — prominent, centred */}
        <motion.div
          variants={fadeUp}
          className="rounded-2xl overflow-hidden border border-violet-500/20 shadow-2xl shadow-violet-900/20 max-w-2xl mx-auto"
        >
          {/* Card header */}
          <div className="bg-gradient-to-r from-violet-600/30 to-indigo-600/30 px-8 py-5 border-b border-white/8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-violet-300" />
              <span className="text-violet-200 font-bold text-sm uppercase tracking-wider">Consulenza Grafica Expert</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-gray-500 text-sm line-through">€80+</span>
              <span className="text-emerald-400 font-extrabold text-3xl">€15</span>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-slate-900/70 px-8 py-6">
            <ul className="space-y-4 mb-8">
              {[
                { icon: '🎨', text: 'Creiamo o correggiamo la tua grafica in 24h' },
                { icon: '✅', text: 'File CMYK, risoluzione e margini al vivo corretti — pronti per la stampa' },
                { icon: '🔒', text: 'Garanzia rimborso totale se non sei soddisfatto' },
                { icon: '💬', text: 'Consultazione diretta su WhatsApp — risposta garantita entro 2 ore' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-200 text-sm">
                  <span className="text-lg leading-none shrink-0">{item.icon}</span>
                  <span className="leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <a
              href={WA_CONSULT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1aad52] text-white font-extrabold rounded-xl px-6 py-5 text-lg shadow-xl shadow-emerald-900/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              <FaWhatsapp className="w-6 h-6 shrink-0" />
              Voglio la Consulenza — €15 su WhatsApp
            </a>

            {/* Urgency + social proof */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-gray-500 text-xs">⏳ Solo 3 slot disponibili questa settimana</p>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['G', 'M', 'S'].map((l, i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-700 border-2 border-slate-900 flex items-center justify-center text-white text-[9px] font-bold">
                      {l}
                    </div>
                  ))}
                </div>
                <p className="text-gray-500 text-xs"><span className="text-gray-300 font-semibold">200+</span> clienti soddisfatti</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

/* ─── Section 3 — Magic Lantern Teaser ──────────────────── */
const MagicLanternTeaser = ({ v }) => (
  <section className="py-16 bg-slate-950">
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={fadeUp} className="text-center mb-10">
          <span className="inline-block text-[11px] font-bold tracking-[0.15em] uppercase px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 mb-4">
            📮 Cosa Succede Adesso
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Ti mando{' '}
            <span className="text-amber-400">4 email nei prossimi 5 giorni.</span>
          </h2>
          <p className="text-gray-400 text-sm mt-3 max-w-lg mx-auto">
            Ognuna contiene qualcosa di concreto e direttamente utilizzabile — non newsletter generiche.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-amber-500/40 via-amber-500/20 to-transparent hidden sm:block" />

          <div className="space-y-4">
            {v.emailSequence.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex items-start gap-5 bg-slate-800/30 rounded-xl px-5 py-4 border border-white/5 hover:border-white/10 transition-colors relative sm:ml-0"
              >
                <div className="shrink-0 w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xl relative z-10">
                  {item.icon}
                </div>
                <div className="pt-1">
                  <span className="text-amber-400 text-[10px] font-black uppercase tracking-[0.15em]">{item.time}</span>
                  <p className="text-gray-300 text-sm mt-0.5 leading-relaxed">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p variants={fadeUp} className="text-center text-gray-600 text-xs mt-6">
          Nessuno spam. Puoi disiscriverti in qualsiasi momento da ogni email.
        </motion.p>
      </motion.div>
    </div>
  </section>
);

/* ─── Section 4 — Social Proof ───────────────────────────── */
const SocialProofStrip = ({ v }) => (
  <section className="py-14 bg-slate-900/70 border-y border-white/5">
    <div className="container mx-auto px-4 max-w-4xl">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <motion.div variants={fadeUp} className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-white">
            Altri come te l'hanno già scaricata
          </h2>
          <div className="flex items-center justify-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-gray-400 text-sm ml-2">Oltre 200 download questo mese</span>
          </div>
        </motion.div>

        {/* WhatsApp-style chat bubbles */}
        <motion.div
          variants={fadeUp}
          className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50"
        >
          <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-400/20 flex items-center justify-center">
              <FaWhatsapp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Printora — Clienti</p>
              <p className="text-emerald-200 text-xs">Recensioni verificate</p>
            </div>
          </div>
          <div className="bg-[#0b141a] px-4 py-6 space-y-4">
            {v.testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="flex justify-start"
              >
                <div className="flex items-start gap-2.5 max-w-sm">
                  <div className={`w-8 h-8 rounded-full ${v.accentBg} border ${v.accentBorder} flex items-center justify-center ${v.accentClass} font-extrabold text-sm shrink-0 mt-0.5`}>
                    {t.letter}
                  </div>
                  <div className="bg-[#1f2c34] rounded-2xl rounded-tl-sm px-4 py-3 shadow-md">
                    <p className="text-white text-sm leading-relaxed">"{t.text}"</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className={`${v.accentClass} text-xs font-bold`}>— {t.name}</span>
                      <span className="text-gray-500 text-[10px]">{t.role}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

/* ─── Section 5 — Share Loop ─────────────────────────────── */
const ShareLoop = ({ v }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(v.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* fallback */ }
  };

  const waShareHref = `https://wa.me/?text=${encodeURIComponent(v.shareText(v.shareUrl))}`;
  const fbShareHref = `https://www.facebook.com/sharer/sharer.php?u=${v.shareUrlEncoded}`;

  return (
    <section className="py-14 bg-slate-950">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-800/40 rounded-2xl p-8 border border-white/8 text-center space-y-5"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 mx-auto">
            <Share2 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Conosci qualcuno che ne ha bisogno?</h2>
            <p className="text-gray-400 text-sm mt-2">
              Condividi la guida gratuita — aiuta un collega, un cliente, o un amico titolare di negozio.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* WhatsApp */}
            <a
              href={waShareHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1aad52] text-white font-bold rounded-xl px-5 py-3 text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-emerald-900/30"
            >
              <FaWhatsapp className="w-4 h-4" />
              Condividi su WhatsApp
            </a>
            {/* Facebook */}
            <a
              href={fbShareHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold rounded-xl px-5 py-3 text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-900/30"
            >
              <FaFacebook className="w-4 h-4" />
              Condividi su Facebook
            </a>
            {/* Copy link */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-gray-200 font-bold rounded-xl px-5 py-3 text-sm transition-all hover:-translate-y-0.5"
            >
              <Copy className="w-4 h-4" />
              {copied ? '✓ Link Copiato!' : 'Copia Link'}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Section 6 — Related Resources ─────────────────────── */
const RelatedResources = () => {
  const resources = [
    {
      icon: BookOpen,
      accent: 'emerald',
      title: 'Crea la Tua Grafica',
      desc: 'Guida gratuita passo passo per fare la grafica da solo con il nostro editor.',
      link: '/guida-editor',
      label: 'Vai alla Guida →',
    },
    {
      icon: FileCheck,
      accent: 'blue',
      title: 'Checklist Pre-Stampa',
      desc: '7 controlli tecnici per mandare in stampa senza errori né ristampe.',
      link: '/guida-file-stampa',
      label: 'Vai alla Checklist →',
    },
    {
      icon: Users,
      accent: 'amber',
      title: 'Lavori & Recensioni',
      desc: 'Vedi banner, roll-up e DTF stampati da Printora — recensioni reali.',
      link: '/recensioni-lavori',
      label: 'Guarda i lavori →',
    },
  ];

  const accentMap = {
    emerald: { bg: 'bg-emerald-500/10 border-emerald-500/20', icon: 'text-emerald-400', text: 'text-emerald-400 hover:text-emerald-300' },
    blue: { bg: 'bg-blue-500/10 border-blue-500/20', icon: 'text-blue-400', text: 'text-blue-400 hover:text-blue-300' },
    amber: { bg: 'bg-amber-500/10 border-amber-500/20', icon: 'text-amber-400', text: 'text-amber-400 hover:text-amber-300' },
  };

  return (
    <section className="py-14 bg-slate-900/60 border-t border-white/5">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={fadeUp} className="text-center mb-8">
            <h2 className="text-xl font-extrabold text-white">Esplora le Risorse Printora</h2>
            <p className="text-gray-500 text-sm mt-1">Tutto quello che ti serve per stampare al meglio</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-4">
            {resources.map(({ icon: Icon, accent, title, desc, link, label }) => {
              const a = accentMap[accent];
              return (
                <motion.div
                  key={link}
                  variants={fadeUp}
                  className="bg-slate-800/40 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors group flex flex-col gap-4"
                >
                  <div className={`w-10 h-10 rounded-xl ${a.bg} border flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${a.icon}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-sm mb-1">{title}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
                  </div>
                  <Link to={link} className={`inline-flex items-center gap-1.5 text-xs font-semibold ${a.text} transition-colors`}>
                    {label}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Order CTAs */}
          <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-white/5">
            <p className="text-gray-500 text-sm">Hai già la grafica pronta?</p>
            <div className="flex gap-3">
              <Link to="/banner" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold text-sm transition-colors">
                Ordina il tuo Banner <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-gray-700">·</span>
              <Link to="/roll-up" className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-semibold text-sm transition-colors">
                Ordina il Roll-up <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Section 7 — Sticky Bottom Bar ─────────────────────── */
const StickyBar = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) setVisible(true);
    }, 3500);

    const onScroll = () => {
      if (window.scrollY > 300 && !dismissed) setVisible(true);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="fixed bottom-0 inset-x-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-white/10 shadow-2xl shadow-black/60"
        >
          <div className="container mx-auto px-4 py-3 max-w-4xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-violet-500/15 border border-violet-500/25 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-violet-400" />
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-bold truncate">Grafica Banner o Roll-up in 24h — €15 Fissi</p>
                <p className="text-gray-500 text-xs hidden sm:block">Il nostro esperto crea il file pronto per la stampa. Garanzia rimborso.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={WA_CONSULT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1aad52] text-white font-bold rounded-xl px-4 py-2.5 text-sm shadow-lg transition-all hover:-translate-y-0.5"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span className="hidden sm:inline">Prenota — €15</span>
                <span className="sm:hidden">€15</span>
              </a>
              <button
                onClick={handleDismiss}
                className="w-7 h-7 rounded-full bg-slate-700/60 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                aria-label="Chiudi barra"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};



/* ─── Page ───────────────────────────────────────────────── */
const GraziePage = () => {
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source') || 'hvco_editor';
  const name = searchParams.get('name') || '';

  const v = VARIANTS[source] || VARIANTS.hvco_editor;

  return (
    <>
      <Helmet>
        <title>Grazie! La Tua Guida è in Arrivo | Printora</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="La tua guida gratuita Printora è in arrivo. Controlla la tua email." />
      </Helmet>

      <div className="bg-slate-950 min-h-screen">
        <ConfirmationHero v={v} name={name} />
        <TripwireUpsell v={v} />
        <MagicLanternTeaser v={v} />
        <SocialProofStrip v={v} />
        <ShareLoop v={v} />
        <RelatedResources />

        {/* Bottom padding for sticky bar */}
        <div className="h-20" />
      </div>

      <StickyBar />
    </>
  );
};

export default GraziePage;
