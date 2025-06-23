/**
 * @file Internationalization initialization
 * @description Configures typesafe-i18n for multilingual support
 * 
 * This file initializes the i18n system with support for Italian (default),
 * English, and German. It sets up translation loaders and registers the
 * localization system with SvelteKit.
 * 
 * Key features:
 * - Initializes i18n with Italian as default language
 * - Registers translation loaders for all supported languages
 * - Provides fallback to Italian when translations are missing
 * 
 * @dependencies
 * - typesafe-i18n: For core internationalization functionality
 * - ./i18n/en: English translations
 * - ./i18n/it: Italian translations
 * - ./i18n/de: German translations
 * 
 * @notes
 * - Add new languages by importing their translation files and updating loaders
 * - Fallback locale is Italian as per project requirements
 * - All translations are loaded synchronously for simplicity
 */

import { initI18nSvelte } from 'typesafe-i18n/svelte';
import en from './i18n/en';
import it from './i18n/it';
import de from './i18n/de';

// Configure supported locales and their loaders
const loaders = {
    en: () => en,
    it: () => it,
    de: () => de
};

// Initialize i18n with Italian as the default language
initI18nSvelte({
    loaders,
    fallbackLocale: 'it', // Italian is the default language
    // showKeyNotFound: false // Prevents showing missing keys in production
});