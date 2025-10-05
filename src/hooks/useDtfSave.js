import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { dataURLToBlob } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

// Backend base URL (Vite env or default)
const BACKEND_BASE =
  (import.meta?.env && import.meta.env.VITE_BACKEND_URL) || 'http://localhost:5000';

/**
 * Upload a Blob/File to backend -> Google Drive (_staging).
 * Returns: { driveFileId, webViewLink, name, mimeType, size }
 */
async function uploadBlobToDrive({ blob, filename, mimeType }) {
  const file = new File([blob], filename, { type: mimeType || 'image/png' });
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${BACKEND_BASE}/api/files/upload`, {
    method: 'POST',
    body: form,
  });
  const json = await res.json();

  if (!res.ok || !json?.ok) {
    throw new Error(json?.error || 'Upload failed');
  }

  return {
    driveFileId: json.driveFileId,
    webViewLink: json.webViewLink,
    name: json.name,
    mimeType: json.mimeType,
    size: json.size,
  };
}

const useDtfSave = ({ fabricCanvasRefs, designState, hasFluo }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [finalDesignUrls, setFinalDesignUrls] = useState([]);

  const cartHook = useCart();
  const navigate = useNavigate();

  // Generate previews for UI (72 dpi)
  const generatePreviews = useCallback(
    async (multiplier = 1) => {
      const urls = [];
      for (const canvas of fabricCanvasRefs.current) {
        if (canvas) {
          const dataUrl = canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier,
          });
          urls.push(dataUrl);
        }
      }
      return urls;
    },
    [fabricCanvasRefs]
  );

  const handleSaveInitiation = async () => {
    if (
      !fabricCanvasRefs.current ||
      fabricCanvasRefs.current.length === 0 ||
      fabricCanvasRefs.current.every((c) => c.getObjects().length === 0)
    ) {
      toast({
        title: 'Nessun design da salvare',
        description: 'Crea almeno un design prima di salvare.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const urls = await generatePreviews(); // 72 dpi previews for UI
      setFinalDesignUrls(urls);
      setIsConfirming(true);
    } catch (error) {
      console.error('Errore durante la generazione dell\'anteprima:', error);
      toast({
        title: 'Errore Anteprima',
        description: 'Impossibile generare l\'anteprima del design.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmSave = async () => {
    if (!cartHook || !designState) return;
    setIsConfirming(false);
    setIsSaving(true);

    try {
      // 1) Keep low-res previews for UI only
      const previewUrls = finalDesignUrls;

      // 2) Generate high-res (300 dpi equivalent) data URLs and convert to blobs
      const scale = 300 / 72; // ~4.1667x
      const highResDataUrls = await generatePreviews(scale);
      const highResBlobs = await Promise.all(
        highResDataUrls.map((dataURL) => dataURLToBlob(dataURL))
      );

      const { product } = designState;
      const itemsForCart = [];

      for (let i = 0; i < fabricCanvasRefs.current.length; i++) {
        const metersPerSheet = designState.height / 100;

        // Upload the high-res PNG for each “telo”
        const fileName = `dtf_telo_${i + 1}.png`;
        const uploadMeta = await uploadBlobToDrive({
          blob: highResBlobs[i],
          filename: fileName,
          mimeType: 'image/png',
        });
        // uploadMeta: { driveFileId, webViewLink, name, mimeType, size }

        // Build pricing/extras like before
        let currentExtras = designState.extras ? [...designState.extras] : [];
        const fluoExtra = product.extras?.find((e) => e.name?.includes('FLUO'));

        let basePricePerMeter = product.price;
        let pricePerSheet = basePricePerMeter * metersPerSheet;

        if (hasFluo && fluoExtra) {
          pricePerSheet += fluoExtra.price * metersPerSheet;
          if (!currentExtras.some((e) => e.name === fluoExtra.name)) {
            currentExtras.push(fluoExtra);
          }
        } else if (currentExtras.length) {
          currentExtras = currentExtras.filter((e) => !e.name?.includes('FLUO'));
        }

        // Keep a small preview for UI, but DO NOT store blobs in cart
        const itemDetails = {
          // UI preview only (data URL or can be replaced by a thumb later)
          previewUrl: previewUrls[i],

          // Drive references (used later by order + Make flow)
          driveFileId: uploadMeta.driveFileId,
          driveLink: uploadMeta.webViewLink,
          fileName: uploadMeta.name,
          mimeType: uploadMeta.mimeType,
          size: uploadMeta.size,

          // Context
          numeroTelo: i + 1,
          totaleTeli: fabricCanvasRefs.current.length,
          dimensioniTelo: `${designState.width}cm x ${designState.height}cm`,
          hasFluo: !!hasFluo,
        };

        itemsForCart.push({
          product: product,
          name: `${product.name} (Telo ${i + 1}/${fabricCanvasRefs.current.length})`,
          quantity: 1, // each sheet is one item
          extras: currentExtras,
          total: pricePerSheet,
          details: itemDetails,
        });
      }

      // 3) Add all to cart
      cartHook.addMultipleToCart(itemsForCart);

      toast({
        title: 'Design salvato!',
        description: `I tuoi ${fabricCanvasRefs.current.length} teli DTF sono stati caricati su Drive e aggiunti al carrello.`,
      });

      // 4) Go to shipping/checkout
      navigate('/spedizioni');
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
      toast({
        title: 'Errore nel salvataggio',
        description: error?.message || 'Si è verificato un problema. Riprova.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    isConfirming,
    setIsConfirming,
    finalDesignUrls,
    handleSaveInitiation,
    handleConfirmSave,
  };
};

export default useDtfSave;