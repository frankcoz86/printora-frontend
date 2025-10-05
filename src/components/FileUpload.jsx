import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, File as FileIcon, X, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { pdfToImage } from '@/lib/utils';

/**
 * ENV NOTE:
 * If you have Vite, you can set VITE_BACKEND_URL in .env to override the default.
 * e.g., VITE_BACKEND_URL=http://localhost:5000
 */
const BACKEND_BASE =
  (import.meta?.env && import.meta.env.VITE_BACKEND_URL) || 'http://localhost:5000';

const FileUpload = ({
  onFileSelect,
  initialFile,
  accept,
  label = 'Carica il tuo file',
}) => {
  const [file, setFile] = useState(initialFile);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setFile(initialFile);
  }, [initialFile]);

  // Small helper: upload via XHR so we can show progress %
  const uploadToBackend = (theFile) =>
    new Promise((resolve, reject) => {
      const url = `${BACKEND_BASE}/api/files/upload`;
      const form = new FormData();
      form.append('file', theFile);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);

      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          const pct = Math.round((evt.loaded / evt.total) * 100);
          setProgress(pct);
        }
      };

      xhr.onload = () => {
        try {
          const json = JSON.parse(xhr.responseText || '{}');
          if (xhr.status >= 200 && xhr.status < 300 && json?.ok) {
            resolve(json); // { ok, driveFileId, webViewLink, name, mimeType, size }
          } else {
            reject(json?.error || 'Upload failed');
          }
        } catch (e) {
          reject(`Upload parse error: ${e?.message || e}`);
        }
      };

      xhr.onerror = () => reject('Network error during upload');
      xhr.send(form);
    });

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!acceptedFiles.length) return;

      const selectedFile = acceptedFiles[0];

      // Optional: client-side quick allowlist to match server
      const allowed = ['pdf', 'tif', 'tiff', 'png', 'jpg', 'jpeg', 'ai', 'cdr'];
      const ext = selectedFile.name.split('.').pop()?.toLowerCase() || '';
      if (!allowed.includes(ext)) {
        toast({
          title: 'Formato non supportato',
          description: `.${ext} non è consentito. Formati ammessi: ${allowed.join(', ')}`,
          variant: 'destructive',
        });
        return;
      }

      setIsUploading(true);
      setProgress(0);

      try {
        // Build a preview for UI (kept client-side only)
        let previewUrl;
        if (selectedFile.type === 'application/pdf') {
          previewUrl = await pdfToImage(selectedFile);
        } else if (selectedFile.type.startsWith('image/')) {
          previewUrl = URL.createObjectURL(selectedFile);
        }

        // 1) Upload immediately to backend → Drive (_staging)
        const res = await uploadToBackend(selectedFile);
        // res = { ok, driveFileId, webViewLink, name, mimeType, size }

        // 2) Create the object we keep in UI + pass up
        const uploadedFileObject = {
          name: selectedFile.name,
          size: selectedFile.size,
          url: previewUrl || null,     // preview only
          mimeType: selectedFile.type || res?.mimeType || '',
          // Drive refs from backend (use these later in orders/Make)
          driveFileId: res?.driveFileId,
          driveLink: res?.webViewLink,
        };

        setFile(uploadedFileObject);

        // 3) Bubble up to parent so it can store on the cart item
        if (onFileSelect) {
          onFileSelect(uploadedFileObject);
        }

        toast({
          title: 'File caricato',
          description: `${selectedFile.name} è stato caricato correttamente.`,
        });
      } catch (error) {
        console.error('Error uploading file:', error);
        toast({
          title: 'Errore di upload',
          description: String(error || 'Non è stato possibile caricare il file.'),
          variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
        setProgress(0);
      }
    },
    [onFileSelect, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept:
      accept || {
        'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
        'application/pdf': ['.pdf'],
        'application/postscript': ['.ai', '.eps'],
        'application/zip': ['.zip', '.rar'], // server will still enforce allowlist
      },
  });

  const removeFile = (e) => {
    e.stopPropagation();
    if (file && file.url && file.url.startsWith('blob:')) {
      URL.revokeObjectURL(file.url);
    }
    setFile(null);
    if (onFileSelect) onFileSelect(null);
  };

  return (
    <div
      {...getRootProps()}
      className={`w-full p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-300
      ${isDragActive ? 'border-primary bg-primary/10' : 'border-slate-600 hover:border-primary/70 bg-slate-800/50'}`}
    >
      <input {...getInputProps()} />
      <AnimatePresence mode="wait">
        {isUploading ? (
          <motion.div
            key="uploading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center space-y-2 text-slate-300"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm font-semibold">Caricamento… {progress}%</p>
          </motion.div>
        ) : file ? (
          <motion.div
            key="file"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-3 text-left">
              {file.url ? (
                <img
                  src={file.url}
                  alt="preview"
                  className="w-10 h-10 rounded object-contain bg-white"
                />
              ) : (
                <FileIcon className="w-6 h-6 text-primary" />
              )}
              <div>
                <p className="text-sm font-semibold text-white truncate max-w-[200px]">
                  {file.name}
                </p>
                <p className="text-xs text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-1 rounded-full hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center space-y-2 text-slate-400"
          >
            <UploadCloud className="w-8 h-8" />
            <p className="text-sm font-semibold">{label}</p>
            <p className="text-xs">
              {isDragActive ? 'Rilascia il file qui' : 'Trascina un file o clicca per selezionare'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;
