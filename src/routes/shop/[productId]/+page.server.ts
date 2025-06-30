/**
     * @file +page.server.ts for the product detail page
     * @purpose Server-side data loading for a single merchandise item.
     * 
     * @dependencies
     * - @sveltejs/kit: For `error` helper and `PageServerLoad` type.
     * - $lib/api/apiClient: To fetch single product data and handle API errors.
     *
     * @notes
     * - Fetches a single merchandise item by its ID from the URL parameters.
     * - Generates a dynamic, SEO-friendly title and meta description for the product.
     * - Gracefully handles 404 errors if a product is not found, showing a standard "Not Found" page.
     */
import { apiClient, handleApiError } from '$lib/api/apiClient';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/**
 * SvelteKit load function to fetch a single product's data before the page is rendered.
 * @param {object} context - The SvelteKit load event context, containing `params` and `fetch`.
 * @returns A promise that resolves to the data for the product detail page.
 * @throws {Error} A SvelteKit error if the API call fails or the product is not found.
 */
export const load: PageServerLoad = async ({ params, fetch }) => {
    try {
        const product = await apiClient.getMerchandiseItem(params.productId, fetch);
        const name = product.name_translations['en'] || Object.values(product.name_translations)[0];
        const description = product.description_translations?.['en'] || `Details for ${name}.`;

        return {
            product,
            title: `${name} - Zungri Museum Shop`,
            metaDescription: description.substring(0, 160) // Truncate for meta tag
        };
    } catch (e) {
        const err = handleApiError(e, 'Failed to load product details');
        // Specifically handle 404 to show a user-friendly "Not Found" page.
        if (err.status === 404) {
            throw error(404, 'Product not found');
        }
        throw error(err.status, err.details);
    }
};