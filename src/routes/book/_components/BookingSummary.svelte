<script lang="ts">
	/**
	 * @file Booking Summary Component
	 * @purpose Displays a real-time summary of the user's booking selections and provides primary navigation controls.
	 *
	 * @dependencies
	 * - Svelte: For component logic and reactivity.
	 * - bookingStore: To access reactive state like summary details, price, and validation errors.
	 * - lucide-svelte: For icons.
	 *
	 * @notes
	 * - Uses `$bindable()` for `currentStep` to create a two-way binding with the parent page.
	 * - Disables the "Proceed to Payment" button until all steps are complete and the form is valid.
	 * - Provides a "Start Over" button to easily reset the entire booking process.
	 * - Enhanced debugging to help identify validation issues.
	 */
	import {
		bookingActions,
		bookingSummary,
		isCreatingBooking,
		customerInfo,
		validationErrors
	} from '$lib/stores/bookingStore';
	import { Calendar, Clock, CreditCard, Loader2, Ticket, RotateCcw } from 'lucide-svelte';

	let {
		currentStep = $bindable(),
		handleProceedToPayment
	}: {
		currentStep: number;
		handleProceedToPayment: () => Promise<void>;
	} = $props();

	// Enhanced customer form validation with detailed checking
	const isCustomerFormValid = $derived(() => {
		const hasName = !!$customerInfo.name && $customerInfo.name.trim().length >= 2;
		const hasEmail = !!$customerInfo.email && $customerInfo.email.includes('@');
		const noNameError = !$validationErrors.name;
		const noEmailError = !$validationErrors.email;

		console.log('[BookingSummary] Customer form validation:', {
			hasName,
			hasEmail,
			noNameError,
			noEmailError,
			customerInfo: $customerInfo,
			validationErrors: $validationErrors
		});

		return hasName && hasEmail && noNameError && noEmailError;
	});

	// Enhanced payment readiness checking
	const canProceedToPayment = $derived(() => {
		const isComplete = $bookingSummary.isComplete;
		const isFormValid = isCustomerFormValid();
		const notCreating = !$isCreatingBooking;

		console.log('[BookingSummary] Payment readiness:', {
			isComplete,
			isFormValid,
			notCreating,
			canProceed: isComplete && isFormValid && notCreating,
			bookingSummary: $bookingSummary
		});

		return isComplete && isFormValid && notCreating;
	});

	function startOver() {
		bookingActions.resetBooking();
		currentStep = 1;
	}

	// Force validation check when step changes to 4
	$effect(() => {
		if (currentStep === 4) {
			console.log('[BookingSummary] Reached step 4, checking validation state');
			// Trigger validation if needed
			if ($customerInfo.name && $customerInfo.email) {
				bookingActions.updateCustomerInfo({
					name: $customerInfo.name,
					email: $customerInfo.email,
					isGuest: true
				});
			}
		}
	});
</script>

<div class="bg-cream-50 rounded-card shadow-soft border border-neutral-300 p-6">
	<h3 class="font-heading mb-6 text-2xl font-semibold text-neutral-800">Booking Summary</h3>

	{#if $bookingSummary.totalTickets === 0 && !$bookingSummary.date}
		<div
			class="rounded-card border-2 border-dashed border-neutral-300 p-8 text-center text-neutral-500"
		>
			<p>Your selections will appear here as you proceed.</p>
		</div>
	{/if}

	<div class="space-y-4">
		<!-- Date Summary -->
		{#if $bookingSummary.date}
			<div class="rounded-card bg-neutral-100 p-3">
				<header class="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-600">
					<Calendar class="text-primary-500 h-5 w-5" />
					<span>Visit Date</span>
				</header>
				<p class="font-medium text-neutral-800">
					{$bookingSummary.date.toLocaleDateString('en-GB', {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</p>
			</div>
		{/if}

		<!-- Tickets Summary -->
		{#if $bookingSummary.tickets.length > 0}
			<div class="rounded-card bg-neutral-100 p-3">
				<header class="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-600">
					<Ticket class="text-primary-500 h-5 w-5" />
					<span>Selected Ticket</span>
				</header>
				<div class="space-y-2">
					{#each $bookingSummary.tickets as ticket (ticket.type.id)}
						<div class="flex justify-between text-sm text-neutral-800">
							<span>{ticket.quantity}x {ticket.type.name_translations?.en ?? 'Ticket'}</span>
							<span class="font-medium">€{ticket.subtotal.toFixed(2)}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Time Slot Summary -->
		{#if $bookingSummary.timeSlot}
			<div class="rounded-card bg-neutral-100 p-3">
				<header class="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-600">
					<Clock class="text-primary-500 h-5 w-5" />
					<span>Time Slot</span>
				</header>
				<p class="font-medium text-neutral-800">
					{new Date($bookingSummary.timeSlot.start_time).toLocaleTimeString('en-GB', {
						hour: '2-digit',
						minute: '2-digit'
					})}
					-
					{new Date($bookingSummary.timeSlot.end_time).toLocaleTimeString('en-GB', {
						hour: '2-digit',
						minute: '2-digit'
					})}
				</p>
			</div>
		{/if}
	</div>

	<!-- Total Price -->
	{#if $bookingSummary.totalPrice > 0}
		<div
			class="border-primary-200 bg-primary-50 rounded-card text-primary-600 mt-6 flex items-baseline justify-between border p-4"
		>
			<span class="text-lg font-semibold">Total</span>
			<span class="text-2xl font-bold">€{$bookingSummary.totalPrice.toFixed(2)}</span>
		</div>
	{/if}

	<!-- Debug Information (remove in production) -->
	<div class="mt-4 rounded bg-neutral-50 p-3 text-xs text-neutral-500">
		<strong>Debug Info:</strong><br />
		Current Step: {currentStep}<br />
		Summary Complete: {$bookingSummary.isComplete}<br />
		Form Valid: {isCustomerFormValid()}<br />
		Can Proceed: {canProceedToPayment()}<br />
		Creating: {$isCreatingBooking}<br />
		Customer: {JSON.stringify($customerInfo)}<br />
		Errors: {JSON.stringify($validationErrors)}
	</div>

	<!-- Action Buttons -->
	<div class="mt-6 flex flex-col gap-3">
		{#if currentStep === 4}
			<button
				type="button"
				class="rounded-card bg-primary-500 text-primary-50 focus-visible:outline-primary-300 inline-flex w-full items-center justify-center gap-2 border border-transparent px-4 py-3 font-medium transition-all duration-200 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
				onclick={handleProceedToPayment}
				disabled={!canProceedToPayment() || $isCreatingBooking}
			>
				{#if $isCreatingBooking}
					<Loader2 class="h-4 w-4 animate-spin" />
					<span>Securing Your Booking...</span>
				{:else}
					<CreditCard class="h-4 w-4" />
					<span>Proceed to Payment</span>
				{/if}
			</button>

			<!-- Show why button is disabled -->
			{#if !canProceedToPayment() && !$isCreatingBooking}
				<div class="rounded-card border border-amber-200 bg-amber-50 p-3 text-center text-sm">
					<p class="font-medium text-amber-800">Payment button is disabled because:</p>
					<ul class="mt-1 text-left text-xs text-amber-700">
						{#if !$bookingSummary.isComplete}
							<li>• Booking is not complete (missing date, time, or tickets)</li>
						{/if}
						{#if !isCustomerFormValid()}
							<li>• Customer information is incomplete or has errors</li>
							{#if !$customerInfo.name || $customerInfo.name.trim().length < 2}
								<li>&nbsp;&nbsp;- Name is required (min 2 characters)</li>
							{/if}
							{#if !$customerInfo.email || !$customerInfo.email.includes('@')}
								<li>&nbsp;&nbsp;- Valid email is required</li>
							{/if}
							{#if $validationErrors.name}
								<li>&nbsp;&nbsp;- Name error: {$validationErrors.name}</li>
							{/if}
							{#if $validationErrors.email}
								<li>&nbsp;&nbsp;- Email error: {$validationErrors.email}</li>
							{/if}
						{/if}
					</ul>
				</div>
			{/if}
		{:else}
			<div class="rounded-card bg-neutral-100 p-4 text-center text-sm text-neutral-500">
				Complete all steps to proceed to payment.
			</div>
		{/if}

		{#if currentStep > 1}
			<button
				type="button"
				class="rounded-card focus-visible:outline-primary-300 inline-flex w-full items-center justify-center gap-2 border border-neutral-300 bg-transparent px-4 py-3 font-medium text-neutral-800 transition-all duration-200 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2"
				onclick={startOver}
			>
				<RotateCcw class="h-4 w-4" />
				<span>Start Over</span>
			</button>
		{/if}
	</div>
</div>

<style>
</style>
