import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { rigidMediaProducts } from '@/data/rigidMediaProducts';
import { toast } from '@/components/ui/use-toast';
import { CheckCircle, HardDrive, Zap, Scissors, Box, Layers } from 'lucide-react';
import RigidMediaCardV2 from '@/components/RigidMediaCardV2';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const RigidMediaPageV2 = () => {
    const navigate = useNavigate();
    const { cartHook } = useOutletContext();

    const handleAddToCart = useCallback((productData) => {
        if (!cartHook) return;
        const { product, quantity, total, details } = productData;
        
        const cartProduct = { ...product, weight: details.weight_per_item };
        
        cartHook.addToCart(cartProduct, quantity, [], total, details);
        toast({
            title: "Aggiunto al carrello!",
            description: `${quantity} x ${product.name} (${details.dimensions})`,
            action: <div className="flex items-center text-emerald-400"><CheckCircle className="mr-2" /><span>Successo</span></div>,
        });
    }, [cartHook]);
    
    const handleDesign = useCallback((designState) => {
        navigate('/designer', { state: { designState } });
    }, [navigate]);

    return (
        <>
            <Helmet>
                <title>Stampa su Supporti Rigidi | Forex, Dibond, Plexiglass | Printora</title>
                <meta name="description" content="Stampa UV professionale su supporti rigidi: Forex, Plexiglass, Alluminio Dibond e altri. Configura il tuo pannello personalizzato online e calcola il preventivo in tempo reale." />
                <meta name="keywords" content="stampa forex, stampa plexiglass, stampa dibond, pannelli rigidi, stampa uv, printora, stampa personalizzata" />
            </Helmet>

            <div className="bg-slate-900 text-white">
                <div className="container mx-auto px-4 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <HardDrive className="mx-auto h-16 w-16 text-primary mb-4" />
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">Stampa su Supporti Rigidi</h1>
                        <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
                            Dai forma alle tue idee con i nostri pannelli rigidi. Qualità di stampa UV eccezionale per ogni esigenza.
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        className="grid md:grid-cols-2 xl:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {rigidMediaProducts.map((material) => (
                           <motion.div key={material.id} variants={itemVariants}>
                                <RigidMediaCardV2 
                                    material={material} 
                                    onAddToCart={handleAddToCart}
                                    onDesign={handleDesign}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                        className="mt-24"
                    >
                        <div className="text-center mb-12">
                            <Zap className="mx-auto h-12 w-12 text-primary mb-4" />
                            <h2 className="text-3xl md:text-4xl font-extrabold">Finiture di Precisione</h2>
                            <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">Non solo stampa. Grazie alla nostra fustellatrice digitale, diamo vita a qualsiasi forma.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                            <motion.div variants={itemVariants} className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-primary transition-all duration-300 transform hover:-translate-y-2">
                                <Scissors className="h-12 w-12 text-primary mx-auto mb-4" />
                                <h3 className="font-bold text-xl">Taglio Sagomato</h3>
                                <p className="text-sm text-gray-400 mt-2">Taglio preciso con lama oscillante per dare forma alle tue idee.</p>
                            </motion.div>
                            <motion.div variants={itemVariants} className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-primary transition-all duration-300 transform hover:-translate-y-2">
                                <Box className="h-12 w-12 text-primary mx-auto mb-4" />
                                <h3 className="font-bold text-xl">Cordonatura</h3>
                                <p className="text-sm text-gray-400 mt-2">Creiamo linee di piega perfette per espositori e packaging.</p>
                            </motion.div>
                            <motion.div variants={itemVariants} className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-primary transition-all duration-300 transform hover:-translate-y-2">
                                <Layers className="h-12 w-12 text-primary mx-auto mb-4" />
                                <h3 className="font-bold text-xl">Kiss-Cut</h3>
                                <p className="text-sm text-gray-400 mt-2">Mezzo taglio per adesivi prespaziati facili da applicare.</p>
                            </motion.div>
                            <motion.div variants={itemVariants} className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-primary transition-all duration-300 transform hover:-translate-y-2">
                                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                                <h3 className="font-bold text-xl">Taglio a V e Fresatura</h3>
                                <p className="text-sm text-gray-400 mt-2">Incisioni e lavorazioni speciali per dettagli unici.</p>
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </>
    );
};

export default RigidMediaPageV2;