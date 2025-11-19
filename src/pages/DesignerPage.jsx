import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from '@/components/ui/use-toast';
import DesignerHeader from '@/components/designer/DesignerHeader';
import DesignerCanvas from '@/components/designer/DesignerCanvas';
import DesignerSidebar from '@/components/designer/DesignerSidebar';
import TemplateBrowser from '@/components/designer/TemplateBrowser';
import ClipartBrowser from '@/components/designer/ClipartBrowser';
import HelpModal from '@/components/designer/HelpModal';
import Loader from '@/components/Loader';
import { FONT_FAMILIES } from '@/components/designer/utils';
import { useCart } from '@/context/CartContext';
import { useDesignerCanvas } from '@/hooks/useDesignerCanvas';
import { fabric } from 'fabric';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

// ---------- helpers ----------
const BACKEND_BASE =
  (import.meta?.env && import.meta.env.VITE_BACKEND_URL) || 'http://localhost:5000';

function dataURLToBlob(dataURL) {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)[1] || 'application/octet-stream';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8 = new Uint8Array(n);
  while (n--) u8[n] = bstr.charCodeAt(n);
  return new Blob([u8], { type: mime });
}

async function uploadBlobToDrive({ blob, filename, mimeType }) {
  const form = new FormData();
  const file = new File([blob], filename, { type: mimeType });
  form.append('file', file);
  const res = await fetch(`${BACKEND_BASE}/api/files/upload`, { method: 'POST', body: form });
  const json = await res.json();
  if (!res.ok || !json?.ok) throw new Error(json?.error || 'Upload failed');
  return {
    driveFileId: json.driveFileId,
    driveLink: json.webViewLink,
    name: json.name,
    mimeType: json.mimeType,
    size: json.size,
  };
}
// ---------------------------------

const DesignerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { designState: initialDesignState } = location.state || {};

  const [designState, setDesignState] = useState(initialDesignState);
  const [isSaving, setIsSaving] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isClipartOpen, setIsClipartOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false);
  const [hasDownloadedPdf, setHasDownloadedPdf] = useState(false);

  useEffect(() => {
    if (!initialDesignState) {
      toast({
        title: "Configurazione Prodotto Mancante",
        description: "Per favore, torna indietro e configura un prodotto prima di accedere all'editor.",
        variant: "destructive",
      });
      navigate(-1);
    }
  }, [initialDesignState, navigate]);

  const {
    canvasRef,
    fabricCanvasRef,
    activeObject,
    isCanvasReady,
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
    addImage,
    addText,
    deleteActiveObject,
    addClipart,
    updateProperty,
    alignActiveObject,
    moveLayer,
    updateBackground,
    downloadAsPng,
    downloadAsPdf,
  } = useDesignerCanvas(designState);

  const handleDownloadPdfAndTrack = () => {
    downloadAsPdf();
    setHasDownloadedPdf(true);
    toast({
      title: "PDF Scaricato!",
      description: "Ora puoi salvare il tuo design e aggiungerlo al carrello.",
      variant: "default",
      className: "bg-green-700 border-green-600 text-white",
    });
  };

  const handleSaveInitiation = async () => {
    if (!hasDownloadedPdf) {
      toast({
        title: "Download PDF Obbligatorio",
        description:
          "Per favore, scarica un'anteprima PDF della tua grafica prima di salvare. Questo passaggio assicura che il risultato finale sia corretto.",
        variant: "destructive",
      });
      return;
    }
    setIsSaveConfirmOpen(true);
  };

  const handleSaveAndContinue = async () => {
    if (!designState || !fabricCanvasRef.current) return;

    setIsSaving(true);
    setIsSaveConfirmOpen(false);

    try {
      const canvas = fabricCanvasRef.current;

      // 1) hide guides/rulers if any
      const originalVisibilities = new Map();
      canvas.getObjects().forEach((obj) => {
        if (obj.guideType) {
          originalVisibilities.set(obj, obj.visible);
          obj.set('visible', false);
        }
      });
      canvas.renderAll();

      // 2) low-res preview for UI
      const previewUrl = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 1 });

      // 3) high-res export (~300 dpi)
      const scale = 300 / 72; // ~4.1667
      const dataUrl = canvas.toDataURL({ format: 'png', quality: 1, multiplier: scale });
      const highResBlob = dataURLToBlob(dataUrl);

      // restore guides
      originalVisibilities.forEach((visible, obj) => obj.set('visible', visible));
      canvas.renderAll();

      // 4) upload to Drive (staging)
      const fileName = `banner_${Date.now()}_300dpi.png`;
      const meta = await uploadBlobToDrive({
        blob: highResBlob,
        filename: fileName,
        mimeType: 'image/png',
      });
      // meta: { driveFileId, driveLink, name, mimeType, size }

      // 5) pricing
      const widthCm  = Number(designState?.width  ?? designState?.size?.width  ?? 0);
      const heightCm = Number(designState?.height ?? designState?.size?.height ?? 0);

      // For banners/rollups/rigid-media we usually charge €/m²
      const areaM2 = Math.max(0, (widthCm * heightCm) / 10000);
      const unitPricePerM2 = Number(designState?.product?.price ?? 0);

      // Extras: support both flat and per m²
      let extrasTotal = 0;
      (designState?.extras || []).forEach((ex) => {
        if (typeof ex?.pricePerM2 === 'number') {
          extrasTotal += ex.pricePerM2 * areaM2;
        } else if (typeof ex?.price === 'number') {
          extrasTotal += ex.price;
        }
      });

      const baseLine = unitPricePerM2 * areaM2;
      const linePrice = Math.max(0, baseLine + extrasTotal);

      const quantity = 1;
      const price = Number(linePrice.toFixed(2));             // unit price
      const total = Number((linePrice * quantity).toFixed(2)); // line total

      // 6) add to cart with Drive refs in details (set BOTH price & total)
      addToCart({
        product: designState.product,
        name: `${designState.product.name} ${widthCm}x${heightCm}cm`,
        quantity,
        extras: designState.extras || [],
        price,     // <- ensure this is set
        total,     // <- and this too
        details: {
          kind: 'editor-file',
          previewUrl,
          driveFileId: meta.driveFileId,
          driveLink: meta.driveLink,
          fileName: meta.name,
          mimeType: meta.mimeType,
          size: meta.size,
          dimensioni: `${widthCm}cm x ${heightCm}cm`,
          areaM2,
          unitPricePerM2,
          extrasTotal,
        },
      });

      toast({
        title: "Design salvato",
        description: "Il file di stampa è stato caricato su Drive e aggiunto al carrello.",
      });

      // 7) ensure cart state is committed, then navigate
      await Promise.resolve(); // tiny flush to avoid race conditions
      navigate('/carrello');   // or your actual cart route
    } catch (error) {
      console.error("Errore durante il salvataggio:", error);
      toast({
        title: "Errore nel salvataggio",
        description: "Impossibile salvare il design.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!designState) return <Loader />;

  const isBannerEditor =
    designState.product.type === 'banner' ||
    designState.product.type === 'rollup' ||
    designState.product.type === 'rigid-media';

  const handleAddText = (type) => {
    const color = isBannerEditor ? '#000000' : '#ffffff';
    addText(type, color);
  };

  const handleLoadTemplate = (template) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !template.objects) return;

    canvas.clear();
    updateBackground({ backgroundColor: '#ffffff' });

    const objects = template.objects(canvas);

    objects.forEach((objData) => {
      const { type, ...options } = objData;
      let fabricObject;
      switch (type) {
        case 'i-text':
          fabricObject = new fabric.IText(options.text || '', options);
          break;
        case 'textbox':
          fabricObject = new fabric.Textbox(options.text || '', options);
          break;
        case 'rect':
          fabricObject = new fabric.Rect(options);
          break;
        default:
          return;
      }
      canvas.add(fabricObject);
    });

    canvas.renderAll();
    saveState();
  };

  useEffect(() => {
    // Listen for sidebar close event (mobile only)
    const handler = () => setIsSidebarVisible(false);
    window.addEventListener('closeSidebar', handler);
    return () => window.removeEventListener('closeSidebar', handler);
  }, []);

  useEffect(() => {
    // Show sidebar when canvas becomes ready (mobile)
    if (isCanvasReady && !isSidebarVisible) setIsSidebarVisible(true);
    // Hide sidebar when preview mode is enabled (mobile)
    if (isPreviewMode && isSidebarVisible) setIsSidebarVisible(false);
  }, [isCanvasReady, isPreviewMode]);

  return (
    <>
      <Helmet>
        <title>Editor Grafico - {designState.product.name} | Printora</title>
        <meta
          name="description"
          content={`Crea la tua grafica personalizzata per ${designState.product.name} con il nostro editor avanzato.`}
        />
      </Helmet>
      <div className="flex flex-col h-screen bg-slate-800 text-white font-sans">
        {/* Mobile sidebar slider button */}
        {!isSidebarVisible && (
          <button
            type="button"
            className="fixed left-0 top-1/2 -translate-y-1/2 z-40 md:hidden flex items-center justify-center w-8 h-16 rounded-r-full bg-black/40 hover:bg-black/60 text-white focus:outline-none transition"
            aria-label="Apri strumenti"
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            onClick={() => setIsSidebarVisible(true)}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        )}
        <DesignerHeader
          designState={designState}
          onSave={handleSaveInitiation}
          isSaving={isSaving}
          onNavigateBack={() => navigate(-1)}
          onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
          isPreviewMode={isPreviewMode}
          onDownloadPng={downloadAsPng}
          onDownloadPdf={handleDownloadPdfAndTrack}
          onOpenHelp={() => setIsHelpOpen(true)}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          onDelete={deleteActiveObject}
          activeObject={activeObject}
        />
        <div className="flex-1 flex relative overflow-hidden">
          <DesignerSidebar
            onAddImage={addImage}
            onAddText={handleAddText}
            onOpenTemplates={() => setIsTemplatesOpen(true)}
            onOpenClipart={() => setIsClipartOpen(true)}
            activeObject={activeObject}
            canvasRef={fabricCanvasRef}
            updateProperty={updateProperty}
            alignActiveObject={alignActiveObject}
            moveLayer={moveLayer}
            updateBackground={updateBackground}
            fontFamilies={FONT_FAMILIES}
            isVisible={!isPreviewMode && isCanvasReady && isSidebarVisible}
          />
          <DesignerCanvas ref={canvasRef} fabricCanvas={fabricCanvasRef.current} isReady={isCanvasReady} />
        </div>
      </div>

      <TemplateBrowser
        isOpen={isTemplatesOpen}
        onOpenChange={setIsTemplatesOpen}
        onSelectTemplate={handleLoadTemplate}
        productType={designState.product.type}
        designState={designState}
      />

      <ClipartBrowser
        isOpen={isClipartOpen}
        onOpenChange={setIsClipartOpen}
        onSelectClipart={addClipart}
        isBannerEditor={isBannerEditor}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onOpenChange={setIsHelpOpen}
        productType={designState.product.type}
      />

      <Dialog open={isSaveConfirmOpen} onOpenChange={setIsSaveConfirmOpen}>
        <DialogContent className="sm:max-w-[500px] bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl text-yellow-300">
              <AlertTriangle className="w-8 h-8" /> Conferma Salvataggio Definitivo
            </DialogTitle>
            <DialogDescription className="text-slate-400 pt-2">
              Stai per salvare la tua grafica e aggiungerla al carrello. Questa azione è <strong>irreversibile</strong> e non potrai più modificare questo design. Sei sicuro di voler procedere?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsSaveConfirmOpen(false)}>
              <XCircle className="mr-2 h-4 w-4" /> Annulla
            </Button>
            <Button variant="accent" onClick={handleSaveAndContinue} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              {isSaving ? 'Salvataggio...' : 'Sì, Conferma e Salva'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DesignerPage;
