/**
 * @file Server Hooks (hooks.server.ts)
 * @description This file uses a sequence of handles to process requests.
 * 1. `i18nHandle`: Manages internationalization (i18n) using Paraglide,
 *    detecting the locale and setting the language context.
 * 2. `authHandle`: Initializes the Supabase client, validates the user's session
 *    using JWT, performs route guarding, and makes the validated session
 *    available in `event.locals`.
 *
 * @dependencies
 * - $env/static/public: Supabase URL and Anon Key.
 * - $env/static/private: Supabase JWT Secret.
 * - @supabase/ssr: `createServerClient`.
 * - @sveltejs/kit/hooks: `sequence` for chaining handles.
 * - @sveltejs/kit: `redirect`, `Handle`.
 * - jose: `jwtVerify`.
 * - @supabase/supabase-js: `Session`.
 * - $lib/paraglide: Generated Paraglide i18n handle.
 */

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { JWT_SECRET } from '$env/static/private';
import { createServerClient } from '@supabase/ssr';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import * as jose from 'jose';
import type { Session } from '@supabase/supabase-js';
import { paraglideMiddleware } from '$lib/paraglide/server';


// Define the accurate Supabase JWT payload structure
export type SupabaseJwt = {
    aal: string;
    aud: string;
    email: string;
    exp: number;
    iat: number;
    phone: string;
    role: string;
    session_id: string;
    sub: string;
    amr?: { method: string; timestamp: number }[];
    app_metadata?: { provider?: string; providers?: string[];[key: string]: any };
    is_anonymous?: boolean;
    iss?: string;
    jti?: string;
    nbf?: string;
    user_metadata?: { [key: string]: any };
} & jose.JWTPayload;

// creating a handle to use the paraglide middleware
const paraglideHandle: Handle = ({ event, resolve }) =>
    paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
        event.request = localizedRequest;
        return resolve(event, {
            transformPageChunk: ({ html }) => {
                return html.replace('%lang%', locale);
            }
        });
    });



/**
 * @name authHandle
 * @description The second handle in the sequence. It manages authentication,
 * session validation, and route protection.
 */
const authHandle: Handle = async ({ event, resolve }) => {
    console.log(`\n--- [Auth Handle] Handling request for: ${event.url.pathname} ---`); // DEBUG

    // Use explicit getAll/setAll cookie handlers for Supabase SSR client
    event.locals.supabase = createServerClient(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll: () => {
                    const cookies = event.cookies.getAll();
                    console.log(`[DEBUG Auth Handle - getAll] Found ${cookies.length} cookies.`); // DEBUG
                    return cookies;
                },
                setAll: (cookies) => {
                    console.log(
                        `[DEBUG Auth Handle - setAll] Setting ${cookies.length} cookies:`,
                        JSON.stringify(cookies.map((c) => c.name))
                    ); // DEBUG
                    cookies.forEach(({ name, value, options }) => {
                        event.cookies.set(name, value, { ...options, path: '/' });
                    });
                }
            }
        }
    );

    /**
     * @name getSession
     * @description A method on `event.locals` to securely get the session data.
     * It retrieves the session from Supabase and then validates the JWT signature
     * against the private secret. Returns a valid session object or null.
     */
    event.locals.getSession = async (): Promise<Session | null> => {
        console.log('[DEBUG getSession in Auth Handle] Running...'); // DEBUG
        const {
            data: { session: rawSession },
            error: getSessionError
        } = await event.locals.supabase.auth.getSession();

        if (getSessionError) {
            console.error(
                '[ERROR getSession in Auth Handle] supabase.auth.getSession() error:',
                getSessionError.message
            );
        }

        if (!rawSession) {
            console.log('[DEBUG getSession in Auth Handle] Raw session NOT FOUND by supabase.auth.getSession().');
            event.locals.user = null;
            event.locals.accessToken = null;
            return null;
        }
        console.log(
            '[DEBUG getSession in Auth Handle] Raw session FOUND. User ID:',
            rawSession.user?.id
        ); // DEBUG

        try {
            console.log('[DEBUG getSession in Auth Handle] Attempting JWT validation...'); // DEBUG
            const secret = new TextEncoder().encode(JWT_SECRET);
            const { payload: decoded }: { payload: SupabaseJwt } = await jose.jwtVerify(
                rawSession.access_token,
                secret
            );
            console.log('[DEBUG getSession in Auth Handle] JWT validation SUCCESSFUL.'); // DEBUG

            const validated_session: Session = {
                access_token: rawSession.access_token,
                refresh_token: rawSession.refresh_token,
                expires_at: decoded.exp,
                expires_in: decoded.exp ? decoded.exp - Math.round(Date.now() / 1000) : 0,
                token_type: 'bearer',
                user: {
                    id: decoded.sub,
                    aud: decoded.aud,
                    role: decoded.role ?? 'authenticated',
                    email: decoded.email,
                    phone: decoded.phone,
                    created_at: rawSession.user?.created_at ?? '',
                    app_metadata: decoded.app_metadata ?? {},
                    user_metadata: decoded.user_metadata ?? {},
                    is_anonymous: decoded.is_anonymous ?? false
                }
            };
            event.locals.user = validated_session.user;
            event.locals.accessToken = validated_session.access_token;
            return validated_session;
        } catch (err: any) {
            console.error('[ERROR getSession in Auth Handle] JWT validation FAILED:', err.message); // DEBUG
            event.locals.user = null;
            event.locals.accessToken = null;
            return null;
        }
    };

    // Call getSession ONCE per request and store the result in locals.session
    event.locals.session = await event.locals.getSession();
    console.log(
        '[DEBUG Auth Handle] Stored session in locals:',
        event.locals.session ? `User: ${event.locals.session.user.id}` : 'null'
    ); // DEBUG

    // --- Route Guarding ---
    // Use the session stored directly in locals for guarding
    const sessionForGuard = event.locals.session;

    if (sessionForGuard) {
        console.log(`[DEBUG Auth Handle Guard] Using session FOUND in locals. User: ${sessionForGuard.user.id}`);
    } else {
        console.log(`[DEBUG Auth Handle Guard] Using session NOT FOUND in locals.`);
    }

    // Protect admin routes
    if (event.url.pathname.startsWith('/admin')) {
        if (!sessionForGuard) {
            console.warn(`[GUARD] Access denied to ${event.url.pathname}. No session. Redirecting to /login.`);
            redirect(303, '/login');
        }
        // You can add role-based checks here if needed
        // if (sessionForGuard.user.role !== 'Administrator') {
        //   redirect(303, '/');
        // }
    }

    // Redirect logged-in users from public auth pages
    if (event.url.pathname === '/login' || event.url.pathname === '/signup') {
        if (sessionForGuard) {
            console.log(`[GUARD] User already logged in. Redirecting from ${event.url.pathname} to /admin.`);
            redirect(303, '/admin');
        }
    }

    console.log(`[DEBUG Auth Handle] Resolving request for ${event.url.pathname}`); // DEBUG

    // Resolve the request, allowing it to proceed to the route handler.
    // SvelteKit automatically passes `event.locals.session` and `event.locals.user`
    // to the root layout data via the `+layout.server.ts` load function.
    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            return name === 'content-range' || name === 'x-supabase-api-version';
        }
    });
};

// Export the sequence of handles. They will run in the order they are provided.
export const handle = sequence(paraglideHandle, authHandle);