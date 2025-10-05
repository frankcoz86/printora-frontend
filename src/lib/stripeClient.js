import { loadStripe } from '@stripe/stripe-js';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

console.log('Stripe Publishable Key is present:', !!publishableKey);
console.log('Environment check:', {
  publishableKey: publishableKey ? publishableKey.substring(0, 12) + '...' : 'Missing',
  env: import.meta.env.MODE,
  keyType: publishableKey?.startsWith('pk_live_') ? 'LIVE' : 'TEST'
});

if (!publishableKey) {
  console.error("Stripe publishable key is missing. Make sure VITE_STRIPE_PUBLISHABLE_KEY is set in your environment variables.");
}

// Enhanced Stripe configuration with proper options
export const stripePromise = publishableKey ? loadStripe(publishableKey, {
  // Add locale to prevent localization issues
  locale: 'auto', // or 'it' for Italian specifically
  // Add API version to ensure compatibility
  apiVersion: '2024-06-20'
}) : null;

export default stripePromise;