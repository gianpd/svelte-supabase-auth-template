/**
 * @file German translations
 * @description Contains all German translations for the application
 * 
 * This file exports a dictionary of German translation strings. All keys should
 * match exactly with the Italian and English translation files.
 * 
 * @notes
 * - Use formal German appropriate for a cultural institution
 * - Maintain consistent terminology with other translations
 * - Pay attention to German compound nouns and grammatical gender
 */

import type { BaseTranslation } from "typesafe-i18n";

const de: BaseTranslation = {
    common: {
        loading: 'Wird geladen...',
        submit: 'Absenden',
        cancel: 'Abbrechen',
        error: 'Ein Fehler ist aufgetreten',
        tryAgain: 'Erneut versuchen'
    },

    navigation: {
        home: 'Startseite',
        about: 'Über uns',
        visit: 'Besuch planen',
        contact: 'Kontakt',
        book: 'Tickets buchen',
        shop: 'Museumsshop'
    },

    languages: {
        en: 'Englisch',
        it: 'Italienisch',
        de: 'Deutsch'
    },

    booking: {
        title: 'Besuch buchen'
    }
};

export default de;