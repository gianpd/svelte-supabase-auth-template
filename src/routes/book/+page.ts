import { bookingActions, selectedTicketTypes } from '$lib/stores/bookingStore';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    // Fetch essential data before the page component loads.
    // This runs on the server for the initial visit.
    // We check if the store is already populated to avoid re-fetching during client-side navigation.
    let currentTicketTypes;
    const unsubscribe = selectedTicketTypes.subscribe(value => {
        currentTicketTypes = value;
    });
    unsubscribe(); // Immediately unsubscribe

    if (!currentTicketTypes || currentTicketTypes.length === 0) {
        // In a real app, this would be an async call, e.g., await api.getTicketTypes()
        // We'll call the action that populates the store.
        await bookingActions.loadTicketTypes();
    }

    // The page component doesn't need to receive any data directly,
    // as the store is now populated. We can return an empty object.
    // If loadTicketTypes returned data, we would return it here.
    return {};
};