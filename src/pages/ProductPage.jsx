import React, { Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Wind, CheckCircle } from 'lucide-react';
import { products } from '@/data/products';
import BannerPriceCalculator from '@/components/BannerPriceCalculator';
import RollupSelector from '@/components/RollupSelector';
import Loader from '@/components/Loader';

const Faq = lazy(() => import('@/components/Faq'));

const ProductPage = () => {
    const { cartHook } = useOutletContext();
    const { addToCart } = cartHook;
    
    const bannerProduct = products.find(p => p.type === 'banner');
    const rollupProduct = products.find(p => p.type === 'rollup');

    if (!bannerProduct || !rollupProduct) {
        return <Loader />;
    }

    return (
        <>
            <Helmet>
                <title>Stampa Banner & Roll-up | Printora</title>
                <meta name="description" content="Stampa online di banner pubblicitari e roll-up avvolgibili. Massima qualità a prezzi promozionali. Calcola il preventivo e ordina subito!" />
                <meta name="keywords" content="stampa banner, rollup, stampa grande formato, espositori pubblicitari, banner personalizzati" />
            </Helmet>
            <div className="bg-slate-950">
                <div className="container mx-auto px-4 pt-16 pb-20 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                            Banner & Roll-up
                        </h1>
                        <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
                            Dai massima visibilità al tuo brand con i nostri banner e roll-up. Qualità eccezionale a prezzi imbattibili.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="py-16 bg-slate-900">
                <div className="container mx-auto px-4">
                    {/* BANNER SECTION */}
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-24">
                        <div>
                             <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                                <img src={bannerProduct.image} alt={bannerProduct.imageAlt} className="rounded-xl shadow-lg w-full h-auto" />
                                <div className="mt-8 bg-slate-800/50 p-6 rounded-xl border border-white/10">
                                    <h3 className="text-xl font-bold text-white mb-3">Qualità che si Vede e si Sente</h3>
                                    <p className="text-gray-400">
                                        Utilizziamo solo PVC da 510gr di alta qualità, stampato con inchiostri ecosolventi che garantiscono colori vividi e una resistenza eccezionale agli agenti atmosferici e ai raggi UV. Perfetto per interni ed esterni.
                                    </p>
                                </div>
                             </motion.div>
                        </div>
                        <div className="sticky top-24">
                             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                                <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/10 shadow-2xl shadow-black/30">
                                    <h2 className="text-3xl font-bold text-white mb-2">{bannerProduct.name}</h2>
                                    <p className="text-emerald-300 font-semibold text-lg mb-4">PROMO a partire da €{bannerProduct.price.toFixed(2)}/mq</p>
                                    <p className="text-gray-300 mb-6">{bannerProduct.description}</p>
                                    <ul className="space-y-2 text-sm text-gray-300 mb-6">
                                        {bannerProduct.features.map((feature, index) => (
                                            <li key={index} className="flex items-start">
                                                <Wind className="w-4 h-4 mr-2 mt-1 shrink-0 text-emerald-400" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <BannerPriceCalculator product={bannerProduct} onAddToCart={addToCart} />
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* ROLL-UP SECTION */}
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                        <div>
                           <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                            <img src={rollupProduct.image} alt={rollupProduct.imageAlt} className="rounded-xl shadow-lg w-full h-auto" />
                            <div className="mt-8 bg-slate-800/50 p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-bold text-white mb-3">Il Tuo Messaggio, Ovunque</h3>
                                <p className="text-gray-400">
                                    I nostri roll-up sono la soluzione ideale per fiere, eventi e punti vendita. Leggeri, facili da trasportare e montare in pochi secondi. Struttura in alluminio e borsa per il trasporto inclusa.
                                </p>
                            </div>
                           </motion.div>
                        </div>
                        <div className="sticky top-24">
                           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                             <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/10 shadow-2xl shadow-black/30">
                                <h2 className="text-3xl font-bold text-white mb-2">{rollupProduct.name}</h2>
                                <p className="text-cyan-300 font-semibold text-lg mb-4">PROMO a partire da €{rollupProduct.formats[0].promo_price.toFixed(2)}</p>
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
            
            <Suspense fallback={<Loader />}>
                <Faq />
            </Suspense>
        </>
    );
};

export default ProductPage;