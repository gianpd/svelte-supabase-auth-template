/**
 * @file Server Hooks (hooks.server.ts)
 * @description Initializes Supabase client, validates session using JWT,
 * performs route guarding, and makes the validated session available
 * in `event.locals.session`.
 *
 * @dependencies
 * - $env/static/public: Supabase URL and Anon Key.
 * - $env/static/private: Supabase JWT Secret.
 * - @supabase/ssr: `createServerClient`.
 * - @sveltejs/kit: `redirect`, `Handle`.
 * - jose: `jwtVerify`.
 * - @supabase/supabase-js: `Session`.
 */

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { JWT_SECRET } from '$env/static/private';
import { createServerClient } from '@supabase/ssr';
import { redirect, type Handle } from '@sveltejs/kit';
import * as jose from 'jose';
import type { Session } from '@supabase/supabase-js';

// Define the accurate Supabase JWT payload structure
export type SupabaseJwt = {
    aal: string; aud: string; email: string; exp: number; iat: number;
    phone: string; role: string; session_id: string; sub: string;
    amr?: { method: string; timestamp: number; }[];
    app_metadata?: { provider?: string; providers?: string[];[key: string]: any; };
    is_anonymous?: boolean; iss?: string; jti?: string; nbf?: string;
    user_metadata?: { [key: string]: any; };
} & jose.JWTPayload;

export const handle: Handle = async ({ event, resolve }) => {
    console.log(`\n--- Handling request for: ${event.url.pathname} ---`); // DEBUG

    // Use explicit getAll/setAll cookie handlers
    event.locals.supabase = createServerClient(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll: () => {
                    const cookies = event.cookies.getAll();
                    console.log(`[DEBUG Hooks - getAll] Found ${cookies.length} cookies.`); // DEBUG
                    return cookies;
                },
                setAll: (cookies) => {
                    console.log(`[DEBUG Hooks - setAll] Setting ${cookies.length} cookies:`, JSON.stringify(cookies.map(c => c.name))); // DEBUG
                    cookies.forEach(({ name, value, options }) => {
                        event.cookies.set(name, value, { ...options, path: '/' })
                    })
                }
            }
        }
    );

    // Define getSession with JWT validation
    event.locals.getSession = async (): Promise<Session | null> => {
        console.log('[DEBUG getSession in Hook] Running...'); // DEBUG
        const {
            data: { session: rawSession },
            error: getSessionError
        } = await event.locals.supabase.auth.getSession();

        if (getSessionError) {
            console.error('[ERROR getSession in Hook] supabase.auth.getSession() error:', getSessionError.message);
        }

        if (!rawSession) {
            console.log('[DEBUG getSession in Hook] Raw session NOT FOUND by supabase.auth.getSession().');
            event.locals.accessToken = null;
            return null;
        }
        console.log('[DEBUG getSession in Hook] Raw session FOUND by supabase.auth.getSession(). User ID:', rawSession.user?.id); // DEBUG

        try {
            console.log('[DEBUG getSession in Hook] Attempting JWT validation...'); // DEBUG
            const secret = new TextEncoder().encode(JWT_SECRET);
            const { payload: decoded }: { payload: SupabaseJwt } = await jose.jwtVerify(rawSession.access_token, secret);
            console.log('[DEBUG getSession in Hook] JWT validation SUCCESSFUL.'); // DEBUG

            const validated_session: Session = { /* ... reconstruction logic ... */
                access_token: rawSession.access_token,
                refresh_token: rawSession.refresh_token,
                expires_at: decoded.exp,
                expires_in: decoded.exp ? decoded.exp - Math.round(Date.now() / 1000) : 0,
                token_type: 'bearer',
                user: {
                    id: decoded.sub, aud: decoded.aud, role: decoded.role ?? 'authenticated',
                    email: decoded.email, phone: decoded.phone, created_at: rawSession.user?.created_at ?? '',
                    app_metadata: decoded.app_metadata ?? {}, user_metadata: decoded.user_metadata ?? {},
                    is_anonymous: decoded.is_anonymous ?? false
                }
            };
            event.locals.accessToken = validated_session.access_token;
            return validated_session;
        } catch (err: any) {
            console.error('[ERROR getSession in Hook] JWT validation FAILED:', err.message); // DEBUG
            event.locals.accessToken = null;
            return null;
        }
    };

    // Call getSession ONCE and store the result in locals.session
    event.locals.session = await event.locals.getSession();
    console.log('[DEBUG Hooks] Stored session in locals:', event.locals.session ? `User: ${event.locals.session.user.id}` : 'null'); // DEBUG


    // --- Route Guarding ---
    // Use the session stored directly in locals for guarding
    const sessionForGuard = event.locals.session; // Read the value we just stored

    // Log the value being used for the guard check
    if (sessionForGuard) {
        console.log(`[DEBUG Hook Guard] Using session FOUND in locals. User: ${sessionForGuard.user.id}`); // DEBUG
    } else {
        console.log(`[DEBUG Hook Guard] Using session NOT FOUND in locals.`); // DEBUG
    }

    const protectedPaths = new Set(['(app)']); // Ensure this matches your protected route group name
    const requestedPathSegment = event.route.id?.split('/')[1] || '';

    if (!sessionForGuard && protectedPaths.has(requestedPathSegment)) {
        console.warn(`[GUARD Hook] Access denied to ${event.route.id}. No session in locals. Redirecting to /login.`); // DEBUG
        redirect(303, 'auth/login');
    }

    const publicAuthPaths = new Set(['login', 'signup']);
    if (sessionForGuard && publicAuthPaths.has(requestedPathSegment)) {
        console.log(`[GUARD Hook] User already logged in (session in locals). Redirecting from ${event.url.pathname} to /dashboard.`); // DEBUG
        redirect(303, '/dashboard');
    }

    console.log(`[DEBUG Hooks] Resolving request for ${event.url.pathname}`); // DEBUG
    /**
     * Resolve the request.
     * SvelteKit automatically passes `event.locals.session` to the root layout data.
     */
    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            return name === 'content-range' || name === 'x-supabase-api-version';
        }
    });
};