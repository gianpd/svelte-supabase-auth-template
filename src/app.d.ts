/**
 * @file App Type Definitions (app.d.ts)
 * @description Contains global type definitions for the SvelteKit application.
 *
 * @dependencies
 * - @supabase/supabase-js: Provides the `SupabaseClient` and `Session` types.
 * - $lib/types/supabase: Contains generated database types (assuming this path is correct).
 */

import type { SupabaseClient, Session } from '@supabase/supabase-js';
import type { Database } from '$lib/types/supabase'; // Adjust path if needed

declare global {
	namespace App {
		interface Error {
			message: string;
			details?: string;
			code?: string;
		}

		/**
		 * @interface Locals
		 * @description Defines `event.locals` properties added by `hooks.server.ts`.
		 */
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession(): Promise<Session | null>;
			session: Session | null;
			accessToken: string | null; // Keep this if backend API needs it
		}

		/**
		 * @interface PageData
		 * @description Defines the common shape of data returned from load functions.
		 * Root layouts will populate session and potentially supabase client.
		 */
		interface PageData {
			session: Session | null;
			// Add supabase client if passed from universal load
			supabase?: SupabaseClient<Database>;
			flash?: { type: 'success' | 'error'; message: string };
		}

		// interface PageState {}
		// interface Platform {}
	}
}

export { };