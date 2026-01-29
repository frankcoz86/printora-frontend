import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import {
  Info,
  Sparkles,
  Plus,
  Minus,
  ThumbsUp,
  ShieldCheck,
  Download,
  Brush,
  AlertTriangle,
  PhoneCall,
} from 'lucide-react';
import { motion } from 'framer-motion';
import FileUpload from '@/components/FileUpload';
import { generateLayoutPdf } from '@/lib/pdfGenerator';

const DtfPriceCalculatorOffer = ({ product, onAddToCart }) => {
  const [length, setLength] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [hasFluo, setHasFluo] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const navigate = useNavigate();

  const fixedWidth = 56;

  useEffect(() => {
    const calculatePrice = () => {
      let finalPrice = 0;
      if (length >= 50) {
        const meters = length / 100;
        let unitPrice = meters * product.price;
        if (hasFluo) {
          const fluoExtra = product.extras.find((e) => e.name.includes('FLUO'));
          if (fluoExtra) {
            unitPrice += meters * fluoExtra.price;
          }
        }
        finalPrice = unitPrice * quantity;
      }
      setTotalPrice(finalPrice);
    };

    calculatePrice();
  }, [length, hasFluo, product, quantity]);

  const originalTotalPrice = totalPrice * 2;
  const savings = Math.max(0, originalTotalPrice - totalPrice);

  const handleDownloadTemplate = () => {
    if (length < 50) {
      toast({ title: "Misure non valide", description: "Imposta una lunghezza valida prima di scaricare il template.", variant: "destructive" });
      return;
    }
    generateLayoutPdf({
      type: 'dtf',
      width: fixedWidth,
      height: length,
      productName: `DTF ${fixedWidth}x${length}cm`
    });
  };

  const handleAddToCart = () => {
    if (length < 50) {
      toast({
        title: 'Misure non valide',
        description: 'La lunghezza minima è 50 cm.',
        variant: 'destructive',
      });
      return;
    }
    const hasFile = uploadedFile && (uploadedFile.driveFileId || uploadedFile.url || uploadedFile.name);
    if (!hasFile) {
      toast({
        title: 'File mancante',
        description: 'Per favore, carica il file di stampa prima di aggiungerlo al carrello.',
        variant: 'destructive',
      });
      return;
    }

    const meters = length / 100;
    let unitPrice = meters * product.price;
    let extras = [];
    if (hasFluo) {
      const fluoExtra = product.extras.find((e) => e.name.includes('FLUO'));
      if (fluoExtra) {
        unitPrice += meters * fluoExtra.price;
        extras = [fluoExtra];
      }
    }

    const cartProduct = {
      ...product,
      id: `${product.id}-${fixedWidth}x${length}`,
      name: `${product.name} ${fixedWidth}x${length}cm`,
      price: unitPrice,
      image: uploadedFile?.url || product.image,
    };

    const itemDetails = {
      description: `Dimensioni: ${fixedWidth}cm x ${length}cm`,
      meters,

      // Drive refs + normalized print files
      kind: 'client-upload',
      driveFileId: uploadedFile?.driveFileId,
      driveLink: uploadedFile?.driveLink,
      mimeType: uploadedFile?.mimeType,
      size: uploadedFile?.size,
      printFiles: [
        uploadedFile?.driveFileId
          ? {
            kind: 'client-upload',
            driveFileId: uploadedFile.driveFileId,
            fileName: uploadedFile.name,
            mimeType: uploadedFile.mimeType,
            size: uploadedFile.size,
          }
          : null,
      ].filter(Boolean),

      // legacy UI
      fileName: uploadedFile?.name,
      fileUrl: uploadedFile?.url,
    };

    onAddToCart({
      product: cartProduct,
      quantity,
      extras,
      total: totalPrice,
      details: itemDetails,
    });
  };

  const handleContactSupport = () => {
    const phoneNumber = '393792775116';

    if (typeof window === 'undefined') {
      return;
    }

    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDesign = () => {
    if (length < 50) {
      toast({
        title: 'Misure non valide',
        description: 'La lunghezza minima è 50 cm.',
        variant: 'destructive',
      });
      return;
    }
    const designState = {
      product: product,
      width: fixedWidth,
      height: length,
      quantity: quantity,
      extras: hasFluo ? product.extras.filter((e) => e.name.includes('FLUO')) : [],
      total: totalPrice,
    };
    navigate('/dtf-designer', { state: { designState } });
  };

  return (
    <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl shadow-black/30">
      <div className="space-y-4">
        <h3 className="text-3xl font-bold text-white">{product.name}</h3>
        <p className="text-gray-300">{product.description}</p>
      </div>

      <div className="space-y-4 pt-8 border-t border-fuchsia-300/20 mt-8">
        <h4 className="text-lg font-semibold text-white">Configura la tua Stampa DTF</h4>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="width" className="text-sm font-medium text-gray-300">
              Larghezza Bobina (fissa)
            </label>
            <Input
              id="width"
              type="number"
              value={fixedWidth}
              disabled
              className="bg-slate-800 border-slate-600 text-gray-400 mt-1"
            />
          </div>
          <div>
            <label htmlFor="length" className="text-sm font-medium text-gray-300">
              Lunghezza (cm)
            </label>
            <Input
              id="length"
              type="number"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="bg-slate-800 border-slate-600 text-white mt-1 focus:ring-2 focus:ring-fuchsia-400 focus:border-fuchsia-400"
              min="50"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start space-x-2 text-cyan-200 bg-cyan-900/50 p-3 rounded-lg border border-cyan-700"
        >
          <Info size={20} className="mt-0.5 shrink-0" />
          <p className="text-xs font-medium">
            Stampa su bobina di larghezza 56cm. Il file dovrà avere questa larghezza, mentre la
            lunghezza è personalizzabile.
          </p>
        </motion.div>

        <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg">
          <label className="flex items-center space-x-3 cursor-pointer">
            <Switch id="fluo-switch" checked={hasFluo} onCheckedChange={setHasFluo} />
            <Sparkles className="w-5 h-5 text-fuchsia-400" />
            <span className="text-sm font-semibold text-white">
              Sì, voglio un impatto SHOCK con i colori FLUO!
            </span>
          </label>
          <span className="text-sm text-fuchsia-300 font-semibold">+€{product.extras[0].price.toFixed(2)} / ml</span>
        </div>

        <div className="grid grid-cols-1 gap-3 pt-2">
          <Button
            variant="outline"
            onClick={handleDesign}
            className="w-full bg-cyan-800/50 border-cyan-600 hover:bg-cyan-700/70 hover:border-cyan-500 text-white cursor-pointer h-12 text-md"
          >
            <Brush className="w-5 h-5 mr-2" />
            <span>Crea la Tua Grafica</span>
          </Button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-600"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs">OPPURE</span>
            <div className="flex-grow border-t border-slate-600"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FileUpload onFileSelect={setUploadedFile} label="Carica il tuo file" />
            <Button
              variant="outline"
              onClick={handleDownloadTemplate}
              className="w-full bg-slate-800/50 border-slate-600 hover:bg-slate-700/70 hover:border-fuchsia-500 cursor-pointer h-12"
            >
              <Download className="w-4 h-4 mr-2" />
              <span>Scarica Template</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 text-green-300 bg-green-900/30 p-2 rounded-lg mt-2">
          <ShieldCheck size={16} />
          <p className="text-xs font-medium">Verifica file professionale OMAGGIO</p>
        </div>

        <div className="flex items-center justify-center space-x-2 text-amber-300 bg-amber-900/30 p-2 rounded-lg mt-2">
          <AlertTriangle size={16} />
          <p className="text-xs font-medium">
            Assicurati che il file caricato non contenga contenuti protetti da copyright
          </p>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="quantity" className="text-sm font-medium text-gray-300">
              Qtà:
            </label>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="h-10 w-10 border-slate-600 text-white hover:bg-slate-700"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-white font-semibold w-10 text-center text-lg">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
              className="h-10 w-10 border-slate-600 text-white hover:bg-slate-700"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div key={`price-${totalPrice}-${savings}`} className="text-right">
            <div className="flex flex-col items-end gap-1 mb-2 md:flex-row md:items-center md:gap-3">
              {originalTotalPrice > 0 && (
                <span className="relative inline-flex items-center px-1.5 py-0.5 text-base md:text-lg font-semibold text-white/90">
                  <span className="relative z-10">€{originalTotalPrice.toFixed(2)}</span>
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="absolute w-full h-[2px] bg-cyan-300/70 -rotate-12" />
                  </span>
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-fuchsia-400/60 bg-fuchsia-500/15 text-[11px] font-semibold uppercase tracking-wide text-fuchsia-200">
                <Sparkles className="w-3 h-3" />
                -50% da questa pagina
              </span>
            </div>
            <p className="text-3xl font-extrabold text-fuchsia-300 mt-1">€{totalPrice.toFixed(2)}</p>
            <span className="text-xs text-gray-400 block">(IVA esclusa)</span>
            {savings > 0 && (
              <p className="mt-1 text-xs text-fuchsia-300">Risparmi €{savings.toFixed(2)} sul prezzo di listino.</p>
            )}
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          size="lg"
          className="w-full mt-4 h-14 text-lg bg-gradient-to-r from-fuchsia-500 to-purple-500 hover:from-fuchsia-600 hover:to-purple-600 text-white font-bold px-8 shadow-lg shadow-fuchsia-500/30 transform hover:scale-105 transition-transform duration-300"
        >
          <ThumbsUp className="w-5 h-5 mr-2" />
          Conferma e Aggiungi
        </Button>
        <Button
          onClick={handleContactSupport}
          size="lg"
          className="w-full mt-3 h-14 text-lg bg-gradient-to-r from-fuchsia-500 to-purple-500 hover:from-fuchsia-600 hover:to-purple-600 text-white font-bold px-8 shadow-lg shadow-fuchsia-500/30 transform hover:scale-105 transition-transform duration-300"
        >
          <PhoneCall className="w-5 h-5 mr-2" />
          <span className="md:hidden">Hai bisogno di aiuto?</span>
          <span className="hidden md:inline">Hai bisogno di aiuto? WhatsApp</span>
        </Button>
      </div>
    </div>
  );
};

export default DtfPriceCalculatorOffer;
