<script lang="ts">
	/**
	 * @file Booking Page
	 * @purpose Provides a multi-step user interface for booking museum tickets.
	 *
	 * @dependencies
	 * - Svelte: For component logic and reactivity.
	 * - SvelteKit: For navigation (goto) and page state (page).
	 * - bookingStore: For all booking-related state and actions.
	 * - lucide-svelte: For icons.
	 *
	 * @notes
	 * - This component has been refactored to use a more logical step order: Tickets -> Date -> Time -> Details.
	 * - Fixed infinite loop issues by properly managing effect dependencies and preventing circular updates.
	 * - Date availability is now loaded only when the user navigates to a new, previously unloaded month.
	 * - Error handling: Prevents reactive loops through careful state management and effect consolidation.
	 * - Fixed availability display: Calendar now properly shows visual indicators for date availability.
	 * - Fixed time slot selection: Improved validation and user feedback for time slot picker.
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
		isLoadingDateAvailability,
		selectedDate,
		selectedTimeSlot,
		totalTickets,
		validationErrors,
		selectedTicket,
		dateAvailability,
		availableTimeSlots
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
		Check,
		Info,
		AlertTriangle
	} from 'lucide-svelte';

	// Define types for stores
	interface Ticket {
		id: string;
	}
	interface CustomerInfo {
		name: string;
		email: string;
	}
	interface ValidationErrors {
		name?: string;
		email?: string;
	}
	interface DateAvailabilityStatus {
		/* Define as per your bookingStore, e.g., 'available' | 'unavailable' | 'loading' | 'unknown' */
	}
	interface BookingActions {
		loadDateAvailabilityForTicket: (ticketId: string, year: number, month: number) => void;
		loadTimeSlotsForSelection: () => void;
		validateBooking: () => boolean;
	}

	interface BookingStep {
		id: number;
		title: string;
		description: string;
		icon: any;
		isComplete: () => boolean;
	}

	// --- STATE MANAGEMENT ---
	let currentStep = $state(1);
	let calendarDate = $state(new Date());
	let loadedMonths = $state<Set<string>>(new Set());
	let lastTicketId = $state<string | null>(null);

	// --- DERIVED STATE ---
	const isCustomerFormValid = $derived(
		!$validationErrors.name &&
			!$validationErrors.email &&
			!!$customerInfo.name &&
			!!$customerInfo.email
	);

	// Safely derive availabilityMap with debugging
	const availabilityMap = $derived(() => {
		if (!$selectedTicket?.id || !$dateAvailability) {
			console.log('[Booking Debug] No ticket or availability data', {
				hasTicket: !!$selectedTicket?.id,
				hasAvailability: !!$dateAvailability
			});
			return null;
		}

		const map =
			$dateAvailability instanceof Map
				? $dateAvailability.get($selectedTicket.id)
				: $dateAvailability[$selectedTicket.id];

		console.log('[Booking Debug] Availability map for ticket', $selectedTicket.id, ':', {
			mapExists: !!map,
			mapSize: map?.size || 0,
			mapType: typeof map
		});

		return map || null;
	});

	const steps: BookingStep[] = [
		{
			id: 1,
			title: 'Select Tickets',
			description: 'Choose your ticket type',
			icon: Ticket,
			isComplete: () => $totalTickets > 0
		},
		{
			id: 2,
			title: 'Select Date',
			description: 'Choose your visit date',
			icon: CalendarIcon,
			isComplete: () => $selectedDate !== null
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
	// Effect to handle date availability loading when moving to step 2
	$effect(() => {
		if (currentStep === 2 && $selectedTicket?.id) {
			const ticketId = $selectedTicket.id;
			const year = calendarDate.getFullYear();
			const month = calendarDate.getMonth();
			const monthKey = `${ticketId}-${year}-${month}`;

			console.log('[Booking Debug] Step 2 effect triggered', {
				ticketId,
				year,
				month,
				monthKey,
				alreadyLoaded: loadedMonths.has(monthKey)
			});

			if (!loadedMonths.has(monthKey)) {
				loadedMonths.add(monthKey);
				console.log('[Booking Debug] Loading availability for', monthKey);
				bookingActions.loadDateAvailabilityForTicket(ticketId, year, month);
			}
		}
	});

	// Effect to handle time slot loading when moving to step 3
	$effect(() => {
		if (currentStep === 3 && $selectedDate && $selectedTicket) {
			console.log('[Booking Debug] Loading time slots for step 3', {
				date: $selectedDate.toISOString().split('T')[0],
				ticketId: $selectedTicket.id,
				totalTickets: $totalTickets
			});
			bookingActions.loadTimeSlotsForSelection();
		}
	});

	// Effect to clear errors when relevant data changes
	$effect(() => {
		if ($selectedDate || $selectedTimeSlot || $totalTickets) {
			bookingError.set(null);
		}
	});

	// Effect to handle ticket type changes - reset loaded months and date availability
	$effect(() => {
		const currentTicketId = $selectedTicket?.id;
		if (currentTicketId !== lastTicketId) {
			console.log('[Booking Debug] Ticket changed from', lastTicketId, 'to', currentTicketId);
			if (lastTicketId !== null) {
				// Only reset if we had a previous ticket (not on initial load)
				loadedMonths = new Set();
				console.log('[Booking Debug] Reset loaded months due to ticket change');
			}
			lastTicketId = currentTicketId as string;
		}
	});

	// --- NAVIGATION ---
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

	/**
	 * Handle month change from Calendar component
	 * @param date - The new month/year date
	 */
	function handleMonthChange(date: Date): void {
		calendarDate = new Date(date);

		console.log('[Booking Debug] Month changed to', date);

		// Load availability for the new month if we have a selected ticket
		if ($selectedTicket?.id) {
			const ticketId = $selectedTicket.id;
			const year = date.getFullYear();
			const month = date.getMonth();
			const monthKey = `${ticketId}-${year}-${month}`;

			console.log('[Booking Debug] Checking if need to load', monthKey);

			if (!loadedMonths.has(monthKey)) {
				loadedMonths.add(monthKey);
				console.log('[Booking Debug] Loading availability for new month', monthKey);
				bookingActions.loadDateAvailabilityForTicket(ticketId, year, month);
			}
		}
	}

	/**
	 * Handle date selection from Calendar component
	 * @param date - The selected date
	 */
	function handleDateSelect(date: Date): void {
		console.log('[Booking Debug] Date selected', date);
		bookingActions.setSelectedDate(date);
		goToNextStep();
	}

	/**
	 * Handle time slot selection
	 */
	function handleTimeSlotSelect(): void {
		console.log('[Booking Debug] Time slot selected, current selection:', $selectedTimeSlot?.id);
		goToNextStep();
	}

	/**
	 * Handle ticket selection
	 */
	function handleTicketSelect(): void {
		console.log('[Booking Debug] Ticket selected');
		goToNextStep();
	}

	// --- BOOKING SUBMISSION ---
	async function handleProceedToPayment(): Promise<void> {
		if (!bookingActions.validateBooking()) {
			return;
		}
		await goto(`/checkout`);
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
								class:text-neutral-400={isActive && !isCompleted}
							>
								{#if isCompleted}
									<Check class="h-5 w-5" />
								{:else}
									<svelte:component this={step.icon} class="h-5 w-5" />
								{/if}
							</div>
							<div class="hidden text-left md:block">
								<div class="text-sm font-semibold text-neutral-900">{step.title}</div>
								<div class="text-xs text-neutral-900">{step.description}</div>
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
					{#if currentStep === 1}
						<div class="p-6 md:p-8" in:fade={{ duration: 400 }} out:fade={{ duration: 200 }}>
							<h2 class="font-heading mb-2 text-2xl font-bold text-neutral-900">
								Select Your Tickets
							</h2>
							<p class="mb-6 text-neutral-600">
								Choose the right experience for you or your group.
							</p>
							<TicketSelector
								language="en"
								class="w-full text-neutral-950"
								onselect={handleTicketSelect}
							/>
						</div>
					{/if}

					{#if currentStep === 2}
						<div class="p-6 md:p-8" in:fade={{ duration: 400 }} out:fade={{ duration: 200 }}>
							<h2 class="font-heading mb-2 text-2xl font-bold text-neutral-900">
								Select Your Visit Date
							</h2>
							<p class="mb-6 text-neutral-600">
								Choose an available date for your museum experience.
							</p>

							<!-- Loading indicator for date availability -->
							{#if $isLoadingDateAvailability}
								<div class="mb-4 flex items-center justify-center rounded-lg bg-blue-50 p-4">
									<Loader class="mr-2 h-5 w-5 animate-spin text-blue-600" />
									<span class="text-blue-800">Loading date availability...</span>
								</div>
							{/if}

							<!-- No ticket selected warning -->
							{#if !$selectedTicket}
								<div class="mb-4 flex items-center justify-center rounded-lg bg-amber-50 p-4">
									<Info class="mr-2 h-5 w-5 text-amber-600" />
									<span class="text-amber-800">Please select a ticket type first</span>
								</div>
							{:else}
								<Calendar
									class="w-full"
									selectedDate={$selectedDate}
									availabilityMap={availabilityMap()}
									selectedTicketId={$selectedTicket?.id ?? null}
									onSelect={handleDateSelect}
									onMonthChange={handleMonthChange}
								/>
							{/if}
						</div>
					{/if}

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

							<!-- Prerequisites Check -->
							{#if !$selectedDate}
								<div class="mb-4 flex items-center justify-center rounded-lg bg-amber-50 p-4">
									<AlertTriangle class="mr-2 h-5 w-5 text-amber-600" />
									<span class="text-amber-800">Please select a date first</span>
								</div>
							{:else if !$selectedTicket}
								<div class="mb-4 flex items-center justify-center rounded-lg bg-amber-50 p-4">
									<AlertTriangle class="mr-2 h-5 w-5 text-amber-600" />
									<span class="text-amber-800">Please select a ticket type first</span>
								</div>
							{:else if $totalTickets <= 0}
								<div class="mb-4 flex items-center justify-center rounded-lg bg-amber-50 p-4">
									<AlertTriangle class="mr-2 h-5 w-5 text-amber-600" />
									<span class="text-amber-800">Please select at least one ticket</span>
								</div>
							{:else if $isLoadingTimeSlots}
								<div class="flex h-48 items-center justify-center text-neutral-500">
									<Loader class="mr-2 animate-spin" /> Loading available times...
								</div>
							{:else if $availableTimeSlots.length === 0}
								<div
									class="mb-4 flex flex-col items-center justify-center rounded-lg bg-red-50 p-6"
								>
									<AlertTriangle class="mb-2 h-8 w-8 text-red-600" />
									<span class="text-center text-red-800"
										>No time slots available for the selected date</span
									>
									<p class="mt-2 text-center text-sm text-red-600">
										Please choose a different date
									</p>
								</div>
							{:else}
								<TimeSlotPicker class="w-full" onselect={handleTimeSlotSelect} />
							{/if}
						</div>
					{/if}

					{#if currentStep === 4}
						<div class="p-6 md:p-8" in:fade={{ duration: 400 }} out:fade={{ duration: 200 }}>
							<h2 class="font-heading mb-2 text-2xl font-bold text-neutral-900">
								Your Information
							</h2>
							<p class="mb-6 text-neutral-900">We need a few details to complete your booking.</p>
							<CustomerForm onsubmit={handleProceedToPayment} />
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
