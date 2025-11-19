import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fabric } from 'fabric';
import { toast } from '@/components/ui/use-toast';
import { FONT_FAMILIES } from '@/components/designer/utils';
import DtfEditorHeader from '@/components/dtf-designer/DtfEditorHeader';
import DtfEditorSidebar from '@/components/dtf-designer/DtfEditorSidebar';
import DtfCanvasArea from '@/components/dtf-designer/DtfCanvasArea';
import HelpModal from '@/components/designer/HelpModal';
import Loader from '@/components/Loader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import useDtfCanvas from '@/hooks/useDtfCanvas';
import useDtfActions from '@/hooks/useDtfActions';
import useDtfSave from '@/hooks/useDtfSave';
import { ScrollArea } from '@/components/ui/scroll-area';
import DtfTemplateBrowser from '@/components/dtf-designer/DtfTemplateBrowser';

const DtfDesignerPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { designState: initialDesignState } = location.state || {};
    const cartHook = useCart();
    
    const [designState, setDesignState] = useState(initialDesignState);
    const [hasFluo, setHasFluo] = useState(initialDesignState?.extras?.some(e => e.name.includes("FLUO")) || false);
    const [isHelpOpen, setIsHelpOpen] = useState(true);
    const [isComponentReady, setIsComponentReady] = useState(false);
    const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
    const [hasDownloadedPngs, setHasDownloadedPngs] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    useEffect(() => {
        if (!location.state || !location.state.designState) {
            toast({
                title: "Configurazione mancante",
                description: "Per favor, configura un prodotto prima di accedere all'editor DTF. Ti stiamo reindirizzando...",
                variant: "destructive"
            });
            const timer = setTimeout(() => navigate('/dtf'), 2000);
            return () => clearTimeout(timer);
        } else {
            setIsComponentReady(true);
        }
    }, [location.state, navigate]);

    const {
        canvasRefs, fabricCanvasRefs, canvases, setCanvases,
        currentCanvasIndex, setCurrentCanvasIndex,
        activeObject, setActiveObject, getCurrentCanvas,
        downloadAllAsPng,
    } = useDtfCanvas(designState, isComponentReady);

    const {
        addImage, addClipart, deleteActiveObject, duplicateActiveObject, updateObjectProperty, addText, alignActiveObject, moveLayer
    } = useDtfActions({ getCurrentCanvas, activeObject, setActiveObject });

    const {
        isSaving, isConfirming, setIsConfirming, finalDesignUrls,
        handleSaveInitiation, handleConfirmSave
    } = useDtfSave({ 
        fabricCanvasRefs, 
        designState, 
        hasFluo, 
    });

    const handleDownloadPngAndTrack = () => {
        const success = downloadAllAsPng();
        if (success) {
            setHasDownloadedPngs(true);
            toast({
                title: "PNG Scaricati!",
                description: "Ora puoi salvare il tuo design e aggiungerlo al carrello.",
                variant: "default",
                className: "bg-green-700 border-green-600 text-white"
            });
        } else {
            toast({
                title: "Nessun telo da scaricare",
                description: "Crea almeno un design prima di scaricare.",
                variant: "destructive"
            });
        }
    };

    const handleSaveClick = () => {
        if (!hasDownloadedPngs) {
            toast({
                title: "Download PNG Obbligatorio",
                description: "Per favor, scarica un'anteprima PNG ad alta risoluzione dei tuoi teli prima di salvare. Questo passaggio assicura che il risultato finale sia corretto.",
                variant: "destructive",
            });
            return;
        }
        handleSaveInitiation();
    };

    useEffect(() => {
        if (!isComponentReady) return;
        const handleKeyDown = (e) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && activeObject) {
                deleteActiveObject();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeObject, isComponentReady, deleteActiveObject]);

    const handleSelectTemplate = (template) => {
        if (!template.objects) return;
        const canvas = getCurrentCanvas();
        if (!canvas) return;

        const objects = template.objects(canvas);
        objects.forEach(objData => {
            const { type, ...options } = objData;
            let fabricObject;
            switch(type) {
                case 'i-text':
                    fabricObject = new fabric.IText(options.text || '', options);
                    break;
                case 'textbox':
                    fabricObject = new fabric.Textbox(options.text || '', options);
                    break;
                case 'rect':
                    fabricObject = new fabric.Rect(options);
                    break;
                default:
                    return;
            }
            canvas.add(fabricObject);
        });
        canvas.renderAll();
    };
    
    // Removed updateBackground function as it's no longer needed in DtfEditorSidebar

    if (!isComponentReady || !designState || !cartHook) {
        return <Loader />;
    }

    // Mobile sidebar close event
    React.useEffect(() => {
        const handler = () => setIsSidebarVisible(false);
        window.addEventListener('closeSidebar', handler);
        return () => window.removeEventListener('closeSidebar', handler);
    }, []);
    // Show sidebar when ready, hide on preview (if needed)
    React.useEffect(() => {
        if (isComponentReady && !isSidebarVisible) setIsSidebarVisible(true);
    }, [isComponentReady]);

    return (
        <>
            <Helmet>
                <title>Crea Layout DTF | Printora</title>
                <meta name="description" content="Editor grafico avanzato per creare e impaginare le tue grafiche per la stampa DTF."/>
            </Helmet>
            <div className="flex flex-col h-screen bg-slate-800 text-white font-sans">
                {/* Mobile sidebar slider button */}
                {!isSidebarVisible && (
                  <button
                    type="button"
                    className="fixed left-0 top-1/2 -translate-y-1/2 z-40 md:hidden flex items-center justify-center w-8 h-16 rounded-r-full bg-black/40 hover:bg-black/60 text-white focus:outline-none transition"
                    aria-label="Apri strumenti"
                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                    onClick={() => setIsSidebarVisible(true)}
                  >
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><polyline points="9 18 15 12 9 6" /></svg>
                  </button>
                )}
                <DtfEditorHeader
                    designState={designState}
                    onNavigateBack={() => navigate(-1)}
                    onOpenHelp={() => setIsHelpOpen(true)}
                    onSave={handleSaveClick}
                    isSaving={isSaving}
                    onDownloadPng={handleDownloadPngAndTrack}
                    hasDownloadedPngs={hasDownloadedPngs}
                />
                <div className="flex flex-1 overflow-hidden">
                    <DtfEditorSidebar
                        activeObject={activeObject}
                        onAddImage={addImage}
                        onAddClipart={addClipart}
                        onDelete={deleteActiveObject}
                        onDuplicate={duplicateActiveObject}
                        updateProperty={updateObjectProperty}
                        canvasRef={getCurrentCanvas()}
                        fontFamilies={FONT_FAMILIES}
                        hasFluo={hasFluo}
                        setHasFluo={setHasFluo}
                        fabricCanvasRefs={fabricCanvasRefs}
                        setCanvases={setCanvases}
                        designState={designState}
                        onAddText={addText}
                        alignActiveObject={alignActiveObject}
                        moveLayer={moveLayer}
                        // Removed updateBackground prop as it's no longer needed
                        onOpenTemplates={() => setIsTemplatesOpen(true)}
                        isVisible={isSidebarVisible}
                    />
                    <DtfCanvasArea
                        canvases={canvases}
                        canvasRefs={canvasRefs}
                        fabricCanvasRefs={fabricCanvasRefs}
                        currentCanvasIndex={currentCanvasIndex}
                        setCurrentCanvasIndex={setCurrentCanvasIndex}
                    />
                </div>
            </div>
            
            <HelpModal isOpen={isHelpOpen} onOpenChange={setIsHelpOpen} productType="dtf" />

            <DtfTemplateBrowser
                isOpen={isTemplatesOpen}
                onOpenChange={setIsTemplatesOpen}
                onSelectTemplate={handleSelectTemplate}
                designState={designState}
            />

            <Dialog open={isConfirming} onOpenChange={setIsConfirming}>
                <DialogContent className="sm:max-w-4xl bg-slate-900 border-slate-700 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl text-yellow-300">
                            <AlertTriangle className="w-8 h-8"/> Approva i tuoi Teli per la Stampa
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 pt-2">
                            Controlla l'anteprima dei tuoi teli. Questa azione è **irreversibile** e, una volta confermati, i file verranno inviati in stampa senza possibilità di modifica.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="my-4">
                        <ScrollArea className="w-full h-64 rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                            <div className="flex space-x-4">
                                {finalDesignUrls.map((url, index) => (
                                    <div key={index} className="flex-shrink-0 flex flex-col items-center gap-2">
                                        <div className="w-48 h-48 bg-slate-800 rounded-md flex items-center justify-center p-1 border border-slate-600">
                                            <img src={url} alt={`Anteprima Telo ${index + 1}`} className="max-w-full max-h-full object-contain" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-300">Telo {index + 1} di {finalDesignUrls.length}</span>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button variant="outline" onClick={() => setIsConfirming(false)}>
                            <XCircle className="mr-2 h-4 w-4" /> Annulla
                        </Button>
                        <Button variant="accent" onClick={handleConfirmSave} disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                            {isSaving ? 'Salvataggio in corso...' : 'Sì, Confermo e Salvo'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DtfDesignerPage;