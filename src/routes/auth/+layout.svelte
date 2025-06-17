<!--
/**
 * @file +layout.svelte
 * @description Enhanced layout for authentication pages with smooth transitions,
 * improved accessibility, responsive design, and better error handling.
 *
 * @features
 * - Elegant loading states with fade transitions
 * - Responsive design with proper spacing on all devices
 * - Improved accessibility with aria attributes
 * - Proper error handling with user feedback
 * - Dynamic navigation links based on current route
 * - Subtle animations for better user experience
 */
-->
<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { sessionStore, authReady } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let { children } = $props();

	let authError: string | null = $state(null);
	let isRedirecting = $state(false);

	// Auth page config
	const authRoutes = [
		{
			path: '/auth/login',
			links: [
				{
					label: 'Sign up',
					href: '/auth/signup',
					prompt: "Don't have an account?"
				},
				{
					label: 'Forgot your password?',
					href: '/auth/reset-password',
					prompt: '',
					size: 'sm'
				}
			]
		},
		{
			path: '/auth/signup',
			links: [
				{
					label: 'Log in',
					href: '/auth/login',
					prompt: 'Already have an account?'
				}
			]
		},
		{
			path: '/auth/reset-password',
			links: [
				{
					label: 'Back to login',
					href: '/auth/login',
					prompt: 'Remember your password?'
				}
			]
		}
		// Add new auth routes here, eg: verify-email, magic-link, etc
	];

	// Get current route info
	let currentPath = $derived(page.url.pathname);
	let currentAuthRoute = $derived(authRoutes.find((r) => r.path === currentPath));

	$effect(() => {
		let unsubAuthReady: (() => void) | undefined;
		let unsubSession: (() => void) | undefined;

		unsubAuthReady = authReady.subscribe((ready) => {
			if (ready) {
				unsubSession = sessionStore.subscribe((session) => {
					// Only try redirect if there is a session and we aren't already on /dashboard
					if (session && page.url.pathname !== '/dashboard') {
						isRedirecting = true;
						goto('/dashboard', { replaceState: true }).catch((error) => {
							isRedirecting = false;
							authError = 'Navigation error. Please try again.';
							console.error('[AuthLayout] Navigation error:', error);
						});
					}
				});
			}
		});

		return () => {
			unsubAuthReady && unsubAuthReady();
			unsubSession && unsubSession();
		};
	});
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4 text-white sm:p-6"
>
	<div class="w-full max-w-md" in:fade={{ duration: 300, delay: 150 }}>
		<!-- Logo and branding -->
		<div class="mb-8 text-center">
			<a href="/" class="group inline-flex items-center" aria-label="Go to homepage">
				<span
					class="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-3xl font-bold text-transparent transition-all duration-300 group-hover:from-blue-300 group-hover:to-blue-500"
				>
					Project NAME
				</span>
			</a>
			<p class="mt-2 text-sm text-gray-400">Your business connection platform</p>
		</div>
		<div
			class="overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-2xl"
			in:fly={{ y: 20, duration: 400, delay: 200 }}
		>
			<!-- State management -->
			{#if !$authReady}
				<div class="p-8 text-center" aria-live="polite">
					<div class="mb-4 flex justify-center">
						<div
							class="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-blue-500"
						></div>
					</div>
					<p class="text-gray-300">Preparing your authentication...</p>
				</div>
			{:else if isRedirecting}
				<div class="p-8 text-center" aria-live="polite">
					<div class="mb-4 flex justify-center">
						<div
							class="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-blue-500"
						></div>
					</div>
					<p class="text-gray-300">Redirecting to your dashboard...</p>
				</div>
			{:else if authError}
				<div class="bg-red-900/30 p-6 text-center" role="alert" aria-live="assertive">
					<p class="text-red-200">{authError}</p>
					<button
						class="mt-2 rounded-md bg-red-800 px-4 py-1 text-sm transition-colors hover:bg-red-700"
						on:click={() => (authError = null)}
					>
						Dismiss
					</button>
				</div>
				<div class="p-6 sm:p-8">
					{@render children()}
				</div>
			{:else}
				<div class="p-6 sm:p-8">
					{@render children()}
				</div>
			{/if}
		</div>
		<!-- Dynamic navigation links -->
		<div class="mt-6 text-center" in:fade={{ duration: 300, delay: 400 }}>
			{#if currentAuthRoute}
				{#each currentAuthRoute.links as l}
					{#if l.prompt}
						<p class="text-gray-300">
							{l.prompt}
							<a
								href={l.href}
								class={`font-medium text-blue-400 underline-offset-2 transition-colors hover:text-blue-300 hover:underline ${l.size === 'sm' ? 'text-sm' : ''}`}
							>
								{l.label}
							</a>
						</p>
					{:else}
						<p class="text-sm text-gray-400">
							<a href={l.href} class="transition-colors hover:text-gray-300">
								{l.label}
							</a>
						</p>
					{/if}
				{/each}
			{/if}
			<!-- Footer info -->
			<div class="mt-8 text-xs text-gray-500">
				<p>
					© {new Date().getFullYear()} B2B Deals, Inc. All rights reserved.
				</p>
				<div class="mt-2 flex justify-center space-x-4">
					<a href="/privacy" class="transition-colors hover:text-gray-400">Privacy</a>
					<a href="/terms" class="transition-colors hover:text-gray-400">Terms</a>
					<a href="/help" class="transition-colors hover:text-gray-400">Help</a>
				</div>
			</div>
		</div>
	</div>
</div>
