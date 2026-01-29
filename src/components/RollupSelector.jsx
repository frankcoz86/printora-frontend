import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Minus, Clock, ShieldCheck, ShoppingCart, Download, Brush, Settings2, Package, PhoneCall } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from '@/components/FileUpload';
import { gtmPush } from '@/lib/gtm';
import { generateLayoutPdf } from '@/lib/pdfGenerator';

const RollupSelector = ({ product, onAddToCart }) => {
  const [selectedFormat, setSelectedFormat] = useState(product.formats[0]);
  const [quantity, setQuantity] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const navigate = useNavigate();

  const handleDesign = useCallback(() => {
    const [width] = selectedFormat.label.split('x').map(dim => parseInt(dim.trim(), 10));
    try {
      gtmPush({
        event: 'editor_click',
        editor_product: 'rollup',
        variant: selectedFormat.name,
      });
    } catch (e) { }
    navigate(`/designer/${product.type.toLowerCase()}`, {
      state: {
        designState: {
          product: { ...product, name: `${product.name} ${selectedFormat.label}`, price: selectedFormat.promo_price },
          width, height: 210, quantity, extras: [], total: selectedFormat.promo_price * quantity
        }
      }
    });
  }, [navigate, product, selectedFormat, quantity]);

  const handleDownloadTemplate = useCallback(() => {
    const [width, height] = selectedFormat.label.split('x').map(dim => parseInt(dim.trim(), 10));
    generateLayoutPdf({
      type: 'rollup',
      width: width,
      height: height,
      productName: `Roll-up ${selectedFormat.label}`
    });
  }, [selectedFormat]);

  const handleAddToCart = useCallback(() => {
    if (selectedFormat.available === false) {
      toast({ title: "Prodotto non disponibile", description: "Questo formato sarà disponibile a breve." });
      return;
    }
    const hasFile = uploadedFile && (uploadedFile.driveFileId || uploadedFile.url || uploadedFile.name);
    if (!hasFile) {
      toast({ title: "Nessun file caricato", description: "Carica un file di stampa o crea una grafica.", variant: "destructive" });
      return;
    }

    const total = selectedFormat.promo_price * quantity;

    const productForCart = {
      ...product,
      id: `${product.id}-${selectedFormat.label}`,
      name: `${product.name} ${selectedFormat.label}`,
      price: selectedFormat.promo_price,
      image: uploadedFile?.url || product.image,
    };

    const itemDetails = {
      dimensions: selectedFormat.label,

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

      // legacy UI
      fileName: uploadedFile?.name,
      fileUrl: uploadedFile?.url,
    };

    onAddToCart({
      product: productForCart,
      quantity,
      extras: [],
      total,
      details: itemDetails,
    });
  }, [product, onAddToCart, selectedFormat, quantity, uploadedFile]);

  const handleContactSupport = useCallback(() => {
    const phoneNumber = '393792775116';

    if (typeof window === 'undefined') {
      return;
    }

    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-white flex items-center gap-2"><Package className="text-cyan-300" /> Scegli il formato</h4>
        <div className="grid grid-cols-2 gap-3">
          {product.formats.map(format => (
            <Button
              key={format.label} variant={selectedFormat.label === format.label ? 'default' : 'outline'}
              onClick={() => setSelectedFormat(format)}
              className={`w-full h-auto py-3 px-2 text-center transition-all duration-300 group ${selectedFormat.label === format.label ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 scale-105' : 'bg-slate-800/50 border-slate-600 hover:bg-slate-700/70 hover:border-cyan-500'}`}
            >
              <div className="flex flex-col items-center">
                <span className="font-bold text-base">{format.label}</span>
                <AnimatePresence>
                  {selectedFormat.label === format.label && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-xs font-normal">
                      PROMO €{format.promo_price.toFixed(2)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Button>
          ))}
        </div>
        {!selectedFormat.available && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-amber-300 bg-amber-900/50 p-3 rounded-lg border border-amber-700">
            <Clock size={18} className="shrink-0" /><p className="text-xs font-medium">Novità! Questo formato sarà disponibile a breve.</p>
          </motion.div>
        )}
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white flex items-center gap-2"><Settings2 className="text-cyan-300" /> Prepara il file</h4>
        <FileUpload onFileSelect={setUploadedFile} />
        <div className="relative my-2 flex items-center justify-center"><div className="absolute w-full h-px bg-slate-700"></div><span className="relative bg-slate-900/50 px-2 text-sm text-slate-400">oppure</span></div>
        <Button size="lg" variant="secondary" className="w-full" onClick={handleDesign}><Brush className="w-5 h-5 mr-3" />Crea Grafica con Editor</Button>
        <div className="text-center"><Button variant="link" onClick={handleDownloadTemplate} className="text-cyan-300"><Download className="w-4 h-4 mr-2" />Scarica template (85x210cm)</Button></div>
      </div>

      <div className="pt-4 border-t border-slate-700 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold text-white">Quantità</Label>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={!selectedFormat.available}><Minus className="w-4 h-4" /></Button>
            <span className="font-semibold w-10 text-center text-lg">{quantity}</span>
            <Button variant="outline" size="icon" onClick={() => setQuantity(q => q + 1)} disabled={!selectedFormat.available}><Plus className="w-4 h-4" /></Button>
          </div>
        </div>

        <div key={`price-${selectedFormat.promo_price * quantity}`} className="text-right bg-slate-800/30 p-3 rounded-lg">
          <p className="text-sm text-rose-300">Listino: <span className="line-through">€{(selectedFormat.list_price * quantity).toFixed(2)}</span></p>
          <p className="text-3xl font-bold text-cyan-300">€{(selectedFormat.promo_price * quantity).toFixed(2)}</p>
        </div>

        <Button
          onClick={handleAddToCart} size="lg" className="w-full h-14 text-lg" variant="accent"
          disabled={!selectedFormat.available}
        >
          <ShoppingCart className="w-6 h-6 mr-3" />Aggiungi al Carrello
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
        <div className="flex items-center justify-center space-x-2 text-green-300 text-xs"><ShieldCheck size={16} />Verifica file professionale inclusa</div>
      </div>
    </div>
  );
};

export default RollupSelector;
