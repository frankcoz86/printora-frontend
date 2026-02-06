import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { LayoutTemplate, X, Shirt, Gift, Flame, Trophy, Heart, Download } from 'lucide-react';
import { dtfTemplates } from '@/data/dtfTemplates';
import { generateLayoutPdf } from '@/lib/pdfGenerator';

const categoryIcons = {
  "Addio al Nubilato": <Shirt className="w-5 h-5 mr-2 text-pink-400" />,
  "Addio al Celibato": <Shirt className="w-5 h-5 mr-2 text-blue-400" />,
  "Compleanno": <Gift className="w-5 h-5 mr-2 text-yellow-400" />,
  "Fitness": <Flame className="w-5 h-5 mr-2 text-orange-400" />,
  "Gaming": <Trophy className="w-5 h-5 mr-2 text-green-400" />,
  "Eventi": <LayoutTemplate className="w-5 h-5 mr-2 text-cyan-400" />,
  "Famiglia": <Heart className="w-5 h-5 mr-2 text-red-400" />,
  "Default": <LayoutTemplate className="w-5 h-5 mr-2" />,
};

const DtfTemplateBrowser = ({ isOpen, onOpenChange, onSelectTemplate, designState }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const { categorizedTemplates, categoryOrder } = useMemo(() => {
    const order = ["Addio al Nubilato", "Addio al Celibato", "Compleanno", "Fitness", "Gaming", "Eventi", "Famiglia"];
    const categorized = dtfTemplates.reduce((acc, template) => {
      const category = template.category || 'Generici';
      if (!acc[category]) acc[category] = [];
      acc[category].push(template);
      return acc;
    }, {});

    return { categorizedTemplates: categorized, categoryOrder: order };
  }, []);

  const handleDownloadTemplate = () => {
    // Open the DTF guide PDF in a new tab
    window.open('/assets/template DTF.pdf', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[90vh] bg-slate-900 border-slate-700 text-white flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-primary">
            <LayoutTemplate className="w-8 h-8" /> Scegli un Modello per DTF
          </DialogTitle>
          <DialogDescription className="text-slate-400 pt-2 flex justify-between items-center">
            <span>Inizia con un design pronto all'uso! Scegli un template e aggiungilo al tuo telo.</span>
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
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {categorizedTemplates[category].map((template) => (
                    <motion.div
                      key={template.id}
                      variants={itemVariants}
                      className="group relative overflow-hidden rounded-lg border border-slate-700 hover:border-primary transition-all duration-300 cursor-pointer bg-slate-800"
                      onClick={() => {
                        onSelectTemplate(template);
                        onOpenChange(false);
                      }}
                    >
                      <div className="w-full h-40 flex items-center justify-center p-4 bg-black">
                        <img class="max-h-full max-w-full object-contain" alt={template.name} src="https://images.unsplash.com/photo-1580460848325-6b8d06d628cc" />
                      </div>
                      <div className="p-3">
                        <h3 className="font-bold text-white text-md truncate">{template.name}</h3>
                        <p className="text-sm text-slate-400 truncate">{template.description}</p>
                      </div>
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Aggiungi
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

export default DtfTemplateBrowser;