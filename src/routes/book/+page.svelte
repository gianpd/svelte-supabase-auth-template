<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fade, slide, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import {
		bookingActions,
		bookingError,
		bookingSummary,
		customerInfo,
		isCreatingBooking,
		selectedDate,
		selectedTimeSlot,
		totalPrice,
		totalTickets,
		validationErrors
	} from '$lib/stores/bookingStore';

	// Dynamic imports - proper syntax
	import Calendar from '$lib/components/Calendar.svelte';
	import TimeSlotPicker from '$lib/components/TimeSlotPicker.svelte';
	import TicketSelector from '$lib/components/TicketSelector.svelte';
	import ProgressSteps from './_components/ProgressSteps.svelte';
	import BookingSummary from './_components/BookingSummary.svelte';
	import CustomerForm from './_components/CustomerForm.svelte';
	import StepContent from './_components/StepContent.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { LoaderIcon } from 'lucide-svelte';

	import {
		Loader,
		ChevronLeft,
		ChevronRight,
		Calendar as CalendarIcon,
		Clock,
		Ticket,
		User
	} from 'lucide-svelte';

	// Types
	interface BookingStep {
		id: number;
		title: string;
		description: string;
		icon: any;
		isComplete: boolean;
		isActive: boolean;
	}

	// State management
	let currentStep = $state(1);
	let showCustomerForm = $state(false);
	let isLoading = $state(false);
	let hasError = $state(false);
	let retryCount = $state(0);

	// Derived state with better logic
	const canProceedToStep2 = $derived($selectedDate !== null);
	const canProceedToStep3 = $derived(canProceedToStep2 && $selectedTimeSlot !== null);
	const canProceedToStep4 = $derived(canProceedToStep3 && $totalTickets > 0);
	const canCompleteBooking = $derived(canProceedToStep4 && $customerInfo?.isValid);

	// Dynamic steps configuration
	const steps = $derived<BookingStep[]>([
		{
			id: 1,
			title: 'Select Date',
			description: 'Choose your preferred visit date',
			icon: CalendarIcon,
			isComplete: canProceedToStep2,
			isActive: currentStep === 1
		},
		{
			id: 2,
			title: 'Choose Time',
			description: 'Pick your ideal time slot',
			icon: Clock,
			isComplete: canProceedToStep3,
			isActive: currentStep === 2
		},
		{
			id: 3,
			title: 'Select Tickets',
			description: 'Choose ticket types and quantities',
			icon: Ticket,
			isComplete: canProceedToStep4,
			isActive: currentStep === 3
		},
		{
			id: 4,
			title: 'Your Details',
			description: 'Provide contact information',
			icon: User,
			isComplete: canCompleteBooking,
			isActive: currentStep === 4
		}
	]);

	// Auto-advance logic with improved UX
	$effect(() => {
		if ($selectedDate && currentStep === 1) {
			const timer = setTimeout(() => {
				if (currentStep === 1) {
					currentStep = 2;
				}
			}, 800); // Slightly longer for better UX

			return () => clearTimeout(timer);
		}
	});

	$effect(() => {
		if ($selectedTimeSlot && currentStep === 2) {
			const timer = setTimeout(() => {
				if (currentStep === 2) {
					currentStep = 3;
				}
			}, 800);

			return () => clearTimeout(timer);
		}
	});

	$effect(() => {
		showCustomerForm = $totalTickets > 0 && currentStep >= 3;

		// Auto-advance to customer form when tickets are selected
		if ($totalTickets > 0 && currentStep === 3) {
			const timer = setTimeout(() => {
				if (currentStep === 3) {
					currentStep = 4;
				}
			}, 1200);

			return () => clearTimeout(timer);
		}
	});

	// Navigation functions
	function goToStep(step: number): void {
		if (step < 1 || step > 4) return;

		// Validate if user can go to this step
		if (step === 2 && !canProceedToStep2) return;
		if (step === 3 && !canProceedToStep3) return;
		if (step === 4 && !canProceedToStep4) return;

		currentStep = step;
	}

	function goToPreviousStep(): void {
		if (currentStep > 1) {
			currentStep = currentStep - 1;
		}
	}

	function goToNextStep(): void {
		if (currentStep < 4) {
			const canProceed =
				currentStep === 1
					? canProceedToStep2
					: currentStep === 2
						? canProceedToStep3
						: currentStep === 3
							? canProceedToStep4
							: false;

			if (canProceed) {
				currentStep = currentStep + 1;
			}
		}
	}

	// Enhanced booking completion
	async function handleProceedToPayment(): Promise<void> {
		if (!canCompleteBooking) {
			hasError = true;
			return;
		}

		isLoading = true;
		hasError = false;

		try {
			// Validate all data one more time
			if (!bookingActions.validateBooking()) {
				throw new Error('Booking validation failed');
			}

			const booking = await bookingActions.createBooking();

			if (!booking?.id) {
				throw new Error('Invalid booking response');
			}

			// Add success analytics/tracking here
			await goto(`/checkout?booking=${booking.id}&step=payment`, {
				replaceState: false
			});
		} catch (error) {
			console.error('Booking creation failed:', error);
			hasError = true;
			retryCount += 1;

			// Show user-friendly error message
			if (retryCount < 3) {
				// Auto-retry logic for transient errors
				setTimeout(() => {
					if (retryCount < 3) {
						handleProceedToPayment();
					}
				}, 2000);
			}
		} finally {
			isLoading = false;
		}
	}

	// Reset error state when user makes changes
	$effect(() => {
		if ($selectedDate || $selectedTimeSlot || $totalTickets) {
			hasError = false;
		}
	});

	// Keyboard navigation
	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'ArrowLeft' && currentStep > 1) {
			goToPreviousStep();
		} else if (event.key === 'ArrowRight' && currentStep < 4) {
			goToNextStep();
		}
	}

	onMount(() => {
		// Add keyboard listener
		document.addEventListener('keydown', handleKeydown);

		// Preload next step components for better performance
		if (currentStep < 4) {
			// Preload logic here if needed
		}

		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<svelte:head>
	<title>Book Your Visit - Zungri Museum | Southern Italian Heritage Experience</title>
	<meta
		name="description"
		content="Reserve your tickets for an immersive journey through Southern Italian culture and heritage at Zungri Museum. Choose from guided tours, workshops, and special exhibitions."
	/>
	<meta
		name="keywords"
		content="Zungri Museum, Southern Italy, cultural heritage, museum tickets, guided tours"
	/>
	<meta property="og:title" content="Book Your Visit - Zungri Museum" />
	<meta
		property="og:description"
		content="Experience the rich heritage of Southern Italy. Book your museum visit today."
	/>
	<meta property="og:type" content="website" />
	<link rel="canonical" href={$page.url.href} />
</svelte:head>

<main class="from-background via-cream-50 to-primary-50 min-h-screen bg-gradient-to-br">
	<div class="container mx-auto max-w-7xl px-4 py-8">
		<!-- Header Section -->
		<header class="mb-12 text-center">
			<div
				class="bg-primary-100 mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full"
				in:scale={{ duration: 600, easing: quintOut }}
			>
				<CalendarIcon class="text-primary-600 h-8 w-8" />
			</div>

			<h1
				class="font-display mb-4 text-5xl font-bold text-neutral-900 md:text-6xl"
				in:fade={{ duration: 800, delay: 200 }}
			>
				Book Your Visit
			</h1>

			<p
				class="font-body mx-auto max-w-2xl text-xl leading-relaxed text-neutral-600"
				in:fade={{ duration: 800, delay: 400 }}
			>
				Embark on a journey through Southern Italian heritage. Select your preferred date, time, and
				experience level.
			</p>
		</header>

		<!-- Progress Steps -->
		<div class="mb-12" in:slide={{ duration: 600, delay: 600 }}>
			<div class="mb-8 flex justify-center">
				<div class="flex items-center space-x-4 md:space-x-8">
					{#each steps as step, index}
						<button
							type="button"
							class="group flex items-center space-x-3 transition-all duration-300 hover:scale-105"
							class:opacity-50={!step.isComplete && !step.isActive}
							onclick={() => goToStep(step.id)}
							disabled={(step.id === 2 && !canProceedToStep2) ||
								(step.id === 3 && !canProceedToStep3) ||
								(step.id === 4 && !canProceedToStep4)}
						>
							<div
								class="flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300"
								class:bg-primary-600={step.isComplete}
								class:border-primary-600={step.isComplete}
								class:text-white={step.isComplete}
								class:bg-primary-100={step.isActive && !step.isComplete}
								class:border-primary-400={step.isActive && !step.isComplete}
								class:text-primary-600={step.isActive && !step.isComplete}
								class:border-neutral-200={!step.isActive && !step.isComplete}
								class:text-neutral-400={!step.isActive && !step.isComplete}
							>
								{#if step.isComplete}
									<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										/>
									</svg>
								{:else}
									<svelte:component this={step.icon} class="h-5 w-5" />
								{/if}
							</div>

							<div class="hidden text-left md:block">
								<div class="text-sm font-semibold text-neutral-900">{step.title}</div>
								<div class="text-xs text-neutral-500">{step.description}</div>
							</div>
						</button>

						{#if index < steps.length - 1}
							<div
								class="h-0.5 w-8 bg-neutral-200 transition-all duration-500"
								class:bg-primary-600={steps[index + 1].isComplete ||
									(step.isComplete && steps[index + 1].isActive)}
							></div>
						{/if}
					{/each}
				</div>
			</div>
		</div>

		<!-- Error Alert -->
		{#if $bookingError || hasError}
			<div class="mb-8" transition:slide={{ duration: 300 }}>
				<Alert type="error" message={$bookingError || 'Something went wrong. Please try again.'} />
			</div>
		{/if}

		<!-- Main Content Grid -->
		<div class="grid gap-8 lg:grid-cols-3">
			<!-- Steps Content Area -->
			<div class="lg:col-span-2">
				<div class="shadow-exhibit overflow-hidden rounded-2xl border border-neutral-100 bg-white">
					<!-- Step 1: Date Selection -->
					{#if currentStep === 1}
						<div class="p-8" in:fade={{ duration: 400 }} out:fade={{ duration: 200 }}>
							<div class="mb-6">
								<h2 class="font-heading mb-2 text-2xl font-bold text-neutral-900">
									Select Your Visit Date
								</h2>
								<p class="text-neutral-600">
									Choose from available dates for your museum experience.
								</p>
							</div>

							<div class="relative">
								{#if isLoading}
									<div
										class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/80"
									>
										<Loader />
									</div>
								{/if}
								<Calendar class="w-full" />
							</div>
						</div>
					{/if}

					<!-- Step 2: Time Slot Selection -->
					{#if currentStep === 2}
						<div class="p-8" in:fade={{ duration: 400 }} out:fade={{ duration: 200 }}>
							<div class="mb-6">
								<h2 class="font-heading mb-2 text-2xl font-bold text-neutral-900">
									Choose Your Time Slot
								</h2>
								<p class="text-neutral-600">
									Select the perfect time for your visit on {$selectedDate}.
								</p>
							</div>

							<div class="relative">
								{#if isLoading}
									<div
										class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/80"
									>
										<Loader />
									</div>
								{/if}
								<TimeSlotPicker class="w-full" />
							</div>
						</div>
					{/if}

					<!-- Step 3: Ticket Selection -->
					{#if currentStep === 3}
						<div class="p-8" in:fade={{ duration: 400 }} out:fade={{ duration: 200 }}>
							<div class="mb-6">
								<h2 class="font-heading mb-2 text-2xl font-bold text-neutral-900">
									Select Your Tickets
								</h2>
								<p class="text-neutral-600">Choose the right experience for your group.</p>
							</div>

							<div class="relative">
								{#if isLoading}
									<div
										class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/80"
									>
										<Loader />
									</div>
								{/if}
								<TicketSelector language="en" class="w-full" />
							</div>
						</div>
					{/if}

					<!-- Step 4: Customer Information -->
					{#if currentStep === 4 && showCustomerForm}
						<div class="p-8" in:fade={{ duration: 400 }} out:fade={{ duration: 200 }}>
							<div class="mb-6">
								<h2 class="font-heading mb-2 text-2xl font-bold text-neutral-900">
									Your Information
								</h2>
								<p class="text-neutral-600">We need a few details to complete your booking.</p>
							</div>

							<CustomerForm />
						</div>
					{/if}

					<!-- Navigation Footer -->
					<div class="border-t border-neutral-100 bg-neutral-50 p-6">
						<div class="flex items-center justify-between">
							<button
								type="button"
								class="inline-flex items-center px-4 py-2 text-sm font-medium text-neutral-600 transition-colors duration-200 hover:text-neutral-900"
								class:invisible={currentStep === 1}
								onclick={goToPreviousStep}
							>
								<ChevronLeft class="mr-1 h-4 w-4" />
								Previous
							</button>

							<div class="text-sm text-neutral-500">
								Step {currentStep} of 4
							</div>

							<button
								type="button"
								class="text-primary-600 hover:text-primary-700 inline-flex items-center px-4 py-2 text-sm font-medium transition-colors duration-200"
								class:invisible={currentStep === 4}
								disabled={(currentStep === 1 && !canProceedToStep2) ||
									(currentStep === 2 && !canProceedToStep3) ||
									(currentStep === 3 && !canProceedToStep4)}
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
					<BookingSummary bind:currentStep {handleProceedToPayment} />
				</div>
			</aside>
		</div>
	</div>

	<!-- Loading Overlay -->
	{#if $isCreatingBooking}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
			transition:fade={{ duration: 300 }}
		>
			<div class="mx-4 max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
				<Loader size="large" class="mx-auto mb-4" />
				<h3 class="font-heading mb-2 text-xl font-bold text-neutral-900">Creating Your Booking</h3>
				<p class="text-neutral-600">Please wait while we secure your visit...</p>
			</div>
		</div>
	{/if}
</main>

<style>
	/* Custom scrollbar for WebKit browsers */
	::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}

	::-webkit-scrollbar-track {
		background: var(--color-neutral-100, #f5f5f5);
		border-radius: 4px;
	}

	::-webkit-scrollbar-thumb {
		background: var(--color-neutral-300, #d4d4d4);
		border-radius: 4px;
	}

	::-webkit-scrollbar-thumb:hover {
		background: var(--color-neutral-400, #a3a3a3);
	}

	/* Scrollbar for Firefox */
	* {
		scrollbar-width: thin;
		scrollbar-color: var(--color-neutral-300, #d4d4d4) var(--color-neutral-100, #f5f5f5);
	}

	/* Smooth focus styles */
	:focus-visible {
		outline: 2px solid var(--color-primary-500, #3b82f6);
		outline-offset: 2px;
		border-radius: 4px;
	}

	/* Custom selection color */
	::selection {
		background: var(--color-primary-100, #dbeafe);
		color: var(--color-primary-900, #1e3a8a);
	}
</style>
