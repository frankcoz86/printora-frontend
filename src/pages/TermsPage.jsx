import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const TermsPage = () => {
  return (
    <>
      <Helmet>
        <title>Termini e Condizioni | Printora</title>
        <meta name="description" content="Leggi i Termini e le Condizioni di servizio di Printora per conoscere le regole di utilizzo del sito, le politiche di acquisto e le responsabilità." />
      </Helmet>
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-extrabold mb-8 text-primary">Termini e Condizioni di Servizio</h1>
            <div className="prose prose-invert prose-lg max-w-none space-y-6">
              <p>Ultimo aggiornamento: 01/08/2025</p>
              
              <p>
                I presenti Termini e Condizioni regolano l'utilizzo del sito web Printora e l'acquisto dei prodotti offerti. L'accesso e l'utilizzo del sito implicano l'accettazione di questi termini.
              </p>

              <h2 className="text-2xl font-bold text-cyan-300">1. Oggetto del Servizio</h2>
              <p>
                Printora, un marchio di Isla Produzione e Distribuzione S.r.l.s., offre un servizio di stampa digitale online di prodotti personalizzati, tra cui banner, roll-up, stampe DTF e supporti rigidi.
              </p>

              <h2 className="text-2xl font-bold text-cyan-300">2. Ordini e Pagamenti</h2>
              <ul>
                <li>I prezzi indicati sul sito sono da intendersi IVA esclusa, salvo diversa indicazione.</li>
                <li>Il contratto di vendita si considera concluso al momento della ricezione del pagamento.</li>
                <li>Accettiamo pagamenti tramite PayPal e le principali carte di credito/debito processate da PayPal.</li>
              </ul>

              <h2 className="text-2xl font-bold text-cyan-300">3. File di Stampa e Responsabilità del Cliente</h2>
              <ul>
                <li>Il cliente è l'unico responsabile della qualità, del contenuto e dei diritti d'autore dei file di stampa caricati.</li>
                <li>Il cliente dichiara di possedere tutti i diritti di riproduzione necessari per le immagini e i testi inviati. Printora non si assume alcuna responsabilità per la violazione di diritti di terzi.</li>
                <li>Offriamo una verifica base gratuita del file per controllarne le dimensioni e la risoluzione. Non effettuiamo controlli sui contenuti, sull'ortografia o sulla grafica.</li>
                <li>I colori visualizzati a monitor potrebbero differire leggermente da quelli di stampa a causa delle diverse calibrazioni dei dispositivi. Questa differenza non costituisce un difetto di produzione.</li>
              </ul>

              <h2 className="text-2xl font-bold text-cyan-300">4. Produzione e Spedizione</h2>
              <ul>
                <li>I tempi di produzione indicati sono stime e possono variare in base al carico di lavoro e alla complessità dell'ordine.</li>
                <li>La spedizione viene affidata a corrieri espressi. Non siamo responsabili per ritardi o danni causati dal trasportatore.</li>
              </ul>

              <h2 className="text-2xl font-bold text-cyan-300">5. Diritto di Recesso e Politica sui Resi</h2>
              <ul>
                <li>Ai sensi dell'art. 59 del Codice del Consumo, il diritto di recesso è escluso per la fornitura di beni confezionati su misura o chiaramente personalizzati.</li>
                <li>Tutti i prodotti venduti su Printora sono personalizzati su richiesta del cliente e, pertanto, non è possibile effettuare un reso o richiedere un rimborso, salvo in caso di evidenti difetti di produzione o non conformità rispetto all'ordine.</li>
                <li>Eventuali reclami per difetti di produzione devono essere comunicati entro 8 giorni dalla ricezione della merce, allegando documentazione fotografica.</li>
              </ul>

              <h2 className="text-2xl font-bold text-cyan-300">6. Limitazione di Responsabilità</h2>
              <p>
                La responsabilità di Printora è limitata al valore dei beni acquistati. Non saremo responsabili per danni indiretti, come perdita di profitto o di opportunità commerciali.
              </p>

              <h2 className="text-2xl font-bold text-cyan-300">7. Legge Applicabile e Foro Competente</h2>
              <p>
                I presenti Termini e Condizioni sono regolati dalla legge italiana. Per qualsiasi controversia, il foro competente è quello di Milano.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TermsPage;