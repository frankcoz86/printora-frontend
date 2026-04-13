import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, Mail, Clock, Star, Shield, Copy, Gift,
  ChevronRight, Zap, AlertTriangle, ScanEye, ShieldAlert,
  CheckCircle2, FileText, Target
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const WA_URL = 'https://wa.me/393792775116?text=Controllo+File+%E2%82%AC15';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

/* ═══════════════════════════════════════
   HERO — Warm welcome
═══════════════════════════════════════ */
const Hero = ({ name }) => (
  <section className="relative bg-slate-950 overflow-hidden pt-16 pb-20 px-4">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-500/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/6 rounded-full blur-[100px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:64px_64px]" />
    </div>

    <div className="relative z-10 max-w-3xl mx-auto text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 14, delay: 0.1 }}
        className="flex justify-center mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full scale-150 animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.4)]">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
        </div>
      </motion.div>

      <motion.div variants={stagger} initial="hidden" animate="visible">
        <motion.div variants={fadeUp}>
          <span className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-5">
            Registrazione completata
          </span>
        </motion.div>

        <motion.h1 variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.08] tracking-tight mb-4">
          {name ? `Grazie, ${name}!` : 'Grazie!'}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
            La checklist è in arrivo.
          </span>
        </motion.h1>

        <motion.p variants={fadeUp} className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
          Controlla la tua casella di posta — anche la cartella spam. Troverai la
          <strong className="text-white"> Checklist Pre-Stampa PDF in 7 Punti</strong> subito disponibile.
        </motion.p>

        <motion.div variants={fadeUp}
          className="inline-flex items-center gap-3 bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-sm">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <Mail className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-left">
            <p className="text-white font-semibold text-sm">Email inviata adesso</p>
            <p className="text-gray-500 text-xs">Controlla anche la cartella Promozioni o Spam</p>
          </div>
          <div className="ml-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-blue-400 text-xs font-bold">Live</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

/* ═══════════════════════════════════════
   CHECKLIST PREVIEW
═══════════════════════════════════════ */
const ChecklistPreview = () => {
  const points = [
    { num: '01', icon: '🎨', title: 'Profilo Colore Corretto', desc: 'RGB va bene sullo schermo, ma la stampa richiede CMYK con profilo FOGRA39. Impariamo a convertire senza perdere qualità.' },
    { num: '02', icon: '📐', title: 'Margine di Abbondanza (Bleed)', desc: '3mm oltre il bordo di taglio: il piccolo segreto che previene i bordi bianchi nella stampa finale.' },
    { num: '03', icon: '🖼️', title: 'Risoluzione Minima 300 DPI', desc: 'Le immagini a 72 DPI sembrano perfette sullo schermo ma escono sgranate in stampa. Come verificarlo in anticipo.' },
    { num: '04', icon: '✏️', title: 'Font Convertiti in Tracciati', desc: 'Senza questa operazione la tipografia sostituisce i tuoi font con caratteri di default. Come evitarlo definitivamente.' },
    { num: '05', icon: '🔲', title: 'Nero Ricco vs Nero Puro', desc: 'Il nero puro stampa grigio. Il nero ricco (C60 M40 Y40 K100) stampa bello scuro. La formula esatta è qui.' },
    { num: '06', icon: '📄', title: 'Formato File Corretto', desc: 'PDF, TIFF o JPG? Quale usare in quale caso. Le impostazioni di esportazione che fanno la differenza.' },
    { num: '07', icon: '✅', title: 'Checklist Finale Pre-Invio', desc: 'I 7 controlli da fare sempre prima di mandare il file in tipografia — nessun errore sfugge più.' },
  ];

  return (
    <section className="py-20 bg-slate-900/60 border-y border-white/5">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4">
              Cosa hai appena ricevuto
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              La tua Checklist in <span className="text-blue-400">7 Punti Critici</span>
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">
              Ogni punto elimina un errore specifico che costa soldi in ristampe. Tienila sempre a portata di mano.
            </p>
          </motion.div>

          <div className="space-y-3">
            {points.map((pt, i) => (
              <motion.div key={i} variants={fadeUp}
                className="group relative flex items-start gap-5 bg-slate-900 hover:bg-slate-800/80 border border-white/6 hover:border-blue-500/20 rounded-2xl px-5 py-5 transition-all duration-300">
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
    { day: 'Domani', icon: '🎨', label: 'I neri corretti per la stampa', desc: 'La formula esatta per neri ricchi (C60 M40 Y40 K100) che non sbiadiscono in stampa.' },
    { day: 'Giorno 3', icon: '🔍', label: 'Come le tipografie "aggiustano" i file', desc: 'Quello che fanno le tipografie ai tuoi file senza dirti nulla — e come proteggere il tuo lavoro.' },
    { day: 'Giorno 5', icon: '💡', label: 'Case study: €500 risparmiati', desc: 'Come uno studio ha evitato una ristampa da €500 grazie a 3 controlli di 5 minuti.' },
  ];

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4">
              Il tuo percorso formativo
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Cosa riceverai <span className="text-amber-400">nei prossimi giorni</span>
            </h2>
            <p className="text-gray-400 mt-3">Ogni email ti porta un livello più in alto nella gestione professionale dei file di stampa.</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-[27px] top-8 bottom-4 w-px bg-gradient-to-b from-amber-500/40 via-amber-500/15 to-transparent hidden sm:block" />
            <div className="space-y-4">
              {emails.map((e, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="flex items-start gap-4 bg-slate-900 border border-white/6 hover:border-amber-500/20 rounded-2xl px-5 py-4 transition-all duration-300 group">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-slate-800 border border-white/8 flex flex-col items-center justify-center gap-0.5 relative z-10">
                    <span className="text-xl leading-none">{e.icon}</span>
                    <span className="text-amber-500 text-[9px] font-black uppercase tracking-wide leading-none">{e.day}</span>
                  </div>
                  <div className="pt-1">
                    <p className="text-white font-bold text-sm group-hover:text-amber-300 transition-colors">{e.label}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{e.desc}</p>
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
   INTERACTIVE RADAR — Show value
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
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <span className="inline-block bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4">
            Simulatore interattivo
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Come funziona il <span className="text-indigo-400">controllo Printora</span>
          </h2>
          <p className="text-gray-400">Premi il pulsante per simulare l'analisi tecnica di un file PDF</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-[#080d18] border border-blue-500/15 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.08)] mb-5">
          {/* Terminal top bar */}
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
   RISK CALCULATOR — Elegant version
═══════════════════════════════════════ */
const RiskCalculator = () => {
  const [printVal, setPrintVal] = useState(400);
  const ratio = Math.round(printVal / 15);

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <span className="inline-block bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4">
            Calcola il tuo rischio
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Quanto stai mettendo<br /><span className="text-orange-400">a rischio per stampa?</span>
          </h2>
          <p className="text-gray-400 text-sm">Inserisci il valore del tuo prossimo ordine di stampa</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-slate-900 border border-white/8 rounded-3xl p-7 sm:p-10 shadow-2xl">
          <div className="mb-8">
            <div className="flex justify-between mb-3">
              <span className="text-gray-400 text-sm">Valore stimato ordine di stampa</span>
              <span className="text-blue-400 font-black text-xl">€{printVal}</span>
            </div>
            <input type="range" min={50} max={2000} step={50} value={printVal} onChange={e => setPrintVal(Number(e.target.value))}
              className="w-full h-2.5 rounded-full appearance-none cursor-pointer accent-blue-500 bg-slate-700" />
            <div className="flex justify-between text-[11px] text-gray-600 mt-1.5"><span>€50</span><span>€2,000</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-800/60 border border-white/5 rounded-2xl p-5 text-center">
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-bold">Senza controllo</div>
              <div className="text-3xl font-black text-white">€{printVal}</div>
              <div className="text-gray-600 text-xs mt-1">a rischio se il file è errato</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 text-center">
              <div className="text-blue-400 text-xs uppercase tracking-wider mb-2 font-bold">Controllo Printora</div>
              <div className="text-3xl font-black text-white">€15</div>
              <div className="text-blue-400/60 text-xs mt-1">protezione totale, sempre</div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5 text-center mb-6">
            <p className="text-gray-400 text-sm">
              Per ogni €1 investito in controllo, hai <span className="text-white font-bold">€{ratio} di transazioni protette</span>.
            </p>
          </div>

          <motion.a whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
            href={WA_URL} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-black text-base rounded-2xl py-4 px-6 shadow-[0_4px_24px_rgba(37,211,102,0.3)] hover:shadow-[0_4px_40px_rgba(37,211,102,0.45)] transition-all duration-300">
            <FaWhatsapp className="w-5 h-5" />
            Prenota il Controllo File — €15
            <ChevronRight className="w-4 h-4 opacity-70" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════
   ELEGANT OFFER
═══════════════════════════════════════ */
const ElegantOffer = () => {
  const items = [
    '🔍 Analisi tecnica completa del PDF (CMYK, DPI, font)',
    '📐 Correzione margini e abbondanze (3mm standard)',
    '🎨 Conversione colore RGB → CMYK Profilo FOGRA39',
    '✏️ Incorporazione e verifica font nel documento',
    '♻️ BONUS: Ristampa gratuita in caso di errore nostro',
  ];

  return (
    <section className="py-20 bg-slate-900/60 border-y border-white/5 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4">
              Un passaggio in più — solo per te
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Hai scaricato la checklist.<br />
              <span className="text-blue-400">Vuoi che controlliamo il file noi?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Per i nuovi iscritti offriamo il controllo tecnico completo a <strong className="text-white">soli €15</strong> invece di €80 —
              è il nostro modo di presentarci e guadagnarci la tua fiducia con i fatti.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}
            className="bg-gradient-to-br from-slate-900 to-slate-950 border border-blue-500/15 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.07)]">
            <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/5 bg-blue-500/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Preflight & Correzione File</p>
                  <p className="text-gray-500 text-xs">Controllo tecnico professionale in 24 ore</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-xs line-through">€80+</p>
                <p className="text-blue-400 font-black text-2xl leading-tight">€15</p>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-6 space-y-3">
              {items.map((item, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="flex items-center gap-3 text-gray-300 text-sm py-1">
                  <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
                  {item}
                </motion.div>
              ))}
            </div>

            <div className="px-6 sm:px-8 pb-8">
              <div className="bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 mb-6">
                <p className="text-gray-400 text-sm leading-relaxed italic">
                  "Offriamo questo a €15 perché odiamo vedere stampe bellissime rovinate da errori tecnici evitabili.
                  Vogliamo dimostrarti la nostra qualità prima che tu diventi un cliente fisso."
                </p>
                <p className="text-blue-400 font-bold text-xs mt-2">— Il Team Tecnico Printora</p>
              </div>

              <motion.a whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                href={WA_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-black text-lg rounded-2xl py-4 px-6 shadow-[0_4px_24px_rgba(37,211,102,0.3)] hover:shadow-[0_4px_40px_rgba(37,211,102,0.5)] transition-all duration-300">
                <FaWhatsapp className="w-6 h-6" />
                Sì, controllate il mio file — Solo €15
                <ChevronRight className="w-5 h-5 opacity-70" />
              </motion.a>
              <p className="text-center text-gray-600 text-xs mt-3">
                Risposta in &lt;100 secondi · Risultato in 24h · Garanzia rimborso totale
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-blue-500" /> Garanzia ristampa gratuita</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Nessun costo aggiuntivo</span>
            <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-blue-500" /> Risultato in 24 ore</span>
          </motion.div>
        </motion.div>
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
      <div className="max-w-3xl mx-auto px-4">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <motion.div variants={fadeUp} className="text-center mb-10">
            <div className="flex items-center justify-center gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Cosa dicono i nostri clienti</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {reviews.map((r, i) => (
              <motion.div key={i} variants={fadeUp}
                className="bg-slate-900 border border-white/6 rounded-2xl p-6 flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(r.stars)].map((_, si) => <Star key={si} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed flex-1 italic mb-4">"{r.text}"</p>
                <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-sm">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{r.name}</p>
                    <p className="text-gray-500 text-xs">{r.role}</p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-blue-500 ml-auto" />
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
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-xl font-bold text-white mb-2">Conosci un collega che stampa spesso?</h3>
          <p className="text-gray-500 text-sm mb-6">Condividi la checklist — potrebbe risparmiargli una ristampa costosa.</p>
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
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
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
        <ChecklistPreview />
        <EmailRoadmap />
        <RadarDemo />
        <RiskCalculator />
        <ElegantOffer />
        <SocialProof />
        <ShareSection />
        <div className="h-20" />
      </div>
      <StickyBar />
    </>
  );
};

export default GrazieFileStampaPage;
