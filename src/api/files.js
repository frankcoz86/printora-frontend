// Simple upload via XHR to get progress. Adjust BASE as needed.
const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export function uploadFile({ file, meta = {}, onProgress }) {
  return new Promise((resolve, reject) => {
    const url = `${BASE}/api/files/upload`;
    const form = new FormData();
    form.append('file', file);
    // you can append optional meta fields later if needed
    if (meta.productId) form.append('productId', meta.productId);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    xhr.upload.onprogress = (evt) => {
      if (evt.lengthComputable && typeof onProgress === 'function') {
        const pct = Math.round((evt.loaded / evt.total) * 100);
        onProgress(pct);
      }
    };
    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText);
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
}