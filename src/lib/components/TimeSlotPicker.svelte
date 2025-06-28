<!--
@file TimeSlotPicker Component - Time slot selection for museum visits
@description 
Interactive component for selecting available time slots for museum visits.
Displays capacity information and handles loading states.

Key features:
- Real-time availability display
- Capacity indicators with visual cues
- Loading states during API calls
- Responsive grid layout
- Accessibility support
- Integration with booking store

@dependencies
- Svelte 5: For reactive state management with runes
- Lucide Icons: For time and capacity indicators
- Tailwind CSS: For styling and responsive design
- bookingStore: For time slot state management

@notes
- Time slots are fetched based on selected date and ticket type
- Capacity is shown as available/total format
- Fully booked slots are visually disabled
- Times are displayed in user's local timezone
- Supports both click and keyboard interaction
-->

<script lang="ts">
	import { Clock, Users, AlertCircle, Loader2 } from 'lucide-svelte';
	import {
		selectedDate,
		selectedTimeSlot,
		availableTimeSlots,
		isLoadingTimeSlots,
		bookingError,
		totalTickets,
		bookingActions
	} from '$lib/stores/bookingStore';

	import type { TimeSlot } from '$lib/stores/bookingStore';

	// Type definitions
	interface Props {
		class?: string;
		disabled?: boolean;
		showCapacity?: boolean;
	}

	// Props for customization
	let { class: className = '', disabled = false, showCapacity = true }: Props = $props();

	// Format time for display
	function formatTime(timeString: string): string {
		const date = new Date(timeString);
		return date.toLocaleTimeString('en', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: true
		});
	}

	// Format time range for display
	function formatTimeRange(startTime: string, endTime: string): string {
		return `${formatTime(startTime)} - ${formatTime(endTime)}`;
	}

	// Check if a time slot is selectable
	function isSlotSelectable(timeSlot: TimeSlot): boolean {
		if (disabled) return false;
		if (timeSlot.available_slots <= 0) return false;

		const currentTickets: number = $totalTickets;
		return timeSlot.available_slots >= currentTickets;
	}

	// Get capacity status for styling
	function getCapacityStatus(timeSlot: TimeSlot): 'full' | 'low' | 'medium' | 'high' {
		const availableRatio = timeSlot.available_slots / timeSlot.capacity;

		if (timeSlot.available_slots <= 0) return 'full';
		if (availableRatio <= 0.2) return 'low';
		if (availableRatio <= 0.5) return 'medium';
		return 'high';
	}

	// Get capacity color classes
	function getCapacityClasses(status: string): string {
		switch (status) {
			case 'full':
				return 'text-error bg-error/10 border-error/20';
			case 'low':
				return 'text-warning bg-warning/10 border-warning/20';
			case 'medium':
				return 'text-accent-600 bg-accent-50 border-accent-200';
			case 'high':
				return 'text-success bg-success/10 border-success/20';
			default:
				return 'text-neutral-600 bg-neutral-50 border-neutral-200';
		}
	}

	// Handle time slot selection
	function selectTimeSlot(timeSlot: TimeSlot): void {
		if (!isSlotSelectable(timeSlot)) return;
		bookingActions.setSelectedTimeSlot(timeSlot);
	}

	// Keyboard navigation
	function handleKeydown(event: KeyboardEvent, timeSlot: TimeSlot): void {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			selectTimeSlot(timeSlot);
		}
	}
</script>

<div class="time-slot-picker {className}">
	<!-- Header -->
	<div class="header mb-4">
		<div class="mb-2 flex items-center space-x-2">
			<Clock class="text-primary-600 h-5 w-5" />
			<h3 class="text-lg font-semibold text-neutral-900">Select Time Slot</h3>
		</div>

		{#if $selectedDate}
			<p class="text-sm text-neutral-600">
				Available times for {$selectedDate.toLocaleDateString('en', {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})}
			</p>
		{/if}
	</div>

	<!-- Loading State -->
	{#if $isLoadingTimeSlots}
		<div class="loading-state flex flex-col items-center justify-center space-y-3 py-12">
			<Loader2 class="text-primary-600 h-8 w-8 animate-spin" />
			<p class="text-neutral-600">Loading available time slots...</p>
		</div>

		<!-- Error State -->
	{:else if $bookingError}
		<div class="error-state flex flex-col items-center justify-center space-y-3 py-12">
			<AlertCircle class="text-error h-8 w-8" />
			<p class="text-error text-center">{$bookingError}</p>
			<button
				type="button"
				class="btn-secondary text-sm"
				on:click={() => bookingActions.clearErrors()}
			>
				Try Again
			</button>
		</div>

		<!-- No Date Selected -->
	{:else if !$selectedDate}
		<div
			class="empty-state flex flex-col items-center justify-center space-y-3 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 py-12"
		>
			<Clock class="h-8 w-8 text-neutral-400" />
			<p class="text-center text-neutral-600">Please select a date to view available time slots</p>
		</div>

		<!-- No Time Slots Available -->
	{:else if $availableTimeSlots.length === 0}
		<div
			class="empty-state flex flex-col items-center justify-center space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 py-12"
		>
			<AlertCircle class="h-8 w-8 text-neutral-400" />
			<p class="text-center text-neutral-600">No time slots available for the selected date</p>
			<p class="text-center text-sm text-neutral-500">
				Please choose a different date or check back later
			</p>
		</div>

		<!-- Time Slots Grid -->
	{:else}
		<div class="time-slots-grid grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each $availableTimeSlots as timeSlot (timeSlot.id)}
				{@const isSelected = $selectedTimeSlot?.id === timeSlot.id}
				{@const isSelectable = isSlotSelectable(timeSlot)}
				{@const capacityStatus = getCapacityStatus(timeSlot)}
				{@const capacityClasses = getCapacityClasses(capacityStatus)}

				<button
					type="button"
					class="time-slot-card focus:ring-primary-500 relative rounded-lg border-2 p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1
                        {isSelected
						? 'border-primary-600 bg-primary-50 shadow-md'
						: isSelectable
							? 'hover:border-primary-300 hover:shadow-medium border-neutral-200 bg-white hover:-translate-y-0.5'
							: 'cursor-not-allowed border-neutral-200 bg-neutral-50 opacity-60'}"
					on:click={() => selectTimeSlot(timeSlot)}
					on:keydown={(e) => handleKeydown(e, timeSlot)}
					disabled={!isSelectable}
					aria-label="Select time slot {formatTimeRange(timeSlot.start_time, timeSlot.end_time)}"
					aria-selected={isSelected}
				>
					<!-- Time Range -->
					<div class="time-range mb-2">
						<div class="text-lg font-semibold text-neutral-900">
							{formatTimeRange(timeSlot.start_time, timeSlot.end_time)}
						</div>
					</div>

					<!-- Capacity Information -->
					{#if showCapacity}
						<div class="capacity-info flex items-center justify-between">
							<div class="flex items-center space-x-1">
								<Users class="h-4 w-4 text-neutral-500" />
								<span class="text-sm text-neutral-600"> Capacity </span>
							</div>

							<div
								class="capacity-badge rounded-full border px-2 py-1 text-xs font-medium {capacityClasses}"
							>
								{timeSlot.available_slots}/{timeSlot.capacity}
							</div>
						</div>
					{/if}

					<!-- Status Indicators -->
					<div class="status-indicators mt-3 flex items-center justify-between">
						<!-- Availability Status -->
						<div class="availability-status text-xs">
							{#if capacityStatus === 'full'}
								<span class="text-error font-medium">Fully Booked</span>
							{:else if capacityStatus === 'low'}
								<span class="text-warning font-medium">Few Spots Left</span>
							{:else if capacityStatus === 'medium'}
								<span class="text-accent-600 font-medium">Good Availability</span>
							{:else}
								<span class="text-success font-medium">Available</span>
							{/if}
						</div>

						<!-- Selection Indicator -->
						{#if isSelected}
							<div class="selection-indicator bg-primary-600 h-2 w-2 rounded-full"></div>
						{/if}
					</div>

					<!-- Insufficient Capacity Warning -->
					{#if $totalTickets > 0 && timeSlot.available_slots < $totalTickets && timeSlot.available_slots > 0}
						<div
							class="capacity-warning bg-warning/10 border-warning/20 mt-2 rounded-md border p-2"
						>
							<p class="text-warning text-xs">
								Only {timeSlot.available_slots} spots available (you need {$totalTickets})
							</p>
						</div>
					{/if}
				</button>
			{/each}
		</div>

		<!-- Selected Time Slot Summary -->
		{#if $selectedTimeSlot}
			<div class="selected-summary bg-primary-50 border-primary-200 mt-6 rounded-lg border p-4">
				<div class="mb-2 flex items-center space-x-2">
					<Clock class="text-primary-600 h-4 w-4" />
					<span class="text-primary-900 font-medium">Selected Time Slot</span>
				</div>
				<p class="text-primary-800">
					{formatTimeRange($selectedTimeSlot.start_time, $selectedTimeSlot.end_time)}
				</p>
				<p class="text-primary-700 mt-1 text-sm">
					{$selectedTimeSlot.available_slots} spots available
				</p>
			</div>
		{/if}
	{/if}
</div>

<style>
	/* Hover animations for selectable time slots */
	.time-slot-card:not(:disabled):hover {
		transform: translateY(-2px);
	}

	/* Focus ring for accessibility */
	.time-slot-card:focus {
		outline: 2px solid #2563eb;
		outline-offset: 2px;
	}

	/* Smooth transitions */
	.time-slot-card {
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Mobile responsive adjustments */
	@media (max-width: 640px) {
		.time-slots-grid {
			grid-template-columns: 1fr;
		}

		.time-slot-card {
			padding: 1rem;
		}
	}

	/* Capacity badge animation */
	.capacity-badge {
		transition: all 0.2s ease-in-out;
	}

	/* Selection indicator pulse animation */
	.selection-indicator {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
</style>
