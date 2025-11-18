import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Type, LayoutTemplate, Shapes, Sliders, Pilcrow, CaseSensitive } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ContextualTools from '@/components/designer/ContextualTools';

const DesignerSidebar = ({ 
    onAddImage,
    onAddText,
    onOpenTemplates,
    onOpenClipart,
    activeObject, 
    canvasRef, 
    updateProperty, 
    alignActiveObject, 
    moveLayer, 
    updateBackground, 
    fontFamilies, 
    isVisible 
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
        <motion.aside 
            className={`
                flex-shrink-0 h-full w-80 bg-slate-900/80 backdrop-blur-sm border-r border-slate-700 shadow-2xl z-20
                fixed md:static top-0 left-0 md:w-80 w-full max-w-xs md:max-w-none
                transition-transform duration-300
                ${isVisible ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
            `}
            style={{ zIndex: 50 }}
            initial={false}
            animate={{ x: isVisible ? 0 : '-100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
            {/* Mobile close button */}
            <div className="md:hidden flex items-center p-2 border-b border-slate-700 bg-slate-900">
                <button
                    aria-label="Chiudi pannello"
                    className="text-white text-xl p-2 rounded hover:bg-slate-800 focus:outline-none"
                    onClick={() => { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('closeSidebar')); }}
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <span className="ml-2 font-bold">Strumenti</span>
            </div>
            <div className="p-2 md:p-4 space-y-4 overflow-y-auto h-full custom-scrollbar">
                <Tabs defaultValue="tools" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="tools"><Shapes className="w-4 h-4 mr-2"/>Strumenti</TabsTrigger>
                        <TabsTrigger value="properties"><Sliders className="w-4 h-4 mr-2"/>Proprietà</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tools">
                        <div className="space-y-2 mt-4">
                            <Button variant="outline" className="w-full justify-start" onClick={() => fileInputRef.current.click()}>
                                <Image className="h-4 w-4 mr-2" /> Aggiungi Immagine
                            </Button>
                            <Input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*,.pdf,.ai,.psd,.eps" />
                            
                            <Button variant="outline" className="w-full justify-start" onClick={() => onAddText('graphic')}>
                                <CaseSensitive className="h-4 w-4 mr-2" /> Aggiungi Testo Grafico
                            </Button>

                            <Button variant="outline" className="w-full justify-start" onClick={() => onAddText('textbox')}>
                                <Pilcrow className="h-4 w-4 mr-2" /> Aggiungi Casella di Testo
                            </Button>
                            
                            <Button variant="outline" className="w-full justify-start" onClick={onOpenTemplates}>
                                <LayoutTemplate className="h-4 w-4 mr-2" /> Scegli Template
                            </Button>
                            
                            <Button variant="outline" className="w-full justify-start" onClick={onOpenClipart}>
                                <Shapes className="h-4 w-4 mr-2" /> Esplora Clipart
                            </Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="properties">
                        <ContextualTools 
                            activeObject={activeObject} 
                            updateProperty={updateProperty}
                            alignActiveObject={alignActiveObject}
                            moveLayer={moveLayer}
                            canvasRef={canvasRef}
                            fontFamilies={fontFamilies}
                            updateBackground={updateBackground}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </motion.aside>
    );
};

export default DesignerSidebar;