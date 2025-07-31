/**
         * @file +page.server.ts for the main shop page
         * @purpose Server-side data loading for the merchandise listing page with fallback handling.
         * 
         * @dependencies
         * - @sveltejs/kit: For PageServerLoad type and error handling.
         * - $lib/api/apiClient: To fetch merchandise data and handle API errors.
         * - $lib/utils/mockData: Fallback static data when backend is unavailable.
         *
         * @notes
         * - Gracefully handles backend connection failures with static fallback data
         * - Logs errors for monitoring while maintaining user experience
         * - Sets connection status flag for frontend to display appropriate messaging
         */

import { apiClient, handleApiError } from '$lib/api/apiClient';
import { getMockMerchandise } from '$lib/data/mockMerchandise';
import type { PageServerLoad } from './$types';

/**
 * SvelteKit load function to fetch data before the page is rendered.
 * Implements graceful degradation when backend is unavailable.
 * 
 * @param {object} context - The SvelteKit load event context, containing `fetch`.
 * @returns A promise that resolves to the data for the page with connection status.
 */
export const load: PageServerLoad = async ({ fetch }) => {
    try {
        console.log('🔄 Loading merchandise data...');
        const merchandise = await apiClient.getMerchandise(fetch);
        console.log(`✅ Successfully loaded ${merchandise.length} merchandise items`);

        return {
            merchandise,
            title: 'Shop - Zungri Museum',
            metaDescription: 'Browse official merchandise from the Zungri Museum. Find unique souvenirs and gifts inspired by our collection.',
            isOnline: true,
            csrfToken: generateCSRFToken()
        };
    } catch (e) {
        console.error('❌ Backend connection failed, using fallback data:', e);

        // Check if it's a connection error (ECONNREFUSED, network issues, etc.)
        const isConnectionError = isNetworkError(e);

        if (isConnectionError) {
            console.log('🔄 Loading fallback merchandise data for offline mode...');
            const mockMerchandise = getMockMerchandise();
            console.log(`📦 Loaded ${mockMerchandise.length} mock merchandise items`);

            return {
                merchandise: mockMerchandise,
                title: 'Shop - Zungri Museum (Offline Mode)',
                metaDescription: 'Browse official merchandise from the Zungri Museum. Currently showing sample items - full catalog available when online.',
                isOnline: false,
                connectionError: true,
                csrfToken: generateCSRFToken()
            };
        }

        // For non-connection errors, still try to provide a basic experience
        console.error('❌ Non-connection API error, providing minimal fallback');
        const err = handleApiError(e, 'Failed to load merchandise');

        return {
            merchandise: getMockMerchandise(),
            title: 'Shop - Zungri Museum (Limited Mode)',
            metaDescription: 'Browse official merchandise from the Zungri Museum. Currently showing sample items.',
            isOnline: false,
            connectionError: false,
            apiError: err.details,
            csrfToken: generateCSRFToken()
        };
    }
};

/**
 * Determines if an error is related to network connectivity issues.
 * 
 * @param {unknown} error - The error to analyze.
 * @returns {boolean} True if the error indicates a network/connection problem.
 */
function isNetworkError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;

    const errorStr = error.toString().toLowerCase();
    const errorMessage = 'message' in error ? String(error.message).toLowerCase() : '';

    // Check for common network error patterns
    const networkErrorPatterns = [
        'econnrefused',
        'enotfound',
        'etimedout',
        'network error',
        'connection refused',
        'fetch failed',
        'aggregateerror'
    ];

    return networkErrorPatterns.some(pattern =>
        errorStr.includes(pattern) || errorMessage.includes(pattern)
    );
}

/**
 * Generates a simple CSRF token for forms.
 * In production, this should use a more robust implementation.
 * 
 * @returns {string} A simple CSRF token.
 */
function generateCSRFToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}