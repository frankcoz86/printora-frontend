import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { LayoutTemplate, X, Building, UtensilsCrossed, PartyPopper, ShoppingCart, Presentation, Building2, Image as ImageIcon, Download } from 'lucide-react';
import { bannerTemplates } from '@/data/bannerTemplates';
import { rollupTemplates } from '@/data/rollupTemplates';
import { rigidMediaTemplates } from '@/data/rigidMediaTemplates';
import { generateLayoutPdf } from '@/lib/pdfGenerator';

const categoryIcons = {
  "Immobiliare": <Building className="w-5 h-5 mr-2" />,
  "Ristorazione": <UtensilsCrossed className="w-5 h-5 mr-2" />,
  "Eventi": <PartyPopper className="w-5 h-5 mr-2" />,
  "Eventi e Fiere": <Presentation className="w-5 h-5 mr-2" />,
  "Saldi e Promozioni": <ShoppingCart className="w-5 h-5 mr-2" />,
  "Targhe": <Building2 className="w-5 h-5 mr-2" />,
  "Insegne": <Building className="w-5 h-5 mr-2" />,
  "Fotoquadri": <ImageIcon className="w-5 h-5 mr-2" />,
  "Default": <LayoutTemplate className="w-5 h-5 mr-2" />,
};

const getProductTemplates = (productType) => {
    switch (productType) {
        case 'banner':
            return { templates: bannerTemplates, order: ["Immobiliare", "Saldi e Promozioni", "Ristorazione", "Eventi"] };
        case 'rollup':
            return { templates: rollupTemplates, order: ["Saldi e Promozioni", "Eventi e Fiere", "Ristorazione"] };
        case 'rigid-media':
            return { templates: rigidMediaTemplates, order: ["Targhe", "Insegne", "Fotoquadri"] };
        default:
            return { templates: [], order: [] };
    }
};

const TemplateBrowser = ({ isOpen, onOpenChange, onSelectTemplate, productType, designState }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const { categorizedTemplates, categoryOrder } = useMemo(() => {
    const { templates, order } = getProductTemplates(productType);
    
    const categorized = templates.reduce((acc, template) => {
      const category = template.category || 'Generici';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(template);
      return acc;
    }, {});
    
    const finalOrder = order.filter(cat => categorized[cat] && categorized[cat].length > 0);

    return { categorizedTemplates: categorized, categoryOrder: finalOrder };
  }, [productType]);

  const getProductTitle = (type) => {
      switch (type) {
          case 'banner': return 'Banner';
          case 'rollup': return 'Roll-up';
          case 'rigid-media': return 'Supporto Rigido';
          default: return 'Prodotto';
      }
  }

  const handleDownloadTemplate = () => {
    if (!designState) return;
    generateLayoutPdf({
        type: designState.product.type,
        width: designState.width,
        height: designState.height,
        productName: designState.product.name,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl h-[90vh] bg-slate-900 border-slate-700 text-white flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-primary">
            <LayoutTemplate className="w-8 h-8" /> Scegli un Modello per {getProductTitle(productType)}
          </DialogTitle>
          <DialogDescription className="text-slate-400 pt-2 flex justify-between items-center">
            <span>Parti da una base professionale. Scegli un template per categoria e modificalo come vuoi.</span>
            <Button onClick={handleDownloadTemplate} variant="outline" className="bg-slate-800 border-teal-500 text-teal-300 hover:bg-slate-700 hover:text-teal-200">
                <Download className="mr-2 h-4 w-4" /> Scarica Template Tecnico
            </Button>
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-4 -mr-4 custom-scrollbar">
          {categoryOrder.map(category => (
            categorizedTemplates[category] && (
              <div key={category} className="mb-8">
                <h2 className="flex items-center text-xl font-bold text-cyan-300 border-b border-slate-700 pb-2 mb-4">
                  {categoryIcons[category] || categoryIcons["Default"]} {category}
                </h2>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {categorizedTemplates[category].map((template) => (
                    <motion.div
                      key={template.id}
                      variants={itemVariants}
                      className="group relative overflow-hidden rounded-lg border border-slate-700 hover:border-primary transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        onSelectTemplate(template);
                        onOpenChange(false);
                      }}
                    >
                      <img className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" alt={template.name} src={template.preview} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-4">
                        <h3 className="font-bold text-white text-lg">{template.name}</h3>
                        <p className="text-sm text-slate-300">{template.description}</p>
                      </div>
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Seleziona
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )
          ))}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" /> Chiudi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateBrowser;