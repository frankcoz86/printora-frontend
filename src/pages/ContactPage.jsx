import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, Copy, ArrowRight, User, Hash } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const ContactInfoCard = ({ icon: Icon, title, href, cta, children }) => {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex items-start gap-5 shadow-lg hover:bg-slate-800/70 transition-all duration-300 relative overflow-hidden"
    >
      <div className="flex-shrink-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 p-4 rounded-full border-2 border-emerald-400/50">
        <Icon className="w-6 h-6 text-emerald-300" />
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        <div className="text-gray-300 leading-relaxed">{children}</div>
        {href && (
          <a href={href} target="_blank" rel="noopener noreferrer" className="mt-3 font-semibold text-emerald-400 hover:text-emerald-300 transition-colors duration-300 flex items-center gap-2 group">
            {cta} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        )}
         {!href && cta && (
           <span className="mt-3 font-semibold text-gray-400 text-sm">{cta}</span>
        )}
      </div>
    </motion.div>
  );
};

const EmailItem = ({ label, email }) => {
  const { toast } = useToast();
  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    toast({
      title: 'Copiato!',
      description: 'Indirizzo email copiato negli appunti.',
    });
  };

  return (
    <div className="relative group flex items-center justify-between">
      <div className='flex flex-col'>
         <span className="text-sm text-gray-400">{label}</span>
         <a href={`mailto:${email}`} className="text-emerald-300 hover:underline">{email}</a>
      </div>
      <Button variant="ghost" size="icon" onClick={copyToClipboard} className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 bg-slate-700/50 hover:bg-slate-700">
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

const ContactPage = () => {
  const { toast } = useToast();

  // ── NEW: form state + sending flag ─────────────────────────────────────
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    order_code: "", // optional; set it if you want to pass an order code
  });
  const [sending, setSending] = useState(false);

  // ── NEW: submit handler to call /api/contact ───────────────────────────
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Compila i campi obbligatori", variant: "destructive" });
      return;
    }
    try {
      setSending(true);
      const resp = await fetch(`${import.meta.env.VITE_API_BASE || ""}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await resp.json();
      if (!resp.ok || !j.ok) throw new Error(j.error || "Invio non riuscito");
      toast({ title: "✅ Messaggio inviato", description: "Ti risponderemo al più presto." });
      setForm({ name: "", email: "", subject: "", message: "", order_code: "" });
    } catch (err) {
      toast({ title: "❌ Errore", description: err.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const emails = {
    ordini: 'ordini@printora.it',
    supporto: 'supporto@printora.it', // ✅ fixed typo
  };

  return (
    <>
      <Helmet>
        <title>Contatti - Scrivici o Chiamaci | Printora</title>
        <meta name="description" content="Mettiti in contatto con Printora. Inviaci un messaggio, scrivici un'email, contattaci su WhatsApp o trova il nostro indirizzo. Siamo qui per aiutarti." />
        <meta name="keywords" content="contatti printora, modulo di contatto, indirizzo printora, email printora, supporto clienti stampa" />
      </Helmet>
      <div className="relative py-24 sm:py-32 bg-slate-900 overflow-hidden min-h-screen">
        <div className="absolute inset-0 z-0">
          <div className="absolute w-[50vw] h-[50vw] max-w-3xl max-h-3xl bg-gradient-to-r from-emerald-600/50 to-cyan-600/50 rounded-full opacity-20 blur-3xl animate-blob top-0 left-0 transform -translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute w-[50vw] h-[50vw] max-w-3xl max-h-3xl bg-gradient-to-r from-pink-600/50 to-purple-600/50 rounded-full opacity-20 blur-3xl animation-delay-4000 animate-blob bottom-0 right-0 transform translate-x-1/4 translate-y-1/4"></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, delay: 0.5, type: 'spring' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <img alt="Abstract geometric shape" className="w-[600px] h-[600px] opacity-10" src="https://images.unsplash.com/photo-1648218466069-bb93310f97b7" />
          </motion.div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4 drop-shadow-lg">
              Mettiti in Contatto
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Siamo pronti ad ascoltarti. Compila il modulo o utilizza uno dei canali qui sotto.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/30"
            >
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Send className="w-8 h-8 text-emerald-400" />
                Inviaci un Messaggio
              </h2>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Nome */}
                <motion.div variants={cardVariants} className="relative">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                   <Input
                     placeholder="Il tuo nome"
                     type="text"
                     className="pl-12 h-12 bg-slate-800/70 border-slate-700 focus:border-emerald-500 focus:ring-emerald-500"
                     required
                     value={form.name}
                     onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                   />
                </motion.div>

                {/* Email */}
                <motion.div variants={cardVariants} className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                   <Input
                     placeholder="La tua email"
                     type="email"
                     className="pl-12 h-12 bg-slate-800/70 border-slate-700 focus:border-emerald-500 focus:ring-emerald-500"
                     required
                     value={form.email}
                     onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                   />
                </motion.div>

                {/* Oggetto */}
                <motion.div variants={cardVariants} className="relative">
                   <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                   <Input
                     placeholder="Oggetto del messaggio"
                     type="text"
                     className="pl-12 h-12 bg-slate-800/70 border-slate-700 focus:border-emerald-500 focus:ring-emerald-500"
                     value={form.subject}
                     onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))}
                   />
                </motion.div>

                {/* Messaggio */}
                <motion.div variants={cardVariants}>
                   <Textarea
                     placeholder="Come possiamo aiutarti?"
                     className="min-h-[120px] bg-slate-800/70 border-slate-700 focus:border-emerald-500 focus:ring-emerald-500"
                     required
                     value={form.message}
                     onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                   />
                </motion.div>

                {/* Submit */}
                <motion.div variants={cardVariants}>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={sending}
                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold text-lg h-14"
                  >
                    {sending ? "Invio in corso..." : "Invia Messaggio"}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-2 space-y-8"
            >
              <ContactInfoCard icon={Mail} title="Email">
                <div className="space-y-4">
                  <EmailItem label="Ordini & Preventivi" email={emails.ordini} />
                  <EmailItem label="Supporto Tecnico" email={emails.supporto} />
                </div>
              </ContactInfoCard>
              
              <ContactInfoCard icon={FaWhatsapp} title="WhatsApp" href="https://wa.me/393792775116" cta="Invia un messaggio">
                <p>+39 3792775116</p>
                <p className="text-sm text-gray-400">Risposta rapida per domande veloci.</p>
              </ContactInfoCard>

              <ContactInfoCard icon={MapPin} title="Sede Legale" cta="Lun-Ven: 9:00-18:00">
                <p>Ripa di Porta Ticinese 39, 20143 - Milano (MI)</p>
              </ContactInfoCard>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
