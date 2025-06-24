import type { LayoutServerLoad } from './$types';

/**
 * @file Root server layout loader for the Zungri Museum application.
 * @description This function runs on the server for every request and loads
 * essential data that is available to all pages. It primarily deals with
 * session and user authentication state.
 *
 * @param {object} event - The SvelteKit load event.
 * @returns {Promise<object>} An object containing session and user data.
 * This data is merged into the `data` prop available in all layouts and pages.
 */
export const load: LayoutServerLoad = async ({ locals: { session, user } }) => {
    return {
        session,
        user
    };
};