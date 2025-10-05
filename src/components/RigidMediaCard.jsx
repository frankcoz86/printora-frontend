import React, { useState, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { AlertTriangle, ShoppingCart, Brush } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QuantitySelector from '@/components/QuantitySelector';
import FileUpload from '@/components/FileUpload';

const RigidMediaCard = memo(({ material, onAddToCart, onDesign }) => {
  const [selectedThickness, setSelectedThickness] = useState(material.thicknesses[0]);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(70);
  const [quantity, setQuantity] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [shapingEnabled, setShapingEnabled] = useState(false);
  const [shapingFile, setShapingFile] = useState(null);

  const calculation = useMemo(() => {
    const MAX_PANEL_WIDTH = material.maxWidth || 200;
    const MAX_PANEL_HEIGHT = material.maxHeight || 300;

    if (!width || !height || !selectedThickness || width <= 0 || height <= 0) return null;

    const areaM2 = (width / 100) * (height / 100);
    const shapingCost = shapingEnabled ? areaM2 * 12 : 0;
    const pricePerPanel = areaM2 * selectedThickness.price_per_sqm + shapingCost;
    const total = pricePerPanel * quantity;

    const needsPaneling = width > MAX_PANEL_WIDTH || height > MAX_PANEL_HEIGHT;
    let panelInfo = '';
    if (needsPaneling) {
      const panelsX = Math.ceil(width / MAX_PANEL_WIDTH);
      const panelsY = Math.ceil(height / MAX_PANEL_HEIGHT);
      panelInfo = `Le dimensioni superano il formato massimo del pannello (${MAX_PANEL_WIDTH}x${MAX_PANEL_HEIGHT}cm). La stampa verrà divisa in ${panelsX * panelsY} pannelli.`;
    }

    return { pricePerPanel, total, areaM2, panelInfo, shapingCost };
  }, [width, height, selectedThickness, quantity, material, shapingEnabled]);

  const handleAddToCartClick = useCallback(() => {
    if (!calculation) return;
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
      weight_per_item: calculation.areaM2 * selectedThickness.weight,

      // Lift Drive fields to top level so buildPrintFiles can read them
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

      // keep previous UI-friendly field
      file: uploadedFile ? { name: uploadedFile.name, size: uploadedFile.size } : "N/A",
      shaping: shapingEnabled && shapingFile ? `Abilitata con file: ${shapingFile.name}` : "Non richiesta",
    };

    const productForCart = {
      id: `rigid-${material.id}-${selectedThickness.value}-${width}x${height}`,
      name: `Pannello ${material.name}`,
      image: selectedThickness.image || material.image,
      price: calculation.pricePerPanel, // unit price
      type: 'rigid-media'
    };

    // 4-arg signature: product, quantity, extras, details
    onAddToCart(productForCart, quantity, [], itemDetails);
  }, [calculation, uploadedFile, shapingEnabled, shapingFile, material, selectedThickness, width, height, quantity, onAddToCart]);

  const handleDesignClick = useCallback(() => {
    onDesign({
      product: { ...material, type: 'rigid-media', price: selectedThickness.price_per_sqm },
      width,
      height,
      quantity,
      selectedThickness,
      shapingEnabled,
    });
  }, [onDesign, material, width, height, quantity, selectedThickness, shapingEnabled]);
  
  const displayImage = selectedThickness.image || material.image;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden shadow-lg flex flex-col md:flex-row hover:border-primary/50 transition-colors duration-300"
    >
      <div className="md:w-1/2 xl:w-7/12 flex-shrink-0 relative">
        <img loading="lazy" src={displayImage} alt={material.alt} className="w-full h-64 md:h-full object-cover" />
      </div>
      <div className="p-6 flex flex-col flex-grow md:w-1/2 xl:w-5/12">
        <h3 className="text-2xl font-bold text-primary mb-2">{material.name}</h3>
        <p className="text-gray-300 text-sm mb-6 flex-grow">{material.description}</p>
        
        <div className="space-y-4">
          <div>
            <Label className="font-semibold mb-2 block text-xs">Spessore</Label>
            <Select value={selectedThickness.label} onValueChange={(val) => setSelectedThickness(material.thicknesses.find(t => t.label === val))}>
              <SelectTrigger className="w-full bg-slate-700 border-slate-600"><SelectValue /></SelectTrigger>
              <SelectContent>{material.thicknesses.map(t => <SelectItem key={t.value + t.label} value={t.label}>{t.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="font-semibold mb-2 block text-xs">Base (cm)</Label>
              <Input type="number" value={width} onChange={(e) => setWidth(Math.max(0, Number(e.target.value)))} className="bg-slate-700 border-slate-600"/>
            </div>
            <div>
              <Label className="font-semibold mb-2 block text-xs">Altezza (cm)</Label>
              <Input type="number" value={height} onChange={(e) => setHeight(Math.max(0, Number(e.target.value)))} className="bg-slate-700 border-slate-600"/>
            </div>
          </div>
          <div>
            <Label className="font-semibold mb-2 block text-xs">Quantità</Label>
            <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
          </div>
          <div className="flex items-center space-x-3 pt-2">
            <Switch id={`shaping-${material.id}`} checked={shapingEnabled} onCheckedChange={setShapingEnabled} />
            <Label htmlFor={`shaping-${material.id}`} className="text-sm cursor-pointer">Sagomatura CNC (+€12/mq)</Label>
          </div>
          <AnimatePresence>
          {shapingEnabled && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <Label className="font-semibold mb-2 block text-xs">File Vettoriale Sagoma</Label>
              <FileUpload onFileSelect={setShapingFile} accept={{'image/svg+xml': ['.svg'], 'application/postscript': ['.ai', '.eps'], 'application/pdf': ['.pdf']}} label="Carica file sagoma" />
            </motion.div>
          )}
          </AnimatePresence>
          <div>
            <Label className="font-semibold mb-2 block text-xs">File di Stampa</Label>
            <FileUpload onFileSelect={setUploadedFile} label="Carica file di stampa" />
          </div>
        </div>

        <div className="mt-auto pt-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-gray-400 text-sm block">Totale (+IVA) </span>
                <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                  €{calculation ? calculation.total.toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={handleDesignClick}><Brush className="w-4 h-4 mr-2"/>Editor</Button>
                <Button onClick={handleAddToCartClick} disabled={!calculation}><ShoppingCart className="w-4 h-4 mr-2"/>Aggiungi</Button>
              </div>
            </div>
            {calculation?.panelInfo && (
              <p className="text-xs text-amber-400 flex items-center gap-2 mt-2"><AlertTriangle className="w-4 h-4 flex-shrink-0" />{calculation.panelInfo}</p>
            )}
        </div>
      </div>
    </motion.div>
  );
});

export default RigidMediaCard;
