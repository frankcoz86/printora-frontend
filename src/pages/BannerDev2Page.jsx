import React, { lazy } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';
import { products } from '@/data/products';
import BannerPriceCalculatorOffer from '@/components/BannerPriceCalculatorOffer';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';

const Faq = lazy(() => import('@/components/Faq'));
const WhyChooseUs = lazy(() => import('@/components/WhyChooseUs'));
const WhyBetter = lazy(() => import('@/components/WhyBetter'));
const Testimonials = lazy(() => import('@/components/Testimonials'));

const BannerDev2Page = () => {
    const { cartHook } = useOutletContext();
    const { addToCart } = cartHook;
    const navigate = useNavigate();
    
    const bannerProduct = products.find(p => p.type === 'banner');

    if (!bannerProduct) {
        return <Loader />;
    }

    const handleOpenEditor = () => {
        const width = 300;
        const height = 100;
        const quantity = 1;

        navigate('/designer/banner', {
          state: {
            designState: {
              product: bannerProduct,
              width,
              height,
              quantity,
              extras: [],
              sleevePosition: null,
              sleeveSize: null,
            },
          },
        });
    };

    return (
        <>
            <Helmet>
                <title>Striscioni Banner DEV2 | Printora</title>
                <meta name="description" content="Versione DEV2 della pagina banner, con editor gratuito e offerta dedicata." />
                <meta name="keywords" content="striscioni dev, banner pvc editor, offerte speciali, printora" />
            </Helmet>
            <div className="bg-slate-950 overflow-hidden">
                <div className="container mx-auto px-4 pt-16 pb-20 text-center relative">
                    <div className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
                    <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10">
                        <h1 className="relative z-20 text-4xl md:text-6xl font-extrabold leading-[1.25] tracking-tight text-emerald-300">
                           Crea gratis il tuo banner in PVC
                        </h1>
                        <p className="mt-[21px] text-[23px] text-gray-300 max-w-3xl mx-auto">
                            50% di sconto se acquisti da questa pagina adesso e spedizione in 24 h.
                        </p>
                        <div className="mt-[29px] flex justify-center">
                            <Button size="lg" variant="accent" onClick={handleOpenEditor} className="text-[18px]">
                              Apri l&apos;editor gratuito
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="py-16 bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }} className="space-y-8">
                            <img loading="lazy" src="/assets/banner1.png" alt="Striscione promozionale blu con logo camaleonte, prezzo promo €8,90/mq, editor facile e occhielli inclusi ogni 50cm" className="rounded-2xl shadow-2xl w-full h-auto border-4 border-slate-800" />
                            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                <h3 className="text-xl font-bold text-white mb-3">Qualità che si Vede e si Sente</h3>
                                <p className="text-gray-400">
                                    Utilizziamo solo PVC da 510gr di alta qualità, stampato con inchiostri ecosolventi che garantiscono colori vividi e una resistenza eccezionale agli agenti atmosferici e ai raggi UV. Perfetto per interni ed esterni. Gli occhielli metallici ogni 50 cm sono inclusi di serie per mantenere il telo teso e stabile, riducendo il rischio di strappi su recinzioni, ponteggi e facciate.
                                </p>
                            </div>
                            <img  className="rounded-2xl shadow-2xl w-full h-auto border-4 border-slate-800" alt="Striscione promozionale in PVC con logo in un contesto urbano per eventi o pubblicità" src="/assets/banner2.png" />
                            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                <h3 className="text-xl font-bold text-white mb-3">Il Tuo Messaggio, Ovunque</h3>
                                <p className="text-gray-400">
                                    Dai cantieri alle fiere, dagli eventi sportivi alle promozioni in negozio, i nostri banner sono lo strumento perfetto per catturare l'attenzione. Grazie alla loro versatilità, puoi installarli facilmente su recinzioni, ponteggi, pareti o transenne, garantendo massima visibilità al tuo brand.
                                </p>
                            </div>
                            <img  className="rounded-2xl shadow-2xl w-full h-auto border-4 border-slate-800" alt="Banner PVC 510g occhiellato su recinzione, con dettagli su stampa HD, occhielli inclusi e prezzo promozionale." src="/assets/banner3.png" />
                        </motion.div>
                        <div className="sticky top-24">
                           <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }}>
                             <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-700 shadow-2xl shadow-black/30">
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
                                <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-left">
                                    <p className="text-xs font-semibold tracking-[0.18em] text-emerald-300 uppercase">
                                        Configura e ordina in autonomia
                                    </p>
                                    <p className="mt-1 text-sm text-gray-200">
                                        Nessuna attesa, nessun preventivo da richiedere, nessuna sorpresa sul prezzo: l'editor ti mostra subito il costo finale mentre personalizzi il tuo striscione.
                                    </p>
                                </div>
                                <BannerPriceCalculatorOffer product={bannerProduct} onAddToCart={addToCart} />
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

export default BannerDev2Page;
