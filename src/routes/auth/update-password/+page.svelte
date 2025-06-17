<!-- src/routes/update-password/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/utils/supabaseClient';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let password = '';
	let confirmPassword = '';
	let loading = false;
	let error = '';
	let isValidSession = false;

	onMount(async () => {
		// Check URL parameters first (from email link)
		const urlParams = new URLSearchParams(window.location.search);
		const accessToken = urlParams.get('access_token');
		const refreshToken = urlParams.get('refresh_token');
		const type = urlParams.get('type');

		console.log('URL params:', {
			accessToken: !!accessToken,
			refreshToken: !!refreshToken,
			type
		});

		if (accessToken && refreshToken && type === 'recovery') {
			try {
				const { data, error: setSessionError } = await supabase.auth.setSession({
					access_token: accessToken,
					refresh_token: refreshToken
				});

				console.log('Set session result:', {
					data: !!data.session,
					error: setSessionError
				});

				if (setSessionError) {
					console.error('Set session error:', setSessionError);
					error = 'Invalid or expired reset link. Please request a new password reset.';
				} else if (data.session) {
					isValidSession = true;
					// Clear the URL parameters for security
					window.history.replaceState({}, document.title, window.location.pathname);
				} else {
					error = 'Unable to establish session. Please request a new password reset.';
				}
			} catch (err) {
				console.error('Session setup error:', err);
				error = 'An error occurred processing the reset link. Please request a new password reset.';
			}
		} else {
			// Check if we already have a valid session
			const {
				data: { session },
				error: sessionError
			} = await supabase.auth.getSession();

			if (session && session.user) {
				console.log('Existing session found');
				isValidSession = true;
			} else {
				console.log('No valid session or tokens found');
				error = 'Invalid or expired reset link. Please request a new password reset.';
			}
		}
	});

	async function handlePasswordUpdate() {
		if (!password || !confirmPassword) {
			error = 'Please fill in all fields';
			return;
		}

		if (password.length < 6) {
			error = 'Password must be at least 6 characters long';
			return;
		}

		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		loading = true;
		error = '';

		try {
			const { error: updateError } = await supabase.auth.updateUser({
				password: password
			});

			if (updateError) {
				error = updateError.message;
			} else {
				// Success! Redirect to login or dashboard
				await goto('/login?message=Password updated successfully');
			}
		} catch (err) {
			error = 'An unexpected error occurred. Please try again.';
			console.error('Update password error:', err);
		} finally {
			loading = false;
		}
	}

	function handleSubmit(event) {
		event.preventDefault();
		handlePasswordUpdate();
	}
</script>

<svelte:head>
	<title>Update Password</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Update your password</h2>
			<p class="mt-2 text-center text-sm text-gray-600">Enter your new password below.</p>
		</div>

		{#if !isValidSession && !error}
			<div class="flex justify-center">
				<svg
					class="h-8 w-8 animate-spin text-indigo-600"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			</div>
		{:else if error && !isValidSession}
			<div class="rounded-md bg-red-50 p-4">
				<div class="text-sm text-red-700">{error}</div>
				<div class="mt-3">
					<a href="/reset-password" class="font-medium text-red-600 hover:text-red-500">
						Request a new password reset
					</a>
				</div>
			</div>
		{:else if isValidSession}
			<form class="mt-8 space-y-6" on:submit={handleSubmit}>
				<div class="space-y-4">
					<div>
						<label for="password" class="block text-sm font-medium text-gray-700">
							New Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							bind:value={password}
							disabled={loading}
							class="relative mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
							placeholder="Enter new password"
						/>
					</div>

					<div>
						<label for="confirm-password" class="block text-sm font-medium text-gray-700">
							Confirm New Password
						</label>
						<input
							id="confirm-password"
							name="confirm-password"
							type="password"
							required
							bind:value={confirmPassword}
							disabled={loading}
							class="relative mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
							placeholder="Confirm new password"
						/>
					</div>
				</div>

				{#if error}
					<div class="rounded-md bg-red-50 p-4">
						<div class="text-sm text-red-700">{error}</div>
					</div>
				{/if}

				<div>
					<button
						type="submit"
						disabled={loading}
						class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if loading}
							<svg
								class="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Updating...
						{:else}
							Update password
						{/if}
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>
