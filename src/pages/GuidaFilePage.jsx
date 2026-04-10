import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  ArrowRight,
  Download,
  Lock,
  FileCheck,
  Palette,
  Crosshair,
  Maximize,
  Type,
  FileText,
  AlertTriangle,
  Briefcase,
  ChevronRight,
  Layers,
  Star,
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
const SectionBadge = ({ color = 'blue', children }) => {
  const cls =
    color === 'violet'
      ? 'bg-violet-500/10 border-violet-500/30 text-violet-300'
      : color === 'amber'
      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
      : color === 'emerald'
      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
      : 'bg-blue-500/10 border-blue-500/30 text-blue-300';
  return (
    <span
      className={`inline-block border text-[11px] font-bold tracking-[0.15em] uppercase px-4 py-1.5 rounded-full ${cls}`}
    >
      {children}
    </span>
  );
};

/* ─── Opt-in Form ─────────────────────────────────────────── */
const OptInForm = ({ variant = 'hero' }) => {
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
          source: 'hvco_file_stampa',
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // Backend might not be live yet — still proceed
    } finally {
      setLoading(false);
      const encodedName = encodeURIComponent(name.trim());
      navigate(`/grazie?source=hvco_file_stampa&name=${encodedName}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full">
      <div>
        <label htmlFor={`name-${variant}`} className="block text-xs font-semibold text-gray-400 mb-1.5">
          Il tuo nome
        </label>
        <input
          id={`name-${variant}`}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="es. Sofia"
          required
          className="w-full bg-slate-800/70 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
        />
      </div>
      <div>
        <label htmlFor={`email-${variant}`} className="block text-xs font-semibold text-gray-400 mb-1.5">
          La tua email
        </label>
        <input
          id={`email-${variant}`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="es. sofia@agenzia.it"
          required
          className="w-full bg-slate-800/70 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
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
        className="w-full flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-400 disabled:opacity-60 text-white font-extrabold rounded-xl px-6 py-4 text-base shadow-lg shadow-blue-900/40 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 mt-2"
      >
        <Download className="w-5 h-5 shrink-0" />
        {loading ? 'Un momento…' : 'SCARICA LA CHECKLIST GRATIS →'}
      </button>
      <p className="text-center text-gray-500 text-xs flex items-center justify-center gap-1.5 pt-1">
        <Lock className="w-3 h-3" />
        Nessuno spam. Mai. Puoi cancellare quando vuoi.
      </p>
    </form>
  );
};

/* ─── Hero ───────────────────────────────────────────────── */
const Hero = () => (
  <section className="relative bg-slate-950 overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
    {/* Background glows — blue/indigo palette */}
    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/8 rounded-full blur-[100px] pointer-events-none" />
    <div className="absolute top-[20%] left-[30%] w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />

    <div className="container mx-auto px-4 relative z-10">
      <div className="flex flex-col lg:flex-row items-center gap-14 max-w-7xl mx-auto">

        {/* Left — Copy */}
        <div className="flex-1 text-center lg:text-left">
          {/* Audience callout */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-block"
          >
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/80 border border-blue-500/30 shadow-lg shadow-blue-500/5 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-blue-300 text-xs font-bold tracking-wider uppercase">
                Per Graphic Designer, Agenzie e Stampatori
              </span>
            </div>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.12] tracking-tight mb-8"
          >
            Il Tuo File Finisce{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
              Sempre Sbagliato
            </span>
            <br className="hidden lg:block" />
            in Stampa?
          </motion.h1>

          {/* Subheadline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="space-y-4 max-w-2xl mx-auto lg:mx-0"
          >
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              La checklist professionale in 7 punti che i nostri operatori usano ogni giorno per preflightare
              i file prima della stampa.{' '}
              <strong className="text-white">Ora disponibile gratuitamente. In italiano. Senza tecnicismi.</strong>
            </p>
          </motion.div>

          {/* Trust bullets + social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-8 justify-center lg:justify-start"
          >
            <div className="flex flex-col gap-3 text-sm">
              {[
                'PDF stampabile gratuito',
                'Applicabile a tutti i software',
                'Standard tipografici reali',
              ].map((t, i) => (
                <span key={i} className="flex items-center gap-2 text-gray-300 font-medium">
                  <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                  {t}
                </span>
              ))}
            </div>

            <div className="hidden sm:block w-px h-20 bg-white/10" />

            <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex items-center gap-4 max-w-xs">
              <div className="flex -space-x-3 shrink-0">
                {['S', 'P', 'R'].map((letter, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 border-2 border-slate-950 flex items-center justify-center text-white text-sm font-bold shadow-md"
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex text-amber-400 text-[10px] mb-1">{'★'.repeat(5)}</div>
                <p className="text-gray-400 text-xs leading-snug">
                  <span className="text-white font-bold">140+ designer</span> usano già questa checklist.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right — Premium opt-in card (no mockup) */}
        <div className="flex-1 w-full max-w-lg lg:max-w-[460px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_24px_80px_-12px_rgba(59,130,246,0.22)] overflow-hidden"
          >
            {/* Glossy top border */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60" />
            {/* Inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

            <div className="p-8 relative">
              {/* Card headline */}
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 mb-4">
                  <FileCheck className="w-3 h-3" /> Checklist Tecnica Gratuita
                </span>
                <h2 className="text-2xl font-extrabold text-white leading-snug mt-2">
                  Pre-Stampa Perfetta<br />
                  <span className="text-blue-400">in 7 Punti</span>
                </h2>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                  Inserisci la tua email e ricevi il PDF subito.
                </p>
              </div>

              {/* What's inside — compact */}
              <div className="bg-slate-800/50 rounded-xl px-4 py-3 mb-6 border border-white/5 space-y-2">
                {[
                  'CMYK, risoluzione, bleed, font e formato PDF',
                  'Usabile in Illustrator, InDesign, Canva e Photoshop',
                  'La stessa usata dai nostri tecnici pre-stampa',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-gray-300">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              <OptInForm variant="hero" />
            </div>
          </motion.div>

          {/* Under-card trust note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 flex items-center justify-center gap-4 text-center"
          >
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-gray-500 text-xs">4.9/5 · 140+ download questo mese</p>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

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
        <motion.div variants={fadeUp} className="text-center mb-10">
          <SectionBadge color="blue">Perché i file falliscono in stampa</SectionBadge>
          <h2 className="text-3xl font-extrabold text-white mt-4">
            I Segreti della <span className="text-blue-400">Pre-stampa</span> Svelati
          </h2>
        </motion.div>

        {[
          {
            icon: Palette,
            color: 'blue',
            text: 'Perché stampare un file in RGB fa venire i colori del tutto diversi (e la procedura esatta per evitarlo)',
          },
          {
            icon: Maximize,
            color: 'amber',
            text: 'Il motivo per cui il tuo banner viene "tagliato" ai bordi — e la soluzione definitiva in 30 secondi',
          },
          {
            icon: Crosshair,
            color: 'emerald',
            text: 'La risoluzione che devi avere davvero (NO, non è 300dpi come dicono tutti — ti spieghiamo perché)',
          },
          {
            icon: AlertTriangle,
            color: 'amber',
            text: 'Il formato file che NON dovresti mai inviare in stampa (lo usano la maggior parte dei principianti, sbagliandosi)',
          },
          {
            icon: FileCheck,
            color: 'blue',
            text: 'CMYK vs RGB: la differenza pratica spiegata in sole 4 righe, mettendo al bando la teoria di Wikipedia',
          },
          {
            icon: Briefcase,
            color: 'violet',
            text: 'Come Sofia ha eliminato i re-print dai costi della sua agenzia semplicemente applicando questa checklist',
          },
        ].map(({ icon: Icon, color, text }, i) => {
          const iconCls =
            color === 'amber' ? 'text-amber-400' :
            color === 'violet' ? 'text-violet-400' :
            color === 'blue' ? 'text-blue-400' : 'text-emerald-400';
          const bgCls =
            color === 'amber' ? 'bg-amber-500/10 border-amber-500/20' :
            color === 'violet' ? 'bg-violet-500/10 border-violet-500/20' :
            color === 'blue' ? 'bg-blue-500/10 border-blue-500/20' :
            'bg-emerald-500/10 border-emerald-500/20';

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

/* ─── 7-Step Content Preview ─────────────────────────────── */
const StepsPreview = () => {
  const steps = [
    {
      icon: Palette,
      num: '01',
      title: 'Modalità Colore: CMYK, non RGB',
      desc: 'Come verificare e impostare il profilo colore corretto in Illustrator, Photoshop, InDesign e Canva.',
    },
    {
      icon: Crosshair,
      num: '02',
      title: 'Risoluzione a Misura Reale',
      desc: 'La formula segreta: larghezza in cm × 40 = pixel minimi. Oltre i 100 dpi a grandezza naturale è solo peso inutile.',
    },
    {
      icon: Maximize,
      num: '03',
      title: 'Margini al Vivo (Bleed)',
      desc: 'Perché 5mm su ogni lato salvano il tuo lavoro dai rifili bianchi. Come impostarli nei vari software.',
    },
    {
      icon: AlertTriangle,
      num: '04',
      title: 'Area Sicura (Safe Area)',
      desc: 'Mantieni testi essenziali e loghi ad almeno 10mm dai bordi di taglio. Perché il 20% dei file sbaglia questo.',
    },
    {
      icon: Type,
      num: '05',
      title: 'Gestione Font (Curve)',
      desc: 'Il trucco infallibile per evitare font sostituiti. Come convertire tutto in tracciati in 10 secondi.',
    },
    {
      icon: FileText,
      num: '06',
      title: 'Salvataggio PDF per la Stampa',
      desc: 'Non usare un PDF qualsiasi. I settaggi necessari per esportare un PDF/X-1a perfetto per la tipografia.',
    },
    {
      icon: Layers,
      num: '07',
      title: 'Il Brief di Produzione',
      desc: 'Il template di comunicazione interna per evitare equivoci con lo stampatore su finiture, occhielli e materiali.',
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
            <SectionBadge color="blue">I 7 controlli</SectionBadge>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4">
              Cosa copre la <span className="text-blue-400">checklist</span>
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm">
              Passa il tuo file attraverso questi 7 controlli, e potrai mandarlo in stampa con la tranquillità di un professionista.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {steps.map(({ icon: Icon, num, title, desc }) => (
              <motion.div
                key={num}
                variants={fadeUp}
                className="flex items-start gap-5 bg-slate-800/30 rounded-2xl px-6 py-5 border border-white/5 group hover:border-blue-500/20 transition-colors"
              >
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <div className="w-11 h-11 rounded-full bg-blue-500/15 border border-blue-500/25 flex items-center justify-center group-hover:bg-blue-500/25 transition-colors">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase">
                    {num}
                  </span>
                </div>
                <div className="pt-1">
                  <h3 className="text-white font-bold text-base mb-1">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Social Proof – Sofia story ─────────────────────────── */
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
          <SectionBadge color="blue">Perché funziona</SectionBadge>
          <h2 className="text-3xl font-extrabold text-white mt-4">
            Come Sofia ha <span className="text-blue-400">eliminato i re-print</span>
          </h2>
        </motion.div>

        {/* Story card */}
        <motion.div
          variants={fadeUp}
          className="bg-slate-800/50 rounded-2xl p-8 border border-white/10 space-y-5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl pointer-events-none" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-12 h-12 rounded-full bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 font-extrabold text-lg shrink-0">
              S
            </div>
            <div>
              <p className="text-white font-bold">Sofia C.</p>
              <p className="text-gray-500 text-sm">Graphic Designer · Agenzia Creativa, Roma</p>
            </div>
          </div>

          <div className="space-y-3 text-gray-300 text-sm leading-relaxed relative z-10">
            <p>
              <span className="text-white font-semibold">«L'anno scorso ho perso circa €400 in ristampe.</span> I file sembravano perfetti sullo schermo. Li mandavo al tipografo, e regolarmente c'era qualcosa di tagliato o il nero sembrava marrone.
            </p>
            <p>
              Il problema non era la tipografia, ero io che non conoscevo le specifiche tecniche dell'ambiente di produzione reale. Non basta sapere usare Illustrator o InDesign per preparare un file esecutivo di stampa.
            </p>
            <p>
              Da quando uso la Checklist di Printora, la tengo letteralmente incollata sul monitor.<span className="text-blue-400 font-semibold"> Sono 7 step rigorosi. Faccio la spunta prima di esportare.</span>
            </p>
            <p>
              Negli ultimi 6 mesi, mandando dozzine di banner, roll-up e adesivi, non abbiamo avuto <span className="text-white font-semibold">errore né sorprese di stampa nemmeno una volta.</span> E il bello è che i tipografi (compreso Printora) lavorano il mio file senza dovermi richiamare ogni volta.»
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/5 relative z-10">
            {['Zero errori tecnici', 'Nessuna rifatturazione al cliente', 'Stampa che corrisponde allo schermo'].map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-blue-500/10 border border-blue-500/20 text-blue-300 px-3 py-1 rounded-full"
              >
                ✓ {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

/* ─── Second Opt-in Block ────────────────────────────────── */
const SecondOptin = () => (
  <section className="py-20 bg-slate-950 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 to-indigo-900/5 pointer-events-none" />
    <div className="container mx-auto px-4 max-w-xl relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-slate-800/60 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 shadow-2xl shadow-black/50"
      >
        <div className="text-center mb-6">
          <SectionBadge color="blue">Download gratuito</SectionBadge>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-4 leading-tight">
            Smetti di Mantenere <br />
            <span className="text-blue-400">il Dubbio.</span>
          </h2>
          <p className="text-gray-400 text-sm mt-3">
            Ricevi subito la checklist tecnica in formato PDF e manda in stampa il tuo prossimo lavoro con certezza matematica.
          </p>
        </div>
        <OptInForm variant="mid" />
      </motion.div>
    </div>
  </section>
);

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
            🛡️ Pre-stampa Professionale
          </span>
          <h3 className="text-white font-extrabold text-lg leading-tight">
            Preferisci che verifichiamo NOI{' '}
            <span className="text-violet-400">il tuo file?</span>
          </h3>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">
            Se hai dubbi, il nostro reparto tecnico può preflightare il tuo documento, convertire i colori per la macchina e agganciare i margini in sicurezza in sole 24 ore.
            <span className="text-white font-semibold"> Prezzo fisso €15. Nessuna spesa per le ristampe.</span>
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
            Controllo File €15
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
        Hai un file pronto in CMYK/Pdf nativo?
      </p>
      <Link
        to="/banner"
        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
      >
        Configura e Invia l'Ordine alla Coda di Stampa
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </div>
);

/* ─── Page ───────────────────────────────────────────────── */
const GuidaFilePage = () => (
  <>
    <Helmet>
      <title>Checklist File di Stampa Perfetto — Guida Gratuita | Printora</title>
      <meta
        name="description"
        content="Il tuo file viene sempre sbagliato in stampa? Scarica la checklist professionale gratuita in 7 punti per Designer, Agenzie e Stampatori e non sprechi mai più un ordine."
      />
      <meta property="og:title" content="Checklist File di Stampa Perfetto — Guida Gratuita | Printora" />
      <meta
        property="og:description"
        content="Scarica gratis la checklist usata dai professionisti Printora per mandare in stampa senza sorprese."
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

export default GuidaFilePage;
