<script lang="ts">
	/**
	 * @file CustomerForm.svelte
	 * @purpose Customer information form component for booking process
	 *
	 * @dependencies
	 * - lucide-svelte: For icons
	 * - bookingStore: For customer info and validation state
	 *
	 * @notes
	 * - Properly handles bidirectional data binding between input and store
	 * - Real-time validation with user feedback
	 * - Integrates with booking validation system
	 * - Error handling: Shows validation errors and clears them appropriately
	 * - Fixed state synchronization issues between input and store
	 */
	import { User } from 'lucide-svelte';
	import { customerInfo, validationErrors, bookingActions } from '$lib/stores/bookingStore';

	// Local reactive state that properly syncs with store
	let nameValue = $state($customerInfo.name || '');
	let emailValue = $state($customerInfo.email || '');

	// Sync local state with store when store changes externally
	$effect(() => {
		if ($customerInfo.name !== nameValue) {
			nameValue = $customerInfo.name || '';
		}
		if ($customerInfo.email !== emailValue) {
			emailValue = $customerInfo.email || '';
		}
	});

	// Validation functions
	function validateName(name: string): string | undefined {
		if (!name || name.trim().length < 2) {
			return 'Full name must be at least 2 characters';
		}
		return undefined;
	}

	function validateEmail(email: string): string | undefined {
		if (!email) {
			return 'Email address is required';
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return 'Please enter a valid email address';
		}
		return undefined;
	}

	// Handle input changes with proper state management
	function handleNameInput(event: Event) {
		const target = event.target as HTMLInputElement;
		nameValue = target.value;

		// Update store immediately
		bookingActions.updateCustomerInfo({
			name: nameValue,
			email: emailValue,
			isGuest: true
		});

		// Clear validation error if input is now valid
		const error = validateName(nameValue);
		if (!error && $validationErrors.name) {
			validationErrors.update((current) => ({ ...current, name: undefined }));
		}
	}

	function handleEmailInput(event: Event) {
		const target = event.target as HTMLInputElement;
		emailValue = target.value;

		// Update store immediately
		bookingActions.updateCustomerInfo({
			name: nameValue,
			email: emailValue,
			isGuest: true
		});

		// Clear validation error if input is now valid
		const error = validateEmail(emailValue);
		if (!error && $validationErrors.email) {
			validationErrors.update((current) => ({ ...current, email: undefined }));
		}
	}

	// Handle blur events for validation
	function handleNameBlur() {
		const error = validateName(nameValue);
		if (error) {
			validationErrors.update((current) => ({ ...current, name: error }));
		}
	}

	function handleEmailBlur() {
		const error = validateEmail(emailValue);
		if (error) {
			validationErrors.update((current) => ({ ...current, email: error }));
		}
	}

	// Debug info for troubleshooting
	$effect(() => {
		console.log('[CustomerForm] State update:', {
			nameValue,
			emailValue,
			storeName: $customerInfo.name,
			storeEmail: $customerInfo.email,
			validationErrors: $validationErrors
		});
	});
</script>

<div class="bg-cream-50 rounded-card border border-neutral-300 p-6">
	<header class="mb-2 flex items-center gap-2">
		<User class="text-primary-500 h-5 w-5" />
		<h3 class="font-heading text-xl font-semibold text-neutral-800">Your Information</h3>
	</header>
	<p class="mb-6 text-sm text-neutral-600">
		Please provide your contact details for the booking confirmation.
	</p>

	<div class="flex flex-col gap-4">
		<!-- Name Field -->
		<div>
			<label for="customer-name" class="mb-1 block text-sm font-medium text-neutral-900"
				>Full Name *</label
			>
			<input
				id="customer-name"
				type="text"
				placeholder="Enter your full name"
				bind:value={nameValue}
				class:invalid={$validationErrors.name}
				class="rounded-card focus:ring-primary-300 focus:border-primary-300 w-full border border-neutral-300 bg-white px-3 py-2 text-neutral-950 transition-all duration-200 focus:outline-none focus:ring-2"
				required
				aria-invalid={$validationErrors.name ? 'true' : 'false'}
				aria-describedby="name-error"
				oninput={handleNameInput}
				onblur={handleNameBlur}
			/>
			{#if $validationErrors.name}
				<p id="name-error" class="text-error mt-1 text-xs">{$validationErrors.name}</p>
			{/if}
		</div>

		<!-- Email Field -->
		<div>
			<label for="customer-email" class="mb-1 block text-sm font-medium text-neutral-700"
				>Email Address *</label
			>
			<input
				id="customer-email"
				type="email"
				placeholder="Enter your email address"
				bind:value={emailValue}
				class:invalid={$validationErrors.email}
				class="rounded-card focus:ring-primary-300 focus:border-primary-300 invalid:border-error invalid:focus:ring-error/50 w-full border border-neutral-300 bg-white px-3 py-2 text-neutral-950 transition-all duration-200 focus:outline-none focus:ring-2"
				required
				aria-invalid={$validationErrors.email ? 'true' : 'false'}
				aria-describedby="email-error"
				oninput={handleEmailInput}
				onblur={handleEmailBlur}
			/>
			{#if $validationErrors.email}
				<p id="email-error" class="text-error mt-1 text-xs">{$validationErrors.email}</p>
			{:else}
				<p class="mt-1 text-xs text-neutral-500">
					We'll send your e-tickets to this email address.
				</p>
			{/if}
		</div>

		<!-- Form Status Debug (remove in production) -->
		<div class="rounded bg-neutral-50 p-2 text-xs text-neutral-500">
			<strong>Debug Info:</strong><br />
			Local Name: "{nameValue}" (valid: {!validateName(nameValue)})<br />
			Local Email: "{emailValue}" (valid: {!validateEmail(emailValue)})<br />
			Store Name: "{$customerInfo.name}"<br />
			Store Email: "{$customerInfo.email}"<br />
			Validation Errors: {JSON.stringify($validationErrors)}
		</div>
	</div>
</div>

<style>
	.invalid {
		border-color: #ef4444;
		box-shadow: 0 0 0 1px #ef4444;
	}

	.invalid:focus {
		border-color: #ef4444;
		box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
	}
</style>
