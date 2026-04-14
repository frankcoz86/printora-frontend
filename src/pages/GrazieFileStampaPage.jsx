import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, Mail, Star, Shield, Copy, ChevronRight, Zap,
  ScanEye, CheckCircle2, Sparkles
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const WA_URL = 'https://wa.me/393792775116?text=Controllo+File+%E2%82%AC15';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

/* ═══════════════════════════════════════
   HERO
═══════════════════════════════════════ */
const Hero = ({ name }) => (
  <section className="relative bg-slate-950 overflow-hidden pt-20 pb-24 px-6">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-500/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/6 rounded-full blur-[100px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:64px_64px]" />
    </div>

    <div className="relative z-10 max-w-3xl mx-auto text-center">
      <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col items-center gap-5">
        <motion.div variants={fadeUp}>
          <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-[0.22em] px-5 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Registrazione completata
          </span>
        </motion.div>

        <motion.h1 variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-[3.5rem] font-black text-white leading-[1.1] tracking-tight">
          {name ? `Grazie, ${name}!` : 'Grazie!'}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
            La checklist è in arrivo.
          </span>
        </motion.h1>

        <motion.p variants={fadeUp} className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Controlla la tua casella di posta — anche la cartella spam. Troverai la
          <strong className="text-white"> Checklist Pre-Stampa PDF in 7 Punti</strong> subito disponibile.
        </motion.p>

        <motion.div variants={fadeUp}
          className="inline-flex items-center gap-3 bg-slate-900 border border-white/10 rounded-2xl px-6 py-3.5 text-sm">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-left">
            <p className="text-white font-semibold text-sm">Email inviata adesso</p>
            <p className="text-gray-500 text-xs">Controlla anche la cartella Promozioni o Spam</p>
          </div>
          <div className="ml-1 flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-blue-400 text-xs font-bold">Live</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

/* ═══════════════════════════════════════
   SECTION DIVIDER
═══════════════════════════════════════ */
const SectionDivider = () => (
  <div className="py-5 bg-slate-950">
    <div className="max-w-3xl mx-auto px-6">
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500/35 to-transparent" />
    </div>
  </div>
);

/* ═══════════════════════════════════════
   ELEGANT OFFER SECTION
═══════════════════════════════════════ */
const ElegantOffer = () => {
  const lineItems = [
    { emoji: '🔍', label: 'Analisi tecnica completa del file PDF', value: '€ 35' },
    { emoji: '🎨', label: 'Conversione profilo colore RGB → CMYK', value: '€ 20' },
    { emoji: '📐', label: 'Aggiunta margini di abbondanza 3mm', value: '€ 15' },
    { emoji: '✏️', label: 'Incorporamento / conversione font', value: '€ 10' },
  ];

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">


      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }}>

          {/* BADGE */}
          <motion.div variants={fadeUp} className="text-center mb-8">
            <span className="inline-block bg-blue-500/10 border border-blue-500/25 text-blue-400 text-[11px] font-black uppercase tracking-[0.25em] px-5 py-2 rounded-full">
              Offerta Esclusiva per i Nuovi Iscritti
            </span>
          </motion.div>

          {/* HEADLINE */}
          <motion.div variants={fadeUp} className="text-center mb-5">
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight">
              Vuoi stampare senza
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                ansia da errori tecnici?
              </span>
            </h2>
          </motion.div>

          {/* RATIONALE */}
          <motion.div variants={fadeUp} className="text-center mb-12">
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
              Un reparto prestampa in agenzia costa da <span className="text-white font-semibold">€80 a €150</span> per analizzare e correggere un file. Noi lo facciamo per soli <span className="text-blue-400 font-bold">€15</span> — con garanzia ristampa gratuita inclusa — perché vogliamo dimostrarti dal vivo la nostra qualità.
            </p>
          </motion.div>

          {/* ── MANIFESTO OFFER CARD ── */}
          <motion.div variants={fadeUp} className="relative">



            <div className="relative bg-slate-900 rounded-3xl overflow-hidden border border-white/8 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">

              {/* ── HEADER BAND ── */}
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-blue-500/15 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-black text-sm tracking-wide uppercase">Preflight & Correzione File</p>
                    <p className="text-blue-400/70 text-xs">Controllo tecnico professionale · Risultato garantito in 24h</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-blue-400 text-[10px] font-black uppercase tracking-wider">Attivo ora</span>
                </div>
              </div>

              {/* ── LINE ITEMS ── */}
              <div className="px-8 pt-7 pb-3 space-y-1">
                <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest mb-5">Cosa è incluso nel servizio</p>
                {lineItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="flex items-center justify-between py-3 border-b border-white/[0.04] group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl w-7 text-center">{item.emoji}</span>
                      <span className="text-gray-300 text-sm group-hover:text-white transition-colors">{item.label}</span>
                    </div>
                    <span className="text-gray-500 text-sm font-mono tabular-nums line-through decoration-red-500/40">{item.value}</span>
                  </motion.div>
                ))}
              </div>

              {/* ── SUBTOTAL ── */}
              <div className="mx-8 mt-4 mb-0 flex items-center justify-between py-3 border-t border-white/10">
                <p className="text-gray-500 text-sm">Valore totale di mercato</p>
                <p className="text-gray-500 text-base font-black line-through decoration-red-500/50">€ 80</p>
              </div>

              {/* ── SEPARATOR ── */}
              <div className="mx-8 border-t border-dashed border-white/10 my-0" />

              {/* ── FINAL PRICE ── */}
              <div className="mx-8 flex items-center justify-between py-5">
                <div>
                  <p className="text-white font-black text-lg">Il tuo prezzo oggi</p>
                  <p className="text-gray-500 text-xs mt-0.5">Solo per chi si iscrive oggi · Posti limitati</p>
                </div>
                <div className="text-right">
                  <p className="text-5xl font-black text-white tracking-tighter leading-none">€15</p>
                  <p className="text-blue-400 text-xs font-bold mt-1">– 81% di sconto</p>
                </div>
              </div>

              {/* ── TRUST STRIP ── */}
              <div className="grid grid-cols-3 divide-x divide-white/5 border-t border-white/5 mx-0">
                {[
                  { icon: '🛡️', label: 'Ristampa gratuita' },
                  { icon: '⚡', label: 'Risultato in 24h' },
                  { icon: '🔄', label: 'Nessun abbonamento' },
                ].map((t, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 py-5 px-3">
                    <span className="text-[22px]">{t.icon}</span>
                    <span className="text-gray-400 text-xs font-bold text-center leading-tight">{t.label}</span>
                  </div>
                ))}
              </div>

              {/* ── CTA ── */}
              <div className="px-8 pb-8 pt-5">
                <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-black text-lg rounded-2xl py-5 px-6 shadow-[0_8px_32px_rgba(59,130,246,0.4)] hover:shadow-[0_8px_48px_rgba(59,130,246,0.55)] transition-all duration-300">
                  <FaWhatsapp className="w-6 h-6" />
                  Sì, controllate il mio file — €15
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <p className="text-center text-gray-600 text-xs mt-4">
                  Risposta WhatsApp in &lt; 2 min · Nessun obbligo
                </p>
              </div>

            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════
   CHECKLIST PREVIEW
═══════════════════════════════════════ */
const ChecklistPreview = () => {
  const points = [
    { num: '01', icon: '🎨', title: 'Profilo Colore Corretto', desc: 'RGB va bene sullo schermo, ma la stampa richiede CMYK con profilo FOGRA39. Impariamo a convertire senza perdere qualità.' },
    { num: '02', icon: '📐', title: 'Margine di Abbondanza (Bleed)', desc: '3mm oltre il bordo di taglio: il piccolo segreto che previene i bordi bianchi nella stampa finale.' },
    { num: '03', icon: '🖼️', title: 'Risoluzione Minima 300 DPI', desc: 'Le immagini a 72 DPI sembrano perfette sullo schermo ma escono sgranate in stampa. Come verificarlo in anticipo.' },
    { num: '04', icon: '✏️', title: 'Font Convertiti in Tracciati', desc: 'Senza questa operazione il font viene sostituito con caratteri di default. Come evitarlo definitivamente.' },
    { num: '05', icon: '🔲', title: 'Nero Ricco vs Nero Puro', desc: 'Il nero puro stampa grigio. Il nero ricco (C60 M40 Y40 K100) stampa bello scuro. La formula esatta è qui.' },
    { num: '06', icon: '📄', title: 'Formato File Corretto', desc: 'PDF, TIFF o JPG? Quale usare in quale caso. Le impostazioni di esportazione che fanno la differenza.' },
    { num: '07', icon: '✅', title: 'Checklist Finale Pre-Invio', desc: 'I 7 controlli da fare sempre prima di mandare il file in tipografia — nessun errore sfugge più.' },
  ];

  const services = [
    { icon: <ScanEye className="w-5 h-5" />, title: 'Controllo Tecnico Totale', desc: 'DPI, CMYK, font, sovrastampe: ogni dettaglio analizzato prima della stampa.' },
    { icon: <Shield className="w-5 h-5" />, title: 'Correzione Margini & Bleed', desc: '3mm di abbondanza aggiunti per un taglio perfetto, senza bordi bianchi.' },
    { icon: <Zap className="w-5 h-5" />, title: 'Risultato in 24 Ore', desc: 'File print-ready consegnato in meno di un giorno lavorativo, garantito.' },
  ];

  return (
    <section className="py-20 bg-slate-900/60 border-y border-white/5">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4">
              Cosa hai appena ricevuto
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white">
              La tua Checklist in <span className="text-blue-400">7 Punti Critici</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mt-3 max-w-xl mx-auto">
              Ogni punto elimina un errore specifico che costa soldi in ristampe. Tienila sempre a portata di mano.
            </p>
          </motion.div>

          <div className="space-y-3 mb-14">
            {points.map((pt, i) => (
              <motion.div key={i} variants={fadeUp}
                className="group relative flex items-start gap-5 bg-slate-900 hover:bg-slate-800/80 border border-white/6 hover:border-blue-500/20 rounded-2xl px-6 py-5 transition-all duration-300">
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black text-gray-600 tracking-widest">{pt.num}</span>
                  <span className="text-2xl">{pt.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-base mb-1 group-hover:text-blue-300 transition-colors">{pt.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{pt.desc}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-blue-500/40 group-hover:text-blue-500 transition-colors shrink-0 mt-0.5" />
              </motion.div>
            ))}
          </div>

          {/* Service cards */}
          <motion.div variants={fadeUp} className="border-t border-white/5 pt-10">
            <p className="text-center text-gray-500 text-sm font-bold uppercase tracking-widest mb-8">Vuoi che lo facciamo noi direttamente?</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {services.map((s, i) => (
                <div key={i} className="group bg-slate-950 border border-white/6 hover:border-blue-500/25 rounded-2xl p-6 text-center transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 group-hover:border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-4 transition-colors">
                    {s.icon}
                  </div>
                  <h4 className="text-white font-bold text-base mb-2">{s.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════
   EMAIL SEQUENCE
═══════════════════════════════════════ */
const EmailRoadmap = () => {
  const emails = [
    { day: 'Oggi', icon: '📬', label: 'La tua Checklist Pre-Stampa', desc: 'PDF completo in 7 punti: tutti i controlli prima di mandare il file in tipografia.' },
    { day: 'Domani', icon: '🎨', label: 'I neri corretti per la stampa', desc: 'La formula esatta per neri ricchi che non sbiadiscono in stampa.' },
    { day: 'Giorno 3', icon: '🔍', label: 'Come le tipografie "aggiustano" i file', desc: 'Quello che fanno ai tuoi file senza dirti nulla — e come proteggere il tuo lavoro.' },
    { day: 'Giorno 5', icon: '💡', label: 'Case study: €500 risparmiati', desc: 'Come uno studio ha evitato una ristampa da €500 grazie a 3 controlli di 5 minuti.' },
  ];

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4">
              Il tuo percorso formativo
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white">
              Cosa riceverai <span className="text-amber-400">nei prossimi giorni</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mt-3">Ogni email ti porta un livello più in alto nella gestione professionale dei file di stampa.</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-[27px] top-8 bottom-4 w-px bg-gradient-to-b from-amber-500/40 via-amber-500/15 to-transparent hidden sm:block" />
            <div className="space-y-4">
              {emails.map((e, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="flex items-start gap-4 bg-slate-900 border border-white/6 hover:border-amber-500/20 rounded-2xl px-6 py-4 transition-all duration-300 group">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-slate-800 border border-white/8 flex flex-col items-center justify-center gap-0.5 relative z-10">
                    <span className="text-xl leading-none">{e.icon}</span>
                    <span className="text-amber-500 text-[9px] font-black uppercase tracking-wide leading-none">{e.day}</span>
                  </div>
                  <div className="pt-1">
                    <p className="text-white font-bold text-sm group-hover:text-amber-300 transition-colors">{e.label}</p>
                    <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">{e.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════
   INTERACTIVE RADAR
═══════════════════════════════════════ */
const RadarDemo = () => {
  const [phase, setPhase] = useState(0);

  const errors = [
    { label: 'Profilo Colore', from: 'RGB', to: 'CMYK FOGRA39', icon: '🎨' },
    { label: 'Margine Abbondanza', from: '0mm', to: '3mm aggiunto', icon: '📐' },
    { label: 'Risoluzione', from: '72 DPI', to: '300 DPI', icon: '🖼️' },
    { label: 'Font', from: 'Non incorporati', to: 'Incorporati', icon: '✏️' },
  ];

  const runDemo = () => {
    if (phase !== 0) return;
    setPhase(1);
    setTimeout(() => setPhase(2), 2200);
  };

  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <span className="inline-block bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4">
            Simulatore interattivo
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-3">
            Come funziona il <span className="text-indigo-400">controllo Printora</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">Premi il pulsante per simulare l'analisi tecnica di un file PDF</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-[#080d18] border border-blue-500/15 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.08)] mb-5">
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/80 border-b border-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-2 text-gray-600 text-xs font-mono">printora_preflight.exe</span>
          </div>

          <div className="p-6 sm:p-8 min-h-[260px] font-mono text-sm flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {phase === 0 && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center gap-4">
                  <ScanEye className="w-14 h-14 text-slate-700" />
                  <p className="text-slate-600">In attesa di analisi…</p>
                </motion.div>
              )}

              {phase === 1 && (
                <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="space-y-2">
                  <div className="text-blue-400 mb-3 flex items-center gap-2">
                    ▶ Analisi PDF in corso
                    <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>█</motion.span>
                  </div>
                  {['Verifica profilo colore...', 'Controllo margini taglio...', 'Ispezione DPI immagini...', 'Analisi font incorporati...'].map((line, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.4 }}
                      className="text-gray-500 flex items-center gap-2 text-xs">
                      <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.4 }}
                        className="text-blue-400">⟳</motion.span>
                      {line}
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {phase === 2 && (
                <motion.div key="fixed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="space-y-3">
                  <div className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    CORREZIONE COMPLETATA — File 100% Print-Ready
                  </div>
                  {errors.map((err, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
                      className="flex items-center gap-3 bg-emerald-500/8 border border-emerald-500/15 rounded-lg px-4 py-2 text-xs">
                      <span>{err.icon}</span>
                      <span className="text-emerald-400 font-bold">{err.label}:</span>
                      <span className="text-gray-600 line-through">{err.from}</span>
                      <span className="text-emerald-400">→</span>
                      <span className="text-emerald-300 font-bold">{err.to}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="flex justify-center gap-3">
          {phase === 0 && (
            <button onClick={runDemo}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider px-8 py-3 rounded-xl text-sm transition-all shadow-lg shadow-blue-900/30">
              ▶ Avvia Simulazione
            </button>
          )}
          {phase === 2 && (
            <button onClick={() => setPhase(0)}
              className="bg-slate-800 hover:bg-slate-700 text-gray-400 font-bold px-6 py-2.5 rounded-xl text-sm transition-all">
              ↺ Ricomincia
            </button>
          )}
        </div>
      </div>
    </section>
  );
};



/* ═══════════════════════════════════════
   SOCIAL PROOF
═══════════════════════════════════════ */
const SocialProof = () => {
  const reviews = [
    { stars: 5, name: 'Roberta F.', role: 'Freelance Designer', text: 'Mando tutti i file dei clienti a Printora prima della stampa. €15 e dormo serena. Risposta sempre in meno di 5 minuti.' },
    { stars: 5, name: 'Luca P.', role: 'Art Director', text: 'Il bleed mancante lo hanno aggiunto in 2 ore. Il banner 5×1m è venuto perfetto. Non lo farei più senza il loro controllo.' },
  ];

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <motion.div variants={fadeUp} className="text-center mb-10">
            <div className="flex items-center justify-center gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white">Cosa dicono i nostri clienti</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {reviews.map((r, i) => (
              <motion.div key={i} variants={fadeUp}
                className="bg-slate-900 border border-white/6 rounded-2xl p-6 flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(r.stars)].map((_, si) => <Star key={si} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-300 text-base leading-relaxed flex-1 italic mb-4">"{r.text}"</p>
                <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-sm">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{r.name}</p>
                    <p className="text-gray-500 text-xs">{r.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════
   SHARE SECTION
═══════════════════════════════════════ */
const ShareSection = () => {
  const [copied, setCopied] = useState(false);
  const url = 'https://printora.it/guida-file-stampa';
  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 bg-slate-900/40 border-t border-white/5">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-xl font-bold text-white mb-2">Conosci un collega che stampa spesso?</h3>
          <p className="text-gray-400 text-base leading-relaxed mb-6">Condividi la checklist — potrebbe risparmiargli una ristampa costosa.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href={`https://wa.me/?text=Questa checklist di Printora mi ha già salvato da errori in stampa!%20${url}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366]/20 border border-[#25D366]/40 hover:bg-[#25D366]/30 text-[#25D366] font-bold rounded-xl px-5 py-2.5 text-sm transition-all">
              <FaWhatsapp className="w-4 h-4" /> Condividi su WhatsApp
            </a>
            <button onClick={copy}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl px-5 py-2.5 text-sm transition-all">
              <Copy className="w-4 h-4" />
              {copied ? '✓ Copiato!' : 'Copia Link'}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════
   STICKY BAR
═══════════════════════════════════════ */
const StickyBar = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
          transition={{ type: 'spring', damping: 22 }}
          className="fixed bottom-0 inset-x-0 z-50 bg-slate-950/96 backdrop-blur-lg border-t border-blue-500/15 shadow-[0_-4px_30px_rgba(59,130,246,0.1)]"
        >
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 px-6 py-3">
            <div className="hidden sm:block">
              <p className="text-white font-bold text-sm">Preflight & Correzione File — Solo €15</p>
              <p className="text-blue-400/70 text-xs">Controllo esperto · Garanzia ristampa · Risultato 24h</p>
            </div>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold rounded-xl px-5 py-2.5 text-sm shadow-md">
              <FaWhatsapp className="w-4 h-4" />
              Controllo File — €15
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ═══════════════════════════════════════
   PAGE ROOT
═══════════════════════════════════════ */
const GrazieFileStampaPage = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || '';

  return (
    <>
      <Helmet>
        <title>Grazie! La Tua Checklist è in Arrivo | Printora</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-slate-950 min-h-screen font-sans">
        <Hero name={name} />
        <SectionDivider />
        <ElegantOffer />
        <ChecklistPreview />
        <EmailRoadmap />
        <RadarDemo />
        <SocialProof />
        <ShareSection />
        <div className="h-20" />
      </div>
      <StickyBar />
    </>
  );
};

export default GrazieFileStampaPage;
