import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Info, Plus, Minus, ThumbsUp, ShieldCheck, Download, Brush, Settings2, CheckCircle, Eye, Wind, Scissors, Pocket, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import FileUpload from '@/components/FileUpload';
import { gtmPush } from '@/lib/gtm';

const presetSizes = [
  { label: '300x100 cm', width: 300, height: 100 },
  { label: '200x100 cm', width: 200, height: 100 },
  { label: '400x100 cm', width: 400, height: 100 },
  { label: '200x150 cm', width: 200, height: 150 },
  { label: '300x150 cm', width: 300, height: 150 },
  { label: '400x150 cm', width: 400, height: 150 },
];

const BOBBINS = [105, 160];
const MAX_HEIGHT_CONTINUOUS = 5000;

const BannerConfigurator = ({ product, onAddToCart }) => {
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [hasReinforcement, setHasReinforcement] = useState(false);
  const [hasEyelets, setHasEyelets] = useState(true);
  const [sleeveSides, setSleeveSides] = useState({ top: false, bottom: false, left: false, right: false });
  const [uploadedFile, setUploadedFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const priceCalculation = useMemo(() => {
    if (width < 50 || height < 50) return { singleBannerPrice: 0, totalPrice: 0, weldingInfo: '', productionNotes: '' };

    const areaMq = (width / 100) * (height / 100);
    const perimeterM = ((width / 100) + (height / 100)) * 2;
    const basePricePerMq = 8.90;
    
    let singleBannerPrice = areaMq * basePricePerMq;

    let productionNotes = [];
    if (!hasEyelets) {
      productionNotes.push("ATTENZIONE: Banner richiesto SENZA OCCHIELLI.");
    }

    if (hasReinforcement) {
      const reinforcementExtra = product.extras.find(e => e.name.includes('Rinforzo'));
      if (reinforcementExtra) {
        singleBannerPrice += perimeterM * reinforcementExtra.price;
      }
    }
    
    const sleeveExtra = product.extras.find(e => e.name.includes('Asola'));
    let sleeveNoteParts = [];
    let sleeveLengthM = 0;
    if (sleeveExtra) {
      if (sleeveSides.top) { sleeveLengthM += width / 100; sleeveNoteParts.push('superiore'); }
      if (sleeveSides.bottom) { sleeveLengthM += width / 100; sleeveNoteParts.push('inferiore'); }
      if (sleeveSides.left) { sleeveLengthM += height / 100; sleeveNoteParts.push('sinistro'); }
      if (sleeveSides.right) { sleeveLengthM += height / 100; sleeveNoteParts.push('destro'); }

      if (sleeveLengthM > 0) {
        singleBannerPrice += sleeveLengthM * sleeveExtra.price;
        productionNotes.push(`Realizzare asola su lato/i: ${sleeveNoteParts.join(', ')}.`);
      }
    }

    const minDim = Math.min(width, height);
    const maxDim = Math.max(width, height);
    let weldingInfo = '';
    if (maxDim > MAX_HEIGHT_CONTINUOUS) {
      weldingInfo = `L'altezza massima è ${MAX_HEIGHT_CONTINUOUS / 100}m. Il banner verrà diviso.`;
      productionNotes.push(`Banner diviso in sezioni causa altezza > ${MAX_HEIGHT_CONTINUOUS / 100}m.`);
    } else if (minDim > BOBBINS[1]) {
      weldingInfo = `Il banner verrà stampato in più teli e termosaldato.`;
      productionNotes.push(`Banner termosaldato (dimensione > ${BOBBINS[1]}cm).`);
    }

    return {
      singleBannerPrice,
      totalPrice: singleBannerPrice * quantity,
      weldingInfo,
      productionNotes: productionNotes.join(' '),
    };
  }, [width, height, hasReinforcement, hasEyelets, sleeveSides, product, quantity]);

  const { totalPrice, weldingInfo, productionNotes, singleBannerPrice } = priceCalculation;

  useEffect(() => {
    if (location.state?.fromDesigner && location.state?.designFile) {
      const { designFile, designState } = location.state;
      setUploadedFile(designFile);
      if (designState) {
        setWidth(designState.width);
        setHeight(designState.height);
        setQuantity(designState.quantity);
        setHasReinforcement(designState.extras.some(e => e.name.includes('Rinforzo')));
        setHasEyelets(designState.extras.some(e => e.name.includes('Occhielli')));
        if (designState.sleeveSides) {
          setSleeveSides(designState.sleeveSides);
        }
      }
      toast({
        title: "Grafica pronta!",
        description: "Il tuo design personalizzato è stato caricato. Puoi aggiungerlo al carrello.",
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleSleeveSideChange = (side) => {
    setSleeveSides(prev => ({ ...prev, [side]: !prev[side] }));
  };

  const handleDesign = useCallback(() => {
    if (width < 50 || height < 50) {
      toast({ title: "Misure non valide", description: "Imposta misure valide (min 50cm per lato).", variant: "destructive" });
      return;
    }
    const selectedExtras = [];
    if (hasReinforcement) {
      const reinforcementExtra = product.extras.find(e => e.name.includes('Rinforzo'));
      if (reinforcementExtra) selectedExtras.push(reinforcementExtra);
    }
    if (hasEyelets) {
      const eyeletsExtra = product.extras.find(e => e.name.includes('Occhielli'));
      if (eyeletsExtra) selectedExtras.push(eyeletsExtra);
    }
    const sleeveExtra = product.extras.find(e => e.name.includes('Asola'));
    if (sleeveExtra && Object.values(sleeveSides).some(s => s)) {
      selectedExtras.push(sleeveExtra);
    }

    try {
      gtmPush({
        event: 'editor_click',
        editor_product: 'banner-configurator',
        format: `${width}x${height}`,
        width_cm: width,
        height_cm: height,
      });
    } catch (e) {}

    navigate(`/designer/${product.type.toLowerCase()}`, {
      state: {
        designState: {
          product: product,
          width, height, quantity, extras: selectedExtras, sleeveSides
        }
      }
    });
  }, [navigate, product, width, height, quantity, hasReinforcement, hasEyelets, sleeveSides]);

  const handleDownloadStaticTemplate = useCallback(() => {
    window.open('https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/42627898b438ffc0256b26129a03dbfe.jpg', '_blank');
  }, []);

  const handleAddToCart = useCallback(() => {
    if (width < 50 || height < 50) {
      toast({ title: "Misure non valide", description: "La misura minima per lato è 50 cm.", variant: "destructive" });
      return;
    }
    const hasFile = uploadedFile && (uploadedFile.driveFileId || uploadedFile.url || uploadedFile.name);
    if (!hasFile) {
      toast({ title: "Azione richiesta", description: "Carica un file di stampa o crea una grafica con l'editor prima di aggiungere al carrello.", variant: "destructive" });
      return;
    }

    const selectedExtras = [];
    if (hasReinforcement) {
      const reinforcementExtra = product.extras.find(e => e.name.includes('Rinforzo'));
      if (reinforcementExtra) selectedExtras.push(reinforcementExtra);
    }
    if (hasEyelets) {
      const eyeletsExtra = product.extras.find(e => e.name.includes('Occhielli'));
      if (eyeletsExtra) selectedExtras.push(eyeletsExtra);
    }
    const sleeveExtra = product.extras.find(e => e.name.includes('Asola'));
    const hasSleeve = Object.values(sleeveSides).some(s => s);
    if (sleeveExtra && hasSleeve) {
      selectedExtras.push(sleeveExtra);
    }

    const productForCart = {
      id: `${product.id}-${width}x${height}`,
      name: product.name,
      image: uploadedFile?.url || product.images?.[0]?.src || product.image,
      price: singleBannerPrice,
      type: 'banner',
      weight: product.weight || 1,
    };

    const itemDetails = {
      dimensions: `${width}cm x ${height}cm`,
      area: (width / 100) * (height / 100),
      weldingInfo,
      productionNotes,
      options: selectedExtras.map(e => e.name).join(', ') || 'Nessuna',
      eyelets: hasEyelets,
      sleeveSides,
      reinforcement: hasReinforcement,

      // Drive refs + normalized print files
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
      ].filter(Boolean),

      // legacy UI convenience
      fileName: uploadedFile?.name,
      fileUrl: uploadedFile?.url,
    };

    onAddToCart({
      product: productForCart,
      quantity,
      extras: selectedExtras,
      total: totalPrice,
      details: itemDetails,
    });
  }, [
    product, onAddToCart, width, height, quantity, uploadedFile,
    hasReinforcement, hasEyelets, sleeveSides, weldingInfo,
    singleBannerPrice, productionNotes, totalPrice
  ]);

  const applyPreset = useCallback((preset) => {
    setWidth(preset.width);
    setHeight(preset.height);
  }, []);

  const reinforcementExtra = product.extras.find(e => e.name.includes('Rinforzo'));
  const sleeveExtra = product.extras.find(e => e.name.includes('Asola'));
  const isDesigned = uploadedFile && uploadedFile.name?.startsWith('design_');

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-white flex items-center gap-2"><Settings2 className="text-emerald-300"/> Configura il tuo Banner</h4>
        <div className="flex flex-wrap gap-2">
          {presetSizes.map(p => (
            <motion.button
              key={p.label}
              variant="outline"
              size="sm"
              onClick={() => applyPreset(p)}
              className="px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ease-in-out border bg-slate-800/60 text-gray-300 border-slate-700 hover:border-emerald-500 hover:text-emerald-300"
              whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(0,255,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              {p.label}
            </motion.button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <Label htmlFor="width">Larghezza (cm)</Label>
            <Input id="width" type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} min="50" className="bg-slate-700 border-slate-600"/>
          </div>
          <div>
            <Label htmlFor="height">Altezza (cm)</Label>
            <Input id="height" type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} min="50" max={MAX_HEIGHT_CONTINUOUS} className="bg-slate-700 border-slate-600"/>
          </div>
        </div>
        {weldingInfo && (
          <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} className="flex items-start text-cyan-200 bg-cyan-900/50 p-3 rounded-lg border border-cyan-700 gap-2">
            <Info size={20} className="mt-0.5 shrink-0" />
            <p className="text-xs font-medium">{weldingInfo}</p>
          </motion.div>
        )}
      </div>

      <div className="space-y-3 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <h4 className="text-lg font-semibold text-white flex items-center gap-2"><Wind className="text-blue-300"/> Finiture</h4>
        <div className="space-y-2">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-200 flex items-center gap-2"><Eye size={16}/>Occhielli metallici ogni 50cm (standard professionale, inclusi)</span>
            <input type="checkbox" checked={hasEyelets} onChange={() => setHasEyelets(p => !p)} className="w-4 h-4 text-emerald-400 rounded-sm focus:ring-emerald-400 bg-slate-700 border-slate-500" />
          </label>
          {!hasEyelets && (
            <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} className="flex items-start text-amber-200 bg-amber-900/50 p-3 rounded-lg border border-amber-700 gap-2">
              <Scissors size={20} className="mt-0.5 shrink-0" />
              <p className="text-xs font-medium">Il banner verrà fornito senza occhielli, solo tagliato a misura.</p>
            </motion.div>
          )}
          {reinforcementExtra && (
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-200">Rinforzo perimetrale professionale – consigliato per esterni, vento e grandi dimensioni (+€{reinforcementExtra.price.toFixed(2)}/ml)</span>
              <input type="checkbox" checked={hasReinforcement} onChange={() => setHasReinforcement(p => !p)} className="w-4 h-4 text-emerald-400 rounded-sm focus:ring-emerald-400 bg-slate-700 border-slate-500" />
            </label>
          )}
          {sleeveExtra && (
            <div className="space-y-2 pt-2">
              <span className="text-sm text-gray-200 flex items-center gap-2"><Pocket size={16}/>Asola per tubo/palo (+€{sleeveExtra.price.toFixed(2)}/ml)</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={sleeveSides.top} onChange={() => handleSleeveSideChange('top')} className="w-4 h-4 text-emerald-400 rounded-sm focus:ring-emerald-400 bg-slate-700 border-slate-500"/>
                  <ArrowUp size={14}/> Superiore
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={sleeveSides.bottom} onChange={() => handleSleeveSideChange('bottom')} className="w-4 h-4 text-emerald-400 rounded-sm focus:ring-emerald-400 bg-slate-700 border-slate-500"/>
                  <ArrowDown size={14}/> Inferiore
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={sleeveSides.left} onChange={() => handleSleeveSideChange('left')} className="w-4 h-4 text-emerald-400 rounded-sm focus:ring-emerald-400 bg-slate-700 border-slate-500"/>
                  <ArrowLeft size={14}/> Sinistro
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={sleeveSides.right} onChange={() => handleSleeveSideChange('right')} className="w-4 h-4 text-emerald-400 rounded-sm focus:ring-emerald-400 bg-slate-700 border-slate-500"/>
                  <ArrowRight size={14}/> Destro
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Prepara il tuo File</h4>
        <FileUpload onFileSelect={setUploadedFile} initialFile={uploadedFile} />
        <div className="relative my-2 flex items-center justify-center">
          <div className="absolute w-full h-px bg-slate-700"></div><span className="relative bg-slate-900/50 px-2 text-sm text-slate-400">oppure</span>
        </div>
        <Button size="lg" variant={isDesigned ? 'default' : 'secondary'} className="w-full" onClick={handleDesign}>
          {isDesigned ? <><CheckCircle className="w-5 h-5 mr-3 text-emerald-300"/>Grafica Pronta</> : <><Brush className="w-5 h-5 mr-3"/>Crea Grafica con Editor</>}
        </Button>
        <div className="text-center"><Button variant="link" onClick={handleDownloadStaticTemplate} className="text-emerald-300"><Download className="w-4 h-4 mr-2" />Scarica template</Button></div>
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
  );
};

export default BannerConfigurator;
