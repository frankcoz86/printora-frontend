import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Clock, CheckCircle, AlertTriangle,
  Sparkles, ArrowRight, BadgeCheck, Brush, Package,
  FileCheck, Zap, Users, MessageCircle,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

/* ─── Constants ─────────────────────────────────────────── */
const WA_URL =
  'https://wa.me/393792775116?text=Consulenza+grafica+%E2%82%AC15';

const SLOTS_REMAINING = 3;
const TOTAL_SLOTS = 8;

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
      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
  return (
    <span
      className={`inline-block border text-[11px] font-bold tracking-[0.15em] uppercase px-4 py-1.5 rounded-full ${cls}`}
    >
      {children}
    </span>
  );
};

const CheckItem = ({ children }) => (
  <li className="flex items-start gap-2.5 text-gray-300 text-sm">
    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
    <span>{children}</span>
  </li>
);

const WaButton = ({ label = 'Prenota la Consulenza Grafica — €15', full = false }) => (
  <a
    href={WA_URL}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1aad52] text-white font-bold rounded-2xl px-8 py-4 text-lg shadow-lg shadow-emerald-900/40 hover:shadow-emerald-700/50 hover:-translate-y-0.5 transition-all duration-300 ${full ? 'w-full' : ''}`}
  >
    <FaWhatsapp className="w-6 h-6 shrink-0" />
    {label}
  </a>
);

/* ─── Hero ───────────────────────────────────────────────── */
const Hero = () => (
  <section className="relative bg-slate-950 overflow-hidden pt-10 pb-20">
    <div className="absolute -top-60 right-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />

    <div className="container mx-auto px-4 relative z-10 text-center">
      {/* Audience callout */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <SectionBadge color="violet">
          🎯 Per event organizer, titolari di negozio, ristoratori e designer
        </SectionBadge>
      </motion.div>

      {/* H1 */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08 }}
        className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6"
      >
        La Tua Grafica Professionale{' '}
        <span className="text-emerald-400">Pronta in 24 Ore.</span>
        <br className="hidden md:block" />
        <span className="text-white">Prezzo Fisso: </span>
        <span className="text-violet-400">€15. Garantita.</span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.18 }}
        className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
      >
        Un esperto grafico dedicato analizza il tuo brief, crea o corregge la tua grafica
        e ti consegna un file pronto per la stampa — in CMYK, alla risoluzione corretta,
        con i margini al vivo. Tutto incluso. Nessuna sorpresa.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.28 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <WaButton />
        <Link
          to="/banner"
          className="group flex items-center gap-2 bg-slate-800/40 hover:bg-slate-800/80 border border-white/10 hover:border-emerald-500/30 text-gray-300 hover:text-white rounded-xl px-6 py-3.5 text-sm font-bold backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:-translate-y-0.5"
        >
          <span className="text-gray-400 font-normal mr-1">Hai già la grafica?</span>
          Configura il tuo banner
          <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {/* Trust strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-10 text-sm text-gray-400"
      >
        {[
          [CheckCircle, 'File CMYK pronto in 24h'],
          [CheckCircle, '1 revisione inclusa'],
          [ShieldCheck, 'Garanzia rimborso'],
          [BadgeCheck, 'Esperto dedicato, non un bot'],
        ].map(([Icon, label], i) => (
          <span key={i} className="flex items-center gap-1.5">
            <Icon className="w-4 h-4 text-emerald-400" />
            {label}
          </span>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ─── Problem ────────────────────────────────────────────── */
const Problem = () => (
  <section className="bg-slate-900/80 py-16 border-y border-white/5">
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="space-y-6"
      >
        <motion.div variants={fadeUp} className="text-center mb-2">
          <SectionBadge color="amber">Il problema che vediamo ogni giorno</SectionBadge>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4">
            Conosci questa situazione?
          </h2>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="bg-slate-800/50 rounded-2xl p-6 border border-white/5 space-y-3 text-gray-300 leading-relaxed"
        >
          <p>Hai un evento tra 5 giorni. Hai il logo, i testi, forse una bozza su Canva.</p>
          <p>Carichi il file. <span className="text-white font-semibold">Speriamo nella sorte.</span></p>
          <p>
            O peggio: chiami il tipografo locale.{' '}
            <strong className="text-white">Aspetti 3 giorni il preventivo.</strong> Ti dicono
            che "non va bene" senza spiegarti perché. Rimandi. Aspetti ancora. E intanto
            l'evento si avvicina.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-6"
        >
          <p className="text-amber-200 font-semibold flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            Il 73% delle stampe che riceviamo con problemi ha:
          </p>
          <ul className="space-y-2 text-gray-300 text-sm">
            {[
              'Risoluzione insufficiente — meno di 100 dpi a scala reale',
              'Colori in RGB invece di CMYK — vengono sbiaditi o completamente diversi',
              'Margini al vivo mancanti — il banner viene tagliato sul contenuto',
              'Testo troppo vicino ai bordi',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-gray-500 text-sm mt-4 italic">
            Non è colpa tua. Nessuno te lo ha mai insegnato.
          </p>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

/* ─── Solution – How it works ────────────────────────────── */
const Solution = () => (
  <section className="py-16 bg-slate-950">
    <div className="container mx-auto px-4 max-w-4xl">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <motion.div variants={fadeUp} className="text-center mb-12">
          <SectionBadge color="emerald">La Soluzione</SectionBadge>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4">
            Noi lo facciamo per te.{' '}
            <span className="text-emerald-400">In 3 passi.</span>
          </h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto">
            Ci mandi il brief, il grafico crea o corregge il file, tu ordini il banner.
            Entro 24 ore hai tutto pronto.
          </p>
        </motion.div>

        <motion.div variants={stagger} className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: '01', Icon: MessageCircle, color: 'violet',
              title: 'Manda il tuo brief',
              desc: 'Logo, testi, dimensioni del banner. Su WhatsApp in 5 minuti. Il grafico risponde entro 2 ore.',
            },
            {
              step: '02', Icon: Brush, color: 'emerald',
              title: 'Il grafico crea il file',
              desc: 'In CMYK, risoluzione corretta, margini al vivo. Pronto per andare in macchina senza sorprese.',
            },
            {
              step: '03', Icon: Package, color: 'violet',
              title: 'Ordini il banner',
              desc: 'Con il file perfetto in mano, configuri e ordini il tuo banner da €8,90/mq direttamente online.',
            },
          ].map(({ step, Icon, color, title, desc }) => (
            <motion.div
              key={step}
              variants={fadeUp}
              className={`bg-slate-800/50 rounded-2xl p-6 border text-center space-y-3 ${
                color === 'violet' ? 'border-violet-500/20' : 'border-emerald-500/20'
              }`}
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
                  color === 'violet'
                    ? 'bg-violet-500/15 border border-violet-500/30'
                    : 'bg-emerald-500/15 border border-emerald-500/30'
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    color === 'violet' ? 'text-violet-400' : 'text-emerald-400'
                  }`}
                />
              </div>
              <span
                className={`block text-[10px] font-black tracking-[0.22em] uppercase ${
                  color === 'violet' ? 'text-violet-500' : 'text-emerald-500'
                }`}
              >
                Step {step}
              </span>
              <h3 className="font-bold text-white text-lg">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  </section>
);

/* ─── Credentials ────────────────────────────────────────── */
const Credentials = () => (
  <section className="py-12 bg-slate-900/60">
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { Icon: BadgeCheck, text: 'Produzione interna — conosciamo la macchina da stampa' },
          { Icon: Users,      text: 'Centinaia di banner stampati ogni mese' },
          { Icon: FileCheck,  text: 'Verifica professionale gratuita su ogni ordine' },
          { Icon: Zap,        text: 'Risposta WhatsApp entro 2 ore in orario lavorativo' },
        ].map(({ Icon, text }, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="flex flex-col items-center text-center gap-2 bg-slate-800/40 rounded-xl p-4 border border-white/5"
          >
            <Icon className="w-8 h-8 text-emerald-400" />
            <p className="text-gray-300 text-xs leading-snug">{text}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ─── Benefits table ─────────────────────────────────────── */
const Benefits = () => (
  <section className="py-16 bg-slate-950">
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div variants={fadeUp} className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-white">
            Cosa facciamo — cosa ottieni
          </h2>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="overflow-hidden rounded-2xl border border-white/10"
        >
          {[
            ['Analisi del brief via WhatsApp', 'Non devi spiegarlo 10 volte — capiamo subito'],
            ['Creazione grafica professionale da zero', 'File da professionista, non da Canva'],
            ['Correzione file esistente', 'Nessun problema in stampa, zero rimpianti'],
            ['Conversione CMYK + 100 dpi corretti', 'I colori escono esattamente come li vuoi'],
            ['Margini al vivo e aree sicure', 'Il banner non viene tagliato dove non deve'],
            ['Consegna entro 24 ore lavorative', 'Il tuo evento non aspetta'],
            ['1 revisione inclusa', 'Se qualcosa non ti convince, lo sistemiamo'],
          ].map(([feature, benefit], i) => (
            <div
              key={i}
              className={`grid grid-cols-2 gap-4 px-5 py-4 text-sm ${
                i % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-900/30'
              } ${i !== 0 ? 'border-t border-white/5' : ''}`}
            >
              <span className="text-violet-300 font-medium flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-violet-400" />
                {feature}
              </span>
              <span className="text-gray-300">{benefit}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  </section>
);

/* ─── Fascination Bullets ────────────────────────────────── */
const Fascination = () => (
  <section className="py-12 bg-slate-900/60 border-y border-white/5">
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-4"
      >
        <motion.h2 variants={fadeUp} className="text-2xl font-extrabold text-white text-center mb-6">
          Quello che nessuno ti dice sulla stampa
        </motion.h2>
        {[
          'Il singolo errore di colore che fa venire i banner sbiaditi — e come lo blocchiamo noi prima della stampa',
          'Perché i file fatti su Canva quasi sempre vanno in stampa "diversi" da come li vedi sullo schermo',
          'Come il nostro grafico crea in 24 ore quello che un freelance ti farebbe aspettare una settimana',
          'La differenza tra €80 di un grafico normale e €15 del nostro esperto (non è quello che pensi)',
          'Come Giuseppe ha ordinato 12 banner a mezzanotte prima di un evento e li ha ricevuti perfetti',
        ].map((b, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="flex items-start gap-3 bg-slate-800/30 rounded-xl px-5 py-3.5 border border-white/5"
          >
            <span className="text-emerald-400 font-black text-lg mt-0.5 shrink-0">›</span>
            <p className="text-gray-300 text-sm leading-relaxed">{b}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ─── Social Proof – WhatsApp style ─────────────────────── */
const testimonials = [
  {
    text: 'Ho ordinato 8 striscioni per una fiera. Il grafico mi ha sistemato il file in meno di 3 ore. Sono arrivati perfetti il giorno dopo. Mai più il tipografo locale.',
    name: 'Giuseppe F.', role: 'Event Manager', city: 'Milano',
  },
  {
    text: "Finalmente un fornitore che capisce i file. Ho mandato l'AI, mi hanno risposto in 2 ore confermando tutto. Zero ansia.",
    name: 'Sofia C.', role: 'Graphic Designer', city: 'Roma',
  },
  {
    text: 'Non sapevo fare la grafica — li ho chiamati su WhatsApp, mi hanno aiutato passo passo e in 24 ore avevo il file. Incredibile.',
    name: 'Marco B.', role: 'Titolare negozio', city: 'Treviso',
  },
];

const SocialProof = () => (
  <section className="py-16 bg-slate-950">
    <div className="container mx-auto px-4 max-w-2xl">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div variants={fadeUp} className="text-center mb-10">
          <SectionBadge color="emerald">Cosa dicono i clienti</SectionBadge>
          <h2 className="text-3xl font-extrabold text-white mt-4">Clienti che si sono fidati</h2>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50"
        >
          {/* WA header */}
          <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-400/20 flex items-center justify-center">
              <FaWhatsapp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Printora — Assistenza</p>
              <p className="text-emerald-200 text-xs">Messaggi verificati</p>
            </div>
          </div>
          {/* Messages */}
          <div className="bg-[#0b141a] px-4 py-6 space-y-5">
            {testimonials.map((t, i) => (
              <div key={i} className="flex justify-start">
                <div className="bg-[#1f2c34] rounded-2xl rounded-tl-sm px-4 py-3 max-w-sm shadow-md">
                  <p className="text-white text-sm leading-relaxed">"{t.text}"</p>
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between gap-4">
                    <span className="text-emerald-400 text-xs font-bold">— {t.name}</span>
                    <span className="text-gray-500 text-[11px]">{t.role}, {t.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

/* ─── The Offer ──────────────────────────────────────────── */
const TheOffer = () => (
  <section className="py-16 bg-slate-900/80">
    <div className="container mx-auto px-4 max-w-2xl">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="space-y-6"
      >
        <motion.div variants={fadeUp} className="text-center">
          <SectionBadge color="violet">L'Offerta</SectionBadge>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4">
            Consulenza Grafica Expert —{' '}
            <span className="text-emerald-400">€15 fissi</span>
          </h2>
        </motion.div>

        {/* Included */}
        <motion.div
          variants={fadeUp}
          className="bg-slate-800/50 rounded-2xl p-6 border border-violet-500/20"
        >
          <ul className="space-y-3">
            <CheckItem>Creazione o correzione grafica professionale</CheckItem>
            <CheckItem>File in CMYK, risoluzione corretta, margini al vivo</CheckItem>
            <CheckItem>Consegna entro 24 ore lavorative</CheckItem>
            <CheckItem>1 revisione inclusa</CheckItem>
            <CheckItem>Esperto grafico dedicato, non un bot</CheckItem>
          </ul>
        </motion.div>

        {/* Bonuses */}
        <motion.div
          variants={fadeUp}
          className="bg-emerald-950/30 rounded-2xl p-5 border border-emerald-500/20"
        >
          <p className="text-emerald-300 font-bold text-sm uppercase tracking-wider mb-3">
            🎁 Bonus inclusi — solo per chi prenota oggi
          </p>
          <ul className="space-y-2 text-gray-300 text-sm">
            {[
              'Check gratuito del file se ne hai già uno',
              'Suggerimenti professionali su leggibilità e impatto visivo',
              'Template grafico base gratuito se parti da zero',
              'Priorità di lavorazione rispetto agli ordini standard',
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <ArrowRight className="w-3 h-3 text-emerald-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Value stack */}
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-white/10 overflow-hidden"
        >
          <div className="px-6 py-4 bg-slate-800/60 border-b border-white/10">
            <p className="text-white font-semibold text-sm uppercase tracking-wider">
              📊 Il valore reale di quello che ricevi
            </p>
          </div>
          <div className="divide-y divide-white/5 bg-slate-800/30">
            {[
              ['Consulenza grafica professionale', '€80'],
              ['File tecnico CMYK + dpi + bleed', '€30'],
              ['1 revisione inclusa', '€20'],
              ['Check file + suggerimenti visivi', '€30'],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between px-6 py-3 text-sm">
                <span className="text-gray-300">{label}</span>
                <span className="text-gray-500 line-through">{val}</span>
              </div>
            ))}
          </div>
          <div className="px-6 py-5 bg-slate-900/60">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-400 text-sm">Valore totale</span>
              <span className="text-gray-500 line-through text-sm">€160+</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white font-bold text-lg">Il tuo prezzo oggi</span>
              <span className="text-emerald-400 font-extrabold text-3xl">€15</span>
            </div>
            <p className="text-gray-500 text-xs mt-1 text-right">Con garanzia rimborso completo</p>
          </div>
        </motion.div>

        {/* Why €15 */}
        <motion.p
          variants={fadeUp}
          className="text-gray-500 text-sm text-center leading-relaxed italic px-2"
        >
          "Perché €15 e non €80? Il nostro grafico è già in azienda. Non ha costi overhead da
          freelance. Sappiamo che una grafica perfetta significa un cliente soddisfatto che
          ordina di nuovo. È un investimento nella tua fiducia — non un favore."
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeUp} className="pt-2">
          <WaButton full />
          <p className="text-center text-gray-500 text-xs mt-3">
            Via WhatsApp · Risposta garantita entro 2 ore
          </p>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

/* ─── Scarcity ───────────────────────────────────────────── */
const Scarcity = () => (
  <section className="py-10 bg-slate-950 border-y border-white/5">
    <div className="container mx-auto px-4 max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center space-y-4"
      >
        <SectionBadge color="amber">
          <Clock className="w-3 h-3 inline mr-1" />
          Disponibilità limitata
        </SectionBadge>
        <p className="text-white font-semibold">
          Il nostro grafico gestisce{' '}
          <span className="text-emerald-400 font-bold">massimo {TOTAL_SLOTS} consulenze</span>{' '}
          a settimana.
        </p>
        {/* Slot dots */}
        <div className="flex gap-2 justify-center">
          {Array.from({ length: TOTAL_SLOTS }).map((_, i) => (
            <div
              key={i}
              className={`h-4 w-4 rounded-full ${
                i < TOTAL_SLOTS - SLOTS_REMAINING
                  ? 'bg-red-500/70'
                  : 'bg-emerald-400 shadow-sm shadow-emerald-400/40'
              }`}
            />
          ))}
        </div>
        <p className="text-sm">
          <span className="text-emerald-400 font-bold text-xl">{SLOTS_REMAINING}</span>
          <span className="text-gray-400"> slot disponibili questa settimana</span>
        </p>
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200 font-semibold text-sm transition-colors"
        >
          <FaWhatsapp className="w-4 h-4" />
          Prenota il tuo slot adesso →
        </a>
      </motion.div>
    </div>
  </section>
);

/* ─── Guarantee ──────────────────────────────────────────── */
const Guarantee = () => (
  <section className="py-16 bg-slate-900/70">
    <div className="container mx-auto px-4 max-w-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-slate-800/50 rounded-2xl p-8 border border-emerald-500/20 text-center space-y-4"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 mx-auto">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-extrabold text-white">
          🛡 Garanzia Assoluta Printora
        </h3>
        <p className="text-gray-300 leading-relaxed">
          Se la grafica consegnata non ti soddisfa dopo la revisione,
          ti rimborsiamo i <span className="text-emerald-400 font-bold">€15 integralmente</span> —
          senza domande, senza burocrazia.
        </p>
        <p className="text-gray-500 text-sm font-semibold">
          Nessun rischio per te. Tutto il rischio è nostro.
        </p>
      </motion.div>
    </div>
  </section>
);

/* ─── Final CTA ──────────────────────────────────────────── */
const FinalCta = () => (
  <section className="py-20 bg-slate-950 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-violet-900/10 to-emerald-900/10 pointer-events-none" />
    <div className="container mx-auto px-4 max-w-xl relative z-10 text-center space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
          Prenota la Consulenza Grafica
          <br />
          <span className="text-emerald-400">e il tuo banner è risolto.</span>
        </h2>
        <p className="text-gray-400">
          Slot disponibili:{' '}
          <span className="text-emerald-400 font-bold">{SLOTS_REMAINING} questa settimana</span>
        </p>
        <WaButton full label="[PRENOTA ORA — €15] Via WhatsApp" />
        <div className="flex flex-col items-center gap-2 pt-2">
          <Link
            to="/banner"
            className="text-gray-500 hover:text-gray-300 text-sm flex items-center gap-1 transition-colors"
          >
            Hai già la grafica pronta? Vai al configuratore banner →
          </Link>
        </div>

        {/* P.S. */}
        <div className="mt-8 bg-slate-800/40 rounded-xl p-5 border border-white/5 text-left">
          <p className="text-gray-400 text-sm leading-relaxed">
            <span className="text-white font-bold">P.S.</span> — Ogni giorno in cui il tuo
            banner non è ordinato è un giorno in cui l'evento si avvicina e il margine di
            manovra si restringe. Per €15 hai un esperto grafico che risolve il problema
            oggi. O aspetti ancora il preventivo del tipografo?
          </p>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors"
          >
            <FaWhatsapp className="w-4 h-4" />
            Prenota ora — {SLOTS_REMAINING} slot rimasti questa settimana →
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─── Self-serve bottom strip ────────────────────────────── */
const SelfServeStrip = () => (
  <div className="bg-slate-900 border-t border-white/10 py-8">
    <div className="container mx-auto px-4 max-w-2xl text-center space-y-3">
      <p className="text-gray-400 text-sm">
        Sei già pratico di grafica e preferisci procedere da solo?
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
const GraficaConsultingPage = () => (
  <>
    <Helmet>
      <title>Consulenza Grafica Expert — €15 | File Pronto in 24h | Printora</title>
      <meta
        name="description"
        content="Il nostro esperto grafico crea o corregge il tuo file in 24 ore. File CMYK, risoluzione corretta, margini al vivo. Prezzo fisso €15 con garanzia rimborso. Per banner e striscioni PVC."
      />
    </Helmet>
    <div className="bg-slate-950 overflow-hidden">
      <Hero />
      <Problem />
      <Solution />
      <Credentials />
      <Benefits />
      <Fascination />
      <SocialProof />
      <TheOffer />
      <Scarcity />
      <Guarantee />
      <FinalCta />
      <SelfServeStrip />
    </div>
  </>
);

export default GraficaConsultingPage;
