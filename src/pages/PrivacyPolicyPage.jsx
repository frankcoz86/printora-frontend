import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Printora</title>
        <meta name="description" content="Leggi la nostra Privacy Policy per capire come raccogliamo, usiamo e proteggiamo i tuoi dati personali su Printora." />
      </Helmet>
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-extrabold mb-8 text-primary">Privacy Policy</h1>
            <div className="prose prose-invert prose-lg max-w-none space-y-6">
              <p>Ultimo aggiornamento: 01/08/2025</p>
              
              <p>
                Benvenuto su Printora. La tua privacy è di fondamentale importanza per noi. Questa Privacy Policy descrive quali dati personali raccogliamo e come li utilizziamo.
              </p>

              <h2 className="text-2xl font-bold text-cyan-300">1. Titolare del Trattamento</h2>
              <p>
                Il titolare del trattamento dei dati è Isla Produzione e Distribuzione S.r.l.s., con sede legale in Ripa di Porta Ticinese 39, 20143 - Milano (MI), P.IVA IT13037220962.
              </p>

              <h2 className="text-2xl font-bold text-cyan-300">2. Dati Raccolti</h2>
              <p>
                Raccogliamo i seguenti tipi di dati:
              </p>
              <ul>
                <li><strong>Dati forniti volontariamente:</strong> Nome, cognome, indirizzo di spedizione, dati di fatturazione (se richiesti), indirizzo email e numero di telefono per la gestione degli ordini e delle comunicazioni.</li>
                <li><strong>Dati di navigazione:</strong> Indirizzi IP, tipo di browser, orari di accesso e altri dati relativi al dispositivo e al sistema operativo, raccolti tramite cookie e tecnologie simili per garantire il corretto funzionamento del sito e per analisi statistiche anonime.</li>
                <li><strong>File di stampa:</strong> I file grafici caricati per la personalizzazione dei prodotti vengono conservati temporaneamente sui nostri server sicuri per il tempo strettamente necessario alla produzione e poi eliminati.</li>
              </ul>

              <h2 className="text-2xl font-bold text-cyan-300">3. Finalità del Trattamento</h2>
              <p>
                Utilizziamo i tuoi dati per:
              </p>
              <ul>
                <li>Elaborare e spedire i tuoi ordini.</li>
                <li>Fornire assistenza clienti e rispondere alle tue richieste.</li>
                <li>Emettere fatture e adempiere agli obblighi fiscali e legali.</li>
                <li>Inviare comunicazioni di servizio relative al tuo ordine (conferma, spedizione, ecc.).</li>
                <li>Migliorare il nostro sito e i nostri servizi attraverso analisi aggregate e anonime.</li>
              </ul>

              <h2 className="text-2xl font-bold text-cyan-300">4. Base Giuridica del Trattamento</h2>
              <p>
                Il trattamento dei tuoi dati si basa sull'esecuzione di un contratto (l'acquisto dei nostri prodotti), sul consenso (per attività di marketing, se previsto) e sull'adempimento di obblighi legali.
              </p>

              <h2 className="text-2xl font-bold text-cyan-300">5. Condivisione dei Dati</h2>
              <p>
                I tuoi dati non vengono venduti a terzi. Potremmo condividerli con:
              </p>
              <ul>
                <li>Corrieri per la spedizione dei prodotti.</li>
                <li>Fornitori di servizi di pagamento (es. PayPal) per l'elaborazione delle transazioni.</li>
                <li>Consulenti fiscali e legali per adempiere agli obblighi di legge.</li>
              </ul>
              <p>
                Questi soggetti tratteranno i dati come autonomi titolari o responsabili del trattamento, in conformità con le normative vigenti.
              </p>

              <h2 className="text-2xl font-bold text-cyan-300">6. Sicurezza dei Dati</h2>
              <p>
                Adottiamo misure di sicurezza tecniche e organizzative adeguate per proteggere i tuoi dati da accessi non autorizzati, perdita o distruzione. Le transazioni di pagamento sono protette da crittografia.
              </p>

              <h2 className="text-2xl font-bold text-cyan-300">7. Diritti dell'Interessato</h2>
              <p>
                In qualsiasi momento, hai il diritto di accedere ai tuoi dati, chiederne la rettifica, la cancellazione, la limitazione del trattamento o opporti al loro utilizzo. Puoi esercitare i tuoi diritti contattandoci all'indirizzo email fornito nella pagina Contatti.
              </p>

              <h2 className="text-2xl font-bold text-cyan-300">8. Cookie Policy</h2>
              <p>
                Il nostro sito utilizza cookie tecnici essenziali per il suo funzionamento e cookie analitici per raccogliere informazioni in forma aggregata. Per maggiori dettagli, consulta la nostra Cookie Policy (se disponibile).
              </p>

              <h2 className="text-2xl font-bold text-cyan-300">9. Modifiche a questa Policy</h2>
              <p>
                Ci riserviamo il diritto di modificare questa Privacy Policy. Qualsiasi modifica sarà pubblicata su questa pagina. Ti invitiamo a consultarla regolarmente.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;