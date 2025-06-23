/**
 * @file English translations
 * @description Contains all English translations for the application
 * 
 * This file exports a dictionary of English translation strings used throughout
 * the application. Keys should follow a consistent naming convention using
 * dot notation for namespacing.
 * 
 * Translation structure:
 * - Top-level keys represent modules/features (e.g., 'header', 'booking')
 * - Nested keys represent specific UI elements or messages
 * 
 * @notes
 * - Always use the same keys across all language files
 * - Keep translations concise and culturally appropriate
 * - Use placeholders ({variable}) for dynamic content
 */

import type { BaseTranslation } from "typesafe-i18n";

const en: BaseTranslation = {
    // Common UI elements
    common: {
        loading: 'Loading...',
        submit: 'Submit',
        cancel: 'Cancel',
        error: 'An error occurred',
        tryAgain: 'Try again'
    },

    // Navigation
    navigation: {
        home: 'Home',
        about: 'About',
        visit: 'Plan Your Visit',
        contact: 'Contact Us',
        book: 'Book Tickets',
        shop: 'Museum Shop'
    },

    // Language names
    languages: {
        en: 'English',
        it: 'Italian',
        de: 'German'
    },

    // Placeholder for booking module (will be expanded later)
    booking: {
        title: 'Book Your Visit'
    }
};

export default en;