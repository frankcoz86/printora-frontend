import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Rocket, Megaphone, Users, BarChart, CheckCircle, Clock, Target } from 'lucide-react';

const launchPhases = [
    {
        name: "Fase 1: Pre-Lancio (2 settimane prima)",
        icon: Clock,
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/30",
        tasks: [
            { title: "Creare Hype sui Social", description: "Annuncia l'imminente lancio con grafiche 'coming soon'. Avvia un countdown." },
            { title: "Campagna Email Teaser", description: "Invia una mail alla tua lista contatti per anticipare la novità e offrire un bonus esclusivo al lancio." },
            { title: "Offerta Early Bird", description: "Prepara uno sconto speciale per i primi 100 clienti che si registreranno o acquisteranno." },
            { title: "Finalizzazione Contenuti", description: "Assicurati che tutte le pagine del sito siano perfette: testi, immagini, prezzi." },
        ]
    },
    {
        name: "Fase 2: Giorno del Lancio",
        icon: Rocket,
        color: "text-fuchsia-400",
        bgColor: "bg-fuchsia-500/10",
        borderColor: "border-fuchsia-500/30",
        tasks: [
            { title: "Annuncio Ufficiale", description: "Pubblica su tutti i canali social che il sito è LIVE. Aggiorna le bio con il link." },
            { title: "Lancio Campagne Pubblicitarie", description: "Attiva le campagne Google Ads e Facebook/Instagram Ads mirate al tuo target." },
            { title: "Email di Lancio", description: "Invia l'email ufficiale a tutta la lista, comunicando l'offerta di lancio." },
            { title: "Monitoraggio in Tempo Reale", description: "Tieni d'occhio la Dashboard per analizzare i primi ordini e il comportamento degli utenti." },
        ]
    },
    {
        name: "Fase 3: Post-Lancio (Prime 4 settimane)",
        icon: BarChart,
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
        borderColor: "border-cyan-500/30",
        tasks: [
            { title: "Raccolta Recensioni", description: "Invia email post-acquisto per chiedere ai clienti di lasciare una recensione sul sito o su Google." },
            { title: "Content Marketing", description: "Pubblica articoli sul blog o post sui social che mostrano i tuoi prodotti in azione (es. '5 modi creativi per usare i banner')." },
            { title: "Collaborazioni con Influencer", description: "Contatta piccoli influencer o aziende nel tuo settore per collaborazioni o scambi di visibilità." },
            { title: "Campagne di Remarketing", description: "Crea campagne mirate per gli utenti che hanno visitato il sito ma non hanno acquistato." },
        ]
    }
];

const MarketingChannelCard = ({ icon: Icon, title, description }) => (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10">
        <div className="flex items-center gap-4 mb-3">
            <Icon className="w-8 h-8 text-emerald-300" />
            <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-gray-400">{description}</p>
    </div>
);

const MarketingPlanPage = () => {
    return (
        <>
            <Helmet>
                <title>Piano di Lancio - Printora</title>
                <meta name="description" content="La roadmap strategica per il lancio e la crescita di Printora." />
            </Helmet>
            <div className="relative min-h-screen bg-slate-900 p-4 sm:p-6 lg:p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.1),_transparent_40%)]"></div>

                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl font-extrabold text-white">Piano di Lancio Strategico</h1>
                        <p className="text-lg text-gray-400 mt-2 max-w-3xl mx-auto">La tua roadmap per un decollo di successo. Segui questi passi per massimizzare l'impatto.</p>
                    </motion.div>

                    <div className="mt-12 space-y-12">
                        {launchPhases.map((phase, index) => (
                            <motion.div
                                key={phase.name}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className={`p-6 md:p-8 rounded-2xl border ${phase.borderColor} ${phase.bgColor}`}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <phase.icon className={`w-8 h-8 ${phase.color}`} />
                                    <h2 className={`text-3xl font-bold ${phase.color}`}>{phase.name}</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {phase.tasks.map(task => (
                                        <div key={task.title} className="flex items-start gap-4">
                                            <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-semibold text-white">{task.title}</h4>
                                                <p className="text-sm text-gray-400">{task.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mt-20 mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Canali di Marketing Chiave</h2>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto">Concentra i tuoi sforzi qui per ottenere i migliori risultati.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                        <MarketingChannelCard icon={Users} title="Social Media" description="Crea contenuti di valore che mostrino la qualità dei tuoi prodotti. Usa Instagram e Facebook per raggiungere un pubblico mirato con campagne a pagamento." />
                        <MarketingChannelCard icon={Megaphone} title="Email Marketing" description="Costruisci una lista di contatti e nutrila con offerte esclusive, anteprime e contenuti utili. È il tuo canale di comunicazione diretto e più redditizio." />
                        <MarketingChannelCard icon={Target} title="Google Ads" description="Intercetta i clienti che cercano attivamente i tuoi prodotti. Crea campagne mirate per parole chiave come 'stampa banner online' o 'stampa dtf personalizzata'." />
                    </div>
                </div>
            </div>
        </>
    );
};

export default MarketingPlanPage;