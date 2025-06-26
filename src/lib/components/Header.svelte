<!--
/**
 * @file Header.svelte
 * @description Main navigation header for the Zungri Museum website.
 * Features responsive design with mobile menu, multilingual navigation,
 * and museum branding.
 *
 * Key features:
 * - Fully responsive navigation with mobile hamburger menu
 * - Language switcher integration
 * - Museum logo and branding
 * - Navigation links for all main sections
 * - Shopping cart and booking CTAs
 * - Optimized for all screen sizes including very small devices
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
 * - Handles very small screens (320px+)
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

	// Close mobile menu when clicking outside (optional - can be removed if causing issues)
	function handleClickOutside(event: MouseEvent) {
		if (mobileMenuOpen && event.target && !(event.target as Element).closest('header')) {
			mobileMenuOpen = false;
		}
	}
</script>

<svelte:document on:keydown={handleKeydown} />

<header class="sticky top-0 z-50 bg-white shadow-md">
	<div class="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
		<div class="flex h-14 items-center justify-between sm:h-16">
			<!-- Logo and Museum Name -->
			<div class="flex min-w-0 flex-shrink-0 items-center">
				<a
					href="/"
					class="flex items-center space-x-2 text-blue-600 transition-colors duration-200 hover:text-blue-700 sm:space-x-3"
				>
					<!-- Museum Logo/Icon -->
					<div
						class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:h-10 sm:w-10"
					>
						<svg
							class="h-4 w-4 sm:h-6 sm:w-6"
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
					<div class="xs:block hidden min-w-0 sm:block">
						<h1 class="truncate text-base font-bold text-gray-900 sm:text-xl">Museo di Zungri</h1>
						<p class="hidden text-xs text-gray-600 sm:block">Calabria, Italia</p>
					</div>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<nav class="hidden lg:flex lg:items-center lg:space-x-6 xl:space-x-8">
				{#each navigationItems as item}
					<a
						href={item.href}
						class="inline-flex items-center space-x-1 whitespace-nowrap text-sm font-medium transition-colors duration-200 {isActiveRoute(
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
			<div class="hidden md:flex md:items-center md:space-x-2 lg:space-x-4">
				{#each actionButtons as button}
					<a
						href={button.href}
						class="inline-flex items-center space-x-1 whitespace-nowrap rounded-md px-2 py-2 text-xs font-medium transition-colors duration-200 sm:space-x-2 sm:px-4 sm:text-sm {button.variant ===
						'primary'
							? 'bg-blue-600 text-white hover:bg-blue-700'
							: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}"
					>
						<svelte:component this={button.icon} class="h-3 w-3 sm:h-4 sm:w-4" />
						<span class="hidden sm:inline">{button.label()}</span>
						<span class="sm:hidden">{button.label().split(' ')[0]}</span>
					</a>
				{/each}

				<!-- Language Switcher -->
				<div class="flex-shrink-0">
					<LanguageSwitcher />
				</div>
			</div>

			<!-- Mobile Menu Button -->
			<div class="flex md:hidden">
				<button
					type="button"
					class="inline-flex items-center justify-center rounded-md p-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
					aria-expanded={mobileMenuOpen}
					aria-label="Toggle navigation menu"
					on:click={toggleMobileMenu}
				>
					{#if mobileMenuOpen}
						<X class="h-5 w-5 sm:h-6 sm:w-6" />
					{:else}
						<Menu class="h-5 w-5 sm:h-6 sm:w-6" />
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Navigation Menu -->
	{#if mobileMenuOpen}
		<div class="mobile-menu md:hidden">
			<div
				class="max-h-screen overflow-y-auto border-t border-gray-200 bg-white px-3 pb-3 pt-2 shadow-lg sm:px-4"
			>
				<!-- Mobile Navigation Links -->
				<div class="space-y-1">
					{#each navigationItems as item}
						<a
							href={item.href}
							class="flex items-center space-x-3 rounded-md px-3 py-3 text-base font-medium transition-colors duration-200 {isActiveRoute(
								item.href
							)
								? 'bg-blue-50 text-blue-600'
								: 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}"
						>
							{#if item.icon}
								<svelte:component this={item.icon} class="h-5 w-5 flex-shrink-0" />
							{/if}
							<span class="truncate">{item.label()}</span>
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
							<svelte:component this={button.icon} class="h-5 w-5 flex-shrink-0" />
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

<style>
	/* Custom responsive breakpoint for very small screens */
	@media (min-width: 375px) {
		.xs\:block {
			display: block;
		}
	}

	/* Ensure smooth transitions */
	.mobile-menu {
		animation: slideDown 0.2s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Ensure proper text truncation on very small screens */
	@media (max-width: 374px) {
		h1 {
			font-size: 0.875rem;
		}
	}
</style>
