import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useOutletContext, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Info, Download, Brush, Settings2, ThumbsUp, ShieldCheck, Plus, Minus, Award, BoxSelect } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import FileUpload from '@/components/FileUpload';
import { products } from '@/data/products';
import { rigidMediaProducts } from '@/data/rigidMediaProducts';
import { generateLayoutPdf } from '@/lib/pdfGenerator';
import Loader from '@/components/Loader';

const Faq = lazy(() => import('@/components/Faq'));
const ImageScroller = lazy(() => import('@/components/ImageScroller'));

const MAX_WIDTH_PRINT = 300; // Example max width in cm for continuous print

const NewRigidMediaPage = () => {
  const { cartHook } = useOutletContext();
  const { addToCart } = cartHook;
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedMaterial, setSelectedMaterial] = useState(rigidMediaProducts[0]);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(70);
  const [thickness, setThickness] = useState(selectedMaterial.thicknessOptions[0].value);
  const [quantity, setQuantity] = useState(1);
  const [hasCncShaping, setHasCncShaping] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    if (selectedMaterial) {
      setThickness(selectedMaterial.thicknessOptions[0].value);
    }
  }, [selectedMaterial]);

  useEffect(() => {
    if (location.state?.fromDesigner && location.state?.designFile) {
      const { designFile, designState } = location.state;
      
      const newFile = new File([designFile.blob], designFile.name, { type: designFile.type });
      setUploadedFile(newFile);

      if (designState) {
        const materialFromState = rigidMediaProducts.find(m => m.id === designState.product.id);
        if (materialFromState) {
          setSelectedMaterial(materialFromState);
          setWidth(designState.width);
          setHeight(designState.height);
          setThickness(designState.thickness);
          setQuantity(designState.quantity);
          setHasCncShaping(designState.extras.some(e => e.name.includes('Sagomatura CNC')));
        }
      }
      toast({
        title: "Grafica pronta!",
        description: "Il tuo design personalizzato è stato caricato. Puoi aggiungerlo al carrello.",
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const priceCalculation = useCallback(() => {
    if (!selectedMaterial || width < 10 || height < 10) {
      return { singleProductPrice: 0, totalPrice: 0, warning: '' };
    }

    const areaMq = (width / 100) * (height / 100);
    const thicknessObj = selectedMaterial.thicknessOptions.find(opt => opt.value === thickness);

    if (!thicknessObj) {
      return { singleProductPrice: 0, totalPrice: 0, warning: 'Seleziona uno spessore valido.' };
    }

    const basePrice = selectedMaterial.basePrice * thicknessObj.priceMultiplier;

    let singleProductPrice = areaMq * basePrice;

    if (hasCncShaping) {
      const cncExtra = selectedMaterial.extras.find(e => e.name === 'Taglio sagomato'); // Assuming 'Taglio sagomato' corresponds to CNC shaping
      if (cncExtra) {
        // For 'linear' type extras (like sagomatura), price is per ml of perimeter
        const perimeterCm = (width + height) * 2;
        const perimeterMl = perimeterCm / 100;
        singleProductPrice += perimeterMl * cncExtra.price;
      }
    }

    let warning = '';
    if (width > MAX_WIDTH_PRINT || height > MAX_WIDTH_PRINT) {
      warning = `Dimensioni superiori a ${MAX_WIDTH_PRINT}cm. Il pannello verrà sezionato o saldato.`;
    } else if (areaMq < 0.5) { // Minimum billable area
      let minAreaPrice = 0.5 * basePrice;
      if (hasCncShaping) {
        const cncExtra = selectedMaterial.extras.find(e => e.name === 'Taglio sagomato');
        if (cncExtra) {
          const minPerimeterCm = (Math.sqrt(0.5 * 10000) + Math.sqrt(0.5 * 10000)) * 2; // Approx perimeter for 0.5 sqm square
          const minPerimeterMl = minPerimeterCm / 100;
          minAreaPrice += minPerimeterMl * cncExtra.price;
        }
      }
      singleProductPrice = minAreaPrice;
      warning = `La superficie minima fatturabile è 0.5 mq. Verrà applicato il costo minimo.`;
    }

    return {
      singleProductPrice,
      totalPrice: singleProductPrice * quantity,
      warning,
    };
  }, [selectedMaterial, width, height, thickness, quantity, hasCncShaping]);

  const { singleProductPrice, totalPrice, warning } = priceCalculation();

  const handleDesign = useCallback(() => {
    if (!selectedMaterial || width < 10 || height < 10) {
      toast({ title: "Misure non valide", description: "Imposta misure valide (min 10cm per lato).", variant: "destructive" });
      return;
    }
    const selectedExtras = [];
    if (hasCncShaping) {
      const cncExtra = selectedMaterial.extras.find(e => e.name.includes('Sagomatura CNC'));
      if (cncExtra) selectedExtras.push(cncExtra);
    }

    navigate('/designer', { state: { 
      designState: {
        product: {id: selectedMaterial.id, name: selectedMaterial.name}, // Pass minimal product info for designer
        width, height, thickness, quantity, extras: selectedExtras,
        productType: 'rigid-media'
      }
    }});
  }, [navigate, selectedMaterial, width, height, thickness, quantity, hasCncShaping]);

  const handleDownloadTemplate = useCallback(() => {
    if (width < 10 || height < 10) {
      toast({ title: "Misure non valide", description: "Imposta misure valide.", variant: "destructive" });
      return;
    }
    generateLayoutPdf({ type: selectedMaterial.type, width, height, productName: selectedMaterial.name });
  }, [selectedMaterial, width, height]);


  const handleAddToCart = useCallback(() => {
    if (width < 10 || height < 10) {
      toast({ title: "Misure non valide", description: "La misura minima per lato è 10 cm.", variant: "destructive" });
      return;
    }
    if (!uploadedFile) {
      toast({ title: "Azione richiesta", description: "Carica un file di stampa o crea una grafica con l'editor prima di aggiungere al carrello.", variant: "destructive" });
      return;
    }

    const selectedExtras = [];
    if (hasCncShaping) {
      const cncExtra = selectedMaterial.extras.find(e => e.name.includes('Sagomatura CNC'));
      if (cncExtra) selectedExtras.push(cncExtra);
    }

    const productForCart = {
      id: `${selectedMaterial.id}-${width}x${height}-${thickness}`,
      name: `${selectedMaterial.name} ${thickness}mm`,
      image: selectedMaterial.image,
      price: singleProductPrice, // unit price
      type: 'rigid-media',
      weight: selectedMaterial.weightPerSqmPerMm * thickness * ((width / 100) * (height / 100)), // Approximate weight for shipping
    };
    
    const itemDetails = {
      dimensions: `${width}cm x ${height}cm`,
      material: selectedMaterial.name,
      thickness: `${thickness}mm`,
      area: (width / 100) * (height / 100),

      // --- Drive refs for Apps Script move/copy ---
      kind: 'client-upload',
      driveFileId: uploadedFile?.driveFileId,
      driveLink: uploadedFile?.driveLink,
      mimeType: uploadedFile?.mimeType,
      size: uploadedFile?.size,

      // Also keep your display field
      file: uploadedFile ? uploadedFile.name : 'Nessun file caricato',
      options: selectedExtras.length > 0 ? selectedExtras.map(e => e.name).join(', ') : 'Nessuna',
      weight: productForCart.weight, // Pass exact weight to details
    };

    // 4-arg signature
    addToCart(productForCart, quantity, selectedExtras, itemDetails);
  }, [selectedMaterial, width, height, thickness, quantity, hasCncShaping, uploadedFile, singleProductPrice, addToCart]);

  const isDesigned = uploadedFile && uploadedFile.name.startsWith('design_');

  return (
    <>
      <Helmet>
        <title>Stampa Pannelli Rigidi Personalizzati | Printora</title>
        <meta name="description" content="Stampa online su pannelli rigidi come Forex, Plexiglass, Dibond e Polionda. Massima qualità per insegne, espositori e decorazioni." />
        <meta name="keywords" content="stampa pannelli rigidi, forex, plexiglass, dibond, polionda, stampa UV, insegne personalizzate, printora" />
      </Helmet>
      <div className="bg-slate-950 overflow-hidden">
        <div className="container mx-auto px-4 pt-16 pb-20 text-center relative">
          <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-cyan-300">
              Stampa su Supporti Rigidi
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
              Ideale per insegne, pannelli espositivi e decorazioni con la massima qualità e durata.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }} className="space-y-8">
              <img loading="lazy" src={selectedMaterial.image} alt={selectedMaterial.imageAlt} className="rounded-2xl shadow-2xl w-full h-auto border-4 border-slate-800" />
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3">Materiali di Alta Qualità</h3>
                <p className="text-gray-400">
                  Offriamo un'ampia gamma di materiali rigidi stampabili in alta definizione, perfetti per ogni esigenza espositiva e decorativa. Durata e resa cromatica eccellente garantite.
                </p>
              </div>
            </motion.div>
            <div className="sticky top-24">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }}>
                <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-700 shadow-2xl shadow-black/30">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-3xl font-bold text-white">{selectedMaterial.name}</h2>
                    <div className="flex items-center gap-2 bg-accent/90 text-accent-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg border border-orange-400/50 shrink-0">
                      <Award size={14}/>QUALITÀ PREMIUM
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6">{selectedMaterial.description}</p>
                  <ul className="space-y-2 text-sm text-gray-300 mb-6">
                    {selectedMaterial.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-1 shrink-0 text-emerald-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-white flex items-center gap-2"><Settings2 className="text-cyan-300"/> Scegli il Materiale</h4>
                      <div className="flex flex-wrap gap-3 justify-center">
                        {rigidMediaProducts.map(material => (
                          <motion.button
                            key={material.id}
                            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ease-in-out border ${selectedMaterial.id === material.id ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-transparent shadow-lg shadow-cyan-500/20' : 'bg-slate-800/60 text-gray-300 border-slate-700 hover:border-cyan-500 hover:text-cyan-300'}`}
                            onClick={() => setSelectedMaterial(material)}
                            whileHover={{ scale: 1.05, boxShadow: selectedMaterial.id !== material.id ? "0 0 10px rgba(0,255,255,0.3)" : undefined }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {material.name}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-white flex items-center gap-2"><Settings2 className="text-emerald-300"/> Configura il tuo Pannello</h4>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <Label htmlFor="width">Larghezza (cm)</Label>
                          <Input id="width" type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} min="10" />
                        </div>
                        <div>
                          <Label htmlFor="height">Altezza (cm)</Label>
                          <Input id="height" type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} min="10" />
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                        <Label htmlFor="thickness">Spessore (mm)</Label>
                        <select
                          id="thickness"
                          value={thickness}
                          onChange={(e) => setThickness(Number(e.target.value))}
                          className="w-full p-2 rounded-md bg-slate-800 border border-slate-700 text-white focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          {selectedMaterial.thicknessOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      {warning && (
                        <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} className="flex items-start text-orange-200 bg-orange-900/50 p-3 rounded-lg border border-orange-700 gap-2">
                          <Info size={20} className="mt-0.5 shrink-0" />
                          <p className="text-xs font-medium">{warning}</p>
                        </motion.div>
                      )}
                    </div>

                    {selectedMaterial.extras.some(e => e.name.includes('Taglio sagomato')) && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`p-4 rounded-xl border-2 ${hasCncShaping ? 'border-emerald-500 bg-emerald-900/20 shadow-lg shadow-emerald-500/10' : 'border-slate-700 bg-slate-800/50'}`}
                      >
                        <label htmlFor="cnc-shaping" className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-3">
                            <BoxSelect className={`w-6 h-6 ${hasCncShaping ? 'text-emerald-400' : 'text-gray-400'}`} />
                            <div>
                              <span className="text-lg font-semibold text-white">Sagomatura CNC</span>
                              <p className="text-sm text-gray-300">Taglio e fresatura su misura.</p>
                            </div>
                          </div>
                          <Switch
                            id="cnc-shaping"
                            checked={hasCncShaping}
                            onCheckedChange={setHasCncShaping}
                            className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-600"
                          />
                        </label>
                      </motion.div>
                    )}

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white">Prepara il tuo File</h4>
                      <FileUpload onFileSelect={setUploadedFile} initialFile={uploadedFile} />
                      <div className="relative my-2 flex items-center justify-center">
                        <div className="absolute w-full h-px bg-slate-700"></div><span className="relative bg-slate-900/50 px-2 text-sm text-slate-400">oppure</span>
                      </div>
                      <Button size="lg" variant={isDesigned ? 'default' : 'secondary'} className="w-full" onClick={handleDesign}>
                        {isDesigned ? <><CheckCircle className="w-5 h-5 mr-3 text-emerald-300"/>Grafica Pronta</> : <><Brush className="w-5 h-5 mr-3"/>Crea Grafica con Editor</>}
                      </Button>
                      <div className="text-center"><Button variant="link" onClick={handleDownloadTemplate} className="text-emerald-300"><Download className="w-4 h-4 mr-2" />Scarica template</Button></div>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-slate-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="quantity">Quantità:</Label>
                          <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="w-4 h-4" /></Button>
                          <span className="font-semibold w-10 text-center text-lg">{quantity}</span>
                          <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}><Plus className="w-4 h-4" /></Button>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-emerald-300">€{totalPrice.toFixed(2)}</p>
                          <span className="text-xs text-gray-400 block">(IVA esclusa)</span>
                        </div>
                      </div>
                      <Button onClick={handleAddToCart} size="lg" className="w-full h-14 text-lg" variant="accent"><ThumbsUp className="w-5 h-5 mr-2" />Conferma e Aggiungi</Button>
                      <div className="flex items-center justify-center space-x-2 text-green-300 text-xs"><ShieldCheck size={16} />Verifica file professionale inclusa</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      <Suspense fallback={<Loader />}>
        <ImageScroller />
        <Faq />
      </Suspense>
    </>
  );
};

export default NewRigidMediaPage;
