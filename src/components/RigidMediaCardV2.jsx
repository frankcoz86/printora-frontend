import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { ShoppingCart, Brush, Download, AlertTriangle, Layers, Scissors } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QuantitySelector from '@/components/QuantitySelector';
import FileUpload from '@/components/FileUpload';
import { generateLayoutPdf } from '@/lib/pdfGenerator';

const RigidMediaCardV2 = ({ material, onAddToCart, onDesign }) => {
  const [selectedThickness, setSelectedThickness] = useState(material.thicknessOptions[0]);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(70);
  const [quantity, setQuantity] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [shapingEnabled, setShapingEnabled] = useState(false);
  const [shapingFile, setShapingFile] = useState(null);

  const calculation = useMemo(() => {
    const MAX_PANEL_WIDTH = material.maxWidth || 300;
    const MAX_PANEL_HEIGHT = material.maxHeight || 200;

    if (!width || !height || !selectedThickness || width < 10 || height < 10) return null;
    
    let areaM2 = (width / 100) * (height / 100);
    const basePrice = material.basePrice * selectedThickness.priceMultiplier;
    
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
    
    const weightPerItem = areaM2 * (material.weightPerSqmPerMm * selectedThickness.value);

    return { pricePerPanel, total, areaM2, panelInfo, shapingCost, weightPerItem };
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
      weight_per_item: calculation.weightPerItem,

      // Lift Drive fields to top level for Apps Script
      kind: 'client-upload',
      driveFileId: uploadedFile?.driveFileId,
      driveLink: uploadedFile?.driveLink,
      mimeType: uploadedFile?.mimeType,
      size: uploadedFile?.size,
      printFiles: [
        uploadedFile?.driveFileId ? {
          kind: 'client-upload',
          driveFileId: uploadedFile.driveFileId,
          fileName: uploadedFile.name,
          mimeType: uploadedFile.mimeType,
          size: uploadedFile.size,
        } : null,
        shapingFile?.driveFileId ? {
          kind: 'client-upload',
          driveFileId: shapingFile.driveFileId,
          fileName: shapingFile.name,
          mimeType: shapingFile.mimeType,
          size: shapingFile.size,
        } : null,
      ].filter(Boolean),

      // keep your nested fields for UI
      file: uploadedFile,
      shaping: shapingEnabled && shapingFile ? { enabled: true, file: shapingFile } : { enabled: false },
    };

    onAddToCart({ product: {
        id: `rigid-${material.id}-${selectedThickness.value}-${width}x${height}-${shapingEnabled}`,
        name: `Pannello ${material.name}`,
        image: selectedThickness.image || material.image,
        price: calculation.pricePerPanel,
        type: 'rigid-media'
      },
      quantity,
      total: calculation.total,
      details: itemDetails
    });
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
    if (!width || !height || width <= 0 || height <= 0) {
      toast({ title: "Dimensioni non valide", description: "Inserisci base e altezza per scaricare il template.", variant: "destructive" });
      return;
    }
    generateLayoutPdf({ type: 'rigid-media', width, height, productName: material.name });
  }, [width, height, material.name]);

  const displayImage = selectedThickness.image || material.image;

  return (
    <div 
      className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden shadow-lg flex flex-col hover:border-primary/50 transition-all duration-300"
    >
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.img 
            key={displayImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            loading="lazy" 
            src={displayImage} 
            alt={material.alt} 
            className="w-full h-48 object-cover" 
          />
        </AnimatePresence>
      </div>

      <div className="p-4 md:p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-primary mb-2">{material.name}</h3>
        <p className="text-gray-300 text-sm mb-4 flex-grow">{material.description}</p>
        
        <div className="space-y-4">
          <div>
            <Label className="font-semibold mb-2 block text-xs flex items-center gap-2"><Layers className="w-4 h-4 text-cyan-300"/>Spessore</Label>
            <Select value={selectedThickness.value.toString()} onValueChange={(val) => setSelectedThickness(material.thicknessOptions.find(t => t.value.toString() === val))}>
              <SelectTrigger className="w-full bg-slate-700 border-slate-600"><SelectValue /></SelectTrigger>
              <SelectContent>{material.thicknessOptions.map(t => <SelectItem key={t.value} value={t.value.toString()}>{t.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="font-semibold mb-2 block text-xs">Base (cm)</Label>
              <Input type="number" value={width} min="10" onChange={(e) => setWidth(Math.max(0, Number(e.target.value)))} placeholder="Base" className="bg-slate-700 border-slate-600"/>
            </div>
              <div>
              <Label className="font-semibold mb-2 block text-xs">Altezza (cm)</Label>
              <Input type="number" value={height} min="10" onChange={(e) => setHeight(Math.max(0, Number(e.target.value)))} placeholder="Altezza" className="bg-slate-700 border-slate-600"/>
            </div>
          </div>
          {calculation?.panelInfo && (
            <p className="text-xs text-amber-400 flex items-start gap-2 text-left pt-1"><AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />{calculation.panelInfo}</p>
          )}
          
          <div className={`bg-slate-700/40 p-3 rounded-lg border-2 transition-all duration-300 ${shapingEnabled ? 'border-cyan-400 shadow-lg shadow-cyan-500/10' : 'border-slate-700'}`}>
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
                  <p className="text-xs text-slate-400">Taglio su misura (+€12/mq)</p>
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
            <Label className="font-semibold mb-2 block text-xs">File di Stampa</Label>
            <FileUpload onFileSelect={setUploadedFile} label="Carica il tuo file"/>
            <div className="relative my-2 flex items-center justify-center">
              <div className="absolute w-full h-px bg-slate-700"></div><span className="relative bg-slate-800/50 px-2 text-sm text-slate-400">oppure</span>
            </div>
            <Button variant="secondary" onClick={handleDesignClick} className="w-full bg-fuchsia-600/20 text-fuchsia-300 border border-fuchsia-500/30 hover:bg-fuchsia-600/30 hover:text-fuchsia-200">
              <Brush className="w-4 h-4 mr-2"/>Crea con l'Editor Online
            </Button>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <div className="text-center mb-4">
            <Button variant="link" onClick={handleDownloadTemplate} className="text-emerald-300 text-xs">
              <Download className="w-3 h-3 mr-2" />Scarica template di stampa
            </Button>
          </div>
          <div className="flex justify-between items-center mb-4">
            <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
            <div className="text-right">
              <span className="text-gray-400 text-sm">Totale (+IVA) </span>
              <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                €{calculation ? calculation.total.toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
          
          <Button onClick={handleAddToCartClick} disabled={!calculation} className="w-full">
            <ShoppingCart className="w-4 h-4 mr-2"/>Aggiungi al Carrello
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RigidMediaCardV2;
