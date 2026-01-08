/**
 * Facebook Pixel Tracking Utilities
 * 
 * Safe wrappers for Facebook Pixel events that check if fbq is loaded
 * and handle errors gracefully.
 */

/**
 * Safe wrapper for Facebook Pixel function
 * @param {...any} args - Arguments to pass to fbq
 */
export const fbq = (...args) => {
  try {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq(...args);
    }
  } catch (error) {
    console.debug('Facebook Pixel error:', error);
  }
};

/**
 * Track AddToCart event
 * @param {Object} params - Event parameters
 * @param {Array<string>} params.content_ids - Product IDs
 * @param {string} params.content_name - Product name
 * @param {string} params.content_type - Content type (usually 'product')
 * @param {number} params.value - Product value
 * @param {string} params.currency - Currency code (e.g., 'EUR')
 */
export const trackAddToCart = ({ content_ids, content_name, content_type = 'product', value, currency = 'EUR' }) => {
  fbq('track', 'AddToCart', {
    content_ids: Array.isArray(content_ids) ? content_ids : [content_ids],
    content_name,
    content_type,
    value: Number(value || 0),
    currency,
  });
};

/**
 * Track InitiateCheckout event
 * @param {Object} params - Event parameters
 * @param {Array<string>} params.content_ids - Product IDs in cart
 * @param {Array<Object>} params.contents - Array of {id, quantity} objects
 * @param {number} params.value - Total cart value
 * @param {string} params.currency - Currency code
 * @param {number} params.num_items - Number of items in cart
 */
export const trackInitiateCheckout = ({ content_ids, contents, value, currency = 'EUR', num_items }) => {
  fbq('track', 'InitiateCheckout', {
    content_ids: Array.isArray(content_ids) ? content_ids : [content_ids],
    contents: contents || [],
    value: Number(value || 0),
    currency,
    num_items: Number(num_items || 0),
  });
};

/**
 * Track Purchase event
 * @param {Object} params - Event parameters
 * @param {Array<string>} params.content_ids - Product IDs purchased
 * @param {Array<Object>} params.contents - Array of {id, quantity} objects
 * @param {number} params.value - Total purchase value
 * @param {string} params.currency - Currency code
 * @param {number} params.num_items - Number of items purchased
 */
export const trackPurchase = ({ content_ids, contents, value, currency = 'EUR', num_items }) => {
  fbq('track', 'Purchase', {
    content_ids: Array.isArray(content_ids) ? content_ids : [content_ids],
    contents: contents || [],
    value: Number(value || 0),
    currency,
    num_items: Number(num_items || 0),
  });
};
