import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  ArrowRight,
  Download,
  Lock,
  BookOpen,
  Palette,
  Upload,
  Type,
  CheckSquare,
  Ruler,
  AlertTriangle,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

/* ─── Constants ─────────────────────────────────────────── */
const WA_CONSULT_URL =
  'https://wa.me/393792775116?text=Consulenza+grafica+%E2%82%AC15';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://printora-backend.onrender.com';

/* ─── Animation helpers ──────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

/* ─── Reusable micro-components ──────────────────────────── */
const SectionBadge = ({ color = 'emerald', children }) => {
  const cls =
    color === 'violet'
      ? 'bg-violet-500/10 border-violet-500/30 text-violet-300'
      : color === 'amber'
      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
      : color === 'blue'
      ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
  return (
    <span
      className={`inline-block border text-[11px] font-bold tracking-[0.15em] uppercase px-4 py-1.5 rounded-full ${cls}`}
    >
      {children}
    </span>
  );
};

/* ─── PDF Guide Mock-up Visual ───────────────────────────── */
const GuidaMockup = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.3 }}
    className="relative mx-auto w-full max-w-[260px]"
  >
    {/* Shadow / depth layer */}
    <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl bg-emerald-500/10 border border-emerald-500/20" />
    {/* Main card */}
    <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl shadow-emerald-900/40">
      {/* Cover header */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 px-6 py-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-4">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <p className="text-emerald-100 text-[10px] font-bold tracking-[0.2em] uppercase mb-1">
          Mini-Guida Gratuita
        </p>
        <h3 className="text-white font-extrabold text-sm leading-tight">
          GRAFICA FACILE
        </h3>
        <p className="text-emerald-100/80 text-xs mt-1 leading-snug">
          5 Passi per Creare la Tua<br />Grafica Professionale
        </p>
      </div>
      {/* Cover body */}
      <div className="bg-slate-900 px-5 py-5 space-y-2.5">
        {[
          { step: '01', label: 'Dimensioni giuste' },
          { step: '02', label: 'Carica il tuo logo' },
          { step: '03', label: 'Scegli i colori' },
          { step: '04', label: 'Aggiungi i testi' },
          { step: '05', label: 'Controlla e scarica' },
        ].map(({ step, label }) => (
          <div key={step} className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black flex items-center justify-center shrink-0">
              {step}
            </span>
            <span className="text-gray-300 text-xs">{label}</span>
          </div>
        ))}
      </div>
      {/* Footer brand */}
      <div className="bg-slate-950 px-5 py-3 flex items-center justify-between">
        <span className="text-emerald-400 text-xs font-bold tracking-wider">
          printora.it
        </span>
        <span className="text-gray-600 text-[10px]">Guida PDF</span>
      </div>
    </div>
    {/* Free badge */}
    <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-400/30">
      <div className="text-center">
        <p className="text-slate-900 font-black text-[10px] leading-none">100%</p>
        <p className="text-slate-900 font-black text-[10px] leading-none">GRATIS</p>
      </div>
    </div>
  </motion.div>
);

/* ─── Opt-in Form ─────────────────────────────────────────── */
const OptInForm = ({ variant = 'hero', onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim()) {
      setError('Inserisci nome e email per continuare.');
      return;
    }
    setLoading(true);
    try {
      await fetch(`${BACKEND_URL}/api/leads/hvco`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          source: 'hvco_editor',
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // Backend might not be live yet — still proceed
    } finally {
      setLoading(false);
      const encodedName = encodeURIComponent(name.trim());
      navigate(`/grazie?source=hvco_editor&name=${encodedName}`);
    }
  };

  const isCompact = variant === 'sticky';

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full">
      {!isCompact && (
        <div>
          <label htmlFor={`name-${variant}`} className="block text-xs font-semibold text-gray-400 mb-1.5">
            Il tuo nome
          </label>
          <input
            id={`name-${variant}`}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="es. Marco"
            required
            className="w-full bg-slate-800/70 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />
        </div>
      )}
      {isCompact && (
        <input
          id={`name-${variant}`}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Il tuo nome"
          required
          className="w-full bg-slate-800/70 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
        />
      )}
      <div>
        {!isCompact && (
          <label htmlFor={`email-${variant}`} className="block text-xs font-semibold text-gray-400 mb-1.5">
            La tua email
          </label>
        )}
        <input
          id={`email-${variant}`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={isCompact ? 'La tua email' : 'es. marco@ilmionegozio.it'}
          required
          className="w-full bg-slate-800/70 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
        />
      </div>
      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-900 font-extrabold rounded-xl px-6 py-4 text-base shadow-lg shadow-emerald-900/40 hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
      >
        <Download className="w-5 h-5 shrink-0" />
        {loading ? 'Un momento…' : 'SCARICA LA GUIDA GRATIS →'}
      </button>
      <p className="text-center text-gray-500 text-xs flex items-center justify-center gap-1.5">
        <Lock className="w-3 h-3" />
        Nessuno spam. Mai. Puoi cancellare quando vuoi.
      </p>
    </form>
  );
};

/* ─── Success State ──────────────────────────────────────── */
const SuccessState = ({ name }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="text-center space-y-4 py-4"
  >
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 mx-auto">
      <CheckCircle className="w-8 h-8 text-emerald-400" />
    </div>
    <div>
      <h3 className="text-white font-extrabold text-xl">
        Perfetto{name ? `, ${name}` : ''}! 🎉
      </h3>
      <p className="text-gray-400 text-sm mt-2 leading-relaxed">
        La guida è in arrivo nella tua casella email. <br />
        Controlla anche la cartella <span className="text-emerald-400 font-semibold">Spam</span> se non la trovi entro 5 minuti.
      </p>
    </div>
    <div className="bg-slate-800/50 border border-emerald-500/20 rounded-xl p-4 text-left space-y-2">
      <p className="text-emerald-300 text-sm font-bold">Nel frattempo…</p>
      <p className="text-gray-400 text-xs leading-relaxed">
        Hai già un'idea di grafica ma non vuoi occupartene tu?
        Il nostro esperto grafico crea il file per te in 24 ore — prezzo fisso <span className="text-white font-bold">€15</span>.
      </p>
      <a
        href={WA_CONSULT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200 text-sm font-semibold transition-colors mt-1"
      >
        <FaWhatsapp className="w-4 h-4" />
        Scopri la Consulenza Grafica €15 →
      </a>
    </div>
  </motion.div>
);

/* ─── Hero ───────────────────────────────────────────────── */
const Hero = () => {
  const [submitted, setSubmitted] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleSuccess = (data) => {
    setUserData(data);
    setSubmitted(true);
  };

  return (
    <section className="relative bg-slate-950 overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
      {/* Background glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] left-[30%] w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 max-w-7xl mx-auto">

          {/* Left — Copy */}
          <div className="flex-1 text-center lg:text-left">
            {/* Audience callout */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-block"
            >
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/80 border border-emerald-500/30 shadow-lg shadow-emerald-500/5 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 text-xs font-bold tracking-wider uppercase">
                  Per Titolari di Negozio e Ristoratori
                </span>
              </div>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight mb-8"
            >
              Vuoi un Banner Professionale <br className="hidden lg:block"/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200">
                per il Tuo Negozio o Evento
              </span>
              <br className="hidden lg:block"/>
              ma Non Hai Idea da Dove Cominciare?
            </motion.h1>

            {/* Subheadline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="space-y-6 max-w-2xl mx-auto lg:mx-0"
            >
              <p className="text-xl md:text-2xl font-bold text-gray-200">
                Scarica Gratis la Mini-Guida in 5 Passi.<br/>
                <span className="text-gray-400 font-medium text-lg md:text-xl">Nessuna Esperienza Grafica Richiesta.</span>
              </p>
              <p className="text-base md:text-lg text-gray-400 leading-relaxed">
                In questa guida gratuita impari a usare il nostro editor online
                e <strong className="text-gray-200">crei la tua grafica professionale in meno di 15 minuti.</strong> Passo dopo passo. Con esempi reali.
              </p>
            </motion.div>

            {/* Trust strip & Social Proof combined */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-12 flex flex-col sm:flex-row items-center gap-8 justify-center lg:justify-start"
            >
              <div className="flex flex-col gap-3 text-sm">
                {[
                  'PDF gratuito, zero costi',
                  'Nessuna app da installare',
                  'In italiano, senza tecnicismi',
                ].map((t, i) => (
                  <span key={i} className="flex items-center gap-2 text-gray-300 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    {t}
                  </span>
                ))}
              </div>

              <div className="hidden sm:block w-px h-20 bg-white/10" />

              <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex items-center gap-4 max-w-xs transition hover:bg-slate-800/60">
                <div className="flex -space-x-3 shrink-0">
                  {['M', 'L', 'G'].map((letter, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 border-2 border-slate-950 flex items-center justify-center text-white text-sm font-bold shadow-md"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex text-amber-400 text-[10px] mb-1">
                    {'★'.repeat(5)}
                  </div>
                  <p className="text-gray-400 text-xs leading-snug">
                    <span className="text-white font-bold">Oltre 200</span> hanno già creato la grafica con questa guida.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — Combined Mockup + Form Card */}
          <div className="flex-1 w-full max-w-lg lg:max-w-[480px] mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(16,185,129,0.2)] overflow-hidden"
            >
              {/* Glossy top border */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50" />
              
              {/* Top part: Mockup presentation */}
              <div className="bg-slate-950/60 pt-10 pb-8 px-6 border-b border-white/5 relative flex justify-center">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
                <GuidaMockup />
              </div>

              {/* Bottom part: Form */}
              <div className="p-8 relative">
                {submitted ? (
                  <SuccessState name={userData?.name} />
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-extrabold text-white mb-1">
                        Scarica la Guida Gratis
                      </h2>
                      <p className="text-gray-400 text-sm">
                        Inserisci i tuoi dati per riceverla via email.
                      </p>
                    </div>
                    <OptInForm variant="hero" onSuccess={handleSuccess} />
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── Fascination Bullets ────────────────────────────────── */
const FascinationBullets = () => (
  <section className="py-16 bg-slate-900/80 border-y border-white/5">
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="space-y-6"
      >
        <motion.div variants={fadeUp} className="text-center mb-8">
          <SectionBadge color="emerald">Cosa trovi nella guida</SectionBadge>
          <h2 className="text-3xl font-extrabold text-white mt-4">
            Quello che nessuno ti spiega{' '}
            <span className="text-emerald-400">sulla grafica per banner</span>
          </h2>
        </motion.div>

        {[
          {
            icon: AlertTriangle,
            color: 'amber',
            text: "L'errore #1 che fa sembrare amatoriale anche la grafica più curata — (#3 ti sorprenderà)",
          },
          {
            icon: Palette,
            color: 'emerald',
            text: 'Come scegliere i colori che si stampano ESATTAMENTE come li vedi sullo schermo',
          },
          {
            icon: Upload,
            color: 'blue',
            text: 'Il trucco per caricare loghi e immagini senza farle diventare sfocate',
          },
          {
            icon: Ruler,
            color: 'emerald',
            text: 'Come impostare le dimensioni esatte senza fare calcoli (usa il nostro sistema)',
          },
          {
            icon: AlertTriangle,
            color: 'amber',
            text: 'Le 3 cose che NON devi mai mettere vicino ai bordi — e perché vengono tagliate',
          },
          {
            icon: Sparkles,
            color: 'violet',
            text: 'Come Marco (titolare di negozio a Treviso) ha fatto il suo banner per i saldi in 12 minuti',
          },
        ].map(({ icon: Icon, color, text }, i) => {
          const iconCls =
            color === 'amber'
              ? 'text-amber-400'
              : color === 'violet'
              ? 'text-violet-400'
              : color === 'blue'
              ? 'text-blue-400'
              : 'text-emerald-400';
          const bgCls =
            color === 'amber'
              ? 'bg-amber-500/10 border-amber-500/20'
              : color === 'violet'
              ? 'bg-violet-500/10 border-violet-500/20'
              : color === 'blue'
              ? 'bg-blue-500/10 border-blue-500/20'
              : 'bg-emerald-500/10 border-emerald-500/20';

          return (
            <motion.div
              key={i}
              variants={fadeUp}
              className="flex items-start gap-4 bg-slate-800/30 rounded-xl px-5 py-4 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className={`shrink-0 w-9 h-9 rounded-lg ${bgCls} border flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${iconCls}`} />
              </div>
              <p className="text-gray-300 text-sm leading-relaxed pt-1">{text}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  </section>
);

/* ─── 5-Step Content Preview ─────────────────────────────── */
const StepsPreview = () => {
  const steps = [
    {
      icon: Ruler,
      num: '01',
      title: 'Scegli le dimensioni giuste',
      desc: 'Come misurare lo spazio e inserirlo nell\'editor. I formati più usati e a cosa servono.',
    },
    {
      icon: Upload,
      num: '02',
      title: 'Carica il tuo logo',
      desc: 'Formati accettati (PNG con sfondo trasparente = il migliore). Cosa fare se hai solo un JPEG.',
    },
    {
      icon: Palette,
      num: '03',
      title: 'Scegli i colori del tuo brand',
      desc: 'Differenza RGB/CMYK in parole semplici. Come trovare i codici colore del tuo brand.',
    },
    {
      icon: Type,
      num: '04',
      title: 'Aggiungi i testi',
      desc: 'Regola del messaggio unico: 1 frase principale, 1 sottotitolo. Dimensioni minime leggibili a distanza.',
    },
    {
      icon: CheckSquare,
      num: '05',
      title: 'Controlla e scarica',
      desc: 'La checklist rapida pre-invio. Come inviare il file direttamente all\'ordine.',
    },
  ];

  return (
    <section className="py-16 bg-slate-950">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <SectionBadge color="blue">I 5 passi della guida</SectionBadge>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4">
              Cosa impari,{' '}
              <span className="text-emerald-400">passo dopo passo</span>
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm">
              In meno di 15 minuti crei una grafica professionale pronta per la stampa.
              Anche se non hai mai usato un editor grafico in vita tua.
            </p>
          </motion.div>

          <motion.div variants={stagger} className="space-y-4">
            {steps.map(({ icon: Icon, num, title, desc }) => (
              <motion.div
                key={num}
                variants={fadeUp}
                className="flex items-start gap-5 bg-slate-800/30 rounded-2xl px-6 py-5 border border-white/5 group hover:border-emerald-500/20 transition-colors"
              >
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <div className="w-11 h-11 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center group-hover:bg-emerald-500/25 transition-colors">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-[10px] font-black tracking-[0.2em] text-emerald-600 uppercase">
                    {num}
                  </span>
                </div>
                <div className="pt-1">
                  <h3 className="text-white font-bold text-base mb-1">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Social Proof – Marco story ─────────────────────────── */
const SocialProof = () => (
  <section className="py-16 bg-slate-900/70 border-y border-white/5">
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div variants={fadeUp} className="text-center mb-10">
          <SectionBadge color="emerald">Una storia vera</SectionBadge>
          <h2 className="text-3xl font-extrabold text-white mt-4">
            Come Marco ha fatto il suo banner{' '}
            <span className="text-emerald-400">in 12 minuti</span>
          </h2>
        </motion.div>

        {/* Story card */}
        <motion.div
          variants={fadeUp}
          className="bg-slate-800/50 rounded-2xl p-8 border border-white/10 space-y-5"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 font-extrabold text-lg shrink-0">
              M
            </div>
            <div>
              <p className="text-white font-bold">Marco B.</p>
              <p className="text-gray-500 text-sm">Titolare di negozio · Treviso</p>
            </div>
          </div>

          <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
            <p>
              <span className="text-white font-semibold">«Avevo i saldi d'estate tra due settimane</span> e il mio
              tipografo di fiducia mi chiedeva €200 per fare un banner. Troppo.
            </p>
            <p>
              Ho trovato Printora su Instagram. Non avevo mai creato una grafica in vita mia — uso il telefono
              per mandare messaggi, punto.
            </p>
            <p>
              Ho scaricato la guida. In 12 minuti avevo la grafica pronta nel loro editor.
              Ho caricato il logo, ho scritto "SALDI -30%" e ho scelto i colori del mio negozio.{' '}
              <span className="text-emerald-400 font-semibold">Semplice. Davvero.</span>
            </p>
            <p>
              Il banner è arrivato in 48 ore. I miei clienti mi hanno chiesto dove l'avevo fatto.
              <span className="text-white font-semibold"> Ho speso €42 invece di €200.</span>»
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/5">
            {['Nessuna esperienza grafica', 'Risultato professionale', '€42 invece di €200'].map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full"
              >
                ✓ {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Second testimonial — Luca */}
        <motion.div
          variants={fadeUp}
          className="mt-4 bg-slate-800/30 rounded-2xl p-6 border border-white/5"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 font-extrabold shrink-0">
              L
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                «Ho fatto lo striscione per la sagra in meno di un pomeriggio. Non avevo mai usato il computer per queste cose. La guida mi ha spiegato tutto passo per passo.»
              </p>
              <p className="text-gray-500 text-xs mt-2">Luca R. · Titolare ristorante · Puglia</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

/* ─── Second Opt-in Block ────────────────────────────────── */
const SecondOptin = () => {
  const [submitted, setSubmitted] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleSuccess = (data) => {
    setUserData(data);
    setSubmitted(true);
  };

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/5 to-blue-900/5 pointer-events-none" />
      <div className="container mx-auto px-4 max-w-xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-800/60 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-8 shadow-2xl shadow-black/50"
        >
          {submitted ? (
            <SuccessState name={userData?.name} />
          ) : (
            <>
              <div className="text-center mb-6">
                <SectionBadge color="emerald">Download gratuito</SectionBadge>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-4 leading-tight">
                  Pronto a creare la tua grafica{' '}
                  <span className="text-emerald-400">in 15 minuti?</span>
                </h2>
                <p className="text-gray-400 text-sm mt-3">
                  Ricevi subito la mini-guida gratuita in 5 passi.
                  Nessuna esperienza richiesta.
                </p>
              </div>
              <OptInForm variant="mid" onSuccess={handleSuccess} />
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Upsell Strip — Consulenza Grafica ─────────────────── */
const UpsellStrip = () => (
  <section className="py-12 bg-slate-900/80 border-y border-white/5">
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row items-center gap-6 bg-slate-800/40 rounded-2xl p-6 border border-violet-500/20"
      >
        <div className="flex-1 text-center md:text-left">
          <span className="inline-block text-[11px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 mb-3">
            🎨 Alternativa — Nessuna Fatica
          </span>
          <h3 className="text-white font-extrabold text-lg leading-tight">
            Preferisci che lo faccia{' '}
            <span className="text-violet-400">il nostro esperto per te?</span>
          </h3>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">
            Se hai il logo e una bozza di idea, il nostro grafico crea il file professionale
            in 24 ore — CMYK, risoluzione corretta, margini al vivo.
            <span className="text-white font-semibold"> Prezzo fisso €15. Garanzia rimborso.</span>
          </p>
        </div>
        <div className="shrink-0">
          <a
            href={WA_CONSULT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-400 text-white font-bold rounded-xl px-6 py-3.5 text-sm shadow-lg shadow-violet-900/30 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
          >
            <FaWhatsapp className="w-4 h-4" />
            Scopri la consulenza €15
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─── CTA Strip — go to /banner ─────────────────────────── */
const SelfServeStrip = () => (
  <div className="bg-slate-900 border-t border-white/10 py-8">
    <div className="container mx-auto px-4 max-w-2xl text-center space-y-3">
      <p className="text-gray-400 text-sm">
        Hai già la grafica pronta e vuoi procedere direttamente all'ordine?
      </p>
      <Link
        to="/banner"
        className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200 font-semibold transition-colors"
      >
        Configura e ordina il tuo banner in autonomia
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </div>
);

/* ─── Page ───────────────────────────────────────────────── */
const GuidaEditorPage = () => (
  <>
    <Helmet>
      <title>Crea la Tua Grafica in 5 Passi — Guida Gratuita | Printora</title>
      <meta
        name="description"
        content="Scarica gratis la mini-guida in 5 passi per creare la tua grafica professionale per banner e striscioni. Nessuna esperienza richiesta. Passo dopo passo, con esempi reali. Per titolari di negozio, ristoratori e organizzatori di eventi."
      />
      <meta property="og:title" content="Crea la Tua Grafica in 5 Passi — Guida Gratuita | Printora" />
      <meta
        property="og:description"
        content="Guida gratuita per creare la tua grafica professionale in meno di 15 minuti. Nessuna esperienza richiesta."
      />
    </Helmet>
    <div className="bg-slate-950 overflow-hidden">
      <Hero />
      <FascinationBullets />
      <StepsPreview />
      <SocialProof />
      <SecondOptin />
      <UpsellStrip />
      <SelfServeStrip />
    </div>
  </>
);

export default GuidaEditorPage;
