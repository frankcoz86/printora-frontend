import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HardDrive } from 'lucide-react';
import { Link } from 'react-router-dom';

const FormatPrintingPage = () => {
    return (
        <>
            <Helmet>
                <title>Stampa Formato | Printora</title>
                <meta name="description" content="Esplora le nostre opzioni di stampa su diversi formati e supporti rigidi. Qualità garantita per ogni tua esigenza." />
            </Helmet>
            <div className="bg-slate-950">
                <div className="container mx-auto px-4 pt-16 pb-20 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                            Stampa su Ogni Formato
                        </h1>
                        <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
                           Dai pannelli rigidi ai materiali flessibili, abbiamo la soluzione di stampa perfetta per ogni tuo progetto. Scopri le opzioni disponibili.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="py-20 bg-slate-900">
                <div className="container mx-auto px-4 text-center">
                    <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
                        <Link to="/supporti-rigidi">
                            <motion.div 
                                className="bg-slate-800 p-8 rounded-2xl border border-white/10 hover:border-purple-400/50 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer"
                                whileHover={{ y: -5 }}
                            >
                                <div className="bg-purple-500/10 p-4 rounded-full mb-4 inline-block">
                                    <HardDrive className="w-10 h-10 text-purple-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Supporti Rigidi</h2>
                                <p className="text-gray-400">
                                    Stampa su Forex, Plexiglass, Alluminio e altri materiali per pannelli resistenti e di alta qualità.
                                </p>
                            </motion.div>
                        </Link>
                    </div>
                     <p className="mt-12 text-gray-500">Altre opzioni di stampa saranno disponibili a breve!</p>
                </div>
            </div>
        </>
    );
};

export default FormatPrintingPage;