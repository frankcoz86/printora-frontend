/**
 * Facebook Pixel Tracking Utilities
 * 
 * Safe wrappers for Facebook Pixel events that check if fbq is loaded,
 * handle errors gracefully, and prevent duplicate event tracking.
 */

const FIRED_EVENTS_KEY = 'printora_fb_events';
const EVENT_EXPIRY_HOURS = 24;

/**
 * Generate a unique event ID for deduplication
 * @param {string} eventType - Type of event (e.g., 'Purchase', 'AddToCart')
 * @param {string} identifier - Unique identifier (e.g., order ID, transaction ID)
 * @returns {string} Unique event ID
 * 
 * NOTE: Does NOT include timestamp to ensure same order always generates same ID
 */
export const generateEventID = (eventType, identifier) => {
  // ✅ Static ID based only on event type and identifier
  // This ensures the same order always generates the same eventID
  return `${eventType}_${identifier}`;
};

/**
 * Check if an event has already been fired
 * @param {string} eventID - The event ID to check
 * @returns {boolean} True if event already fired
 */
const hasEventFired = (eventID) => {
  try {
    const firedEvents = JSON.parse(localStorage.getItem(FIRED_EVENTS_KEY) || '{}');
    const now = Date.now();

    // Clean up expired events (older than 24 hours)
    Object.keys(firedEvents).forEach(key => {
      if (now - firedEvents[key] > EVENT_EXPIRY_HOURS * 60 * 60 * 1000) {
        delete firedEvents[key];
      }
    });

    // Save cleaned events
    localStorage.setItem(FIRED_EVENTS_KEY, JSON.stringify(firedEvents));

    return !!firedEvents[eventID];
  } catch (error) {
    console.debug('Error checking fired events:', error);
    return false;
  }
};

/**
 * Mark an event as fired
 * @param {string} eventID - The event ID to mark
 */
const markEventFired = (eventID) => {
  try {
    const firedEvents = JSON.parse(localStorage.getItem(FIRED_EVENTS_KEY) || '{}');
    firedEvents[eventID] = Date.now();
    localStorage.setItem(FIRED_EVENTS_KEY, JSON.stringify(firedEvents));
  } catch (error) {
    console.debug('Error marking event fired:', error);
  }
};

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
 * @param {string} params.eventID - Optional unique event ID for deduplication
 */
export const trackAddToCart = ({ content_ids, content_name, content_type = 'product', value, currency = 'EUR', eventID }) => {
  fbq('track', 'AddToCart', {
    content_ids: Array.isArray(content_ids) ? content_ids : [content_ids],
    content_name,
    content_type,
    value: Number(value || 0),
    currency,
  }, eventID ? { eventID } : undefined);
};

/**
 * Track InitiateCheckout event
 * @param {Object} params - Event parameters
 * @param {Array<string>} params.content_ids - Product IDs in cart
 * @param {Array<Object>} params.contents - Array of {id, quantity} objects
 * @param {number} params.value - Total cart value
 * @param {string} params.currency - Currency code
 * @param {number} params.num_items - Number of items in cart
 * @param {string} params.eventID - Optional unique event ID for deduplication
 */
export const trackInitiateCheckout = ({ content_ids, contents, value, currency = 'EUR', num_items, eventID }) => {
  fbq('track', 'InitiateCheckout', {
    content_ids: Array.isArray(content_ids) ? content_ids : [content_ids],
    contents: contents || [],
    value: Number(value || 0),
    currency,
    num_items: Number(num_items || 0),
  }, eventID ? { eventID } : undefined);
};

/**
 * Track Purchase event with deduplication
 * @param {Object} params - Event parameters
 * @param {Array<string>} params.content_ids - Product IDs purchased
 * @param {Array<Object>} params.contents - Array of {id, quantity} objects
 * @param {number} params.value - Total purchase value
 * @param {string} params.currency - Currency code
 * @param {number} params.num_items - Number of items purchased
 * @param {string} params.eventID - Unique event ID for deduplication (REQUIRED)
 */
export const trackPurchase = ({ content_ids, contents, value, currency = 'EUR', num_items, eventID }) => {
  // CRITICAL: Check if this purchase event has already been fired
  if (!eventID) {
    console.warn('Meta Pixel Purchase event called without eventID - skipping for safety');
    return;
  }

  if (hasEventFired(eventID)) {
    console.debug(`Meta Pixel Purchase event ${eventID} already fired - skipping duplicate`);
    return;
  }

  // Fire the event
  fbq('track', 'Purchase', {
    content_ids: Array.isArray(content_ids) ? content_ids : [content_ids],
    contents: contents || [],
    value: Number(value || 0),
    currency,
    num_items: Number(num_items || 0),
  }, { eventID });

  // Mark as fired to prevent duplicates
  markEventFired(eventID);
  console.debug(`Meta Pixel Purchase event ${eventID} fired successfully`);
};
