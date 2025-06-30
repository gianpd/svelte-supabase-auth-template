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

	// Derived state to check if the customer form is valid.
	const isCustomerFormValid = $derived(
		!$validationErrors.name &&
			!$validationErrors.email &&
			!!$customerInfo.name &&
			!!$customerInfo.email
	);

	// Derived state for enabling the final payment button.
	const canProceedToPayment = $derived($bookingSummary.isComplete && isCustomerFormValid);

	function startOver() {
		bookingActions.resetBooking();
		currentStep = 1;
	}
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

	<!-- Action Buttons -->
	<div class="mt-6 flex flex-col gap-3">
		{#if currentStep === 4}
			<button
				type="button"
				class="rounded-card bg-primary-500 text-primary-50 focus-visible:outline-primary-300 inline-flex w-full items-center justify-center gap-2 border border-transparent px-4 py-3 font-medium transition-all duration-200 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
				onclick={handleProceedToPayment}
				disabled={!canProceedToPayment || $isCreatingBooking}
			>
				{#if $isCreatingBooking}
					<Loader2 class="h-4 w-4 animate-spin" />
					<span>Securing Your Booking...</span>
				{:else}
					<CreditCard class="h-4 w-4" />
					<span>Proceed to Payment</span>
				{/if}
			</button>
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
	.summary-card {
		background-color: var(--card);
		color: var(--card-foreground);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 1.5rem;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.05),
			0 2px 4px -2px rgba(0, 0, 0, 0.05);
	}
	.summary-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
	}
	.summary-placeholder {
		color: var(--muted-foreground);
		text-align: center;
		padding: 2rem 1rem;
		border: 2px dashed var(--border);
		border-radius: var(--radius);
	}
	.summary-item {
		background-color: var(--muted);
		padding: 0.75rem 1rem;
		border-radius: var(--radius);
	}
	.summary-item header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--muted-foreground);
		margin-bottom: 0.5rem;
	}
	.summary-item p,
	.ticket-item {
		color: var(--card-foreground);
		font-weight: 500;
	}
	.ticket-item {
		display: flex;
		justify-content: space-between;
		font-size: 0.9rem;
	}
	.summary-total {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 1rem;
		margin-top: 1.5rem;
		border: 1px solid hsla(var(--primary), 0.2);
		background-color: hsla(var(--primary), 0.05);
		border-radius: var(--radius);
		color: var(--primary);
	}
	.summary-total span:first-child {
		font-size: 1.125rem;
		font-weight: 600;
	}
	.summary-total .price {
		font-size: 1.5rem;
		font-weight: 700;
	}
	.action-buttons {
		margin-top: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-radius: var(--radius);
		font-weight: 500;
		border: 1px solid transparent;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		width: 100%;
	}
	.btn:focus-visible {
		outline: 2px solid var(--ring);
		outline-offset: 2px;
	}
	.btn:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}
	.btn .icon {
		width: 1rem;
		height: 1rem;
	}
	.btn-primary {
		background-color: var(--primary);
		color: var(--primary-foreground);
	}
	.btn-primary:not(:disabled):hover {
		filter: brightness(1.1);
	}
	.btn-outline {
		background-color: transparent;
		color: var(--foreground);
		border-color: var(--border);
	}
	.btn-outline:not(:disabled):hover {
		background-color: var(--muted);
	}
	.icon-primary {
		color: var(--primary);
		width: 1.25rem;
		height: 1.25rem;
	}
	.animate-spin {
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
