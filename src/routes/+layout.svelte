<!--
/**
 * @file +layout.svelte (Root Layout)
 * @description The main layout for the entire Zungri Museum application.
 * Includes global styles, fonts, authentication setup, and the main
 * page structure with header and footer.
 *
 * Key features:
 * - Global CSS and font imports
 * - Supabase authentication listener initialization
 * - Main site header and footer
 * - Responsive layout structure
 * - Authentication state management
 *
 * @dependencies
 * - $lib/stores/authStore: Authentication state management
 * - $lib/components/Header.svelte: Main navigation header
 * - $lib/components/Footer.svelte: Site footer
 * - ../app.css: Global styles including Tailwind
 *
 * @notes
 * - Initializes auth listener once on client mount
 * - Uses Svelte 5 $effect for lifecycle management
 * - Provides consistent layout for all pages
 * - Handles authentication cleanup on unmount
 */
-->
<script lang="ts">
	import '../app.css'; // Global styles including Tailwind
	import { initializeAuthListener } from '$lib/stores/authStore';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();

	// Initialize the Supabase auth listener when the component mounts on the client
	$effect(() => {
		const unsubscribe = initializeAuthListener();
		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		};
	});
</script>

<!-- Page structure with header, main content, and footer -->
<div class="flex min-h-screen flex-col bg-gray-50">
	<!-- Main site header with navigation -->
	<Header />

	<!-- Main content area -->
	<main class="flex-grow">
		{@render children()}
	</main>

	<!-- Site footer -->
	<Footer />
</div>

<!-- Global styles -->
<style>
	:global(body) {
		font-family: 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
		line-height: 1.6;
	}

	:global(h1, h2, h3, h4, h5, h6) {
		font-family: 'Poppins', 'Inter', 'Segoe UI', sans-serif;
		font-weight: 600;
		line-height: 1.3;
	}

	/* Smooth scroll behavior */
	:global(html) {
		scroll-behavior: smooth;
	}

	/* Focus styles for accessibility */
	:global(*:focus) {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}

	/* Custom scrollbar for webkit browsers */
	:global(::-webkit-scrollbar) {
		width: 8px;
	}

	:global(::-webkit-scrollbar-track) {
		background: #f1f5f9;
	}

	:global(::-webkit-scrollbar-thumb) {
		background: #cbd5e1;
		border-radius: 4px;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background: #94a3b8;
	}
</style>
