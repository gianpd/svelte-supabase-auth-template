// File: frontend/src/lib/server/newsletterService.ts
import { db } from '$lib/server/database';
import { logger } from '$lib/server/logger';
import { generateToken } from '$lib/utils/crypto';

export interface Subscriber {
    id: string;
    email: string;
    isActive: boolean;
    isConfirmed: boolean;
    isUnsubscribed: boolean;
    language: string;
    source: string;
    confirmationToken?: string;
    unsubscribeToken: string;
    subscribedAt: Date;
    confirmedAt?: Date;
    unsubscribedAt?: Date;
    ip: string;
    userAgent: string;
    metadata?: Record<string, any>;
}

export interface CreateSubscriberData {
    email: string;
    language: string;
    source: string;
    ip: string;
    userAgent: string;
    requiresConfirmation: boolean;
}

class NewsletterService {
    async findSubscriber(email: string): Promise<Subscriber | null> {
        try {
            const subscriber = await db.newsletter_subscribers.findUnique({
                where: { email }
            });
            return subscriber;
        } catch (error) {
            logger.error('Error finding subscriber', { email, error });
            throw new Error('Database error');
        }
    }

    async createSubscriber(data: CreateSubscriberData): Promise<Subscriber> {
        try {
            const confirmationToken = data.requiresConfirmation ? generateToken() : null;
            const unsubscribeToken = generateToken();

            const subscriber = await db.newsletter_subscribers.create({
                data: {
                    email: data.email,
                    isActive: !data.requiresConfirmation,
                    isConfirmed: !data.requiresConfirmation,
                    isUnsubscribed: false,
                    language: data.language,
                    source: data.source,
                    confirmationToken,
                    unsubscribeToken,
                    subscribedAt: new Date(),
                    confirmedAt: data.requiresConfirmation ? null : new Date(),
                    ip: data.ip,
                    userAgent: data.userAgent,
                    metadata: {
                        initialSource: data.source,
                        signupTimestamp: Date.now()
                    }
                }
            });

            logger.info('Newsletter subscriber created', {
                email: data.email,
                requiresConfirmation: data.requiresConfirmation
            });

            return subscriber;
        } catch (error) {
            logger.error('Error creating subscriber', { email: data.email, error });
            throw new Error('Database error');
        }
    }

    async reactivateSubscriber(email: string, metadata: Record<string, any>): Promise<void> {
        try {
            await db.newsletter_subscribers.update({
                where: { email },
                data: {
                    isActive: true,
                    isUnsubscribed: false,
                    unsubscribedAt: null,
                    metadata: {
                        ...metadata,
                        reactivatedAt: new Date()
                    }
                }
            });

            logger.info('Newsletter subscriber reactivated', { email });
        } catch (error) {
            logger.error('Error reactivating subscriber', { email, error });
            throw new Error('Database error');
        }
    }

    async confirmSubscriber(token: string): Promise<Subscriber | null> {
        try {
            const subscriber = await db.newsletter_subscribers.findFirst({
                where: { confirmationToken: token }
            });

            if (!subscriber) {
                return null;
            }

            const updatedSubscriber = await db.newsletter_subscribers.update({
                where: { id: subscriber.id },
                data: {
                    isActive: true,
                    isConfirmed: true,
                    confirmedAt: new Date(),
                    confirmationToken: null
                }
            });

            logger.info('Newsletter subscriber confirmed', { email: subscriber.email });
            return updatedSubscriber;
        } catch (error) {
            logger.error('Error confirming subscriber', { token, error });
            throw new Error('Database error');
        }
    }

    async unsubscribe(token: string): Promise<boolean> {
        try {
            const subscriber = await db.newsletter_subscribers.findFirst({
                where: { unsubscribeToken: token }
            });

            if (!subscriber) {
                return false;
            }

            await db.newsletter_subscribers.update({
                where: { id: subscriber.id },
                data: {
                    isActive: false,
                    isUnsubscribed: true,
                    unsubscribedAt: new Date()
                }
            });

            logger.info('Newsletter subscriber unsubscribed', { email: subscriber.email });
            return true;
        } catch (error) {
            logger.error('Error unsubscribing', { token, error });
            throw new Error('Database error');
        }
    }

    async getActiveSubscribers(limit?: number, offset?: number): Promise<Subscriber[]> {
        try {
            return await db.newsletter_subscribers.findMany({
                where: {
                    isActive: true,
                    isConfirmed: true,
                    isUnsubscribed: false
                },
                take: limit,
                skip: offset,
                orderBy: { subscribedAt: 'desc' }
            });
        } catch (error) {
            logger.error('Error getting active subscribers', { error });
            throw new Error('Database error');
        }
    }

    async getSubscriberStats(): Promise<{
        total: number;
        active: number;
        confirmed: number;
        unsubscribed: number;
    }> {
        try {
            const [total, active, confirmed, unsubscribed] = await Promise.all([
                db.newsletter_subscribers.count(),
                db.newsletter_subscribers.count({ where: { isActive: true } }),
                db.newsletter_subscribers.count({ where: { isConfirmed: true } }),
                db.newsletter_subscribers.count({ where: { isUnsubscribed: true } })
            ]);

            return { total, active, confirmed, unsubscribed };
        } catch (error) {
            logger.error('Error getting subscriber stats', { error });
            throw new Error('Database error');
        }
    }
}

export const newsletterService = new NewsletterService();