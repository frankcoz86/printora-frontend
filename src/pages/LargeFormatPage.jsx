import React, { lazy } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

const Faq = lazy(() => import('@/components/Faq'));
const ImageScroller = lazy(() => import('@/components/ImageScroller'));

const products = [
    {
        name: 'Striscioni PVC',
        description: 'Massima visibilità per esterni e interni. Resistenti, duraturi e con una qualità di stampa eccezionale.',
        link: '/banner',
        image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/fcf1aeaa-652d-41d1-a139-cd99c925f878/132f42e166b6b03c15bacc827d8f06a2.png',
        features: ['PVC 510gr ultra-resistente', 'Occhielli metallici inclusi', 'Stampa HD Ecosolvent']
    },
    {
        name: 'Roll-up Espositivi',
        description: 'La soluzione perfetta per fiere, eventi e punti vendita. Montaggio rapido, struttura in alluminio e borsa inclusa.',
        link: '/rollup',
        image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/fcf1aeaa-652d-41d1-a139-cd99c925f878/7e958a7cc95749f016f8d71f9b8a452b.png',
        features: ['Struttura riavvolgibile', 'Borsa da trasporto inclusa', 'Montaggio in 30 secondi']
    },
    {
        name: 'Supporti Rigidi',
        description: 'Stampa diretta su pannelli in Forex, Plexiglass, Alluminio e altro. Ideali per insegne, quadri e allestimenti.',
        link: '/supporti-rigidi',
        image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/fcf1aeaa-652d-41d1-a139-cd99c925f878/c01313511841251318a158b035595519.png',
        features: ['Vasta scelta di materiali', 'Stampa diretta UV', 'Sagomatura personalizzata']
    }
];

const LargeFormatPage = () => {
    return (
        <>
            <Helmet>
                <title>Stampa Grande Formato: Banner, Roll-up e Supporti Rigidi | Printora</title>
                <meta name="description" content="Scopri le nostre soluzioni di stampa digitale grande formato. Realizziamo striscioni in PVC, espositori roll-up e pannelli rigidi personalizzati per la tua comunicazione." />
                <meta name="keywords" content="stampa grande formato, banner, rollup, forex, plexiglass, alluminio, printora" />
            </Helmet>
            <div className="bg-slate-950 overflow-hidden">
                <div className="container mx-auto px-4 pt-16 pb-20 text-center relative">
                    <div className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
                    <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-300 to-pink-300">
                           Stampa Grande Formato
                        </h1>
                        <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
                            Dai vita alle tue idee in grande. Scegli la soluzione perfetta per comunicare il tuo messaggio con impatto e professionalità.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="py-16 bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product, index) => (
                            <motion.div 
                                key={product.name}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link to={product.link} className="block bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-fuchsia-500/70 transition-all duration-300 overflow-hidden group h-full flex flex-col">
                                    <div className="overflow-hidden">
                                        <img loading="lazy" src={product.image} alt={`Immagine rappresentativa per ${product.name}`} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
                                        <p className="text-gray-400 text-sm mb-4 flex-grow">{product.description}</p>
                                        <ul className="space-y-2 text-xs text-gray-300 mb-6">
                                            {product.features.map(feature => (
                                                <li key={feature} className="flex items-center">
                                                    <CheckCircle className="w-3.5 h-3.5 mr-2 shrink-0 text-fuchsia-400" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-auto pt-4 border-t border-slate-700">
                                            <span className="font-semibold text-fuchsia-300 flex items-center group-hover:text-white transition-colors">
                                                Scopri di più <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
            
            <ImageScroller />
            <Faq />
        </>
    );
};

export default LargeFormatPage;