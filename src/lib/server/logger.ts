// File: frontend/src/lib/server/logger.ts
import { dev } from '$app/environment';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: Record<string, any>;
}

class Logger {
    private formatLog(level: LogLevel, message: string, context?: Record<string, any>): LogEntry {
        return {
            level,
            message,
            timestamp: new Date().toISOString(),
            context
        };
    }

    private output(entry: LogEntry): void {
        const logMessage = dev
            ? `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${entry.context ? '\n' + JSON.stringify(entry.context, null, 2) : ''}`
            : JSON.stringify(entry);

        switch (entry.level) {
            case 'error':
                console.error(logMessage);
                break;
            case 'warn':
                console.warn(logMessage);
                break;
            case 'debug':
                if (dev) console.debug(logMessage);
                break;
            default:
                console.log(logMessage);
        }
    }

    info(message: string, context?: Record<string, any>): void {
        this.output(this.formatLog('info', message, context));
    }

    warn(message: string, context?: Record<string, any>): void {
        this.output(this.formatLog('warn', message, context));
    }

    error(message: string, context?: Record<string, any>): void {
        this.output(this.formatLog('error', message, context));
    }

    debug(message: string, context?: Record<string, any>): void {
        this.output(this.formatLog('debug', message, context));
    }
}

export const logger = new Logger();