import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Paintbrush, Sparkles, Zap, Package, Edit, Upload, Printer, Shirt, ShoppingBag, HardHat, Award } from 'lucide-react';
import { dtfProduct } from '@/data/products';
import DtfPriceCalculator from '@/components/DtfPriceCalculator';
import { Button } from '@/components/ui/button';

const Feature = ({ icon: Icon, title, description }) => (
  <div className="flex items-start space-x-4">
    <div className="shrink-0">
      <div className="p-3 bg-fuchsia-500/10 rounded-full">
        <Icon className="w-6 h-6 text-fuchsia-400" />
      </div>
    </div>
    <div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  </div>
);

const StepCard = ({ icon: Icon, number, title, description }) => (
    <motion.div 
        className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
    >
        <div className="relative flex justify-center mb-4">
            <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400 text-slate-900 font-bold text-lg">{number}</span>
            <Icon className="w-12 h-12 text-cyan-300" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
    </motion.div>
);

const ApplicationCard = ({ icon: Icon, name }) => (
    <div className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
        <Icon className="w-8 h-8 text-fuchsia-300" />
        <span className="text-sm font-medium text-white">{name}</span>
    </div>
);

const DtfDev1Page = () => {
    const { cartHook } = useOutletContext();
    const { addToCart } = cartHook;
    const navigate = useNavigate();

    const cmykImage = dtfProduct.images.find(img => img.id === 1);
    const fluoImages = dtfProduct.images.filter(img => img.id !== 1);

    const handleOpenEditor = () => {
        const width = 56;
        const height = 100;
        const quantity = 1;

        const designState = {
            product: dtfProduct,
            width,
            height,
            quantity,
            extras: [],
            total: 0,
        };

        navigate('/dtf-designer', { state: { designState } });
    };

    return (
    <>
      <Helmet>
        <title>Stampa DTF al Metro DEV1 | Printora</title>
        <meta name="description" content="Versione DEV1 della pagina DTF al Metro, per testare varianti di layout e stile." />
        <meta name="keywords" content="stampa dtf dev1, dtf al metro, stampa transfer, dtf fluo, stampa tessuti" />
      </Helmet>
      
      <div className="bg-slate-950 overflow-hidden">
        <div className="container mx-auto px-4 pt-16 pb-20 text-center relative">
          <div className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            <h1 className="relative z-20 text-4xl md:text-6xl font-extrabold leading-[1.25] tracking-tight text-fuchsia-300">
              {"Crea il tuo dtf con l'"}
              <span className="text-fuchsia-100">editor gratuito</span>
            </h1>
            <p className="mt-[21px] text-[23px] text-gray-300 max-w-3xl mx-auto">
              50% di sconto se ordini ora!
              <br />
              Spedizione in 24 h
            </p>
            <div className="mt-[29px] flex justify-center">
              <Button size="lg" variant="accent" onClick={handleOpenEditor} className="text-[18px]">
                Apri l'editor gratuito
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="py-12 md:py-16 bg-slate-900">
        <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                <div className="space-y-6">
                  {dtfProduct.images.map((image, index) => (
                      <motion.div 
                          key={image.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                          <img src={image.src} alt={image.alt} className="w-full h-auto object-cover rounded-xl shadow-lg shadow-fuchsia-900/20"/>
                          <h3 className="text-center mt-4 font-semibold text-white">{image.title}</h3>
                      </motion.div>
                  ))}
                </div>
                <motion.div 
                    className="sticky top-24"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <DtfPriceCalculator product={dtfProduct} onAddToCart={addToCart} />
                </motion.div>
            </div>
        </div>
      </div>
      
      <div className="py-12 md:py-16 bg-slate-950">
        <div className="container mx-auto px-4 space-y-16">
            
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white">Facile, Veloce, Professionale</h2>
                <p className="text-slate-300 mt-2 max-w-2xl mx-auto">Creare le tue personalizzazioni non è mai stato così semplice. Segui questi 3 passaggi:</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StepCard number="1" icon={Edit} title="Crea la Grafica" description="Usa il nostro editor online per creare il tuo design o carica un file già pronto." />
                <StepCard number="2" icon={Printer} title="Noi Stampiamo" description="Stampiamo i tuoi teli con la massima qualità su pellicola transfer." />
                <StepCard number="3" icon={Shirt} title="Tu Applichi" description="Ricevi i transfer pronti da applicare su qualsiasi tessuto con una termopressa." />
            </div>

            <div className="pt-12 border-t border-slate-800">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white">Applicazioni Infinite</h2>
                <p className="text-slate-300 mt-2 max-w-2xl mx-auto">Il DTF è perfetto per personalizzare una vasta gamma di prodotti:</p>
              </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <ApplicationCard icon={Shirt} name="T-shirt & Felpe" />
                    <ApplicationCard icon={Award} name="Abbigliamento Sportivo" />
                    <ApplicationCard icon={HardHat} name="Abbigliamento da Lavoro" />
                    <ApplicationCard icon={ShoppingBag} name="Borse e Zaini" />
                </div>
            </div>

            <div className="pt-12 border-t border-slate-800">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white">Qualità che Lascia il Segno</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-8 mt-8">
                    <Feature icon={Paintbrush} title="Versatilità Totale" description="Applica le tue grafiche su cotone, poliestere, tessuti chiari e scuri, cappellini, borse e molto altro." />
                    <Feature icon={Zap} title="Colori Brillanti e Duraturi" description="Le nostre stampe resistono ai lavaggi mantenendo colori vividi e un'ottima elasticità." />
                    <Feature icon={Package} title="Pronto all'Uso" description="Ricevi il tuo transfer DTF su pellicola, pronto per essere applicato con una semplice termopressa." />
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default DtfDev1Page;
