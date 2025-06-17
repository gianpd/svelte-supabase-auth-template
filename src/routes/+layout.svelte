<!--
/**
 * @file +layout.svelte (Root Layout)
 * @description The main layout for the entire application.
 * It sets up global styles, fonts, and initializes client-side services like Supabase auth listener.
 *
 * @dependencies
 * - $app/navigation: `goto` for navigation.
 * - $lib/stores/session: `initializeAuthListener` to set up Supabase auth state listener.
 * - svelte: `onMount` lifecycle hook.
 *
 * @notes
 * - The `initializeAuthListener` is called here to ensure it runs once on client mount.
 * - Includes global CSS and font imports.
 * - The main page content is rendered via the <slot />.
 */
-->
<script lang="ts">
	import '../app.css'; // Global styles including Tailwind
	import { initializeAuthListener } from '$lib/stores/authStore';

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

<!-- 
  The main application content will be slotted here.
  The previous landing page content has been removed from this root layout.
  It should reside in `src/routes/+page.svelte` if it's the homepage.
-->
<div class="flex min-h-screen flex-col bg-gray-300 text-white">
	{@render children()}
</div>

<!-- 
  The previous styling in <style> block seems to be for a specific landing page, 
  not general app layout. It has been removed. Global styles should be in app.css.
  If specific styles are needed for this layout wrapper, they can be added here.
-->
<style>
	/* Minimal global layout styles can go here if not covered by app.css */
	:global(body) {
		font-family: 'Poppins', sans-serif;
		background-color: hsl(210, 20%, 12%); /* Default dark background from :root of previous style */
		color: hsl(0, 0%, 95%); /* Default light text */
	}
</style>
