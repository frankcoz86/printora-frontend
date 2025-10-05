import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// TEMP: add this log once to verify at runtime
console.log('[Supabase init]', { supabaseUrl });

export const supabase = createClient(supabaseUrl, supabaseKey);