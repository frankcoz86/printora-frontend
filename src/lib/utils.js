import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as PDFLib from 'pdf-lib';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const dataURLToBlob = (dataurl) => {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
};

export const pdfToImage = async (file) => {
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onload = async (e) => {
      try {
        const pdfDoc = await PDFLib.PDFDocument.load(e.target.result);
        const page = pdfDoc.getPage(0);
        
        // This is a simplified representation. For actual rendering, you'd need a library
        // like pdf.js to render the page to a canvas and then get a data URL.
        // For now, we'll return a placeholder or just resolve.
        // Let's simulate creating a canvas and drawing on it.
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 150;
        canvas.height = 150;
        context.fillStyle = 'white';
        context.fillRect(0, 0, 150, 150);
        context.fillStyle = 'black';
        context.font = '16px Arial';
        context.fillText('PDF', 60, 80);
        resolve(canvas.toDataURL());

      } catch (error) {
        console.error("Error loading PDF for preview", error);
        reject(error);
      }
    };
    fileReader.onerror = reject;
    fileReader.readAsArrayBuffer(file);
  });
};