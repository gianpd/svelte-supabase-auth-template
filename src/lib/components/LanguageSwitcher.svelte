<!--
/**
 * @file LanguageSwitcher.svelte
 * @description Language switcher component for the Zungri Museum website.
 * Allows users to switch between Italian, English, and German languages.
 * Uses Paraglide for internationalization and URL-based locale switching.
 *
 * Key features:
 * - Dropdown menu for language selection
 * - Current language indication
 * - Smooth transitions and hover effects
 * - Keyboard navigation support
 * - Automatic URL localization
 *
 * @dependencies
 * - $lib/paraglide/runtime: Paraglide i18n runtime for locale switching
 * - $lib/paraglide/messages: Language labels
 * - lucide-svelte: Icons for UI
 * - $app/navigation: SvelteKit navigation utilities
 *
 * @notes
 * - Uses Paraglide's setLocale function for language switching
 * - Supports keyboard navigation (Enter, Escape, Arrow keys)
 * - Implements proper ARIA attributes for accessibility
 * - Uses flag emojis for visual language identification
 */
-->
<script lang="ts">
	import { setLocale, getLocale, locales } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import { ChevronDown, Globe } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	// Language configuration with labels and flags
	const languageOptions = [
		{
			code: 'it',
			label: m.languages_it,
			nativeLabel: 'Italiano',
			flag: '🇮🇹'
		},
		{
			code: 'en',
			label: m.languages_en,
			nativeLabel: 'English',
			flag: '🇬🇧'
		},
		{
			code: 'de',
			label: m.languages_de,
			nativeLabel: 'Deutsch',
			flag: '🇩🇪'
		}
	];

	// Component state
	let isOpen = $state(false);
	let currentLocale = $state(getLocale());

	// Get current language info
	let currentLanguage = $derived(
		languageOptions.find((lang) => lang.code === currentLocale) || languageOptions[0]
	);

	// Update current locale when it changes
	$effect(() => {
		currentLocale = getLocale();
	});

	// Close dropdown when clicking outside or on route change
	$effect(() => {
		page.url.pathname;
		isOpen = false;
	});

	// Handle language change
	async function handleLanguageChange(newLocale: string) {
		try {
			// Set the new locale using Paraglide
			setLocale(newLocale as any);
			isOpen = false;

			// The page will automatically reload with the new locale
			// due to Paraglide's URL-based routing
		} catch (error) {
			console.error('Error changing language:', error);
		}
	}

	// Toggle dropdown
	function toggleDropdown() {
		isOpen = !isOpen;
	}

	// Close dropdown
	function closeDropdown() {
		isOpen = false;
	}

	// Handle keyboard navigation
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeDropdown();
		} else if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggleDropdown();
		}
	}

	// Handle option selection with keyboard
	function handleOptionKeydown(event: KeyboardEvent, locale: string) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleLanguageChange(locale);
		}
	}
</script>

<div class="relative">
	<!-- Language Switcher Button -->
	<button
		type="button"
		class="inline-flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
		aria-expanded={isOpen}
		aria-haspopup="listbox"
		aria-label="Change language"
		on:click={toggleDropdown}
		on:keydown={handleKeydown}
	>
		<!-- Globe icon for desktop, flag for mobile -->
		<div class="flex items-center space-x-1">
			<Globe class="h-4 w-4 text-gray-500 sm:hidden" />
			<span class="hidden text-sm sm:inline">{currentLanguage.flag}</span>
			<span class="hidden sm:inline">{currentLanguage.nativeLabel}</span>
			<span class="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
		</div>
		<ChevronDown
			class="h-4 w-4 text-gray-500 transition-transform duration-200 {isOpen
				? 'rotate-180'
				: 'rotate-0'}"
		/>
	</button>

	<!-- Dropdown Menu -->
	{#if isOpen}
		<div
			class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
			role="listbox"
			aria-label="Language options"
		>
			{#each languageOptions as language}
				<button
					type="button"
					class="flex w-full items-center space-x-3 px-4 py-2 text-left text-sm transition-colors duration-200 {language.code ===
					currentLocale
						? 'bg-blue-50 text-blue-700'
						: 'text-gray-700 hover:bg-gray-50'}"
					role="option"
					aria-selected={language.code === currentLocale}
					tabindex={isOpen ? 0 : -1}
					on:click={() => handleLanguageChange(language.code)}
					on:keydown={(e) => handleOptionKeydown(e, language.code)}
				>
					<span class="text-lg">{language.flag}</span>
					<div class="flex flex-col">
						<span class="font-medium">{language.nativeLabel}</span>
						<span class="text-xs text-gray-500">{language.label()}</span>
					</div>
					{#if language.code === currentLocale}
						<div class="ml-auto">
							<svg
								class="h-4 w-4 text-blue-600"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

<!-- Close dropdown when clicking outside -->
<svelte:window
	on:click={(e) => {
		if (isOpen && !e.target?.closest('.relative')) {
			closeDropdown();
		}
	}}
/>
