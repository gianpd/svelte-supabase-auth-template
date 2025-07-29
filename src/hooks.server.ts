/**
 * @file Server Hooks (hooks.server.ts)
 * @description This file manages internationalization (i18n) using Paraglide,
 * detecting the locale and setting the language context.
 *
 * @dependencies
 * - @sveltejs/kit: `Handle`.
 * - $lib/paraglide: Generated Paraglide i18n handle.
 */

import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';

/**
 * @name paraglideHandle
 * @description Handle for managing internationalization with Paraglide.
 * This middleware detects the locale from the request and sets up the
 * language context for the entire application.
 */
const paraglideHandle: Handle = ({ event, resolve }) =>
    paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
        event.request = localizedRequest;
        return resolve(event, {
            transformPageChunk: ({ html }) => {
                return html.replace('%lang%', locale);
            }
        });
    });

// Export the handle for internationalization
export const handle = paraglideHandle;