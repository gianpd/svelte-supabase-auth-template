<!--
/**
 * @file Header.svelte
 * @description Main navigation header for the Zungri Museum website.
 * Features responsive design with mobile menu, multilingual navigation,
 * and museum branding.
 *
 * Key features:
 * - Responsive navigation with mobile hamburger menu
 * - Language switcher integration
 * - Museum logo and branding
 * - Navigation links for all main sections
 * - Shopping cart and booking CTAs
 *
 * @dependencies
 * - $lib/components/LanguageSwitcher.svelte: Language switching component
 * - $lib/paraglide/messages: Internationalization messages
 * - lucide-svelte: Icons for navigation
 * - $app/page: Current page state for active link highlighting
 *
 * @notes
 * - Uses Tailwind CSS for responsive design
 * - Implements mobile-first approach
 * - Supports keyboard navigation for accessibility
 */
-->
<script lang="ts">
	import { page } from '$app/state';
	import LanguageSwitcher from './LanguageSwitcher.svelte';
	import * as m from '$lib/paraglide/messages';
	import { Menu, X, ShoppingBag, Calendar, MapPin } from 'lucide-svelte';

	// Mobile menu state
	let mobileMenuOpen = $state(false);

	// Navigation items with i18n labels
	const navigationItems = [
		{
			href: '/',
			label: m.navigation_home,
			icon: null
		},
		{
			href: '/about',
			label: m.navigation_about,
			icon: null
		},
		{
			href: '/plan-your-visit',
			label: m.navigation_visit,
			icon: MapPin
		},
		{
			href: '/exhibitions',
			label: m.navigation_exhibitions,
			icon: null
		},
		{
			href: '/contact',
			label: m.navigation_contact,
			icon: null
		}
	];

	// Action buttons with i18n labels
	const actionButtons = [
		{
			href: '/book',
			label: m.navigation_book,
			icon: Calendar,
			variant: 'primary'
		},
		{
			href: '/shop',
			label: m.navigation_shop,
			icon: ShoppingBag,
			variant: 'secondary'
		}
	];

	// Check if current route is active
	function isActiveRoute(href: string): boolean {
		if (href === '/') {
			return page.url.pathname === '/';
		}
		return page.url.pathname.startsWith(href);
	}

	// Close mobile menu when route changes
	$effect(() => {
		page.url.pathname;
		mobileMenuOpen = false;
	});

	// Handle mobile menu toggle
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	// Handle escape key to close mobile menu
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && mobileMenuOpen) {
			mobileMenuOpen = false;
		}
	}
</script>

<svelte:document on:keydown={handleKeydown} />

<header class="sticky top-0 z-50 bg-white shadow-md">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo and Museum Name -->
			<div class="flex items-center">
				<a href="/" class="flex items-center space-x-3 text-blue-600 hover:text-blue-700">
					<!-- Museum Logo/Icon -->
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
						<svg
							class="h-6 w-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
							/>
						</svg>
					</div>
					<div class="hidden sm:block">
						<h1 class="text-xl font-bold">Museo di Zungri</h1>
						<p class="text-xs text-gray-600">Calabria, Italia</p>
					</div>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<nav class="hidden md:flex md:items-center md:space-x-8">
				{#each navigationItems as item}
					<a
						href={item.href}
						class="inline-flex items-center space-x-1 text-sm font-medium transition-colors duration-200 {isActiveRoute(
							item.href
						)
							? 'border-b-2 border-blue-600 text-blue-600'
							: 'text-gray-700 hover:text-blue-600'}"
					>
						{#if item.icon}
							<svelte:component this={item.icon} class="h-4 w-4" />
						{/if}
						<span>{item.label()}</span>
					</a>
				{/each}
			</nav>

			<!-- Action Buttons and Language Switcher (Desktop) -->
			<div class="hidden md:flex md:items-center md:space-x-4">
				{#each actionButtons as button}
					<a
						href={button.href}
						class="inline-flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 {button.variant ===
						'primary'
							? 'bg-blue-600 text-white hover:bg-blue-700'
							: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}"
					>
						<svelte:component this={button.icon} class="h-4 w-4" />
						<span>{button.label()}</span>
					</a>
				{/each}

				<!-- Language Switcher -->
				<LanguageSwitcher />
			</div>

			<!-- Mobile Menu Button -->
			<div class="md:hidden">
				<button
					type="button"
					class="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
					aria-expanded={mobileMenuOpen}
					aria-label="Toggle navigation menu"
					on:click={toggleMobileMenu}
				>
					{#if mobileMenuOpen}
						<X class="h-6 w-6" />
					{:else}
						<Menu class="h-6 w-6" />
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Navigation Menu -->
	{#if mobileMenuOpen}
		<div class="md:hidden">
			<div class="border-t border-gray-200 bg-white px-2 pb-3 pt-2 shadow-lg">
				<!-- Mobile Navigation Links -->
				<div class="space-y-1">
					{#each navigationItems as item}
						<a
							href={item.href}
							class="flex items-center space-x-3 rounded-md px-3 py-2 text-base font-medium transition-colors duration-200 {isActiveRoute(
								item.href
							)
								? 'bg-blue-50 text-blue-600'
								: 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}"
						>
							{#if item.icon}
								<svelte:component this={item.icon} class="h-5 w-5" />
							{/if}
							<span>{item.label()}</span>
						</a>
					{/each}
				</div>

				<!-- Mobile Action Buttons -->
				<div class="mt-4 space-y-2 border-t border-gray-200 pt-4">
					{#each actionButtons as button}
						<a
							href={button.href}
							class="flex items-center justify-center space-x-2 rounded-md px-4 py-3 text-base font-medium transition-colors duration-200 {button.variant ===
							'primary'
								? 'bg-blue-600 text-white hover:bg-blue-700'
								: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}"
						>
							<svelte:component this={button.icon} class="h-5 w-5" />
							<span>{button.label()}</span>
						</a>
					{/each}
				</div>

				<!-- Mobile Language Switcher -->
				<div class="mt-4 border-t border-gray-200 pt-4">
					<LanguageSwitcher />
				</div>
			</div>
		</div>
	{/if}
</header>
