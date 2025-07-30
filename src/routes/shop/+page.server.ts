// File: frontend/src/routes/shop/+page.server.ts
/**
 * @file +page.server.ts for the main shop page
 * @purpose Server-side data loading for the merchandise listing page.
 * 
 * @dependencies
 * - @sveltejs/kit: For `error` helper and `PageServerLoad` type.
 * - $lib/api/apiClient: To fetch merchandise data and handle API errors.
 *
 * @notes
 * - Fetches all merchandise items using the API client.
 * - Provides SEO-friendly title and meta description.
 * - Implements robust error handling, converting API errors into SvelteKit error pages.
 */

import { apiClient, handleApiError } from '$lib/api/apiClient';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/**
 * SvelteKit load function to fetch data before the page is rendered.
 * @param {object} context - The SvelteKit load event context, containing `fetch`.
 * @returns A promise that resolves to the data for the page.
 * @throws {Error} A SvelteKit error if the API call fails.
 */
export const load: PageServerLoad = async ({ fetch }) => {
    try {
        console.log('🔄 Loading merchandise data...');
        const merchandise = await apiClient.getMerchandise(fetch);
        console.log(`✅ Successfully loaded ${merchandise.length} merchandise items`);

        return {
            merchandise,
            title: 'Shop - Zungri Museum',
            metaDescription: 'Browse official merchandise from the Zungri Museum. Find unique souvenirs and gifts inspired by our collection.'
        };
    } catch (e) {
        console.error('❌ Failed to load merchandise:', e);
        const err = handleApiError(e, 'Failed to load merchandise');
        throw error(err.status, err.details);
    }
};