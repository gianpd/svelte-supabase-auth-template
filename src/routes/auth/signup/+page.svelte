<!--
/**
 * @file Signup Page Component (signup/+page.svelte)
 * @description Provides the user interface for signing up using email/password
 * or Google OAuth. Uses SvelteKit Superforms for form handling and validation,
 * styled with DaisyUI classes.
 *
 * @dependencies
 * - $lib/components/auth/GoogleSignInButton.svelte: Google sign-in button.
 * - ./schema: Zod schema definition for the signup form.
 * - sveltekit-superforms: `superForm` hook.
 * - sveltekit-superforms/adapters: `zodClient` adapter.
 * - ./$types: Page data types.
 */
-->

<script lang="ts">
	import { formSchema } from './schema';
	// REMOVED: import { enhance } from '$app/forms'; // Not needed when using superForm's enhance
	import { type SuperValidated, type Infer, superForm, message } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';
	import { AlertCircle, CheckCircle } from 'lucide-svelte'; // Icons for messages

	// Props: `data` contains the validated form object from the load function
	let { data }: { data: PageData } = $props();

	// Initialize Superform for the signup form
	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		taintedMessage: null, // Disable tainted message for signup form
		// Optionally reset form on success message
		onUpdated: ({ form: f }) => {
			if (f.message && f.valid) {
				// Consider resetting only if it's a success message (e.g., "Check email")
				if (f.message.toLowerCase().includes('success')) {
					// Check the message string directly
					form.reset(); // Reset form fields after successful signup message
				}
			}
		}
	});

	/// Destructure form state and helpers - THIS enhance is from superForm
	const { form: formData, errors, submitting, enhance, message: messageStore } = form;

	// Fix: In Svelte 5, we access the store value directly with $
	// messageStore is the Writable<string> store from superForm
	$effect(() => {
		// This effect will re-run whenever $messageStore changes
		console.log('Message updated:', $messageStore);
	});

	// Derived value to check if the message is a success message
	let isSuccessMessage = $derived(
		typeof $messageStore === 'string' && $messageStore?.toLowerCase().includes('success')
	);
</script>

<div class="hero bg-ui-bg min-h-screen">
	<div class="w-full max-w-sm shadow-2xl">
		<div class="text-center">
			<h1 class="text-2xl font-bold">SIGN UP!</h1>
			<p class="py-4">Crea il tuo account</p>
		</div>
		<div class="card bg-ui-bg-2 w-full max-w-sm shrink-0 shadow-2xl">
			<!-- Use the enhance function from superForm -->
			<form class="card-body" method="POST" use:enhance novalidate>
				<h2 class="card-title mb-4 justify-center text-2xl">Crea Account</h2>

				<!-- General Form Message (Success or Error) -->
				{#if $messageStore}
					<div
						role="alert"
						class="alert mb-4 p-2 text-sm"
						class:alert-success={isSuccessMessage}
						class:alert-error={!isSuccessMessage}
					>
						{#if isSuccessMessage}
							<CheckCircle class="h-6 w-6 shrink-0 stroke-current" />
						{:else}
							<AlertCircle class="h-6 w-6 shrink-0 stroke-current" />
						{/if}
						<!-- Safely render message text -->
						<span>{$messageStore}</span>
					</div>
				{/if}

				<!-- Full Name Input (Optional) -->
				<div class="form-control text-gray-300">
					<label class="label" for="full-name">
						<span class="label-text">Full Name (Optional)</span>
					</label>
					<input
						type="text"
						id="full-name"
						name="fullName"
						placeholder="Your Name"
						autocomplete="name"
						class="input input-bordered text-gray-300"
						class:input-error={$errors.fullName}
						aria-invalid={$errors.fullName ? 'true' : undefined}
						aria-describedby={$errors.fullName ? 'fullName-error' : undefined}
						bind:value={$formData.fullName}
						disabled={$submitting}
					/>
					{#if $errors.fullName}
						<div class="label" id="fullName-error">
							<span class="label-text-alt text-error">{$errors.fullName}</span>
						</div>
					{/if}
				</div>

				<!-- Email Input -->
				<div class="form-control">
					<label class="label" for="email-address">
						<span class="label-text">Email</span>
					</label>
					<input
						type="email"
						id="email-address"
						name="email"
						placeholder="you@example.com"
						autocomplete="email"
						required
						class="input input-bordered"
						class:input-error={$errors.email}
						aria-invalid={$errors.email ? 'true' : undefined}
						aria-describedby={$errors.email ? 'email-error' : undefined}
						bind:value={$formData.email}
						disabled={$submitting}
					/>
					{#if $errors.email}
						<div class="label" id="email-error">
							<span class="label-text-alt text-error">{$errors.email}</span>
						</div>
					{/if}
				</div>

				<!-- Password Input -->
				<div class="form-control">
					<label class="label" for="password">
						<span class="label-text">Password</span>
					</label>
					<input
						type="password"
						id="password"
						name="password"
						placeholder="•••••••• (min. 8 characters)"
						required
						class="input input-bordered"
						class:input-error={$errors.password}
						aria-invalid={$errors.password ? 'true' : undefined}
						aria-describedby={$errors.password ? 'password-error' : undefined}
						bind:value={$formData.password}
						disabled={$submitting}
					/>
					{#if $errors.password}
						<div class="label" id="password-error">
							<span class="label-text-alt text-error">{$errors.password}</span>
						</div>
					{/if}
				</div>

				<!-- Confirm Password Input -->
				<div class="form-control">
					<label class="label" for="confirmPassword">
						<span class="label-text">Confirm Password</span>
					</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						placeholder="••••••••"
						required
						class="input input-bordered"
						class:input-error={$errors.confirmPassword}
						aria-invalid={$errors.confirmPassword ? 'true' : undefined}
						aria-describedby={$errors.confirmPassword ? 'confirmPassword-error' : undefined}
						bind:value={$formData.confirmPassword}
						disabled={$submitting}
					/>
					{#if $errors.confirmPassword}
						<div class="label" id="confirmPassword-error">
							<span class="label-text-alt text-error">{$errors.confirmPassword}</span>
						</div>
					{/if}
				</div>

				<!-- Submit Button -->
				<div class=" form-control mt-6">
					<button type="submit" class="btn btn-primary" disabled={$submitting}>
						{#if $submitting}
							<span class="loading loading-spinner"></span>
							Creating Account...
						{:else}
							Registrati
						{/if}
					</button>
				</div>
				<!-- Placeholder for Social Logins -->
				<div class="relative my-4">
					<div class="absolute inset-0 flex items-center" aria-hidden="true">
						<div class="w-full border-t border-neutral-300"></div>
					</div>
					<div class="relative flex justify-center text-sm">
						<span class="bg-neutral-50 px-2 text-neutral-500">Or continue with</span>
					</div>
				</div>

				<div>
					<!-- <GoogleSignInButton /> -->
					<div class="text-center text-sm text-neutral-500">
						<!-- Google -->
						<button class="btn border-[#e5e5e5] bg-white text-black">
							<svg
								aria-label="Google logo"
								width="16"
								height="16"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 512 512"
								><g
									><path d="m0 0H512V512H0" fill="#fff"></path><path
										fill="#34a853"
										d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
									></path><path
										fill="#4285f4"
										d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
									></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
									></path><path
										fill="#ea4335"
										d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
									></path></g
								></svg
							>
							Signup with Google (PLACEHOLDER)
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
