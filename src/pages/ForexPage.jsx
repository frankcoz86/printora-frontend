import React, { useState, useMemo, useCallback } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Settings2, Download, Brush, CheckCircle, ThumbsUp, ShieldCheck, Plus, Minus, Scissors, AlertTriangle, Layers } from 'lucide-react';
import { rigidMediaProducts } from '@/data/rigidMediaProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import FileUpload from '@/components/FileUpload';
import { cn } from '@/lib/utils';
import { generateLayoutPdf } from '@/lib/pdfGenerator';

const ForexPage = () => {
  const forexProduct = rigidMediaProducts.find(p => p.id === 'forex');
  const { cartHook } = useOutletContext();
  const { addToCart } = cartHook;
  const navigate = useNavigate();

  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(70);
  const [quantity, setQuantity] = useState(1);
  const [selectedThickness, setSelectedThickness] = useState(forexProduct.thicknessOptions[0]);
  const [shapingEnabled, setShapingEnabled] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [shapingFile, setShapingFile] = useState(null);
  const [selectedPredefinedFormat, setSelectedPredefinedFormat] = useState(null);

  const showPanelizingWarning = useMemo(() => {
    const w = parseFloat(width);
    const h = parseFloat(height);
    const maxW = forexProduct.maxWidth || 122;
    const maxH = forexProduct.maxHeight || 244;
    return (w > maxW && w > maxH) || (h > maxW && h > maxH) || (w > maxW && h > maxH) || (w > maxH && h > maxW);
  }, [width, height, forexProduct.maxWidth, forexProduct.maxHeight]);

  const calculation = useMemo(() => {
    if (width < 10 || height < 10) return { pricePerPanel: 0, total: 0 };

    let areaM2 = (width / 100) * (height / 100);
    if (areaM2 < 0.5) areaM2 = 0.5;

    const basePrice = forexProduct.basePrice * selectedThickness.priceMultiplier;
    const shapingCost = shapingEnabled ? areaM2 * 12 : 0;
    const pricePerPanel = areaM2 * basePrice + shapingCost;
    const total = pricePerPanel * quantity;

    return { pricePerPanel, total };
  }, [width, height, quantity, selectedThickness, shapingEnabled, forexProduct]);

  const { pricePerPanel, total } = calculation;

  const handleAddToCart = useCallback(() => {
    if (width < 10 || height < 10) {
      toast({ title: "Misure non valide", description: "La misura minima per lato è 10 cm.", variant: "destructive" });
      return;
    }
    if (!uploadedFile) {
      toast({ title: "File mancante", description: "Carica un file di stampa prima di aggiungere al carrello.", variant: "destructive" });
      return;
    }
    if (shapingEnabled && !shapingFile) {
      toast({ title: "File sagomatura mancante", description: "Carica il file vettoriale per la sagomatura.", variant: "destructive" });
      return;
    }

    const productForCart = {
      id: `${forexProduct.id}-${selectedThickness.value}-${width}x${height}-${Date.now()}`,
      name: `Forex® PVC ${selectedThickness.label}`,
      image: uploadedFile?.url || forexProduct.image,
      price: pricePerPanel,     // unit price
      type: 'rigid-media',
    };

    const itemDetails = {
      dimensions: `${width}cm x ${height}cm`,
      thickness: selectedThickness.label,
      shaping: shapingEnabled ? 'Sì' : 'No',

      // --- Drive refs for Apps Script move/copy ---
      kind: 'client-upload',
      driveFileId: uploadedFile?.driveFileId,
      driveLink: uploadedFile?.driveLink,
      mimeType: uploadedFile?.mimeType,
      size: uploadedFile?.size,
      // include sagoma file if present
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

      // legacy UI fields
      fileName: uploadedFile?.name,
      fileUrl: uploadedFile?.url,
      shapingFileName: shapingFile ? shapingFile.name : null,
      shapingFileUrl: shapingFile ? shapingFile.url : null,
    };

    // 4-arg signature: product, quantity, extras, details
    addToCart(productForCart, quantity, [], itemDetails);
  }, [addToCart, width, height, quantity, selectedThickness, shapingEnabled, uploadedFile, shapingFile, pricePerPanel, forexProduct]);

  const handleDesign = () => {
    if (width < 10 || height < 10) {
      toast({ title: "Misure non valide", description: "Imposta misure valide (min 10cm per lato).", variant: "destructive" });
      return;
    }
    const selectedExtras = [];
    if (shapingEnabled) {
      selectedExtras.push({ name: 'Sagomatura CNC', price: 12, unit: 'mq' });
    }

    const productData = {
      ...forexProduct,
      name: `Forex® PVC ${selectedThickness.label}`,
      price: pricePerPanel,
    };

    navigate(`/designer/forex`, { 
      state: { 
        designState: {
          product: productData,
          width, 
          height, 
          quantity, 
          extras: selectedExtras,
          selectedThickness,
          price: pricePerPanel,
        }
      }
    });
  };

  const handleDownloadTemplate = () => {
    if (width < 10 || height < 10) {
      toast({ title: "Misure non valide", description: "Imposta misure valide (min 10cm per lato) prima di scaricare il template.", variant: "destructive" });
      return;
    }
    generateLayoutPdf({
      type: 'rigid-media',
      width: width,
      height: height,
      productName: `Forex ${selectedThickness.label}`
    });
  };

  const handlePredefinedFormatSelect = (format) => {
    setWidth(format.width);
    setHeight(format.height);
    setSelectedPredefinedFormat(format.label);
  };

  const handleCustomSizes = () => {
    setSelectedPredefinedFormat(null);
  };

  const isDesigned = uploadedFile && uploadedFile.name.startsWith('design_');

  return (
    <>
      <Helmet>
        <title>Stampa su Forex PVC Personalizzato | Printora</title>
        <meta name="description" content="Stampa online su pannelli Forex® in PVC semiespanso. Leggero, resistente e versatile. Ideale per insegne, cartelli e allestimenti." />
      </Helmet>
      <div className="bg-slate-950">
        <div className="container mx-auto px-4 pt-16 pb-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-500">
              Stampa su Forex® PVC
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">{forexProduct.description}</p>
          </motion.div>
        </div>
      </div>

      <div className="py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <img loading="lazy" src={forexProduct.image} alt={forexProduct.imageAlt} className="rounded-2xl shadow-2xl w-full h-auto border-4 border-slate-800" />
              <div className="mt-8 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3">Caratteristiche Tecniche</h3>
                <ul className="space-y-2 text-gray-300">
                  {forexProduct.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-1 shrink-0 text-gray-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {forexProduct.secondImage && (
                <img loading="lazy" src={forexProduct.secondImage} alt={forexProduct.secondImageAlt} className="mt-8 rounded-2xl shadow-2xl w-full h-auto border-4 border-slate-800" />
              )}
            </motion.div>
            <div className="sticky top-24">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-700 shadow-2xl shadow-black/30">
                  <h2 className="text-3xl font-bold text-white mb-4">{forexProduct.name}</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white flex items-center gap-2 mb-3"><Settings2 className="text-gray-300"/> Configurazione</h4>
                      <div className="space-y-4">
                        <div>
                          <Label className="flex items-center gap-2 mb-2"><Layers className="text-gray-300"/>Spessore</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {forexProduct.thicknessOptions.map(opt => (
                              <Button
                                key={opt.value}
                                variant={selectedThickness.value === opt.value ? 'default' : 'outline'}
                                onClick={() => setSelectedThickness(opt)}
                                className="h-12 text-lg"
                              >
                                {opt.label}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6">
                          <h5 className="text-md font-semibold text-white mb-2">Scegli un formato predefinito</h5>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {forexProduct.predefinedFormats.map((format, index) => (
                              <Button
                                key={index}
                                variant={selectedPredefinedFormat === format.label ? 'default' : 'outline'}
                                onClick={() => handlePredefinedFormatSelect(format)}
                                className={cn(
                                  "justify-center text-center h-auto py-2",
                                  selectedPredefinedFormat === format.label ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-slate-700 hover:bg-slate-600 text-gray-200 border-slate-600"
                                )}
                              >
                                <span className="block text-sm font-bold">{format.label.split(' ')[0]}</span>
                                <span className="block text-xs opacity-80">{format.label.includes(' ') ? format.label.split(' ')[1] : `${format.width}x${format.height}cm`}</span>
                              </Button>
                            ))}
                            <Button
                              variant={selectedPredefinedFormat === null ? 'default' : 'outline'}
                              onClick={handleCustomSizes}
                              className={cn(
                                "justify-center text-center",
                                selectedPredefinedFormat === null ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-slate-700 hover:bg-slate-600 text-gray-200 border-slate-600"
                              )}
                            >
                              Misure Personalizzate
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <Label htmlFor="width">Larghezza (cm)</Label>
                            <Input id="width" type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} min="10" />
                          </div>
                          <div>
                            <Label htmlFor="height">Altezza (cm)</Label>
                            <Input id="height" type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} min="10" />
                          </div>
                        </div>
                        {showPanelizingWarning && (
                          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2 p-3 text-sm text-amber-300 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                            <p>{forexProduct.productionNote}</p>
                          </motion.div>
                        )}
                        <div className="mt-4 flex items-center justify-between bg-slate-800 p-3 rounded-lg">
                          <Label htmlFor="shaping" className="flex items-center gap-2">
                            <Scissors className="text-gray-300"/>
                            Sagomatura CNC (+€12/mq)
                          </Label>
                          <Switch id="shaping" checked={shapingEnabled} onCheckedChange={setShapingEnabled} />
                        </div>
                        {shapingEnabled && (
                          <FileUpload onFileSelect={setShapingFile} accept={{'image/svg+xml': ['.svg'], 'application/postscript': ['.ai', '.eps'], 'application/pdf': ['.pdf']}} label="Carica file sagoma vettoriale" />
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white">Prepara il tuo File</h4>
                      <FileUpload onFileSelect={setUploadedFile} initialFile={uploadedFile} />
                      <div className="relative my-2 flex items-center justify-center">
                        <div className="absolute w-full h-px bg-slate-700"></div><span className="relative bg-slate-900/50 px-2 text-sm text-slate-400">oppure</span>
                      </div>
                      <Button size="lg" variant={isDesigned ? 'default' : 'secondary'} className="w-full" onClick={handleDesign}>
                        {isDesigned ? <><CheckCircle className="w-5 h-5 mr-3 text-emerald-300"/>Grafica Pronta</> : <><Brush className="w-5 h-5 mr-3"/>Crea Grafica con Editor</>}
                      </Button>
                      <div className="text-center"><Button variant="link" onClick={handleDownloadTemplate} className="text-gray-300"><Download className="w-4 h-4 mr-2" />Scarica template</Button></div>
                    </div>

                    <div className="pt-4 border-t border-slate-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="quantity">Quantità:</Label>
                          <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="w-4 h-4" /></Button>
                          <span className="font-semibold w-10 text-center text-lg">{quantity}</span>
                          <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}><Plus className="w-4 h-4" /></Button>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-gray-300">€{total.toFixed(2)}</p>
                          <span className="text-xs text-gray-400 block">(IVA esclusa)</span>
                        </div>
                      </div>
                      <Button onClick={handleAddToCart} size="lg" className="w-full h-14 text-lg mt-4" variant="accent"><ThumbsUp className="w-5 h-5 mr-2" />Conferma e Aggiungi</Button>
                      <div className="flex items-center justify-center space-x-2 text-green-300 text-xs mt-2"><ShieldCheck size={16} />Verifica file professionale inclusa</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForexPage;
