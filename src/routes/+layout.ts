// src/routes/+layout.ts

import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr'
import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';

export const load = async ({ fetch, data, depends }) => {
    depends('supabase:auth')

    const supabase = isBrowser()
        ? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
            global: { fetch }
        })
        : createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
            global: { fetch },
            cookies: {
                getAll() {
                    return data.cookies
                }
            }
        })

    const session = isBrowser() ? (await supabase.auth.getSession()).data.session : data.session

    return { supabase, session }
}



injectAnalytics({ mode: dev ? 'development' : 'production' });
