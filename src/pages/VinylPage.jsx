import React, { useState, useMemo, useCallback } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Settings2, Brush, CheckCircle, ThumbsUp, ShieldCheck, Plus, Minus, AlertTriangle, FileDown, Layers, PhoneCall } from 'lucide-react';
import { vinylProduct } from '@/data/vinylProduct';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import FileUpload from '@/components/FileUpload';
import { cn } from '@/lib/utils';
import { generateLayoutPdf } from '@/lib/pdfGenerator';
import Loader from '@/components/Loader';
import { gtmPush } from '@/lib/gtm';

const MAX_HEIGHT_CONTINUOUS = 5000; // 50 metri

const VinylPage = () => {
  const { cartHook } = useOutletContext();
  const navigate = useNavigate();

  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(70);
  const [quantity, setQuantity] = useState(1);
  const [selectedFinish, setSelectedFinish] = useState(vinylProduct.finishOptions[0]);
  const [selectedCut, setSelectedCut] = useState(vinylProduct.cutOptions[0]);
  const [selectedLamination, setSelectedLamination] = useState(vinylProduct.laminationOptions.types[0]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [cutFile, setCutFile] = useState(null);
  const [selectedPredefinedFormat, setSelectedPredefinedFormat] = useState(null);

  const isShapedCut = selectedCut?.value === 'Sagomato';
  const isLaminationDisabled = selectedFinish.value === 'calpestabile';

  const calculation = useMemo(() => {
    if (!selectedFinish || !selectedCut || width < 10 || height < 10) return { pricePerItem: 0, total: 0, panelizingInfo: '' };

    let areaM2 = (width / 100) * (height / 100);
    if (areaM2 < vinylProduct.minArea) areaM2 = vinylProduct.minArea;

    const finishPrice = areaM2 * selectedFinish.pricePerSqm;
    const laminationPrice = selectedLamination.value !== 'none' && !isLaminationDisabled ? areaM2 * vinylProduct.laminationOptions.pricePerSqm : 0;
    
    const priceBeforeCut = finishPrice + laminationPrice;
    const cutPrice = priceBeforeCut * (selectedCut.priceMultiplier - 1);

    const pricePerItem = priceBeforeCut + cutPrice;
    const total = pricePerItem * quantity;

    const maxRollWidth = selectedFinish.rollWidth;
    const minDim = Math.min(width, height);
    const maxDim = Math.max(width, height);
    let panelizingInfo = '';

    if (maxDim > MAX_HEIGHT_CONTINUOUS) {
      panelizingInfo = `L'altezza massima è ${MAX_HEIGHT_CONTINUOUS / 100}m. Il vinile verrà diviso.`;
    } else if (minDim > maxRollWidth) {
      panelizingInfo = `Il vinile verrà stampato in più teli e affiancato poiché la dimensione minore supera la larghezza massima della bobina (${maxRollWidth} cm).`;
    }

    return { pricePerItem, total, panelizingInfo };
  }, [width, height, quantity, selectedFinish, selectedCut, selectedLamination, isLaminationDisabled]);

  const { pricePerItem, total, panelizingInfo } = calculation;

  const handleAddToCart = useCallback(() => {
    const { addToCart } = cartHook;
    if (width < 10 || height < 10) {
      toast({ title: "Misure non valide", description: "La misura minima per lato è 10 cm.", variant: "destructive" });
      return;
    }
    if (!uploadedFile) {
      toast({ title: "File mancante", description: "Carica un file di stampa prima di aggiungere al carrello.", variant: "destructive" });
      return;
    }
    if (isShapedCut && !cutFile) {
      toast({ title: "File di taglio mancante", description: "Per il taglio sagomato, è necessario caricare un file vettoriale per il tracciato.", variant: "destructive" });
      return;
    }

    const laminationLabel = selectedLamination.value !== 'none' && !isLaminationDisabled ? ` con Laminazione ${selectedLamination.label}` : '';
    const productName = `Vinile ${selectedFinish.label}${laminationLabel} ${selectedCut.label}`;

    const productForCart = {
      id: `${vinylProduct.id}-${selectedFinish.value}-${selectedCut.value}-${selectedLamination.value}-${width}x${height}-${Date.now()}`,
      name: productName,
      image: uploadedFile?.url || vinylProduct.image,
      price: pricePerItem,
      type: 'vinyl',
    };

    const itemDetails = {
      dimensions: `${width}cm x ${height}cm`,
      finish: selectedFinish.label,
      lamination: selectedLamination.value !== 'none' && !isLaminationDisabled ? selectedLamination.label : 'Nessuna',
      cut: selectedCut.label,

      // --- Drive refs for Apps Script move/copy ---
      kind: 'client-upload',
      driveFileId: uploadedFile?.driveFileId,
      driveLink: uploadedFile?.driveLink,
      mimeType: uploadedFile?.mimeType,
      size: uploadedFile?.size,
      // optional second file (cut path) if it ever has a Drive ID
      printFiles: [
        uploadedFile?.driveFileId ? {
          kind: 'client-upload',
          driveFileId: uploadedFile.driveFileId,
          fileName: uploadedFile.name,
          mimeType: uploadedFile.mimeType,
          size: uploadedFile.size,
        } : null,
        cutFile?.driveFileId ? {
          kind: 'client-upload',
          driveFileId: cutFile.driveFileId,
          fileName: cutFile.name,
          mimeType: cutFile.mimeType,
          size: cutFile.size,
        } : null,
      ].filter(Boolean),

      // legacy UI fields
      fileName: uploadedFile?.name,
      fileUrl: uploadedFile?.url,
      cutFileName: cutFile ? cutFile.name : null,
      cutFileUrl: cutFile ? cutFile.url : null,

      panelizingInfo: panelizingInfo || null,
    };

    // 4-arg signature
    addToCart(productForCart, quantity, [], itemDetails);
  }, [cartHook, width, height, quantity, selectedFinish, selectedCut, selectedLamination, isShapedCut, uploadedFile, cutFile, pricePerItem, panelizingInfo, isLaminationDisabled]);

  const handleContactSupport = useCallback(() => {
    const phoneNumber = '393792775116';

    if (typeof window === 'undefined') {
      return;
    }

    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
  }, []);

  const handleDesign = () => {
    if (width < 10 || height < 10) {
      toast({ title: "Misure non valide", description: "Imposta misure valide (min 10cm per lato).", variant: "destructive" });
      return;
    }
    
    const extras = [];
    if (selectedLamination.value !== 'none' && !isLaminationDisabled) {
      extras.push({ name: `Laminazione ${selectedLamination.label}`, price: vinylProduct.laminationOptions.pricePerSqm, unit: 'mq' });
    }
    if (selectedCut.priceMultiplier > 1) {
      extras.push({ name: `Taglio ${selectedCut.label}`, price: 0, unit: `x${selectedCut.priceMultiplier}` });
    }

    const productData = {
      ...vinylProduct,
      name: `Vinile Adesivo ${selectedFinish.label}`,
      price: pricePerItem,
    };

    try {
      gtmPush({
        event: 'editor_click',
        editor_product: 'vinile-adesivo',
        finish: selectedFinish?.value,
        size_label: selectedPredefinedFormat?.label,
      });
    } catch (e) {}

    navigate(`/designer/vinyl`, { 
      state: { 
        designState: {
          product: productData,
          width, 
          height, 
          quantity, 
          extras,
          selectedFinish,
          selectedCut,
          selectedLamination,
          price: pricePerItem,
        }
      }
    });
  };

  const handleDownloadTemplate = () => {
    generateLayoutPdf({
      type: 'vinyl',
      width: width,
      height: height,
      productName: `Vinile ${selectedFinish.label}`,
      quantity: quantity,
      extras: [
        { name: `Finitura: ${selectedFinish.label}` },
        { name: `Laminazione: ${selectedLamination.value !== 'none' && !isLaminationDisabled ? selectedLamination.label : 'Nessuna'}` },
        { name: `Taglio: ${selectedCut.label}` }
      ]
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

  if (!vinylProduct || !selectedFinish || !selectedCut) {
    return <Loader />;
  }

  return (
    <>
      <Helmet>
        <title>Stampa Vinile Adesivo Personalizzato | Printora</title>
        <meta name="description" content="Stampa online di vinile adesivo personalizzato. Scegli dimensioni, finitura e taglio. Ideale per vetrine, automezzi e decorazioni." />
      </Helmet>
      <div className="bg-slate-950">
        <div className="container mx-auto px-4 pt-16 pb-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-500">
              Stampa su Vinile Adesivo
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">{vinylProduct.description}</p>
          </motion.div>
        </div>
      </div>

      <div className="py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <img loading="lazy" src={vinylProduct.image} alt={vinylProduct.imageAlt} className="rounded-2xl shadow-2xl w-full h-auto border-4 border-slate-800" />
              <div className="mt-8 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3">Caratteristiche Principali</h3>
                <ul className="space-y-2 text-gray-300">
                  {vinylProduct.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-1 shrink-0 text-gray-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {vinylProduct.secondImage && (
                <img loading="lazy" src={vinylProduct.secondImage} alt={vinylProduct.secondImageAlt} className="mt-8 rounded-2xl shadow-2xl w-full h-auto border-4 border-slate-800" />
              )}
            </motion.div>
            <div className="sticky top-24">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-700 shadow-2xl shadow-black/30">
                  <h2 className="text-3xl font-bold text-white mb-4">{vinylProduct.name}</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white flex items-center gap-2 mb-3"><Settings2 className="text-gray-300"/> Configura il tuo prodotto</h4>
                      <div className="space-y-4">
                        <div>
                          <Label className="mb-2 block">Finitura</Label>
                          <RadioGroup value={selectedFinish.value} onValueChange={(value) => setSelectedFinish(vinylProduct.finishOptions.find(o => o.value === value))} className="grid grid-cols-3 gap-2">
                            {vinylProduct.finishOptions.map(option => (
                              <div key={option.value}>
                                <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                                <Label htmlFor={option.value} className={cn(
                                  "flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors h-full",
                                  selectedFinish.value === option.value 
                                    ? "bg-blue-600 border-blue-500 text-white" 
                                    : "bg-slate-700 border-slate-600 text-gray-200 hover:bg-slate-600"
                                )}>
                                  <span className="block text-sm font-bold">{option.label}</span>
                                  <span className="block text-xs opacity-80">€{option.pricePerSqm.toFixed(2)}/mq</span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div>
                          <Label className="mb-2 block flex items-center gap-2"><Layers className="text-gray-300"/>Laminazione Protettiva (+€{vinylProduct.laminationOptions.pricePerSqm.toFixed(2)}/mq)</Label>
                          <RadioGroup 
                            value={isLaminationDisabled ? 'none' : selectedLamination.value} 
                            onValueChange={(value) => setSelectedLamination(vinylProduct.laminationOptions.types.find(o => o.value === value))} 
                            className="grid grid-cols-3 gap-2"
                            disabled={isLaminationDisabled}
                          >
                            {vinylProduct.laminationOptions.types.map(option => (
                              <div key={option.value}>
                                <RadioGroupItem value={option.value} id={`lamination-${option.value}`} className="sr-only" />
                                <Label htmlFor={`lamination-${option.value}`} className={cn(
                                  "flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors",
                                  isLaminationDisabled ? "cursor-not-allowed bg-slate-800 text-slate-500 border-slate-700" :
                                  (selectedLamination.value === option.value 
                                    ? "bg-blue-600 border-blue-500 text-white" 
                                    : "bg-slate-700 border-slate-600 text-gray-200 hover:bg-slate-600")
                                )}>
                                  <span className="text-sm font-bold">{option.label}</span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                          {isLaminationDisabled && <p className="text-xs text-slate-400 mt-1">La laminazione è già inclusa nella finitura calpestabile.</p>}
                        </div>

                        <div>
                          <Label className="mb-2 block">Tipo di taglio</Label>
                          <RadioGroup value={selectedCut.value} onValueChange={(value) => setSelectedCut(vinylProduct.cutOptions.find(o => o.value === value))} className="grid grid-cols-2 gap-2">
                            {vinylProduct.cutOptions.map(option => (
                              <div key={option.value}>
                                <RadioGroupItem value={option.value} id={`cut-${option.value}`} className="sr-only" />
                                <Label htmlFor={`cut-${option.value}`} className={cn(
                                  "flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors h-full",
                                  selectedCut.value === option.value 
                                    ? "bg-blue-600 border-blue-500 text-white" 
                                    : "bg-slate-700 border-slate-600 text-gray-200 hover:bg-slate-600"
                                )}>
                                  <span className="block text-sm font-bold">{option.label}</span>
                                  <span className="block text-xs opacity-80">{option.description}</span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div className="mt-6">
                          <h5 className="text-md font-semibold text-white mb-2">Scegli un formato predefinito</h5>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {vinylProduct.predefinedFormats.map((format, index) => (
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
                            <Input id="height" type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} min="10" max={MAX_HEIGHT_CONTINUOUS} />
                          </div>
                        </div>
                        {panelizingInfo && (
                          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2 p-3 text-sm text-amber-300 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                            <p>{panelizingInfo}</p>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white">Prepara il tuo File</h4>
                      <FileUpload onFileSelect={setUploadedFile} initialFile={uploadedFile} label="Carica il file di stampa" />
                      {isShapedCut && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 overflow-hidden"
                        >
                          <FileUpload onFileSelect={setCutFile} accept={{'image/svg+xml': ['.svg'], 'application/postscript': ['.ai', '.eps'], 'application/pdf': ['.pdf']}} label="Carica tracciato di taglio vettoriale" />
                        </motion.div>
                      )}
                      <div className="relative my-2 flex items-center justify-center">
                        <div className="absolute w-full h-px bg-slate-700"></div><span className="relative bg-slate-900/50 px-2 text-sm text-slate-400">oppure</span>
                      </div>
                      <Button size="lg" variant={isDesigned ? 'default' : 'secondary'} className="w-full" onClick={handleDesign}>
                        {isDesigned ? <><CheckCircle className="w-5 h-5 mr-3 text-emerald-300"/>Grafica Pronta</> : <><Brush className="w-5 h-5 mr-3"/>Crea Grafica con Editor</>}
                      </Button>
                      <div className="text-center">
                        <Button variant="link" onClick={handleDownloadTemplate} className="text-gray-300">
                          <FileDown className="w-4 h-4 mr-2" />Scarica Template
                        </Button>
                      </div>
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
                      <Button onClick={handleContactSupport} size="lg" className="w-full h-14 text-lg mt-3 whitespace-nowrap" variant="accent"><PhoneCall className="w-5 h-5 mr-2" />Hai bisogno di aiuto? WhatsApp</Button>
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

export default VinylPage;
