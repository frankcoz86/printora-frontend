import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, Mail, BookOpen, Palette, Clock, Star, ArrowRight,
  Zap, Shield, Copy, TrendingUp, TrendingDown, Gift, ChevronRight,
  MoveHorizontal
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const WA_URL = 'https://wa.me/393792775116?text=Consulenza+grafica+%E2%82%AC15';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

/* ═══════════════════════════════════════
   HERO — Warm professional welcome
═══════════════════════════════════════ */
const Hero = ({ name }) => (
  <section className="relative bg-slate-950 overflow-hidden pt-16 pb-20 px-4">
    {/* Ambient glow */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-500/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-violet-500/6 rounded-full blur-[100px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:64px_64px]" />
    </div>

    <div className="relative z-10 max-w-3xl mx-auto text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 14, delay: 0.1 }}
        className="flex justify-center mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/30 blur-2xl rounded-full scale-150 animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_0_40px_rgba(52,211,153,0.4)]">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
        </div>
      </motion.div>

      <motion.div variants={stagger} initial="hidden" animate="visible">
        <motion.div variants={fadeUp}>
          <span className="inline-block bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-5">
            Registrazione completata
          </span>
        </motion.div>

        <motion.h1 variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.08] tracking-tight mb-4">
          {name ? `Grazie, ${name}!` : 'Grazie!'}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            La guida è in arrivo.
          </span>
        </motion.h1>

        <motion.p variants={fadeUp} className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
          Controlla la tua casella di posta — anche la cartella spam. Troverai la tua
          <strong className="text-white"> Mini-Guida Grafica Professionale in 5 Passi</strong> già pronta.
        </motion.p>

        <motion.div variants={fadeUp}
          className="inline-flex items-center gap-3 bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-sm">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <Mail className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-left">
            <p className="text-white font-semibold text-sm">Email inviata adesso</p>
            <p className="text-gray-500 text-xs">Controlla anche la cartella Promozioni o Spam</p>
          </div>
          <div className="ml-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 text-xs font-bold">Live</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

/* ═══════════════════════════════════════
   WHAT'S INSIDE THE GUIDE
═══════════════════════════════════════ */
const GuidePreview = () => {
  const chapters = [
    { num: '01', icon: '🎨', title: 'I Fondamentali della Composizione', desc: 'Come scegliere layout e gerarchie visive che guidano l\'occhio del cliente dove vuoi tu.' },
    { num: '02', icon: '🖋️', title: 'Tipografia che Comunica Professionalità', desc: 'Combinazioni di font che danno autorevolezza al tuo brand, anche partendo da zero.' },
    { num: '03', icon: '🌈', title: 'La Psicologia del Colore per il Marketing', desc: 'Come scegliere palette cromatiche che trasmettono esattamente il messaggio giusto.' },
    { num: '04', icon: '📐', title: 'File Perfetti per la Stampa', desc: 'CMYK, DPI, margini di abbondanza — tutto spiegato in modo semplice e pratico.' },
    { num: '05', icon: '⚡', title: 'Errori da Evitare Sempre', desc: 'I 7 errori che rovinano anche la grafica più curata — e come non commetterli mai.' },
  ];

  return (
    <section className="py-20 bg-slate-900/60 border-y border-white/5">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="inline-block bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4">
              Cosa hai appena ricevuto
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              La tua Guida in <span className="text-violet-400">5 Capitoli</span>
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">
              Ogni capitolo è pensato per portarti da zero a grafiche professionali — passo dopo passo.
            </p>
          </motion.div>

          <div className="space-y-3">
            {chapters.map((ch, i) => (
              <motion.div key={i} variants={fadeUp}
                className="group relative flex items-start gap-5 bg-slate-900 hover:bg-slate-800/80 border border-white/6 hover:border-violet-500/20 rounded-2xl px-5 py-5 transition-all duration-300">
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black text-gray-600 tracking-widest">{ch.num}</span>
                  <span className="text-2xl">{ch.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-base mb-1 group-hover:text-violet-300 transition-colors">{ch.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{ch.desc}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-emerald-500/40 group-hover:text-emerald-500 transition-colors shrink-0 mt-0.5" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════
   EMAIL SEQUENCE TEASER
═══════════════════════════════════════ */
const EmailRoadmap = () => {
  const emails = [
    { day: 'Oggi', icon: '📬', label: 'La tua Mini-Guida', desc: 'La guida completa in PDF: 5 passi per grafiche professionali.' },
    { day: 'Domani', icon: '📖', label: 'L\'errore #1 dei principianti', desc: 'Quello che rende amatoriale anche la grafica più curata.' },
    { day: 'Giorno 3', icon: '🎨', label: 'Colori che vendono', desc: 'Come scegliere la palette perfetta per attirare il tuo cliente ideale.' },
    { day: 'Giorno 5', icon: '📈', label: 'Case study reale', desc: 'Come Marco ha raddoppiato gli ingressi in negozio con un unico banner.' },
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
            <p className="text-gray-400 mt-3">Abbiamo preparato un percorso che ti porta da zero a esperto passo dopo passo.</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-[27px] top-8 bottom-4 w-px bg-gradient-to-b from-amber-500/40 via-amber-500/20 to-transparent hidden sm:block" />
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
   INTERACTIVE BEFORE/AFTER SLIDER
═══════════════════════════════════════ */
const BeforeAfter = () => {
  const [pos, setPos] = useState(50);
  const ref = useRef(null);

  const move = (e) => {
    if (!ref.current) return;
    const { left, width } = ref.current.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    setPos(Math.max(2, Math.min(98, ((x - left) / width) * 100)));
  };

  const startDrag = () => {
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchend', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
  };

  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-10">
          <span className="inline-block bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4">
            Qualità Printora in azione
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Vedi la differenza che fa<br />
            <span className="text-teal-400">un design professionale</span>
          </h2>
          <p className="text-gray-400 text-sm">Trascina lo slider per confrontare</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          ref={ref}
          className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden border border-white/10 shadow-2xl cursor-ew-resize select-none"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          {/* Professional side */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-emerald-950/80 to-slate-900 flex flex-col items-start justify-center p-8 sm:p-14">
            <div className="text-emerald-400 text-xs font-black uppercase tracking-widest mb-3">✓ Design Printora</div>
            <h3 className="text-white text-3xl sm:text-4xl font-black leading-tight mb-4">
              Comunicazione<br /><span className="text-emerald-400">che converte</span>
            </h3>
            <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-lg text-sm">
              Alta risoluzione · CMYK perfetto · Stampa precisa
            </div>
          </div>

          {/* Amateur side */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-gray-100 to-orange-50 flex flex-col items-start justify-center p-8 sm:p-14"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            <div className="text-red-500 text-xs font-black uppercase tracking-widest mb-3">✗ Template generico</div>
            <h3 className="text-gray-800 text-3xl sm:text-4xl font-black leading-tight mb-4 font-serif">
              Comunicazione<br /><span className="text-gray-500">che viene ignorata</span>
            </h3>
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm">
              Sgranata · Margini tagliati · Amatoriale
            </div>
          </div>

          {/* Handle */}
          <div className="absolute inset-y-0 w-0.5 bg-white/80 z-20 pointer-events-none shadow-[0_0_12px_rgba(255,255,255,0.6)]"
            style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 bg-white rounded-full shadow-xl flex items-center justify-center">
              <MoveHorizontal className="w-5 h-5 text-slate-600" />
            </div>
          </div>
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">← Prima</div>
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">Printora →</div>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════
   ROI CALCULATOR
═══════════════════════════════════════ */
const RoiCalculator = () => {
  const [hourlyRate, setHourlyRate] = useState(20);
  const [hours, setHours] = useState(3);
  const [perMonth, setPerMonth] = useState(2);

  const diyCost = hourlyRate * hours * perMonth;
  const ourCost = 15 * perMonth;
  const savings = diyCost - ourCost;

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <span className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4">
            Calcolatore gratuito
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Quanto vale il tuo tempo?
          </h2>
          <p className="text-gray-400">Calcola il costo reale della grafica fai-da-te vs il servizio Printora</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-slate-900 border border-white/8 rounded-3xl p-7 sm:p-10 shadow-2xl">
          <div className="space-y-7 mb-8">
            {[
              { label: 'Valore della tua ora lavorativa', val: `€${hourlyRate}/h`, value: hourlyRate, setter: setHourlyRate, min: 10, max: 100, step: 5, color: 'emerald' },
              { label: 'Ore per creare una grafica da solo', val: `${hours} ore`, value: hours, setter: setHours, min: 1, max: 12, step: 1, color: 'violet' },
              { label: 'Grafiche che crei ogni mese', val: `${perMonth} grafiche`, value: perMonth, setter: setPerMonth, min: 1, max: 10, step: 1, color: 'amber' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm">{item.label}</span>
                  <span className={`font-black text-base ${item.color === 'emerald' ? 'text-emerald-400' : item.color === 'violet' ? 'text-violet-400' : 'text-amber-400'}`}>{item.val}</span>
                </div>
                <input type="range" min={item.min} max={item.max} step={item.step}
                  value={item.value} onChange={e => item.setter(Number(e.target.value))}
                  className={`w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-700 ${item.color === 'emerald' ? 'accent-emerald-500' : item.color === 'violet' ? 'accent-violet-500' : 'accent-amber-500'}`} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-800/80 border border-white/5 rounded-2xl p-5 text-center">
              <div className="flex items-center justify-center gap-1 text-gray-500 mb-2 text-xs font-bold uppercase tracking-wide">
                <TrendingDown className="w-3.5 h-3.5" /> Fai-da-te
              </div>
              <div className="text-3xl font-black text-white">€{diyCost}</div>
              <div className="text-gray-600 text-xs mt-1">al mese in tempo perso</div>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-400 mb-2 text-xs font-bold uppercase tracking-wide">
                <TrendingUp className="w-3.5 h-3.5" /> Con Printora
              </div>
              <div className="text-3xl font-black text-white">€{ourCost}</div>
              <div className="text-emerald-500/60 text-xs mt-1">al mese, tutto incluso</div>
            </div>
          </div>

          {savings > 0 && (
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center">
              <p className="text-gray-400 text-sm mb-0.5">Risparmio mensile risparmio reale:</p>
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">€{savings}</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════
   ELEGANT OFFER SECTION — Soft sell
═══════════════════════════════════════ */
const ElegantOffer = () => {
  const items = [
    '🎨 Design grafico personalizzato (non un template)',
    '📐 Impaginazione professionale pronta per la stampa',
    '✨ Ottimizzazione risoluzione e anti-sgranatura',
    '📱 BONUS: Versione adattata per Instagram / Facebook',
  ];

  return (
    <section className="py-20 bg-slate-900/60 border-y border-white/5 relative overflow-hidden">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>

          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="inline-block bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4">
              Un passaggio in più — solo per te
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Hai scaricato la guida.<br />
              <span className="text-emerald-400">Vuoi che la grafica la facciamo noi?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Per i nuovi iscritti offriamo il servizio completo di design grafico a <strong className="text-white">soli €15</strong> invece di €80 —
              è il nostro modo per presentarci e guadagnarci la tua fiducia.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}
            className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/15 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(52,211,153,0.07)]">

            {/* Card top */}
            <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/5 bg-emerald-500/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Gift className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Servizio "Fatto per Te"</p>
                  <p className="text-gray-500 text-xs">Design professionale in 24 ore</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-xs line-through">€80+</p>
                <p className="text-emerald-400 font-black text-2xl leading-tight">€15</p>
              </div>
            </div>

            {/* Items */}
            <div className="px-6 sm:px-8 py-6 space-y-3">
              {items.map((item, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="flex items-center gap-3 text-gray-300 text-sm py-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  {item}
                </motion.div>
              ))}
            </div>

            {/* Rationale */}
            <div className="px-6 sm:px-8 pb-6">
              <div className="bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 mb-6">
                <p className="text-gray-400 text-sm leading-relaxed italic">
                  "Offriamo questo servizio a €15 perché vogliamo dimostrarti la nostra qualità.
                  Sappiamo che chi prova Printora, torna sempre."
                </p>
                <p className="text-emerald-400 font-bold text-xs mt-2">— Il Team Printora</p>
              </div>

              <motion.a
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-black text-lg rounded-2xl py-4 px-6 shadow-[0_4px_24px_rgba(37,211,102,0.3)] hover:shadow-[0_4px_40px_rgba(37,211,102,0.5)] transition-all duration-300"
              >
                <FaWhatsapp className="w-6 h-6" />
                Sì, voglio la grafica fatta da voi — €15
                <ChevronRight className="w-5 h-5 opacity-70" />
              </motion.a>

              <p className="text-center text-gray-600 text-xs mt-3">
                Risposta in meno di 100 secondi · Consegna in 24h · Garanzia rimborso totale
              </p>
            </div>
          </motion.div>

          {/* Guarantee strip */}
          <motion.div variants={fadeUp}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-500" /> Garanzia rimborso totale</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Nessun costo nascosto</span>
            <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-emerald-500" /> Consegna in 24 ore</span>
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
    { stars: 5, name: 'Marco B.', role: 'Titolare Gelateria', text: 'Non credevo fosse possibile a €15. In 18 ore avevo il banner del gelato pronto. Qualità da agenzia. Tornerò sempre.' },
    { stars: 5, name: 'Giulia T.', role: 'Stilista Indipendente', text: 'Ero bloccata su Canva da 3 giorni. Ho scritto su WhatsApp, e in 24h avevo esattamente quello che immaginavo.' },
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
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-sm">
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
  const url = 'https://printora.it/guida-editor';
  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 bg-slate-900/40 border-t border-white/5">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-xl font-bold text-white mb-2">Conosci qualcuno che ne ha bisogno?</h3>
          <p className="text-gray-500 text-sm mb-6">Condividi la guida gratuita con colleghi o amici — è un regalo utile.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href={`https://wa.me/?text=Ho trovato questa guida gratuita di Printora sulla grafica professionale!%20${url}`}
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
   STICKY BAR — Minimal & polished
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
          className="fixed bottom-0 inset-x-0 z-50 bg-slate-950/96 backdrop-blur-lg border-t border-emerald-500/15 shadow-[0_-4px_30px_rgba(52,211,153,0.1)]"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
            <div className="hidden sm:block">
              <p className="text-white font-bold text-sm">Grafica Professionale · Solo €15</p>
              <p className="text-emerald-400/70 text-xs">Consegna in 24h · Garanzia rimborso</p>
            </div>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold rounded-xl px-5 py-2.5 text-sm shadow-md">
              <FaWhatsapp className="w-4 h-4" />
              Grafica Fatta da Noi — €15
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
const GrazieEditorPage = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || '';

  return (
    <>
      <Helmet>
        <title>Grazie! La Tua Guida è in Arrivo | Printora</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-slate-950 min-h-screen font-sans">
        <Hero name={name} />
        <GuidePreview />
        <EmailRoadmap />
        <BeforeAfter />
        <RoiCalculator />
        <ElegantOffer />
        <SocialProof />
        <ShareSection />
        <div className="h-20" />
      </div>
      <StickyBar />
    </>
  );
};

export default GrazieEditorPage;
