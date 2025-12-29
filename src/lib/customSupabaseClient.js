import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// TEMP: add this log once to verify at runtime
console.log('[Supabase init]', { supabaseUrl });

function createMockSupabaseClient() {
    const baseError = new Error('Supabase is not configured. This is a mock client for local development.');

    const createQueryBuilder = () => {
        const builder = {
            insert() {
                return builder;
            },
            update() {
                return builder;
            },
            select() {
                return builder;
            },
            eq() {
                return builder;
            },
            order() {
                return builder;
            },
            single() {
                return builder;
            },
            then(onFulfilled, onRejected) {
                return Promise.resolve({ data: null, error: baseError }).then(onFulfilled, onRejected);
            },
        };
        return builder;
    };

    return {
        from() {
            return createQueryBuilder();
        },
        functions: {
            async invoke() {
                return { data: null, error: baseError };
            },
        },
        auth: {
            async getSession() {
                return {
                    data: { session: null },
                    error: new Error('Supabase auth is not configured. Auth is disabled in this environment.'),
                };
            },
            onAuthStateChange() {
                return {
                    data: {
                        subscription: {
                            unsubscribe() {},
                        },
                    },
                };
            },
            async signUp() {
                return {
                    error: new Error('Supabase auth is not configured. Auth is disabled in this environment.'),
                };
            },
            async signInWithPassword() {
                return {
                    error: new Error('Supabase auth is not configured. Auth is disabled in this environment.'),
                };
            },
            async signOut() {
                return {
                    error: new Error('Supabase auth is not configured. Auth is disabled in this environment.'),
                };
            },
        },
    };
}

let supabase;

if (!supabaseUrl || !supabaseKey) {
    if (import.meta.env.DEV) {
        console.warn('[Supabase init] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Using mock Supabase client for dev.');
        supabase = createMockSupabaseClient();
    } else {
        throw new Error('Supabase configuration missing: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set.');
    }
} else {
    supabase = createClient(supabaseUrl, supabaseKey);
}

export { supabase };