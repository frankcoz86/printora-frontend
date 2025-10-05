import React, { useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { rigidMediaProducts as rigidMedia } from '@/data/rigidMediaProducts';
import { toast } from '@/components/ui/use-toast';
import { CheckCircle, HardDrive } from 'lucide-react';
import RigidMediaConfigurator from '@/components/RigidMediaConfigurator';

const RigidMediaPageV3 = () => {
    const navigate = useNavigate();
    const { cartHook } = useOutletContext();
    const [selectedMaterial, setSelectedMaterial] = useState(rigidMedia[0]);

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
                <div className="container mx-auto px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <HardDrive className="mx-auto h-16 w-16 text-primary mb-4" />
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">Configuratore Supporti Rigidi</h1>
                        <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
                           Seleziona un materiale e dai forma alle tue idee con qualità di stampa UV eccezionale.
                        </p>
                    </motion.div>
                    
                    <div className="flex flex-col lg:flex-row gap-8">
                        <aside className="lg:w-1/4">
                            <h2 className="text-xl font-bold mb-4 text-cyan-300">Scegli il Materiale</h2>
                            <div className="space-y-2">
                                {rigidMedia.map(material => (
                                    <button
                                        key={material.id}
                                        onClick={() => setSelectedMaterial(material)}
                                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-4 border-2 ${selectedMaterial.id === material.id ? 'bg-slate-700 border-primary' : 'bg-slate-800 border-slate-700 hover:bg-slate-700/50 hover:border-slate-600'}`}
                                    >
                                        <img loading="lazy" src={material.image} alt={material.imageAlt} className="w-12 h-12 object-cover rounded-md" />
                                        <span className="font-semibold">{material.name}</span>
                                    </button>
                                ))}
                            </div>
                        </aside>

                        <main className="lg:w-3/4">
                             <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedMaterial.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                                >
                                    <RigidMediaConfigurator
                                        material={selectedMaterial}
                                        onAddToCart={handleAddToCart}
                                        onDesign={handleDesign}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RigidMediaPageV3;