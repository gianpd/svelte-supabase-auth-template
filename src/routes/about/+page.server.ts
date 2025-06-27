/**
 * @file +page.server.ts (About Page)
 * @description Server-side loader for the About Us page. Fetches dynamic content
 * from the backend API based on the 'about' slug and the current locale.
 * 
 * @dependencies
 * - @sveltejs/kit: For error handling.
 * - paraglide-js-sveltekit: For getting the current language tag.
 * - ../$types: Type definitions for the page load event.
 * - ../../lib/types/api: API response types.
 */
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getLocale } from '$lib/paraglide/runtime';

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        const language = getLocale();

        const slug = 'about';

        console.log(`[About Page Load] Fetching content for slug '${slug}' in language '${language}'`);

        // Fetch content from the backend API
        const response = await fetch(`/api/v1/content/${slug}/${language}`);

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`[About Page Load] API Error (${response.status}):`, errorData.detail);

            // Throw a SvelteKit error to be handled by +error.svelte
            error(response.status, {
                message: 'Could not load museum information.',
                details: errorData.detail || 'The requested content could not be found.'
            });
        }

        const content = await response.json();

        return {
            content
        };
    } catch (e: any) {
        console.error('[About Page Load] Unexpected error:', e);
        error(500, {
            message: 'Internal Server Error',
            details: 'An unexpected error occurred while trying to load the page.'
        });
    }
};
