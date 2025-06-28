<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import {
		CheckCircle,
		ArrowRight,
		Calendar,
		Clock,
		Ticket,
		User,
		CreditCard
	} from 'lucide-svelte';
	import {
		selectedDate,
		selectedTimeSlot,
		totalTickets,
		validationErrors,
		customerInfo // <-- Add this import
	} from '$lib/stores/bookingStore';

	let { currentStep = $bindable() }: { currentStep: number } = $props();

	interface Step {
		number: number;
		label: string;
		icon: typeof SvelteComponent;
	}

	const STEPS: Step[] = [
		{ number: 1, label: 'Select Date', icon: Calendar },
		{ number: 2, label: 'Choose Time', icon: Clock },
		{ number: 3, label: 'Pick Tickets', icon: Ticket },
		{ number: 4, label: 'Your Details', icon: User },
		{ number: 5, label: 'Payment', icon: CreditCard }
	];

	// Derived state to check if the customer form is valid
	// This will now work correctly because `customerInfo` is imported.
	const isFormValid = $derived(
		!$validationErrors.name &&
			!$validationErrors.email &&
			!!$customerInfo.name &&
			!!$customerInfo.email
	);

	function isStepCompleted(step: number): boolean {
		switch (step) {
			case 1:
				return $selectedDate !== null;
			case 2:
				return $selectedTimeSlot !== null;
			case 3:
				return $totalTickets > 0;
			case 4:
				return isFormValid;
			default:
				return false;
		}
	}

	function isStepAccessible(step: number): boolean {
		if (step <= 1) return true;
		// A step is accessible if the *previous* step is completed.
		return isStepCompleted(step - 1);
	}
</script>

<div class="progress-steps-container">
	<div class="progress-steps">
		{#each STEPS as step, index (step.number)}
			{@const isActive = currentStep === step.number}
			{@const isCompleted = isStepCompleted(step.number)}
			{@const isAccessible = isStepAccessible(step.number)}

			<button
				type="button"
				class="step-indicator"
				class:active={isActive}
				class:completed={isCompleted}
				onclick={() => {
					if (isAccessible) currentStep = step.number;
				}}
				disabled={!isAccessible}
				aria-current={isActive ? 'step' : false}
			>
				<svelte:component this={step.icon} class="icon" />
				<span>{step.number}. {step.label}</span>
				{#if isCompleted}
					<CheckCircle class="icon-success" />
				{/if}
			</button>

			{#if index < STEPS.length - 1}
				<ArrowRight class="separator-icon" />
			{/if}
		{/each}
	</div>
</div>

<style>
	/* --- PROGRESS STEPS --- */
	.progress-steps-container {
		margin-bottom: 2rem;
		overflow-x: auto;
		padding-bottom: 1rem;
	}
	.progress-steps {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}
	.step-indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-radius: var(--radius);
		border: 1px solid var(--border);
		background-color: var(--card);
		color: var(--muted-foreground);
		font-weight: 500;
		font-size: 0.875rem;
		white-space: nowrap;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
	}
	.step-indicator:not(:disabled):hover {
		background-color: var(--muted);
		border-color: var(--muted-foreground);
	}
	.step-indicator.completed {
		background-color: hsl(142, 71%, 94%);
		color: hsl(142, 81%, 25%);
		border-color: hsl(142, 71%, 88%);
	}
	.dark .step-indicator.completed {
		background-color: hsl(142, 71%, 15%);
		color: hsl(142, 81%, 85%);
		border-color: hsl(142, 71%, 25%);
	}
	.step-indicator.active {
		background-color: var(--primary);
		color: var(--primary-foreground);
		border-color: var(--primary);
		box-shadow: 0 4px 12px hsla(var(--primary), 0.2);
	}
	.step-indicator:disabled {
		background-color: var(--muted);
		color: var(--muted-foreground);
		opacity: 0.6;
		cursor: not-allowed;
	}
	.step-indicator .icon {
		width: 1rem;
		height: 1rem;
	}
	.step-indicator .icon-success {
		width: 1rem;
		height: 1rem;
		color: hsl(142, 81%, 25%);
	}
	.dark .step-indicator .icon-success {
		color: hsl(142, 81%, 75%);
	}
	.separator-icon {
		width: 1rem;
		height: 1rem;
		flex-shrink: 0;
		color: var(--muted-foreground);
	}
</style>
