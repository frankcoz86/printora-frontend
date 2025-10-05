import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Image, Type, Trash2, LayoutTemplate, Shapes, Undo, Redo } from 'lucide-react';
import { motion } from 'framer-motion';

const TooltipButton = ({ tooltip, children, ...props }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button {...props}>{children}</Button>
    </TooltipTrigger>
    <TooltipContent><p>{tooltip}</p></TooltipContent>
  </Tooltip>
);

const DesignerToolbar = ({ 
    onAddImage, 
    onAddText, 
    onDelete, 
    onOpenTemplates, 
    onOpenClipart, 
    onUndo, 
    onRedo, 
    canUndo, 
    canRedo, 
    isReady, 
    isVisible,
    activeObject
}) => {
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        onAddImage(file);
      }
      e.target.value = null;
  };

  return (
    <motion.div 
        className="w-full flex-shrink-0 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 shadow-lg z-20"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
    >
      <TooltipProvider>
        <div className="flex items-center justify-between p-2 space-x-2 h-16">
          <div className="flex items-center space-x-1">
             <TooltipButton tooltip="Aggiungi un'immagine dal tuo computer" variant="ghost" className="h-12 px-4 flex-col gap-1" onClick={() => fileInputRef.current.click()} disabled={!isReady}>
                <Image className="h-5 w-5" />
                <span className="text-xs">Immagine</span>
             </TooltipButton>
             <Input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*,.pdf,.ai,.psd,.eps" />

             <TooltipButton tooltip="Inserisci un nuovo campo di testo" variant="ghost" className="h-12 px-4 flex-col gap-1" onClick={onAddText} disabled={!isReady}>
                <Type className="h-5 w-5" />
                <span className="text-xs">Testo</span>
             </TooltipButton>

             <TooltipButton tooltip="Scegli tra i nostri design pronti" variant="ghost" className="h-12 px-4 flex-col gap-1" onClick={onOpenTemplates} disabled={!isReady}>
                <LayoutTemplate className="h-5 w-5" />
                 <span className="text-xs">Template</span>
             </TooltipButton>

             <TooltipButton tooltip="Esplora la libreria di forme e icone" variant="ghost" className="h-12 px-4 flex-col gap-1" onClick={onOpenClipart} disabled={!isReady}>
                <Shapes className="h-5 w-5" />
                 <span className="text-xs">Clipart</span>
             </TooltipButton>
          </div>

          <div className="flex items-center space-x-1">
            <TooltipButton tooltip="Annulla l'ultima azione" variant="ghost" size="icon" className="w-12 h-12" onClick={onUndo} disabled={!canUndo || !isReady}>
              <Undo className="h-5 w-5" />
            </TooltipButton>

            <TooltipButton tooltip="Ripristina l'azione annullata" variant="ghost" size="icon" className="w-12 h-12" onClick={onRedo} disabled={!canRedo || !isReady}>
              <Redo className="h-5 w-5" />
            </TooltipButton>

            <div className="pl-1 ml-1 border-l border-slate-700 h-8" />
            
            <TooltipButton tooltip="Elimina l'oggetto selezionato" variant="ghost" size="icon" className="w-12 h-12 text-red-400 hover:text-red-300 hover:bg-red-900/50" onClick={onDelete} disabled={!isReady || !activeObject}>
              <Trash2 className="h-5 w-5" />
            </TooltipButton>

          </div>
        </div>
      </TooltipProvider>
    </motion.div>
  );
};

export default DesignerToolbar;