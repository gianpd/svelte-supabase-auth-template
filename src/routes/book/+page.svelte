<script lang="ts">
	/**
	 * @file Booking Page
	 * @purpose Provides a multi-step user interface for booking museum tickets.
	 *
	 * @dependencies
	 * - Svelte: For component logic and reactivity.
	 * - SvelteKit: For navigation (`goto`) and page state (`page`).
	 * - bookingStore: For all booking-related state and actions.
	 * - lucide-svelte: For icons.
	 *
	 * @notes
	 * - This component has been refactored to use a more logical step order: Date -> Tickets -> Time -> Details.
	 * - Automatic step advancement has been removed to improve user control and fix navigation issues.
	 * - Time slots are now loaded on-demand when the user reaches the time selection step.
	 * - The UI is composed of several child components for each step of the booking process.
	 */
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { fade, slide } from 'svelte/transition';

	import {
		bookingActions,
		bookingError,
		customerInfo,
		isCreatingBooking,
		isLoadingTimeSlots,
		selectedDate,
		selectedTimeSlot,
		totalTickets,
		validationErrors
	} from '$lib/stores/bookingStore';

	// Component Imports
	import Calendar from '$lib/components/Calendar.svelte';
	import TimeSlotPicker from '$lib/components/TimeSlotPicker.svelte';
	import TicketSelector from '$lib/components/TicketSelector.svelte';
	import BookingSummary from './_components/BookingSummary.svelte';
	import CustomerForm from './_components/CustomerForm.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	import {
		Loader,
		ChevronLeft,
		ChevronRight,
		Calendar as CalendarIcon,
		Clock,
		Ticket,
		User,
		Check
	} from 'lucide-svelte';

	interface BookingStep {
		id: number;
		title: string;
		description: string;
		icon: any;
		isComplete: () => boolean;
	}

	// --- STATE MANAGEMENT ---

	let currentStep = $state(1);

	// --- DERIVED STATE ---

	const isCustomerFormValid = $derived(
		!$validationErrors.name &&
			!$validationErrors.email &&
			!!$customerInfo.name &&
			!!$customerInfo.email
	);

	// REFACTORED: The step order is now Date -> Tickets -> Time -> Details for a logical data flow.
	const steps: BookingStep[] = [
		{
			id: 1,
			title: 'Select Date',
			description: 'Choose your visit date',
			icon: CalendarIcon,
			isComplete: () => $selectedDate !== null
		},
		{
			id: 2,
			title: 'Select Tickets',
			description: 'Choose your ticket type',
			icon: Ticket,
			isComplete: () => $totalTickets > 0
		},
		{
			id: 3,
			title: 'Choose Time',
			description: 'Pick your time slot',
			icon: Clock,
			isComplete: () => $selectedTimeSlot !== null
		},
		{
			id: 4,
			title: 'Your Details',
			description: 'Provide your contact info',
			icon: User,
			isComplete: () => isCustomerFormValid
		}
	];

	// --- EFFECTS ---

	$effect(() => {
		// When moving to step 3 (time selection), fetch the available time slots.
		// This ensures we always have fresh data based on the selected date and ticket type.
		if (currentStep === 3) {
			bookingActions.loadTimeSlotsForSelection();
		}
	});

	$effect(() => {
		// Clear general booking errors when the user makes a selection,
		// as this indicates they are trying to correct the issue.
		if ($selectedDate || $selectedTimeSlot || $totalTickets) {
			bookingError.set(null);
		}
	});

	// --- NAVIGATION ---

	/**
	 * Checks if a given step can be accessed based on the completion of previous steps.
	 * @param {number} stepId The ID of the step to check.
	 * @returns {boolean} True if the step is accessible.
	 */
	function isStepAccessible(stepId: number): boolean {
		for (let i = 1; i < stepId; i++) {
			const step = steps.find((s) => s.id === i);
			if (!step || !step.isComplete()) {
				return false;
			}
		}
		return true;
	}

	function goToStep(stepId: number): void {
		if (isStepAccessible(stepId)) {
			currentStep = stepId;
		}
	}

	function goToPreviousStep(): void {
		if (currentStep > 1) {
			currentStep--;
		}
	}

	function goToNextStep(): void {
		const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
		if (currentStepIndex < steps.length - 1 && steps[currentStepIndex].isComplete()) {
			currentStep++;
		}
	}

	// --- BOOKING SUBMISSION ---

	async function handleProceedToPayment(): Promise<void> {
		if (!bookingActions.validateBooking()) {
			// Errors will be displayed reactively from the store.
			return;
		}

		try {
			const booking = await bookingActions.createBooking();
			if (booking?.id) {
				// On success, navigate to the checkout page with the booking ID.
				await goto(`/checkout?booking=${booking.id}&step=payment`);
			} else {
				throw new Error('Invalid booking response from server.');
			}
		} catch (error) {
			console.error('Booking creation failed:', error);
			// Error is set in the store and will be displayed by the Alert component.
		}
	}
</script>

<svelte:head>
	<title>Book Your Visit - Zungri Museum | Southern Italian Heritage</title>
	<meta
		name="description"
		content="Reserve your tickets for an immersive journey through Southern Italian culture and heritage at Zungri Museum. Choose your date, tickets, and time."
	/>
	<meta
		name="keywords"
		content="Zungri Museum, book tickets, Southern Italy, cultural heritage, museum tickets"
	/>
	<link rel="canonical" href={page.url.href} />
</svelte:head>

<main class="from-background via-cream-50 to-primary-50 min-h-screen bg-gradient-to-br">
	<div class="container mx-auto max-w-7xl px-4 py-8 sm:py-12">
		<!-- Header Section -->
		<header class="mb-12 text-center">
			<h1
				class="font-display mb-4 text-4xl font-bold text-neutral-900 md:text-5xl"
				in:fade={{ duration: 800, delay: 200 }}
			>
				Book Your Visit
			</h1>
			<p
				class="font-body mx-auto max-w-2xl text-lg leading-relaxed text-neutral-600 md:text-xl"
				in:fade={{ duration: 800, delay: 400 }}
			>
				Follow the steps below to secure your spot.
			</p>
		</header>

		<!-- Progress Steps -->
		<div class="mb-12" in:slide={{ duration: 600, delay: 600, axis: 'y' }}>
			<div class="flex items-center justify-center space-x-2 md:space-x-4">
				{#each steps as step, index (step.id)}
					{@const isCompleted = step.isComplete()}
					{@const isActive = currentStep === step.id}
					{@const isAccessible = isStepAccessible(step.id)}
					<div class="flex items-center">
						<button
							type="button"
							class="group flex items-center space-x-3 rounded-full p-2 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
							class:hover:bg-neutral-100={isAccessible}
							onclick={() => goToStep(step.id)}
							disabled={!isAccessible}
							aria-label={`Go to step ${step.id}: ${step.title}`}
						>
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 md:h-12 md:w-12"
								class:bg-primary-600={isCompleted}
								class:border-primary-600={isCompleted}
								class:text-white={isCompleted}
								class:bg-primary-100={isActive && !isCompleted}
								class:border-primary-400={isActive && !isCompleted}
								class:text-primary-600={isActive && !isCompleted}
								class:border-neutral-200={!isActive && !isCompleted}
								class:text-neutral-400={!isActive && !isCompleted}
							>
								{#if isCompleted}
									<Check class="h-5 w-5" />
								{:else}
									<svelte:component this={step.icon} class="h-5 w-5" />
								{/if}
							</div>
							<div class="hidden text-left md:block">
								<div class="text-sm font-semibold text-neutral-900">{step.title}</div>
								<div class="text-xs text-neutral-500">{step.description}</div>
							</div>
						</button>
					</div>

					{#if index < steps.length - 1}
						<div
							class="h-0.5 w-8 flex-shrink-0 bg-neutral-200 transition-all duration-500"
							class:bg-primary-600={isStepAccessible(step.id + 1)}
						></div>
					{/if}
				{/each}
			</div>
		</div>

		<!-- Error Alert -->
		{#if $bookingError}
			<div class="mb-8" transition:slide={{ duration: 300 }}>
				<Alert type="error" message={$bookingError} />
			</div>
		{/if}

		<!-- Main Content Grid -->
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
			<!-- Steps Content Area -->
			<div class="lg:col-span-2">
				<div
					class="shadow-exhibit relative overflow-hidden rounded-2xl border border-neutral-100 bg-white"
				>
					<!-- Step 1: Date Selection -->
					{#if currentStep === 1}
						<div class="p-6 md:p-8" in:fade={{ duration: 400 }} out:fade={{ duration: 200 }}>
							<h2 class="font-heading mb-2 text-2xl font-bold text-neutral-900">
								Select Your Visit Date
							</h2>
							<p class="mb-6 text-neutral-600">
								Choose an available date for your museum experience.
							</p>
							<Calendar class="w-full" on:select={goToNextStep} />
						</div>
					{/if}

					<!-- Step 2: Ticket Selection -->
					{#if currentStep === 2}
						<div class="p-6 md:p-8" in:fade={{ duration: 400 }} out:fade={{ duration: 200 }}>
							<h2 class="font-heading mb-2 text-2xl font-bold text-neutral-900">
								Select Your Tickets
							</h2>
							<p class="mb-6 text-neutral-600">
								Choose the right experience for you or your group.
							</p>
							<TicketSelector language="en" class="w-full" />
						</div>
					{/if}

					<!-- Step 3: Time Slot Selection -->
					{#if currentStep === 3}
						<div class="p-6 md:p-8" in:fade={{ duration: 400 }} out:fade={{ duration: 200 }}>
							<h2 class="font-heading mb-2 text-2xl font-bold text-neutral-900">
								Choose Your Time Slot
							</h2>
							<p class="mb-6 text-neutral-600">
								Select the perfect time for your visit on {$selectedDate?.toLocaleDateString(
									'en-US',
									{ month: 'long', day: 'numeric' }
								)}.
							</p>
							{#if $isLoadingTimeSlots}
								<div class="flex h-48 items-center justify-center text-neutral-500">
									<Loader class="mr-2 animate-spin" /> Loading available times...
								</div>
							{:else}
								<TimeSlotPicker class="w-full" />
							{/if}
						</div>
					{/if}

					<!-- Step 4: Customer Information -->
					{#if currentStep === 4}
						<div class="p-6 md:p-8" in:fade={{ duration: 400 }} out:fade={{ duration: 200 }}>
							<h2 class="font-heading mb-2 text-2xl font-bold text-neutral-900">
								Your Information
							</h2>
							<p class="mb-6 text-neutral-600">We need a few details to complete your booking.</p>
							<CustomerForm />
						</div>
					{/if}

					<!-- Navigation Footer -->
					<div class="border-t border-neutral-100 bg-neutral-50 p-4">
						<div class="flex items-center justify-between">
							<button
								type="button"
								class="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
								disabled={currentStep === 1}
								onclick={goToPreviousStep}
							>
								<ChevronLeft class="mr-1 h-4 w-4" />
								Previous
							</button>

							<div class="text-sm text-neutral-500">
								Step {currentStep} of {steps.length}
							</div>

							<button
								type="button"
								class="bg-primary-600 hover:bg-primary-700 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
								disabled={currentStep === steps.length || !steps[currentStep - 1].isComplete()}
								onclick={goToNextStep}
							>
								Next
								<ChevronRight class="ml-1 h-4 w-4" />
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Booking Summary Sidebar -->
			<aside class="lg:col-span-1">
				<div class="sticky top-8">
					<BookingSummary {handleProceedToPayment} bind:currentStep />
				</div>
			</aside>
		</div>
	</div>

	<!-- Loading Overlay for Booking Creation -->
	{#if $isCreatingBooking}
		<div
			class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
			transition:fade={{ duration: 300 }}
		>
			<div class="text-center text-white">
				<Loader class="mx-auto mb-4 h-12 w-12 animate-spin" />
				<h3 class="text-xl font-bold">Creating Your Booking</h3>
				<p>Please wait while we secure your visit...</p>
			</div>
		</div>
	{/if}
</main>
