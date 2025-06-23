/**
 * @file i18n utilities
 * @description Helper functions and constants for internationalization
 * 
 * Provides:
 * - Supported locales array
 * - Base locale (Italian)
 * - Type definitions for locales
 * - Utility functions for locale handling
 * 
 * @notes
 * - Add new locales to the locales array when supporting additional languages
 * - Always keep baseLocale as 'it' (Italian) per project requirements
 */

// Supported locales
export const locales = ['en', 'it', 'de'] as const;
export type Locales = typeof locales[number];

// Base locale (Italian)
export const baseLocale: Locales = 'it';

/**
 * Checks if a string is a valid locale
 * @param locale The locale string to check
 * @returns boolean indicating if the locale is supported
 */
export function isValidLocale(locale: string): locale is Locales {
    return locales.includes(locale as Locales);
}

/**
 * Gets the display name for a locale
 * @param locale The locale code
 * @returns Display name of the locale (e.g., "English" for 'en')
 */
export function getLocaleName(locale: Locales): string {
    const names: Record<Locales, string> = {
        en: 'English',
        it: 'Italiano',
        de: 'Deutsch'
    };
    return names[locale];
}

// Type for base translation structure
export type BaseTranslation = typeof import('./i18n/en').default;