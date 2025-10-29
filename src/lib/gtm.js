// /frontend/src/lib/gtm.js
export function gtmPush(obj) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(obj);
  } catch (e) {
    // swallow
  }
}
