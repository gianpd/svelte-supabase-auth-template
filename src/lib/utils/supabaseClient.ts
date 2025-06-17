/**
 * @file supabaseClient.ts
 * @purpose Creates and exports the Supabase client instance for client-side usage
 * 
 * @dependencies
 * - @supabase/supabase-js: Provides Supabase client functionality
 * - $env/static/public: Access to public environment variables
 *
 * @notes
 * - Uses PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY from environment
 * - Singleton pattern ensures only one instance is created
 */

import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// Create and export the Supabase client
export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    }
});