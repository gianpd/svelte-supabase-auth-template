<!-- src/routes/reset-password/+page.svelte -->
<script>
	import { supabase } from '$lib/utils/supabaseClient'; // Assuming this path from existing code
	import { goto } from '$app/navigation';

	let email = '';
	let loading = false;
	let message = '';
	let error = '';

	async function handleResetRequest() {
		if (!email) {
			error = 'Please enter your email address';
			return;
		}

		loading = true;
		error = '';
		message = '';

		try {
			const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/update-password`
			});

			if (resetError) {
				error = resetError.message;
			} else {
				message = 'Check your email for a password reset link!';
				email = ''; // Clear the form
			}
		} catch (err) {
			error = 'An unexpected error occurred. Please try again.';
			console.error('Reset password error:', err);
		} finally {
			loading = false;
		}
	}

	function handleSubmit(event) {
		event.preventDefault();
		handleResetRequest();
	}
</script>

<svelte:head>
	<title>Reset Password</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset your password</h2>
			<p class="mt-2 text-center text-sm text-gray-600">
				Enter your email address and we'll send you a link to reset your password.
			</p>
		</div>

		<form class="mt-8 space-y-6" on:submit={handleSubmit}>
			<div>
				<label for="email" class="sr-only">Email address</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					bind:value={email}
					disabled={loading}
					class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
					placeholder="Email address"
				/>
			</div>

			{#if error}
				<div class="rounded-md bg-red-50 p-4">
					<div class="text-sm text-red-700">{error}</div>
				</div>
			{/if}

			{#if message}
				<div class="rounded-md bg-green-50 p-4">
					<div class="text-sm text-green-700">{message}</div>
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
						Sending...
					{:else}
						Send reset link
					{/if}
				</button>
			</div>

			<div class="text-center">
				<a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
					Back to sign in
				</a>
			</div>
		</form>
	</div>
</div>

<style>
	/* Add any custom styles here if needed */
</style>
