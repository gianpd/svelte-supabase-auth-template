/**
* @file +page.server.ts (Contact Page)
* @description Server-side logic for the Contact Us page.
* - Initializes the contact form using Superforms.
* - Handles form submission by calling the backend API.
*
* @dependencies
* - @sveltejs/kit: For `fail` action response.
* - sveltekit-superforms: For form management and validation.
* - ./schema: Zod schema for form validation.
*/
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import type { Action } from '@sveltejs/kit';


export const load = async () => {
    // Initialize the form on page load
    return {
        form: await superValidate(zod(formSchema))
    };
};

export const actions: Action = () {
    default: async ({ request, fetch }) => {
    const form = await superValidate(request, zod(formSchema));

    if (!form.valid) {
        // Return validation errors
        return fail(400, { form });
    }

    try {
        // Forward the validated data to the backend API
        const response = await fetch('/api/v1/content/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form.data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return message(form, `Error: ${errorData.detail || 'Failed to send message.'}`, {
                status: response.status
            });
        }

        // Return a success message
        return message(form, 'Thank you for your message! We will get back to you shortly.');
    } catch (e) {
        console.error('Contact form submission error:', e);
        return message(form, 'An unexpected server error occurred. Please try again later.', {
            status: 500
        });
    }
}
};