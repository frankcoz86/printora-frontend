import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // Replace `your_public_table_name` with ANY simple public table you already have
    const { error } = await supabase
      .from('orders')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Supabase keepalive error:', error);
      return res.status(500).json({ ok: false, error: error.message });
    }

    return res.status(200).json({
      ok: true,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Unexpected keepalive error:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}