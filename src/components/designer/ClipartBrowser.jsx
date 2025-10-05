import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CLIPART_CATEGORIES } from './clipart';
import { motion } from 'framer-motion';

const ClipartBrowser = ({ isOpen, onOpenChange, onSelectClipart, isBannerEditor }) => {

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
  
  const getDefaultClipartColor = () => {
    return isBannerEditor ? '#000000' : '#ffffff';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl h-[80vh] bg-slate-900 border-slate-700 text-white flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl text-cyan-300">Libreria Clipart</DialogTitle>
          <DialogDescription>Scegli un elemento da aggiungere al tuo design. Puoi cambiarne il colore dalle proprietà.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue={CLIPART_CATEGORIES[0].name} className="flex-grow flex flex-col overflow-hidden">
          <TabsList className="bg-slate-800">
            {CLIPART_CATEGORIES.map(category => (
              <TabsTrigger key={category.name} value={category.name}>{category.name}</TabsTrigger>
            ))}
          </TabsList>
          <ScrollArea className="flex-grow mt-4 pr-4 -mr-4">
            {CLIPART_CATEGORIES.map(category => (
              <TabsContent key={category.name} value={category.name} className="mt-0">
                <motion.div 
                  className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {category.items.map(item => (
                    <motion.div
                      key={item.name}
                      variants={itemVariants}
                      onClick={() => {
                        onSelectClipart(item.svg, getDefaultClipartColor());
                        onOpenChange(false);
                      }}
                      className="p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors aspect-square flex items-center justify-center flex-col gap-2 border border-slate-700 hover:border-primary-focus"
                    >
                      <div className="w-10 h-10 text-white" dangerouslySetInnerHTML={{ __html: item.svg.replace('<svg', '<svg fill="currentColor"') }}></div>
                      <p className="text-xs text-center text-slate-400">{item.name}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ClipartBrowser;