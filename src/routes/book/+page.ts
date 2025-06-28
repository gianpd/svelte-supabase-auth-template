/**
 * @file Booking Page - Server Load Function
 * @purpose Ensures essential data, like ticket types, is loaded before the page renders.
 * 
 * @dependencies
 * - SvelteKit: For PageLoad type and server-side fetch.
 * - bookingStore: To access booking actions and the `availableTicketTypes` store.
 * - svelte/store: To read the current state of a store via `get`.
 *
 * @notes
 * - This file has been updated to fix an import error. It now correctly checks the
 *   `availableTicketTypes` store instead of the removed `selectedTicketTypes`.
 * - This prevents redundant API calls if the ticket types are already populated in the store.
 * - Error handling is managed within the `loadTicketTypes` action.
 */
import { bookingActions, availableTicketTypes } from '$lib/stores/bookingStore';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

/**
 * Pre-loads necessary data for the booking page.
 * @param {object} params - SvelteKit load event parameters.
 * @param {typeof fetch} params.fetch - The fetch implementation to use (server or client).
 */
export const load: PageLoad = async ({ fetch }) => {
    // Check if the available ticket types have already been loaded into the store.
    const currentTicketTypes = get(availableTicketTypes);

    // If the store is empty, call the action to fetch them.
    // This is crucial for the first page load to populate the ticket selector.
    if (!currentTicketTypes || currentTicketTypes.length === 0) {
        // Pass the context-aware `fetch` to the action. This is essential for it
        // to work correctly during server-side rendering.
        await bookingActions.loadTicketTypes(fetch);
    }

    // The page component reads directly from the reactive stores,
    // so we don't need to return any data as props from the load function.
    return {};
};