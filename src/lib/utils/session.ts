/**
        * @file session.ts
        * @purpose Session management utilities
        * 
        * @dependencies
        * - $app/stores: SvelteKit session store
        *
        * @notes
        * - Provides reactive session access
        * - Handles session state changes
        */

import { session as svelteSession } from '$app/stores';
import { derived } from 'svelte/store';

export const session = derived(svelteSession, ($session) => {
    return $session.data?.session || null;
});