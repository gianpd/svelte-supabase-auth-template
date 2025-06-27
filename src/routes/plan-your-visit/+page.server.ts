/**

@file +page.server.ts (Plan Your Visit Page)

@description Server-side loader for the "Plan Your Visit" page. Fetches dynamic content

from the backend API based on the 'plan-your-visit' slug and the current locale.

@dependencies

@sveltejs/kit: For error handling.

paraglide-js-sveltekit: For getting the current language tag.

../$types: Type definitions for the page load event.

../../lib/types/api: API response types.
*/
import { error } from '@sveltejs/kit';

import { getLocale } from '$lib/paraglide/runtime';

import type { PageServerLoad } from './$types';



export const load: PageServerLoad = async ({ fetch }) => {
    try {
        const lang = getLocale();
        const slug = 'plan-your-visit';

        console.log(
            `[Plan Your Visit Page Load] Fetching content for slug '${slug}' in language '${lang}'`
        );

        // Fetch content from the backend API
        const response = await fetch(`/api/v1/content/${slug}/${lang}`);

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`[Plan Your Visit Page Load] API Error (${response.status}):`, errorData.detail);
            error(response.status, {
                message: 'Could not load visit information.',
                details: errorData.detail || 'The requested content could not be found.'
            });
        }

        const content = await response.json();

        return {
            content
        };
    } catch (e: any) {
        console.error('[Plan Your Visit Page Load] Unexpected error:', e);
        error(500, {
            message: 'Internal Server Error',
            details: 'An unexpected error occurred while trying to load the page.'
        });
    }


};