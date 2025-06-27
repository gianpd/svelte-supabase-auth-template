/**
 * @file +page.server.ts (About Page)
 * @purpose Server-side loader for the About Us page using centralized API client
 * 
 * @dependencies
 * - @sveltejs/kit: For error handling and load function types
 * - paraglide-js-sveltekit: For getting the current language tag
 * - $lib/api/apiClient: Centralized API client for backend communication
 *
 * @notes
 * - Uses apiClient for consistent error handling and request formatting
 * - Implements proper fallback behavior for missing content
 * - Error handling: Converts API errors to SvelteKit error format
 * - Supports server-side rendering with proper fetch context
 */

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getLocale } from '$lib/paraglide/runtime';
import { apiClient, handleApiError, type PageContent } from '$lib/api/apiClient';

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        // Get current language from paraglide
        const language = getLocale();
        const slug = 'about';

        console.log(`[About Page Load] Fetching content for slug '${slug}' in language '${language}'`);

        // Use apiClient with server-side fetch context
        const content: PageContent = await apiClient.getPageContent(
            slug,
            language,
            fetch // Pass SvelteKit's fetch for server-side context
        );

        console.log(`[About Page Load] Successfully fetched content:`, {
            id: content.id,
            title: content.title,
            language: content.language_code,
            contentLength: content.content.length
        });

        return {
            content,
            meta: {
                slug,
                language,
                lastUpdated: content.updated_at
            }
        };
    } catch (e: unknown) {
        console.error('[About Page Load] Error fetching content:', e);

        // Use centralized error handling utility
        const errorInfo = handleApiError(
            e,
            'Could not load museum information'
        );

        // Throw SvelteKit error for proper error page handling
        error(errorInfo.status, {
            message: errorInfo.message,
            details: errorInfo.details
        });
    }
};