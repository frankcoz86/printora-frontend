/**
 * UTM Parameter Tracking Utility
 * Captures and persists utm_source and utm_campaign across the user session
 */

const UTM_STORAGE_KEY = 'printora_utm_params';
const UTM_EXPIRY_KEY = 'printora_utm_expiry';
const UTM_EXPIRY_DAYS = 30; // UTM parameters expire after 30 days

/**
 * Extract UTM parameters from URL (only source and campaign)
 */
export function extractUTMFromURL() {
    const params = new URLSearchParams(window.location.search);
    const utmData = {};

    const source = params.get('utm_source');
    const campaign = params.get('utm_campaign');

    if (source) utmData.utm_source = source;
    if (campaign) utmData.utm_campaign = campaign;

    return Object.keys(utmData).length > 0 ? utmData : null;
}

/**
 * Save UTM parameters to localStorage with expiry
 */
export function saveUTMParams(utmData) {
    if (!utmData || Object.keys(utmData).length === 0) return;

    try {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + UTM_EXPIRY_DAYS);

        localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmData));
        localStorage.setItem(UTM_EXPIRY_KEY, expiryDate.toISOString());

        console.log('[UTM] Saved:', utmData);
    } catch (error) {
        console.error('[UTM] Failed to save:', error);
    }
}

/**
 * Get stored UTM parameters (if not expired)
 */
export function getStoredUTMParams() {
    try {
        const utmData = localStorage.getItem(UTM_STORAGE_KEY);
        const expiry = localStorage.getItem(UTM_EXPIRY_KEY);

        if (!utmData || !expiry) return null;

        // Check if expired
        const expiryDate = new Date(expiry);
        if (new Date() > expiryDate) {
            clearUTMParams();
            return null;
        }

        return JSON.parse(utmData);
    } catch (error) {
        console.error('[UTM] Failed to retrieve:', error);
        return null;
    }
}

/**
 * Clear stored UTM parameters
 */
export function clearUTMParams() {
    try {
        localStorage.removeItem(UTM_STORAGE_KEY);
        localStorage.removeItem(UTM_EXPIRY_KEY);
    } catch (error) {
        console.error('[UTM] Failed to clear:', error);
    }
}

/**
 * Get current UTM parameters (from URL or storage)
 * Priority: URL params > Stored params > null
 */
export function getCurrentUTMParams() {
    // First, check if there are new UTM params in the URL
    const urlUTM = extractUTMFromURL();
    if (urlUTM) {
        saveUTMParams(urlUTM);
        return urlUTM;
    }

    // Otherwise, return stored params
    return getStoredUTMParams();
}

/**
 * Get formatted UTM data for order submission
 */
export function getUTMDataForOrder() {
    const utmParams = getCurrentUTMParams();

    return {
        utm_source: utmParams?.utm_source || null,
        utm_campaign: utmParams?.utm_campaign || null
    };
}
