// src/routes/+layout.ts
import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';

export const load = async ({ fetch, data, depends }) => {
    // Remove Supabase auth dependency since we're not using authentication
    // depends('supabase:auth')

    // Return any data that might be needed across the application
    // In this case, we're just passing through any data from the server
    return {
        // Pass through any data from +layout.server.ts if it exists
        ...data
    };
};

// Keep analytics injection for production monitoring
injectAnalytics({ mode: dev ? 'development' : 'production' });