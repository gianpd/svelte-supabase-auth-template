/**
 * @file Signup Page Server Load & Actions (signup/+page.server.ts)
 * @description Handles server-side logic for the signup page:
 * - Redirects authenticated users.
 * - Initializes the signup form using Superforms.
 * - Handles form submission for user registration via Supabase Auth.
 * - Provides comprehensive error handling for Supabase authentication errors.
 *
 * @dependencies
 * - @sveltejs/kit: Provides `Actions`, `fail`, `redirect` types and functions.
 * - App.Locals: Access to `supabase` client and `getSession` initialized in hooks.
 * - sveltekit-superforms: Provides `superValidate`, `message`, `setError`.
 * - sveltekit-superforms/adapters: Provides `zod` adapter.
 * - ./schema: Contains the Zod schema for signup form validation.
 */

import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ locals: { getSession }, url }) => {
    const session = await getSession();
    // If user is already logged in, redirect them
    if (session) {
        console.log('[Signup Page Load] User already logged in, redirecting to dashboard.');
        // Use 'next' param if present, otherwise default to dashboard
        const redirectTo = url.searchParams.get('next') ?? '/dashboard';
        throw redirect(303, redirectTo);
    }

    // Initialize the signup form on page load
    return { form: await superValidate(zod(formSchema)) };
};

// Error patterns that indicate duplicate email
const duplicateEmailPatterns = [
    'already registered',
    'already exists',
    'A user with this email address has already been registered',
    'User already registered',
    'This email is already in use',
    'duplicate key value violates unique constraint',
    'unique constraint',
    'unique violation',
    'email address is already in use',
    'Email already in use'
];

// Helper function to check if an error message indicates a duplicate email
const isDuplicateEmailError = (message) => {
    if (!message) return false;
    return duplicateEmailPatterns.some(pattern =>
        message.toLowerCase().includes(pattern.toLowerCase()));
};

export const actions: Actions = {
    /**
     * Default action for handling email/password signup form submission.
     */
    default: async ({ request, locals: { supabase }, url }) => {
        console.log('[Signup Action] Received POST request.');

        try {
            // Validate the form data against the Zod schema
            const form = await superValidate(request, zod(formSchema));
            console.log('[Signup Action] Form validation result:', form);

            // Basic server-side check if validation failed (client-side should catch most)
            if (!form.valid) {
                console.log('[Signup Action] Form invalid.');
                // Return validation errors
                return fail(400, { form });
            }

            // Extract form data
            const { email, password, fullName } = form.data;

            console.log(`[Signup Action] Attempting signup for: ${email}`);
            const { data: signupData, error: signupError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    // Store optional data like full name in user_metadata
                    data: {
                        full_name: fullName || '' // Use provided name or empty string
                    },
                    // Use current URL as base for redirect
                    emailRedirectTo: `${url.origin}/auth/callback`
                }
            });



            // Handle Supabase Signup Errors
            if (signupError) {
                console.error('[Signup Action] Supabase signup error:', signupError);

                // Check specifically for duplicate email errors
                if (isDuplicateEmailError(signupError.message)) {
                    console.log('[Signup Action] Detected duplicate email error');
                    return setError(form, 'email', 'An account with this email already exists. Try logging in.');
                }

                // Handle password errors
                if (signupError.message.toLowerCase().includes('password')) {
                    return setError(form, 'password', signupError.message);
                }

                // Generic error for other cases
                return message(form, `Registration error: ${signupError.message}`, {
                    status: signupError.status || 500
                });
            }

            // --- Handle Signup Success ---
            // Check if email confirmation is required
            if (signupData.user && !signupData.session) {
                console.log('[Signup Action] Signup successful, email confirmation required.');
                return message(form, 'Signup successful! Please check your email to confirm your account.', { status: 200 });
            }

            // Handle case where signup might auto-verify
            if (signupData.session) {
                console.log('[Signup Action] Signup successful and session created. Redirecting...');
                throw redirect(303, '/dashboard');
            }

            // Fallback success message
            console.log('[Signup Action] Signup process completed.');
            return message(form, 'Signup process completed. Please check your email.', { status: 200 });

        } catch (error) {
            // Catch any unexpected errors not returned by Supabase API
            console.error('[Signup Action] Unexpected error:', error);

            // Create a new form to attach the error
            const form = await superValidate(zod(formSchema));

            // Check if it's a known error type or just show generic message
            const errorMessage = error instanceof Error
                ? error.message
                : 'An unexpected error occurred';

            return message(form, `An unexpected error occurred. Please try again later. (${errorMessage})`, { status: 500 });
        }
    }
};