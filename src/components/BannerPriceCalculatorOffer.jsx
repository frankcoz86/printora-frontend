import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Info, Sparkles, Upload, BoxSelect, Plus, Minus, ThumbsUp, ShieldCheck, Download, Brush, Settings2, CheckCircle, AlertTriangle, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from '@/components/FileUpload';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { gtmPush } from '@/lib/gtm';

const presetSizes = [
  { label: '100x70 cm', width: 100, height: 70 },
  { label: '100x100 cm', width: 100, height: 100 },
  { label: '200x100 cm', width: 200, height: 100 },
  { label: '300x100 cm', width: 300, height: 100 },
  { label: '200x150 cm', width: 200, height: 150 },
  { label: '300x150 cm', width: 300, height: 150 },
  { label: '400x100 cm', width: 400, height: 100 },
  { label: '500x100 cm', width: 500, height: 100 },
];

const BOBBINS = [105, 160];
const MAX_HEIGHT_CONTINUOUS = 5000;
const SLEEVE_PRICE_PER_METER = 3.0;
const REINFORCEMENT_SUGGESTION_AREA_THRESHOLD = 2;

const BannerPriceCalculatorOffer = ({ product, onAddToCart }) => {
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [hasReinforcement, setHasReinforcement] = useState(false);
  const [hasEyelets, setHasEyelets] = useState(true);
  const [hasSleeve, setHasSleeve] = useState(false);
  const [sleeveSize, setSleeveSize] = useState(5);
  const [sleevePosition, setSleevePosition] = useState({
    top: false,
    bottom: false,
    left: false,
    right: false,
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const priceCalculation = useMemo(() => {
    if (width < 50 || height < 50) {
      return { singleBannerPrice: 0, totalPrice: 0, weldingInfo: '' };
    }

    const areaMq = (width / 100) * (height / 100);
    const basePricePerMq = 8.9;

    let singleBannerPrice = areaMq * basePricePerMq;

    if (hasReinforcement) {
      const perimeterM = ((width / 100) + (height / 100)) * 2;
      const reinforcementExtra = product.extras.find((e) => e.name.includes('Rinforzo'));
      if (reinforcementExtra) {
        singleBannerPrice += perimeterM * reinforcementExtra.price;
      }
    }

    if (hasSleeve) {
      let sleeveLength = 0;
      if (sleevePosition.top) sleeveLength += width / 100;
      if (sleevePosition.bottom) sleeveLength += width / 100;
      if (sleevePosition.left) sleeveLength += height / 100;
      if (sleevePosition.right) sleeveLength += height / 100;
      singleBannerPrice += sleeveLength * SLEEVE_PRICE_PER_METER;
    }

    const minDim = Math.min(width, height);
    const maxDim = Math.max(width, height);
    let weldingInfo = '';
    if (maxDim > MAX_HEIGHT_CONTINUOUS) {
      weldingInfo = `L'altezza massima è ${MAX_HEIGHT_CONTINUOUS / 100}m. Il banner verrà diviso.`;
    } else if (minDim > BOBBINS[1]) {
      weldingInfo = 'Il banner verrà stampato in più teli e termosaldato.';
    }

    return {
      singleBannerPrice,
      totalPrice: singleBannerPrice * quantity,
      weldingInfo,
    };
  }, [width, height, hasReinforcement, product, quantity, hasSleeve, sleevePosition]);

  const { totalPrice, weldingInfo, singleBannerPrice } = priceCalculation;

  const originalSinglePrice = singleBannerPrice * 2;
  const originalTotalPrice = totalPrice * 2;
  const savings = Math.max(0, originalTotalPrice - totalPrice);

  const showReinforcementSuggestion = useMemo(() => {
    const areaMq = (width / 100) * (height / 100);
    return areaMq > REINFORCEMENT_SUGGESTION_AREA_THRESHOLD && !hasReinforcement;
  }, [width, height, hasReinforcement]);

  useEffect(() => {
    if (location.state && location.state.fromDesigner && location.state.designFile) {
      const designFile = location.state.designFile;
      const designState = location.state.designState;
      setUploadedFile(designFile);

      if (designState) {
        setWidth(designState.width);
        setHeight(designState.height);
        setQuantity(designState.quantity);
        setHasReinforcement(designState.extras.some((e) => e.name.includes('Rinforzo')));
        setHasEyelets(designState.extras.some((e) => e.name.includes('Occhielli')));
        setHasSleeve(designState.extras.some((e) => e.name.includes('Asola')));
        if (designState.sleevePosition) {
          setSleevePosition(designState.sleevePosition);
        }
        if (designState.sleeveSize) {
          setSleeveSize(designState.sleeveSize);
        }
      }
      toast({
        title: 'Grafica pronta!',
        description: 'Il tuo design personalizzato è stato caricato. Puoi aggiungerlo al carrello.',
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleDesign = useCallback(() => {
    if (width < 50 || height < 50) {
      toast({
        title: 'Misure non valide',
        description: 'Imposta misure valide (min 50cm per lato).',
        variant: 'destructive',
      });
      return;
    }

    const selectedExtras = [];
    if (hasReinforcement) {
      const reinforcementExtra = product.extras.find((e) => e.name.includes('Rinforzo'));
      if (reinforcementExtra) selectedExtras.push(reinforcementExtra);
    }
    if (hasEyelets) {
      const eyeletsExtra = product.extras.find((e) => e.name.includes('Occhielli'));
      if (eyeletsExtra) selectedExtras.push(eyeletsExtra);
    }
    if (hasSleeve) {
      const sleeveSides = Object.entries(sleevePosition)
        .filter(([, value]) => value)
        .map(([key]) => key)
        .join(', ');
      if (sleeveSides) {
        selectedExtras.push({ name: `Asola (${sleeveSides}, ${sleeveSize} cm)`, price: 0 });
      }
    }

    try {
      gtmPush({
        event: 'editor_click',
        editor_product: 'banner',
        format: `${width}x${height} cm`,
        width_cm: width,
        height_cm: height,
      });
    } catch (e) {
      // ignore
    }

    navigate(`/designer/${product.type.toLowerCase()}`, {
      state: {
        designState: {
          product: product,
          width,
          height,
          quantity,
          extras: selectedExtras,
          sleevePosition: hasSleeve ? sleevePosition : null,
          sleeveSize: hasSleeve ? sleeveSize : null,
          singleBannerPrice,
          totalPrice,
        },
      },
    });
  }, [navigate, product, width, height, quantity, hasReinforcement, hasEyelets, hasSleeve, sleevePosition, sleeveSize, singleBannerPrice, totalPrice]);

  const handleDownloadStaticTemplate = useCallback(() => {
    window.open(
      'https://horizons-cdn.hostinger.com/fcf1aeaa-652d-41d1-a139-cd99c925f878/42627898b438ffc0256b26129a03dbfe.jpg',
      '_blank'
    );
  }, []);

  const handleAddToCart = useCallback(() => {
    if (width < 50 || height < 50) {
      toast({
        title: 'Misure non valide',
        description: 'La misura minima per lato è 50 cm.',
        variant: 'destructive',
      });
      return;
    }
    const hasFile = uploadedFile && (uploadedFile.driveFileId || uploadedFile.url || uploadedFile.name);
    if (!hasFile) {
      toast({
        title: 'Azione richiesta',
        description: "Carica un file di stampa o crea una grafica con l'editor prima di aggiungere al carrello.",
        variant: 'destructive',
      });
      return;
    }
    if (hasSleeve && !Object.values(sleevePosition).some((v) => v)) {
      toast({
        title: 'Selezione incompleta',
        description: "Seleziona almeno un lato per l'asola.",
        variant: 'destructive',
      });
      return;
    }

    const selectedExtras = [];
    if (hasReinforcement) {
      const reinforcementExtra = product.extras.find((e) => e.name.includes('Rinforzo'));
      if (reinforcementExtra) selectedExtras.push(reinforcementExtra);
    }
    if (hasEyelets) {
      const eyeletsExtra = product.extras.find((e) => e.name.includes('Occhielli'));
      if (eyeletsExtra) selectedExtras.push(eyeletsExtra);
    }
    if (hasSleeve) {
      const sleeveSides = Object.entries(sleevePosition)
        .filter(([, value]) => value)
        .map(([key]) => key)
        .join(', ');
      if (sleeveSides) {
        selectedExtras.push({ name: `Asola (${sleeveSides}, ${sleeveSize} cm)`, price: 0 });
      }
    }

    const productionNotesParts = [];
    if (hasEyelets) {
      const shorterSide = Math.min(width, height);
      productionNotesParts.push(
        `Aggiungere occhiello centrale sui lati corti (lato da ${shorterSide}cm).`
      );
    }

    const productForCart = {
      id: `${product.id}-${width}x${height}-${Date.now()}`,
      name: product.name,
      image: uploadedFile ? uploadedFile.url || product.image || '' : product.image || '',
      price: singleBannerPrice,
      type: 'banner',
      weight: product.weight || 1,
    };

    const itemDetails = {
      dimensions: `${width}cm x ${height}cm`,
      area: (width / 100) * (height / 100),
      weldingInfo,
      options:
        selectedExtras.length > 0
          ? selectedExtras.map((e) => e.name).join(', ')
          : 'Nessuna',
      productionNotes: productionNotesParts.join(' '),
      kind: 'client-upload',
      driveFileId: uploadedFile ? uploadedFile.driveFileId : undefined,
      driveLink: uploadedFile ? uploadedFile.driveLink : undefined,
      mimeType: uploadedFile ? uploadedFile.mimeType : undefined,
      size: uploadedFile ? uploadedFile.size : undefined,
      printFiles:
        uploadedFile && uploadedFile.driveFileId
          ? [
              {
                kind: 'client-upload',
                driveFileId: uploadedFile.driveFileId,
                fileName: uploadedFile.name,
                mimeType: uploadedFile.mimeType,
                size: uploadedFile.size,
              },
            ]
          : [],
      fileName: uploadedFile ? uploadedFile.name : undefined,
      fileUrl: uploadedFile ? uploadedFile.url : undefined,
    };

    onAddToCart({
      product: productForCart,
      quantity,
      extras: selectedExtras,
      total: totalPrice,
      details: itemDetails,
    });
  }, [
    product,
    onAddToCart,
    width,
    height,
    quantity,
    totalPrice,
    uploadedFile,
    hasReinforcement,
    hasEyelets,
    weldingInfo,
    singleBannerPrice,
    hasSleeve,
    sleevePosition,
    sleeveSize,
  ]);

  const handleContactSupport = useCallback(() => {
    const phoneNumber = '393792775116';
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }
  }, []);

  const applyPreset = useCallback((preset) => {
    setWidth(preset.width);
    setHeight(preset.height);
  }, []);

  const reinforcementExtra = product.extras.find((e) => e.name.includes('Rinforzo'));
  const isDesigned = uploadedFile && uploadedFile.name && uploadedFile.name.startsWith('design_');

  const handleSleevePositionChange = (position) => {
    setSleevePosition((prev) => ({ ...prev, [position]: !prev[position] }));
  };

  const handleSleeveSizeChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (Number.isNaN(value)) {
      setSleeveSize('');
      return;
    }
    if (value < 1) {
      setSleeveSize(1);
      return;
    }
    if (value > 10) {
      setSleeveSize(10);
      return;
    }
    setSleeveSize(value);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
          <Settings2 className="text-emerald-300" /> Configura il tuo Banner
        </h4>
        <div className="flex flex-wrap gap-2">
          {presetSizes.map((p) => (
            <Button
              key={p.label}
              variant="outline"
              size="sm"
              onClick={() => applyPreset(p)}
            >
              {p.label}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <Label htmlFor="width">Larghezza (cm)</Label>
            <Input
              id="width"
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min="50"
            />
          </div>
          <div>
            <Label htmlFor="height">Altezza (cm)</Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min="50"
              max={MAX_HEIGHT_CONTINUOUS}
            />
          </div>
        </div>
        {weldingInfo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start text-cyan-200 bg-cyan-900/50 p-3 rounded-lg border border-cyan-700 gap-2"
          >
            <Info size={20} className="mt-0.5 shrink-0" />
            <p className="text-xs font-medium">{weldingInfo}</p>
          </motion.div>
        )}
      </div>

      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <Label className="font-semibold text-base">Finiture Standard</Label>
          <p className="mt-2 text-xs text-slate-400">
            Occhielli metallici ogni 50 cm sono inclusi di serie per garantire un fissaggio
            professionale e uniforme, anche su grandi formati e in esterno.
          </p>
          <div className="space-y-3 mt-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-200">
                Occhielli metallici ogni 50cm (standard professionale, inclusi)
              </span>
              <Switch checked={hasEyelets} onCheckedChange={setHasEyelets} />
            </label>
            {reinforcementExtra && (
              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-200">
                    Rinforzo perimetrale professionale – consigliato per esterni, vento e grandi
                    dimensioni (+€{reinforcementExtra.price.toFixed(2)}/ml)
                  </span>
                  <Switch
                    checked={hasReinforcement}
                    onCheckedChange={setHasReinforcement}
                  />
                </label>
                <AnimatePresence>
                  {showReinforcementSuggestion && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 flex items-start gap-2 text-amber-300 bg-amber-900/40 p-2 rounded-md border border-amber-800"
                    >
                      <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                      <p className="text-xs font-medium">
                        Per queste dimensioni, consigliamo il rinforzo perimetrale per una maggiore
                        resistenza!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between">
            <Label className="font-semibold text-base">Finiture Speciali</Label>
          </div>
          <div className="mt-3 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-200">
                Asola per palo/asta (+€{SLEEVE_PRICE_PER_METER.toFixed(2)}/ml)
              </span>
              <Switch checked={hasSleeve} onCheckedChange={setHasSleeve} />
            </label>
            <AnimatePresence>
              {hasSleeve && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 pl-2 border-l-2 border-emerald-400 space-y-3">
                    <div>
                      <p className="text-xs text-slate-400 mb-2">
                        Seleziona su quali lati applicare l'asola:
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.keys(sleevePosition).map((pos) => (
                          <label
                            key={pos}
                            className="flex items-center space-x-2 text-sm cursor-pointer"
                          >
                            <Checkbox
                              id={`sleeve-${pos}`}
                              checked={sleevePosition[pos]}
                              onCheckedChange={() => handleSleevePositionChange(pos)}
                            />
                            <span className="capitalize">
                              {pos === 'top'
                                ? 'Alto'
                                : pos === 'bottom'
                                ? 'Basso'
                                : pos === 'left'
                                ? 'Sinistra'
                                : 'Destra'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="sleeveSize" className="text-xs text-slate-400">
                        Dimensione asola (1-10 cm)
                      </Label>
                      <Input
                        id="sleeveSize"
                        type="number"
                        value={sleeveSize}
                        onChange={handleSleeveSizeChange}
                        min="1"
                        max="10"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Prepara il tuo File</h4>
        <FileUpload onFileSelect={setUploadedFile} initialFile={uploadedFile} />
        <div className="relative my-2 flex items-center justify-center">
          <div className="absolute w-full h-px bg-slate-700" />
          <span className="relative bg-slate-900/50 px-2 text-sm text-slate-400">oppure</span>
        </div>
        <Button
          size="lg"
          variant={isDesigned ? 'default' : 'secondary'}
          className="w-full"
          onClick={handleDesign}
        >
          {isDesigned ? (
            <>
              <CheckCircle className="w-5 h-5 mr-3 text-emerald-300" /> Grafica Pronta
            </>
          ) : (
            <>
              <Brush className="w-5 h-5 mr-3" /> Crea Grafica con Editor
            </>
          )}
        </Button>
        <div className="text-center">
          <Button
            variant="link"
            onClick={handleDownloadStaticTemplate}
            className="text-emerald-300"
          >
            <Download className="w-4 h-4 mr-2" /> Scarica template
          </Button>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Label htmlFor="quantity">Quantità:</Label>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="font-semibold w-10 text-center text-lg">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-right">
            <div className="flex items-baseline justify-end gap-3 mb-2">
              {originalTotalPrice > 0 && (
                <span className="text-base md:text-lg font-semibold text-slate-200/90 line-through">
                  €{originalTotalPrice.toFixed(2)}
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-400/60 bg-emerald-500/15 text-[11px] font-semibold uppercase tracking-wide text-emerald-200">
                <Sparkles className="w-3 h-3" />
                -50% da questa pagina
              </span>
            </div>
            <p className="text-3xl font-extrabold text-emerald-300 mt-1">
              €{totalPrice.toFixed(2)}
            </p>
            <span className="text-xs text-gray-400 block">(IVA esclusa)</span>
            {savings > 0 && (
              <p className="mt-1 text-xs text-emerald-300">
                Risparmi €{savings.toFixed(2)} sul prezzo di listino.
              </p>
            )}
          </div>
        </div>
        <Button
          onClick={handleAddToCart}
          size="lg"
          className="w-full h-14 text-lg"
          variant="accent"
        >
          <ThumbsUp className="w-5 h-5 mr-2" /> Conferma e Aggiungi
        </Button>
        <Button
          onClick={handleContactSupport}
          size="lg"
          className="w-full h-14 text-lg mt-3"
          variant="accent"
        >
          <PhoneCall className="w-5 h-5 mr-2" />
          <span className="md:hidden">Hai bisogno di aiuto?</span>
          <span className="hidden md:inline">Hai bisogno di aiuto? WhatsApp</span>
        </Button>
        <div className="flex items-center justify-center space-x-2 text-green-300 text-xs">
          <ShieldCheck size={16} /> Verifica file professionale inclusa
        </div>
      </div>
    </div>
  );
};

export default BannerPriceCalculatorOffer;
