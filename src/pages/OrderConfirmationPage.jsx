import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CheckCircle, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Link, useLocation } from 'react-router-dom';
import FileUpload from '@/components/FileUpload';

const sendEmail = async (data) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Qualcosa è andato storto.');
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Error sending email:', error);
      return { error: error.message };
    }
  };

const OrderConfirmationPage = () => {
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('order_id');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingEmail(true);
    const formData = new FormData(e.target);
    const customerEmail = formData.get('email');

    const uploadUrl = `${window.location.origin}/conferma-ordine?order_id=${orderId}`;

    const result = await sendEmail({
        to: customerEmail,
        subject: `Carica i file per il tuo ordine Printora #${orderId?.substring(0,8)}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Ciao!</h2>
                <p>Grazie per il tuo ordine su Printora. Come richiesto, ecco il link per caricare i tuoi file di stampa:</p>
                <p style="text-align: center;">
                    <a href="${uploadUrl}" style="background-color: #1e90ff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Carica i tuoi file qui</a>
                </p>
                <p>Il tuo ID ordine è: <strong>${orderId}</strong></p>
                <p>Se hai domande, non esitare a contattarci.</p>
                <p>Grazie,<br>Il team di Printora</p>
            </div>
        `,
    });

    setIsLoadingEmail(false);

    if (result.success) {
        toast({
            title: "Link inviato!",
            description: "Controlla la tua email per il link di caricamento.",
        });
        e.target.reset();
    } else {
        toast({
            variant: "destructive",
            title: "Errore nell'invio",
            description: result.error || "Non è stato possibile inviare il link. Riprova più tardi.",
        });
    }
  };

  return (
    <>
      <Helmet>
        <title>Ordine Confermato & Carica File | Printora</title>
        <meta name="description" content="Il tuo ordine è stato confermato! Carica qui i tuoi file di stampa o richiedi un link per caricarli più tardi." />
      </Helmet>
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <CheckCircle className="w-24 h-24 text-emerald-400 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">Ordine Confermato!</h1>
            <p className="text-lg text-gray-300 mb-2">
              Grazie per il tuo acquisto. Il tuo ordine è in preparazione.
            </p>
            {orderId && <p className="text-md text-gray-400 mb-12">ID Ordine: <span className="font-mono">{orderId}</span></p>}
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="bg-slate-800/50 p-8 rounded-2xl border border-white/10 flex flex-col items-center justify-center"
            >
              <h2 className="text-3xl font-bold text-white mb-4">Carica i tuoi file ora</h2>
              <p className="text-gray-400 mb-6">Trascina qui o seleziona i file dal tuo computer.</p>
              <FileUpload orderId={orderId} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="bg-slate-800/50 p-8 rounded-2xl border border-white/10 flex flex-col items-center justify-center"
            >
              <h2 className="text-3xl font-bold text-white mb-4">Oppure carica più tardi</h2>
              <p className="text-gray-400 mb-6">Ti invieremo un link per caricare i file via email.</p>
              <form onSubmit={handleEmailSubmit} className="w-full">
                <Input name="email" type="email" placeholder="La tua email" required className="bg-slate-900 border-slate-700 text-white focus:ring-emerald-400 mb-4" />
                <Button type="submit" size="lg" disabled={isLoadingEmail || !orderId} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold">
                  {isLoadingEmail ? <Loader2 className="w-5 h-5 mr-2 animate-spin"/> : <Send className="w-5 h-5 mr-2" />}
                  {isLoadingEmail ? 'Invio in corso...' : 'Inviami il link'}
                </Button>
              </form>
            </motion.div>
          </div>
           <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16"
            >
                <Link to="/">
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                        Torna alla Home
                    </Button>
                </Link>
            </motion.div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmationPage;