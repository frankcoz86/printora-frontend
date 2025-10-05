import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { ShoppingCart, Brush, Download, AlertTriangle, Layers, ArrowRight, Scissors } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QuantitySelector from '@/components/QuantitySelector';
import FileUpload from '@/components/FileUpload';
import { generateLayoutPdf } from '@/lib/pdfGenerator';

const RigidMediaConfigurator = ({ material, onAddToCart, onDesign }) => {
    const [selectedThickness, setSelectedThickness] = useState(material.thicknessOptions[0]);
    const [width, setWidth] = useState(100);
    const [height, setHeight] = useState(70);
    const [quantity, setQuantity] = useState(1);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [shapingEnabled, setShapingEnabled] = useState(false);
    const [shapingFile, setShapingFile] = useState(null);

    useEffect(() => {
        setSelectedThickness(material.thicknessOptions[0]);
        setUploadedFile(null);
        setShapingEnabled(false);
        setShapingFile(null);
    }, [material]);

    const calculation = useMemo(() => {
        const MAX_PANEL_WIDTH = material.maxWidth || 300;
        const MAX_PANEL_HEIGHT = material.maxHeight || 200;

        if (!width || !height || !selectedThickness || width < 10 || height < 10) return null;

        let areaM2 = (width / 100) * (height / 100);
        let basePrice = material.basePrice * selectedThickness.priceMultiplier;
        
        let panelInfo = '';
        if (width > MAX_PANEL_WIDTH || height > MAX_PANEL_HEIGHT) {
            panelInfo = `Dimensioni superiori a ${MAX_PANEL_WIDTH}x${MAX_PANEL_HEIGHT}cm. Il pannello verrà sezionato.`;
        }

        if (areaM2 < 0.5) {
            if(!panelInfo) panelInfo = `La superficie minima fatturabile è 0.5 mq.`;
            areaM2 = 0.5;
        }

        const shapingCost = shapingEnabled ? areaM2 * 12 : 0;
        const pricePerPanel = areaM2 * basePrice + shapingCost;
        const total = pricePerPanel * quantity;

        return { pricePerPanel, total, areaM2, panelInfo, shapingCost };
    }, [width, height, selectedThickness, quantity, material, shapingEnabled]);

    const handleAddToCartClick = useCallback(() => {
        if (!calculation) {
            toast({ title: "Configurazione Incompleta", description: "Per favore, inserisci dimensioni valide (min. 10cm).", variant: "destructive" });
            return;
        }
        if (!uploadedFile) {
            toast({ title: "File di stampa mancante", description: "Per favore, carica un file di stampa.", variant: "destructive" });
            return;
        }
        if (shapingEnabled && !shapingFile) {
            toast({ title: "File di sagomatura mancante", description: "Per favore, carica un file vettoriale per la sagomatura.", variant: "destructive" });
            return;
        }
        
        const itemDetails = {
            material: material.name,
            thickness: selectedThickness.label,
            dimensions: `${width}cm x ${height}cm`,
            panelInfo: calculation.panelInfo,
            weight_per_item: calculation.areaM2 * (material.weightPerSqmPerMm * selectedThickness.value),
            file: uploadedFile,
            shaping: shapingEnabled && shapingFile ? { enabled: true, file: shapingFile } : { enabled: false },
        };

        const productForCart = {
            id: `rigid-${material.id}-${selectedThickness.value}-${width}x${height}-${shapingEnabled}`,
            name: `Pannello ${material.name}`,
            image: material.image,
            price: calculation.pricePerPanel,
            type: 'rigid-media'
        };

        onAddToCart({ product: productForCart, quantity, total: calculation.total, details: itemDetails });
    }, [calculation, uploadedFile, shapingEnabled, shapingFile, material, selectedThickness, width, height, quantity, onAddToCart]);

    const handleDesignClick = useCallback(() => {
        if (!width || !height || width < 10 || height < 10) {
            toast({ title: "Dimensioni non valide", description: "Inserisci dimensioni valide (min. 10cm) prima di accedere all'editor.", variant: "destructive" });
            return;
        }
        onDesign({
            product: { ...material, type: 'rigid-media', price: calculation.pricePerPanel / quantity },
            width,
            height,
            quantity,
            selectedThickness,
            shapingEnabled,
        });
    }, [onDesign, material, width, height, quantity, selectedThickness, shapingEnabled, calculation]);

    const handleDownloadTemplate = useCallback(() => {
         if (!width || !height || width < 10 || height < 10) {
            toast({ title: "Dimensioni non valide", description: "Inserisci base e altezza per scaricare il template.", variant: "destructive" });
            return;
        }
        generateLayoutPdf({ type: 'rigid-media', width, height, productName: material.name });
    }, [width, height, material.name]);

    const displayImage = material.image;

    return (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden shadow-lg p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col">
                    <h2 className="text-3xl font-bold text-primary mb-2">{material.name}</h2>
                    <p className="text-gray-300 text-sm mb-4 flex-grow">{material.description}</p>
                    <div className="mt-auto space-y-3">
                        <div className="aspect-video rounded-lg overflow-hidden border-2 border-slate-700 shadow-md">
                            <img loading="lazy" src={displayImage} alt={material.alt} className="w-full h-full object-cover" />
                        </div>
                        <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="w-full text-xs bg-slate-700/50 hover:bg-slate-700/80 border-slate-600">
                            <Download className="w-3 h-3 mr-2"/> Scarica il template di stampa
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                     <div>
                        <Label className="font-semibold mb-2 block text-sm flex items-center gap-2"><Layers className="w-4 h-4 text-cyan-400"/>Spessore</Label>
                        <Select value={selectedThickness.value.toString()} onValueChange={(val) => setSelectedThickness(material.thicknessOptions.find(t => t.value.toString() === val))}>
                            <SelectTrigger className="w-full bg-slate-700 border-slate-600"><SelectValue placeholder="Seleziona spessore" /></SelectTrigger>
                            <SelectContent>{material.thicknessOptions.map(t => <SelectItem key={t.value} value={t.value.toString()}>{t.label}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="font-semibold mb-2 block text-sm">Base (cm)</Label>
                            <Input type="number" min="10" value={width} onChange={(e) => setWidth(Math.max(0, Number(e.target.value)))} placeholder="Base" className="bg-slate-700 border-slate-600"/>
                        </div>
                         <div>
                            <Label className="font-semibold mb-2 block text-sm">Altezza (cm)</Label>
                            <Input type="number" min="10" value={height} onChange={(e) => setHeight(Math.max(0, Number(e.target.value)))} placeholder="Altezza" className="bg-slate-700 border-slate-600"/>
                        </div>
                    </div>
                     {calculation?.panelInfo && (
                        <p className="text-xs text-amber-400 flex items-start gap-2 text-left"><AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />{calculation.panelInfo}</p>
                     )}
                    
                    <div className={`bg-slate-700/50 p-4 rounded-lg border-2 transition-all duration-300 ${shapingEnabled ? 'border-cyan-400 shadow-lg shadow-cyan-500/10' : 'border-slate-700'}`}>
                        <div className="flex items-center justify-between cursor-pointer" onClick={() => setShapingEnabled(!shapingEnabled)}>
                            <div className="flex items-center gap-3">
                                <motion.div
                                    animate={{ scale: shapingEnabled ? 1.2 : 1, rotate: shapingEnabled ? 10 : 0 }}
                                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                                >
                                    <Scissors className={`w-6 h-6 transition-colors duration-300 ${shapingEnabled ? 'text-cyan-400' : 'text-slate-400'}`} />
                                </motion.div>
                                <div>
                                    <Label htmlFor={`shaping-${material.id}`} className="text-base font-semibold cursor-pointer">Sagomatura CNC</Label>
                                    <p className="text-xs text-slate-400">Taglio e fresatura su misura (+€12/mq)</p>
                                </div>
                            </div>
                            <Switch id={`shaping-${material.id}`} checked={shapingEnabled} onCheckedChange={setShapingEnabled} aria-label="Abilita sagomatura CNC"/>
                        </div>
                        <AnimatePresence>
                        {shapingEnabled && (
                            <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: '16px' }} exit={{ opacity: 0, height: 0, marginTop: 0 }} className="overflow-hidden">
                                <FileUpload onFileSelect={setShapingFile} accept={{'image/svg+xml': ['.svg'], 'application/postscript': ['.ai', '.eps'], 'application/pdf': ['.pdf']}} label="Carica file sagoma vettoriale" />
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                    
                    <div className="pt-2">
                        <Label className="font-semibold mb-2 block text-sm">File di Stampa</Label>
                        <FileUpload onFileSelect={setUploadedFile} label="Carica il tuo file"/>
                        <div className="relative my-2 flex items-center justify-center">
                            <div className="absolute w-full h-px bg-slate-700"></div><span className="relative bg-slate-800/50 px-2 text-sm text-slate-400">oppure</span>
                        </div>
                        <Button variant="secondary" onClick={handleDesignClick} className="w-full"><Brush className="w-4 h-4 mr-2"/>Crea con l'Editor Online</Button>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                    <Label className="font-semibold mb-2 block text-sm">Quantità</Label>
                    <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
                </div>
                <div className="flex-grow text-center sm:text-right">
                    <span className="text-gray-400 text-sm">Totale (IVA Esclusa) </span>
                    <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                        €{calculation ? calculation.total.toFixed(2) : '0.00'}
                    </p>
                </div>
                 <Button onClick={handleAddToCartClick} disabled={!calculation} size="lg" className="w-full sm:w-auto">
                    <ShoppingCart className="w-5 h-5 mr-2"/>Aggiungi al Carrello <ArrowRight className="w-5 h-5 ml-2"/>
                </Button>
            </div>
        </div>
    );
};

export default RigidMediaConfigurator;