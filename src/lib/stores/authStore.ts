/**
 * @file Authentication Store (authStore.ts)
 * @description Manages the application's authentication state using Svelte stores
 * and interacts with the Supabase client-side auth events.
 *
 * @dependencies
 * - svelte/store: Provides `writable`, `get` for creating/accessing reactive stores.
 * - @supabase/supabase-js: Provides `Session` type.
 * - $lib/utils/supabaseClient: Provides the client-side Supabase instance.
 */

import { writable, type Writable, get } from 'svelte/store'; // Import get
import type { Session } from '@supabase/supabase-js';
import { supabase } from '$lib/utils/supabaseClient';

// --- Stores ---

/**
 * Writable store holding the current authenticated session object.
 * Null if the user is not logged in. Components can subscribe to this
 * to reactively update based on auth state using the $ prefix (e.g., $sessionStore).
 */
export const sessionStore: Writable<Session | null> = writable(null);

/**
 * Writable store indicating if the initial auth check (on page load/app start)
 * has completed. Useful for preventing UI flashes or premature redirects.
 */
export const authReady: Writable<boolean> = writable(false);


// --- Initialization ---

let authListenerInitialized = false;
let unsubscribe: (() => void) | null = null;

/**
 * Initializes the Supabase auth state change listener.
 * This should be called ONCE when the application root mounts client-side.
 * It listens for SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED events and updates
 * the sessionStore accordingly. It also sets authReady to true once the
 * initial session state is determined.
 *
 * @returns {() => void} A function to unsubscribe the listener.
 **/
export function initializeAuthListener(): () => void {
    console.log('[AuthStore] Attempting to initialize auth listener...');

    if (authListenerInitialized && unsubscribe) {
        console.log('[AuthStore] Listener already initialized.');
        return unsubscribe; // Return existing unsubscribe function
    }

    authListenerInitialized = true;

    // Immediately try to get the current session to set initial state
    supabase.auth.getSession().then(({ data }) => {
        console.log('[AuthStore] Initial session fetched client-side:', data.session ? data.session.user.id : 'null');
        // Only set the store if auth isn't already marked as ready by the listener firing first
        if (!get(authReady)) {
            sessionStore.set(data.session);
        }
        // Mark auth as ready only after attempting to get the initial session
        authReady.set(true);
        console.log('[AuthStore] Auth ready.');
    }).catch((error) => {
        console.error('[AuthStore] Error fetching initial session:', error);
        // Still mark as ready even if error occurs, assuming no session
        if (!get(authReady)) {
            sessionStore.set(null);
        }
        authReady.set(true);
    });


    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log(`[AuthStore onAuthStateChange] Event: ${event}`, session ? `User: ${session.user.id}` : 'No session');

        // Explicitly handle SIGNED_OUT
        if (event === 'SIGNED_OUT') {
            console.log('[AuthStore onAuthStateChange] SIGNED_OUT detected, setting store to null.');
            sessionStore.set(null);
        } else {
            // For SIGNED_IN, TOKEN_REFRESHED, USER_UPDATED etc., update with the provided session
            sessionStore.set(session);
        }

        // Ensure authReady is true after the first event fires as well
        if (!get(authReady)) {
            authReady.set(true);
        }
    });

    // Store the unsubscribe function for cleanup
    unsubscribe = subscription.unsubscribe;

    console.log('[AuthStore] Listener initialized.');
    return unsubscribe;
}

// --- Convenience Object (Optional) ---
// Export the stores directly. Components should use the $ prefix for auto-subscription.
export const authStore = {
    currentSession: sessionStore,
    ready: authReady
};