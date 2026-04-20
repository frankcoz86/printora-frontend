import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, Mail, Palette, Star,
  Zap, Shield, Copy, ChevronRight,
  MoveHorizontal, Sparkles, Lightbulb, Layout, Type, Printer
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const WA_URL = 'https://wa.me/393792775116?text=Consulenza+grafica+%E2%82%AC15';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

/* ═══════════════════════════════════════
   HERO
═══════════════════════════════════════ */
const Hero = ({ name }) => (
  <section className="relative bg-slate-950 overflow-hidden pt-10 pb-8 px-6">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-500/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-violet-500/6 rounded-full blur-[100px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:64px_64px]" />
    </div>

    <div className="relative z-10 max-w-3xl mx-auto text-center">
      <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col items-center gap-3">
        <motion.div variants={fadeUp}>
          <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Registrazione completata
          </span>
        </motion.div>

        <motion.h1 variants={fadeUp}
          className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
          {name ? `Grazie, ${name}!` : 'Grazie!'} La guida è in arrivo via email.
        </motion.h1>

        <motion.p variants={fadeUp} className="text-gray-400 text-[13px] sm:text-sm mt-1 max-w-lg mx-auto">
          Controlla la tua casella di posta, anche la cartella spam. Troverai la tua <strong className="text-white">Mini-Guida Grafica</strong> già pronta.
        </motion.p>
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
      <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/35 to-transparent" />
    </div>
  </div>
);

/* ═══════════════════════════════════════
   ELEGANT OFFER SECTION
═══════════════════════════════════════ */
const ElegantOffer = () => {
  const lineItems = [
    { emoji: '🎨', label: 'Design grafico su misura', value: '€ 40' },
    { emoji: '🖨️', label: 'File print-ready CMYK & DPI', value: '€ 20' },
    { emoji: '📱', label: 'Versione social in regalo', value: '€ 15' },
    { emoji: '🔄', label: 'Revisioni fino alla perfezione', value: '€ 10' },
  ];

  return (
    <section className="pt-8 pb-24 bg-slate-950 relative overflow-hidden">


      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }}>

          {/* BADGE */}
          <motion.div variants={fadeUp} className="text-center mb-6">
            <span className="inline-block bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[13px] font-black uppercase tracking-[0.25em] px-6 py-2.5 rounded-full">
              Offerta Esclusiva per i Nuovi Iscritti
            </span>
          </motion.div>

          {/* HEADLINE */}
          <motion.div variants={fadeUp} className="text-center mb-6">
            <h2 className="text-4xl sm:text-5xl md:text-[3.25rem] lg:text-[3.5rem] font-black text-white leading-[1.1] tracking-tight drop-shadow-lg">
              Vuoi Grafiche che Convertono?
              <span className="block mt-2 sm:mt-3 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400">
                Lascia fare agli Esperti, Solo €15
              </span>
            </h2>
          </motion.div>

          {/* RATIONALE */}
          <motion.div variants={fadeUp} className="text-center mb-12">
            <p className="text-gray-300 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
              Le agenzie chiedono da <span className="text-white font-bold">€80 a €200</span> per un singolo banner. Noi lo facciamo per soli <span className="text-emerald-400 font-black text-xl">€15</span>, disposti a lavorare in perdita sul tuo primo ordine, certi che diventerai un cliente abituale.
            </p>
          </motion.div>

          {/* ── MANIFESTO OFFER CARD ── */}
          <motion.div variants={fadeUp} className="relative max-w-3xl mx-auto">
            <div className="relative bg-slate-900 rounded-3xl overflow-hidden border border-white/8 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">

              {/* ── HEADER BAND ── */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-emerald-500/15 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-black text-sm tracking-wide uppercase">Servizio "Fatto per Te"</p>
                    <p className="text-emerald-400/70 text-xs">Design professionale · Consegna garantita in 24h</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-[10px] font-black uppercase tracking-wider">Attivo ora</span>
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

              {/* ── SUBTOTAL / MARKET VALUE ── */}
              <div className="mx-8 mt-4 mb-0 flex items-center justify-between py-3 border-t border-white/10">
                <p className="text-gray-500 text-sm">Valore totale di mercato</p>
                <p className="text-gray-500 text-base font-black line-through decoration-red-500/50">€ 85</p>
              </div>

              {/* ── DOTTED SEPARATOR ── */}
              <div className="mx-8 border-t border-dashed border-white/10 my-0" />

              {/* ── FINAL PRICE ── */}
              <div className="mx-8 flex items-center justify-between py-5">
                <div>
                  <p className="text-white font-black text-lg">Il tuo prezzo oggi</p>
                  <p className="text-gray-500 text-xs mt-0.5">Solo per chi si iscrive oggi · Posti limitati</p>
                </div>
                <div className="text-right">
                  <p className="text-5xl font-black text-white tracking-tighter leading-none">€15</p>
                  <p className="text-emerald-400 text-xs font-bold mt-1">– 82% di sconto</p>
                </div>
              </div>

              {/* ── TRUST STRIP ── */}
              <div className="grid grid-cols-3 divide-x divide-white/5 border-t border-white/5 mx-0">
                {[
                  { icon: '🛡️', label: 'Garanzia rimborso' },
                  { icon: '⚡', label: 'Consegna in 24h' },
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
                  className="group flex items-center justify-center gap-3 w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-lg rounded-2xl py-5 px-6 shadow-[0_8px_32px_rgba(52,211,153,0.4)] hover:shadow-[0_8px_48px_rgba(52,211,153,0.55)] transition-all duration-300">
                  <FaWhatsapp className="w-6 h-6" />
                  Sì, voglio la grafica fatta da voi €15
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
   HOW THE OFFER WORKS
═══════════════════════════════════════ */
const HowItWorksOffer = () => {
  const points = [
    { icon: <Palette className="w-6 h-6" />, title: 'Esperti In-House', desc: 'Nessun freelance esterno. I nostri grafici sono in sede e pronti a lavorare sul tuo progetto per abbattere i costi.' },
    { icon: <Shield className="w-6 h-6" />, title: 'Soddisfatti o Rimborsati', desc: 'Se la grafica non ti convince dopo la revisione, ti restituiamo i €15 al 100%. Senza burocrazia. Nessun rischio per te.' },
    { icon: <Zap className="w-6 h-6" />, title: 'Nessun Vincolo', desc: 'Nessun abbonamento. Paghi solo €15 per la grafica. Lo facciamo perché siamo certi che stamperai sempre con noi.' },
    { icon: <CheckCircle className="w-6 h-6" />, title: 'Pronto in 24 Ore', desc: 'Zero attese. Inviaci testi e logo via WhatsApp e ricevi il file perfetto per la stampa in 24 ore lavorative.' },
  ];

  return (
    <section className="py-20 bg-slate-900/60 border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            <motion.div variants={fadeUp} className="max-w-xl">
              <span className="inline-block bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6">
                Come Funziona L'Offerta
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight drop-shadow-lg mb-6">
                Perché offriamo la<br/>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Grafica a soli €15?</span>
              </h2>
              <div className="space-y-5 text-gray-300 text-lg">
                <p>
                  Sappiamo che sembra strano offrire una grafica completa a <strong className="text-white">soli €15</strong>, quando normalmente costa <strong className="text-white">tra gli €80 e i €200</strong>.
                </p>
                <p>
                  Ma c'è un motivo: il blocco più grande che i clienti hanno prima di stampare, è l'avere un file pronto e professionale.
                </p>
                <p>
                  Noi vogliamo rimuovere questo ostacolo. <strong className="text-white">Siamo disposti a darti il lavoro dei nostri grafici quasi gratis</strong>, perché crediamo ciecamente nella qualità delle nostre stampe.
                </p>
                <p className="italic text-emerald-400 font-medium">
                  Una volta vista la bontà del nostro servizio, sappiamo che diventerai un cliente abituale per tutte le tue stampe future.
                </p>
              </div>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4">
              {points.map((pt, i) => (
                <motion.div key={i} variants={fadeUp} 
                  className="bg-slate-900 border border-white/6 hover:border-emerald-500/20 rounded-2xl p-6 transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    {pt.icon}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center text-emerald-400 mb-5 relative z-10 transition-colors group-hover:border-emerald-500/30 group-hover:bg-emerald-500/20">
                    {pt.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3 relative z-10">{pt.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed relative z-10">{pt.desc}</p>
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
   THE INTERNAL PROCESS
═══════════════════════════════════════ */
const InternalProcess = () => {
  const steps = [
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: '1. Analisi Strategica',
      desc: 'Non ci limitiamo a "mettere in bella". Il nostro grafico analizza il tuo brand e l\'obiettivo della tua campagna per capire quale messaggio debba catturare l\'attenzione per primo.',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400'
    },
    {
      icon: <Layout className="w-6 h-6" />,
      title: '2. Architettura del Layout',
      desc: 'Costruiamo un\'ossatura grafica solida. Posizioniamo il tuo logo, i testi principali e la call-to-action sfruttando i principi della gerarchia visiva per massimizzare l\'impatto.',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      text: 'text-orange-400'
    },
    {
      icon: <Type className="w-6 h-6" />,
      title: '3. Design e Psicologia del Colore',
      desc: 'Scegliamo font leggibili a distanza e applichiamo contrasti cromatici studiati. Bilanciamo attentamente gli elementi con gli spazi vuoti per restituire un percepito premium.',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      text: 'text-rose-400'
    },
    {
      icon: <Printer className="w-6 h-6" />,
      title: '4. Generazione Esecutivo',
      desc: 'Il tocco tecnico finale: convertiamo tutto in CMYK, aggiungiamo i 3mm di abbondanza esterni necessari per il taglio e ti consegniamo un file "blindato", impeccabile per la stampa.',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400'
    }
  ];

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.03)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <motion.div variants={fadeUp} className="text-center mb-20">
            <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4">
              Cosa Succede Ora?
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-[3.25rem] lg:text-[3.5rem] font-black text-white leading-[1.1] tracking-tight drop-shadow-lg">
              L'officina <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">creativa interna</span>
            </h2>
            <p className="text-gray-300 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl mx-auto mt-4">
              Una volta inviatoci il tuo brief, il nostro team entra in azione. Niente template pre-fatti: ecco il nostro processo su misura.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-7 md:left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-amber-500/50 via-orange-500/20 to-transparent md:-translate-x-1/2" />
            
            <div className="space-y-10 md:space-y-16">
              {steps.map((step, i) => (
                <motion.div key={i} variants={fadeUp} className={`relative flex flex-col md:flex-row items-start md:items-center ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                  
                  <div className="hidden md:block md:w-1/2" />

                  <div className="absolute left-0 md:relative md:left-auto md:w-14 items-center justify-center flex z-10 md:mx-auto md:shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-white/10 p-1 shadow-xl">
                      <div className={`w-full h-full rounded-xl ${step.bg} flex items-center justify-center ${step.text}`}>
                        {step.icon}
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full pl-20 md:pl-0 md:w-1/2">
                    <div className={`md:${i % 2 === 0 ? 'pr-12 lg:pr-16' : 'pl-12 lg:pl-16'}`}>
                      <div className={`bg-slate-900 border border-white/5 hover:${step.border} rounded-2xl p-7 transition-all duration-300 relative group shadow-[0_4px_20px_rgba(0,0,0,0.3)]`}>
                        <h3 className="text-white font-bold text-xl mb-3">{step.title}</h3>
                        <p className="text-gray-400 text-[15px] md:text-base leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
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
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-10">
          <span className="inline-block bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4">
            Qualità Printora in azione
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-[3.25rem] lg:text-[3.5rem] font-black text-white leading-[1.1] tracking-tight drop-shadow-lg mb-4 mt-2">
            Vedi la differenza che fa<br />
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">un design professionale</span>
          </h2>
          <p className="text-gray-300 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-6">Trascina lo slider per confrontare</p>
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
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-emerald-950/80 to-slate-900 flex flex-col items-start justify-center p-8 sm:p-14">
            <div className="text-emerald-400 text-xs font-black uppercase tracking-widest mb-3">✓ Design Printora</div>
            <h3 className="text-white text-3xl sm:text-4xl font-black leading-tight mb-4">
              Comunicazione<br /><span className="text-emerald-400">che converte</span>
            </h3>
            <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-lg text-sm">
              Alta risoluzione · CMYK perfetto · Stampa precisa
            </div>
          </div>

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
   SOCIAL PROOF
═══════════════════════════════════════ */
const SocialProof = () => {
  const reviews = [
    { stars: 5, name: 'Marco B.', role: 'Titolare Gelateria', text: 'Non credevo fosse possibile a €15. In 18 ore avevo il banner del gelato pronto. Qualità da agenzia. Tornerò sempre.' },
    { stars: 5, name: 'Giulia T.', role: 'Stilista Indipendente', text: 'Ero bloccata su Canva da 3 giorni. Ho scritto su WhatsApp, e in 24h avevo esattamente quello che immaginavo.' },
  ];

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <motion.div variants={fadeUp} className="text-center mb-10">
            <div className="flex items-center justify-center gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-[3.25rem] lg:text-[3.5rem] font-black text-white leading-[1.1] tracking-tight drop-shadow-lg mb-6 mt-2">Cosa dicono i nostri clienti</h2>
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
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-xl font-bold text-white mb-2">Conosci qualcuno che ne ha bisogno?</h3>
          <p className="text-gray-400 text-base leading-relaxed mb-6">Condividi la guida gratuita con colleghi o amici, è un regalo utile.</p>
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
          className="fixed bottom-0 inset-x-0 z-50 bg-slate-950/96 backdrop-blur-lg border-t border-emerald-500/15 shadow-[0_-4px_30px_rgba(52,211,153,0.1)]"
        >
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 px-6 py-3">
            <div className="hidden sm:block">
              <p className="text-white font-bold text-sm">Grafica Professionale · Solo €15</p>
              <p className="text-emerald-400/70 text-xs">Consegna in 24h · Garanzia rimborso</p>
            </div>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold rounded-xl px-5 py-2.5 text-sm shadow-md">
              <FaWhatsapp className="w-4 h-4" />
              Grafica Fatta da Noi €15
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
        <SectionDivider />
        <ElegantOffer />
        <HowItWorksOffer />
        <InternalProcess />
        <BeforeAfter />
        <SocialProof />
        <ShareSection />
        <div className="h-20" />
      </div>
      <StickyBar />
    </>
  );
};

export default GrazieEditorPage;
