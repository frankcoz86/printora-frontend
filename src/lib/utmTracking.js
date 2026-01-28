/**
 * UTM Parameter Tracking Utility
 * 
 * Captures UTM parameters from URL and persists them throughout the user's session.
 * Uses sessionStorage (cleared when tab closes) for accurate campaign attribution.
 */

const UTM_STORAGE_KEY = 'printora_utm_params';

/**
 * Extract all UTM parameters from current URL
 * @returns {Object|null} UTM parameters object or null if none found
 */
export function extractUTMFromURL() {
    const params = new URLSearchParams(window.location.search);
    const utmData = {};

    // All standard UTM parameters
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

    utmKeys.forEach(key => {
        const value = params.get(key);
        if (value) {
            utmData[key] = value;
        }
    });

    return Object.keys(utmData).length > 0 ? utmData : null;
}

/**
 * Save UTM parameters to sessionStorage
 * SessionStorage persists across pages but clears when tab/browser closes
 * @param {Object} utmData - UTM parameters to save
 */
export function saveUTMParams(utmData) {
    if (!utmData || Object.keys(utmData).length === 0) return;

    try {
        // Get existing UTM data
        const existing = getStoredUTMParams() || {};

        // Merge new params with existing (new params take precedence)
        const merged = { ...existing, ...utmData };

        // Add capture timestamp
        merged._captured_at = new Date().toISOString();

        sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(merged));
        console.log('[UTM] Saved to session:', merged);
    } catch (error) {
        console.error('[UTM] Failed to save:', error);
    }
}

/**
 * Get stored UTM parameters from sessionStorage
 * @returns {Object|null} Stored UTM parameters or null
 */
export function getStoredUTMParams() {
    try {
        const utmData = sessionStorage.getItem(UTM_STORAGE_KEY);
        if (!utmData) return null;

        const parsed = JSON.parse(utmData);
        // Remove internal metadata
        const { _captured_at, ...utmParams } = parsed;

        return Object.keys(utmParams).length > 0 ? utmParams : null;
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
        sessionStorage.removeItem(UTM_STORAGE_KEY);
        console.log('[UTM] Cleared from session');
    } catch (error) {
        console.error('[UTM] Failed to clear:', error);
    }
}

/**
 * Get current UTM parameters (from URL or storage)
 * Priority: URL params > Stored params > null
 * @returns {Object|null} Current UTM parameters
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
 * Returns all UTM parameters in format expected by backend
 * @returns {Object} UTM data object with all parameters
 */
export function getUTMDataForOrder() {
    const utmParams = getCurrentUTMParams();

    return {
        utm_source: utmParams?.utm_source || '',
        utm_medium: utmParams?.utm_medium || '',
        utm_campaign: utmParams?.utm_campaign || '',
        utm_content: utmParams?.utm_content || '',
        utm_term: utmParams?.utm_term || ''
    };
}

/**
 * Initialize UTM tracking on page load
 * Call this in your App component or main entry point
 */
export function initUTMTracking() {
    const urlUTM = extractUTMFromURL();

    if (urlUTM) {
        // New UTM parameters in URL - save them
        saveUTMParams(urlUTM);
        console.log('[UTM] Captured from URL:', urlUTM);
    } else {
        // No UTM in URL - check if we have stored ones
        const stored = getStoredUTMParams();
        if (stored) {
            console.log('[UTM] Using stored parameters:', stored);
        }
    }
}

/**
 * Build a URL with UTM parameters
 * @param {string} path - URL path (e.g., '/dtf', '/rollup')
 * @param {Object} utmParams - UTM parameters to append
 * @returns {string} Complete URL with UTM parameters
 */
export function buildUTMUrl(path, utmParams) {
    const url = new URL(path, window.location.origin);

    Object.entries(utmParams).forEach(([key, value]) => {
        if (value) {
            url.searchParams.set(key, value);
        }
    });

    return url.toString();
}

