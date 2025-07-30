// File: frontend/src/routes/api/newsletter/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { validateEmail } from '$lib/utils/validation';
import { emailService } from '$lib/server/emailService';

interface SubscribeRequest {
    email: string;
    language?: string;
    source?: string;
}

interface SubscribeResponse {
    success: boolean;
    message: string;
}

export const POST: RequestHandler = async ({ request }) => {
    try {
        // Parse request body
        const body: SubscribeRequest = await request.json();

        // Validate email
        if (!body.email) {
            return json({ error: 'Email è obbligatoria' }, { status: 400 });
        }

        const email = body.email.toLowerCase().trim();

        if (!validateEmail(email)) {
            return json({ error: 'Formato email non valido' }, { status: 400 });
        }

        // Send welcome email using existing service
        await emailService.sendWelcomeEmail(email, {
            language: body.language || 'it',
            source: body.source || 'website'
        });

        // Success response
        const response: SubscribeResponse = {
            success: true,
            message: 'Iscrizione completata! Ti abbiamo inviato un\'email di benvenuto.'
        };

        return json(response);

    } catch (err) {
        console.error('Newsletter signup error:', err);
        return json(
            { error: 'Si è verificato un errore nell\'invio dell\'email. Riprova più tardi.' },
            { status: 500 }
        );
    }
};

export const GET: RequestHandler = async () => {
    return json({ error: 'Metodo non supportato' }, { status: 405 });
};