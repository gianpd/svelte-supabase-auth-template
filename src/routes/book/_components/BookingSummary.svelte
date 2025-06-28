<script lang="ts">
	import {
		bookingActions,
		bookingSummary,
		isCreatingBooking,
		selectedDate,
		selectedTimeSlot,
		totalPrice,
		totalTickets,
		validationErrors,
		customerInfo
	} from '$lib/stores/bookingStore';
	import {
		ArrowLeft,
		ArrowRight,
		Calendar,
		Clock,
		CreditCard,
		Loader2,
		Ticket
	} from 'lucide-svelte';

	let {
		currentStep = $bindable(),
		handleProceedToPayment
	}: { currentStep: number; handleProceedToPayment: () => Promise<void> } = $props();

	// Derived state to check if the customer form is valid
	const isFormValid = $derived(
		!$validationErrors.name &&
			!$validationErrors.email &&
			!!$customerInfo.name &&
			!!$customerInfo.email
	);

	// Derived state for enabling/disabling buttons
	let canProceedToStep2 = $derived($selectedDate !== null);
	let canProceedToStep3 = $derived(canProceedToStep2 && $selectedTimeSlot !== null);
	let canProceedToStep4 = $derived(canProceedToStep3 && $totalTickets > 0);
	let canProceedToPayment = $derived(canProceedToStep4 && isFormValid);

	// Add this function to your <script> block
	function isStepAccessible(step: number) {
		switch (step) {
			case 2:
				return canProceedToStep2;
			case 3:
				return canProceedToStep3;
			case 4:
				return canProceedToStep4;
			default:
				return true; // Step 1 is always accessible
		}
	}

	function nextStep() {
		currentStep++;
	}
	function previousStep() {
		currentStep--;
	}
	function startOver() {
		bookingActions.resetBooking();
		currentStep = 1;
	}
</script>

<div class="summary-card">
	<h3 class="summary-title">Booking Summary</h3>

	{#if $totalTickets === 0 && !$selectedDate}
		<div class="summary-placeholder">Your selections will appear here.</div>
	{/if}

	<!-- Date Summary -->
	{#if $selectedDate}
		<div class="summary-item">
			<header>
				<Calendar class="icon-primary" />
				<span>Visit Date</span>
			</header>
			<p>
				{$selectedDate.toLocaleDateString('en-GB', {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})}
			</p>
		</div>
	{/if}

	<!-- Time Slot Summary -->
	{#if $selectedTimeSlot}
		<div class="summary-item">
			<header>
				<Clock class="icon-primary" />
				<span>Time Slot</span>
			</header>
			<p>
				{new Date($selectedTimeSlot.start_time).toLocaleTimeString('en-GB', {
					hour: '2-digit',
					minute: '2-digit'
				})} -
				{new Date($selectedTimeSlot.end_time).toLocaleTimeString('en-GB', {
					hour: '2-digit',
					minute: '2-digit'
				})}
			</p>
		</div>
	{/if}

	<!-- Tickets Summary -->
	{#if $totalTickets > 0}
		<div class="summary-item">
			<header>
				<Ticket class="icon-primary" />
				<span>Tickets</span>
			</header>
			<div class="tickets-list">
				{#each $bookingSummary.tickets as ticket}
					<div class="ticket-item">
						<span>{ticket.quantity}x {ticket.type.name_translations?.en || 'Ticket'}</span>
						<span class="font-medium">€{ticket.subtotal.toFixed(2)}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Total Price -->
	{#if $totalPrice > 0}
		<div class="summary-total">
			<span>Total</span>
			<span class="price">€{$totalPrice.toFixed(2)}</span>
		</div>
	{/if}

	<!-- Action Buttons -->
	<div class="action-buttons">
		{#if currentStep < 4}
			<button
				type="button"
				class="btn btn-primary"
				onclick={nextStep}
				disabled={!isStepAccessible(currentStep + 1)}
			>
				<span>Continue</span>
				<ArrowRight class="icon" />
			</button>
		{:else if currentStep === 4}
			<button
				type="button"
				class="btn btn-primary"
				onclick={handleProceedToPayment}
				disabled={!canProceedToPayment || $isCreatingBooking}
			>
				{#if $isCreatingBooking}
					<Loader2 class="icon animate-spin" />
					<span>Creating Booking...</span>
				{:else}
					<CreditCard class="icon" />
					<span>Proceed to Payment</span>
				{/if}
			</button>
		{/if}

		{#if currentStep > 1}
			<button type="button" class="btn btn-secondary" onclick={previousStep}>
				<ArrowLeft class="icon" />
				<span>Back</span>
			</button>
		{/if}

		{#if currentStep > 1}
			<button type="button" class="btn btn-outline" onclick={startOver}>Start Over</button>
		{/if}
	</div>
</div>

<style>
	/* --- SUMMARY SIDEBAR --- */
	.summary-card {
		position: sticky;
		top: 1rem;
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
		margin-bottom: 1rem;
	}
	.summary-placeholder {
		color: var(--muted-foreground);
		font-style: italic;
		text-align: center;
		padding: 2rem 0;
	}
	.summary-item {
		background-color: var(--muted);
		padding: 0.75rem;
		border-radius: var(--radius);
		margin-bottom: 1rem;
	}
	.summary-item header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--muted-foreground);
		margin-bottom: 0.25rem;
	}
	.summary-item p,
	.summary-item .ticket-item {
		color: var(--card-foreground);
	}
	.tickets-list {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.ticket-item {
		display: flex;
		justify-content: space-between;
		font-size: 0.875rem;
	}
	.summary-total {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 1rem;
		margin-bottom: 1.5rem;
		background-color: hsla(var(--primary), 0.1);
		border: 1px solid hsla(var(--primary), 0.2);
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

	/* --- BUTTONS --- */
	.action-buttons {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-radius: var(--radius);
		font-weight: 500;
		border: 1px solid transparent;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
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
	.btn-secondary {
		background-color: var(--secondary);
		color: var(--secondary-foreground);
	}
	.btn-secondary:not(:disabled):hover {
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

	/* --- ICONS & ANIMATIONS --- */
	.icon-primary {
		color: var(--primary);
		width: 1.25rem;
		height: 1.25rem;
	}
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	.animate-spin {
		animation: spin 1s linear infinite;
	}
</style>
