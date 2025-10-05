/// <reference types="vite/client" />

// (Optional but nice) Strongly-type the env vars you actually use:
interface ImportMetaEnv {
    readonly VITE_CREATE_ORDER_URL: string;
    readonly VITE_MARK_ORDER_PAID_URL?: string;
    readonly VITE_BACKEND_URL?: string;
    readonly VITE_WEBHOOK_RELAY_TOKEN?: string;
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    // add any others you use…
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  