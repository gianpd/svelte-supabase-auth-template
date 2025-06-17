<!--
/**
 * @file +page.svelte (Login Page)
 * @description Allows users to log in to the application using their email and password.
 *
 * Key features:
 * - Email and password input fields.
 * - Form submission handling.
 * - Interaction with Supabase for authentication.
 * - Display of loading states and error messages.
 * - Redirection to the dashboard upon successful login.
 *
 * @dependencies
 * - $app/navigation: For programmatic navigation (goto).
 * - $lib/utils/supabaseClient: The Supabase client instance.
 * - $lib/components/ui/Input.svelte: Reusable input component.
 * - $lib/components/ui/Button.svelte: Reusable button component.
 * - $lib/components/ui/Alert.svelte: Reusable alert component.
 * - $lib/stores/session: For checking auth state (optional here, primarily for layout).
 *
 * @notes
 * - Uses Svelte 5 runes ($state) for managing component state.
 * - Implements client-side authentication logic.
 */
-->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/utils/supabaseClient'; // Assuming this path from existing code
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let errorMessage = $state<string | null>(null);

	/**
	 * Handles the login form submission.
	 * Attempts to sign in the user with Supabase Auth.
	 * Manages loading states and displays errors if any.
	 * Redirects to '/dashboard' on successful login.
	 */
	async function handleLogin() {
		loading = true;
		errorMessage = null;

		try {
			const { error } = await supabase.auth.signInWithPassword({
				email: email,
				password: password
			});

			if (error) {
				console.error('Login error:', error);
				errorMessage = error.message;
			} else {
				// Supabase onAuthStateChange listener in session.ts will handle sessionStore update.
				// Redirect to dashboard.
				console.log('Login successful, redirecting to /dashboard...');
				goto('/dashboard');
			}
		} catch (err) {
			console.error('Unexpected error during login:', err);
			errorMessage = 'An unexpected error occurred. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<h1 class="mb-6 text-center text-2xl font-semibold text-white">Log In</h1>

{#if errorMessage}
	<Alert type="error" message={errorMessage} class="mb-4" />
{/if}

<form on:submit|preventDefault={handleLogin} class="space-y-5">
	<Input
		type="email"
		id="email"
		bind:value={email}
		placeholder="you@example.com"
		required
		disabled={loading}
	/>

	<Input
		type="password"
		id="password"
		bind:value={password}
		placeholder="••••••••"
		required
		disabled={loading}
	/>

	<div>
		<a href="/auth/reset-password" class="text-sm text-blue-400 hover:underline">Forgot password?</a
		>
	</div>

	<!-- Login page -->
	<Button type="submit" disabled={loading} {loading} class="w-full" variant="primary" size="lg">
		Sign In
	</Button>
</form>
