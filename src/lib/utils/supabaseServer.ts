/**
        * @file supabaseServer.ts
        * @purpose Creates server-side Supabase client with proper session handling
        * 
        * @dependencies
        * - @supabase/ssr: Server-side Supabase utilities
        * - cookie: Cookie parsing library
        * - $env/static/public: Public environment variables
        *
        * @notes
        * - Handles cookie-based authentication for server-side operations
        * - Properly manages session tokens
        */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export function createSupabaseServerClient() {
    const cookieStore = cookies();

    return createServerClient(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options) {
                    cookieStore.set({ name, value, ...options });
                },
                remove(name: string, options) {
                    cookieStore.set({ name, value: '', ...options });
                },
            },
        }
    );
}