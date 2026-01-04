import React, { lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CheckCircle, Award } from 'lucide-react';
import { products } from '@/data/products';
import RollupSelector from '@/components/RollupSelector';
import Loader from '@/components/Loader';
const Faq = lazy(() => import('@/components/Faq'));
const WhyChooseUs = lazy(() => import('@/components/WhyChooseUs'));
const WhyBetter = lazy(() => import('@/components/WhyBetter'));
const Testimonials = lazy(() => import('@/components/Testimonials'));

const RollupPage = ({ heroTitle, heroSubtitle, heroButton }) => {
    const { cartHook } = useOutletContext();
    const { addToCart } = cartHook;
    
    const rollupProduct = products.find(p => p.type === 'rollup');

    if (!rollupProduct) {
        return <Loader />;
    }

    return (
        <>
            <Helmet>
                <title>Stampa Roll-up Pubblicitari Online | Qualità PROMO | Printora</title>
                <meta name="description" content="Espositori roll-up avvolgibili professionali. Stampa HD, struttura in alluminio e borsa da trasporto inclusa. Ideali per fiere, eventi e punto vendita." />
                <meta name="keywords" content="stampa rollup, roll up, espositore avvolgibile, espositore pubblicitario, printora" />
            </Helmet>
            <div className="bg-slate-950 overflow-hidden">
                <div className="container mx-auto px-4 pt-16 pb-20 text-center relative">
                    <div className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
                    <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">
                           {heroTitle || 'Roll-up Pubblicitari'}
                        </h1>
                        <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
                            {heroSubtitle || "Comunica il tuo brand ovunque, con stile e professionalità. Il tuo messaggio, sempre al centro dell'attenzione."}
                        </p>
                        {heroButton && (
                            <div className="mt-6 flex justify-center">
                                {heroButton}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            <div className="py-16 bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }} className="space-y-8">
                             <img loading="lazy" src={rollupProduct.image} alt={rollupProduct.imageAlt} className="rounded-2xl shadow-2xl w-full h-auto border-4 border-slate-800" />
                            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                <h3 className="text-xl font-bold text-white mb-3">Il Tuo Messaggio, Ovunque</h3>
                                <p className="text-gray-400">
                                    I nostri roll-up sono la soluzione ideale per fiere, eventi e punti vendita. Leggeri, facili da trasportare e montare in pochi secondi. Struttura in alluminio e borsa per il trasporto inclusa.
                                </p>
                            </div>
                            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }} className="space-y-8">
                                <img  alt="Due roll-up pubblicitari affiancati, uno da 85x200 cm e uno da 100x200 cm, entrambi con grafica 'HAI BISOGNO DI UN ROLL-UP? EDITOR GRAFICO PERSONALIZZATO Tela in PVC 510 gr'." src="/assets/rollUp2.jpg" />
                            </motion.div>
                        </motion.div>
                        <div className="sticky top-24">
                           <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }}>
                             <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-700 shadow-2xl shadow-black/30">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-3xl font-bold text-white">{rollupProduct.name}</h2>
                                    <div className="flex items-center gap-2 bg-accent/90 text-accent-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg border border-orange-400/50 shrink-0">
                                        <Award size={14}/>PREZZO PROMO
                                    </div>
                                </div>
                                <p className="text-gray-300 mb-6">{rollupProduct.description}</p>
                                <ul className="space-y-2 text-sm text-gray-300 mb-6">
                                    {rollupProduct.features.map((feature, index) => (
                                        <li key={index} className="flex items-center">
                                            <CheckCircle className="w-4 h-4 mr-2 shrink-0 text-cyan-400" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <RollupSelector product={rollupProduct} onAddToCart={addToCart} />
                             </div>
                           </motion.div>
                        </div>
                    </div>
                </div>
            </div>
            
            <WhyChooseUs />
            <WhyBetter />
            <Testimonials />
            <Faq />
        </>
    );
};

export default RollupPage;