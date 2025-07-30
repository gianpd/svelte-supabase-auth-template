// File: frontend/src/lib/server/rateLimit.ts
import { Redis } from 'ioredis';
import { env } from '$env/dynamic/private';

const redis = new Redis(env.REDIS_URL);

interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    message: string;
}

interface RateLimitResult {
    allowed: boolean;
    count: number;
    resetTime: number;
}

export async function rateLimit(
    identifier: string,
    config: RateLimitConfig
): Promise<RateLimitResult> {
    const key = `rate_limit:${identifier}`;
    const now = Date.now();
    const window = Math.floor(now / config.windowMs);
    const windowKey = `${key}:${window}`;

    try {
        const count = await redis.incr(windowKey);

        if (count === 1) {
            await redis.expire(windowKey, Math.ceil(config.windowMs / 1000));
        }

        const resetTime = (window + 1) * config.windowMs - now;

        return {
            allowed: count <= config.maxRequests,
            count,
            resetTime
        };
    } catch (error) {
        // If Redis fails, allow the request but log the error
        console.error('Rate limiting error:', error);
        return {
            allowed: true,
            count: 0,
            resetTime: 0
        };
    }
}