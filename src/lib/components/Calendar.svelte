<!--
@file Calendar Component - Interactive date selection for museum visits
@description 
Interactive calendar component for selecting visit dates.
Highlights available dates and prevents selection of past dates or unavailable periods.

Key features:
- Month/year navigation
- Available date highlighting
- Past date prevention
- Responsive design for mobile and desktop
- Accessibility support with keyboard navigation
- Integration with booking store

@dependencies
- Svelte 5: For reactive state management with runes
- Lucide Icons: For navigation arrows
- Tailwind CSS: For styling and responsive design
- bookingStore: For date selection state management

@notes
- Dates are displayed in user's local timezone
- Past dates are automatically disabled
- Available dates can be configured via props
- Supports both click and keyboard interaction
- Mobile-optimized touch interactions
-->

<script lang="ts">
	import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-svelte';
	import { bookingActions, selectedDate } from '$lib/stores/bookingStore';

	// Type definitions
	interface DayInfo {
		date: Date;
		dateString: string;
		day: number;
		isToday: boolean;
		isSelected: boolean;
		isAvailable: boolean;
		isPast: boolean;
		isDisabled: boolean;
	}

	// Props interface
	interface Props {
		availableDates?: string[]; // Array of available date strings (YYYY-MM-DD)
		minDate?: Date | null;
		maxDate?: Date | null;
		class?: string;
		disabled?: boolean;
	}

	// Props for customizing calendar behavior
	let {
		availableDates = [],
		minDate = null,
		maxDate = null,
		class: className = '',
		disabled = false
	}: Props = $props();

	// Reactive state using Svelte 5 runes
	let currentMonth = $state(new Date().getMonth());
	let currentYear = $state(new Date().getFullYear());
	let today = $state(new Date());

	// Derived state for calendar display
	let displayDate = $derived(() => new Date(currentYear, currentMonth, 1));
	let monthName = $derived(() => displayDate().toLocaleDateString('en', { month: 'long' }));
	let daysInMonth = $derived(() => new Date(currentYear, currentMonth + 1, 0).getDate());
	let firstDayOfMonth = $derived(() => new Date(currentYear, currentMonth, 1).getDay());

	// Generate calendar grid
	let calendarDays = $derived(() => {
		const days: (DayInfo | null)[] = [];

		// Add empty cells for days before month starts
		for (let i = 0; i < firstDayOfMonth(); i++) {
			days.push(null);
		}

		// Add days of the month
		for (let day = 1; day <= daysInMonth(); day++) {
			const date = new Date(currentYear, currentMonth, day);
			const dateString = date.toISOString().split('T')[0];

			days.push({
				date,
				dateString,
				day,
				isToday: isSameDay(date, today),
				isSelected: !!($selectedDate && isSameDay(date, $selectedDate)),
				isAvailable: isDateAvailable(date, dateString),
				isPast: date < today,
				isDisabled: !isDateSelectable(date, dateString)
			});
		}

		return days;
	});

	// Helper functions for date validation
	function isSameDay(date1: Date, date2: Date): boolean {
		return date1.toDateString() === date2.toDateString();
	}

	function isDateAvailable(date: Date, dateString: string): boolean {
		// If no specific available dates provided, all future dates are available
		if (availableDates.length === 0) {
			return date >= today;
		}

		return availableDates.includes(dateString);
	}

	function isDateSelectable(date: Date, dateString: string): boolean {
		if (disabled) return false;
		if (date < today) return false;
		if (minDate && date < minDate) return false;
		if (maxDate && date > maxDate) return false;

		return isDateAvailable(date, dateString);
	}

	// Navigation functions
	function previousMonth(): void {
		if (currentMonth === 0) {
			currentMonth = 11;
			currentYear--;
		} else {
			currentMonth--;
		}
	}

	function nextMonth(): void {
		if (currentMonth === 11) {
			currentMonth = 0;
			currentYear++;
		} else {
			currentMonth++;
		}
	}

	// Date selection handler
	async function selectDate(dayInfo: DayInfo | null): Promise<void> {
		if (!dayInfo || dayInfo.isDisabled) return;

		await bookingActions.setSelectedDate(dayInfo.date);
	}

	// Keyboard navigation
	function handleKeydown(event: KeyboardEvent, dayInfo: DayInfo | null): void {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			selectDate(dayInfo);
		}
	}

	// Initialize today's date on mount
	$effect(() => {
		today = new Date();
		today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
	});
</script>

<div class="calendar shadow-medium rounded-lg border border-neutral-200 bg-white {className}">
	<!-- Calendar Header -->
	<div class="calendar-header flex items-center justify-between border-b border-neutral-200 p-4">
		<button
			type="button"
			on:click={previousMonth}
			class="nav-button focus:ring-primary-500 rounded-md p-2 transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2"
			aria-label="Previous month"
			{disabled}
		>
			<ChevronLeft class="h-5 w-5 text-neutral-600" />
		</button>

		<div class="month-year flex items-center space-x-2">
			<CalendarIcon class="text-primary-600 h-5 w-5" />
			<h2 class="text-lg font-semibold text-neutral-900">
				{monthName()}
				{currentYear}
			</h2>
		</div>

		<button
			type="button"
			on:click={nextMonth}
			class="nav-button focus:ring-primary-500 rounded-md p-2 transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2"
			aria-label="Next month"
			{disabled}
		>
			<ChevronRight class="h-5 w-5 text-neutral-600" />
		</button>
	</div>

	<!-- Day Labels -->
	<div class="day-labels grid grid-cols-7 gap-0 border-b border-neutral-200">
		{#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as dayLabel}
			<div class="day-label bg-neutral-50 p-3 text-center text-sm font-medium text-neutral-500">
				{dayLabel}
			</div>
		{/each}
	</div>

	<!-- Calendar Grid -->
	<div class="calendar-grid grid grid-cols-7 gap-0">
		{#each calendarDays() as dayInfo}
			{#if dayInfo}
				<button
					type="button"
					class="day-cell relative flex h-12 items-center justify-center p-3 text-sm transition-all duration-200 focus:z-10 focus:outline-none
                        {dayInfo.isDisabled
						? 'cursor-not-allowed text-neutral-300'
						: 'hover:bg-primary-50 focus:ring-primary-500 cursor-pointer text-neutral-900 focus:ring-2'}
                        {dayInfo.isSelected
						? 'bg-primary-600 hover:bg-primary-700 text-white'
						: dayInfo.isToday
							? 'bg-accent-100 text-accent-800 font-semibold'
							: dayInfo.isAvailable
								? 'hover:bg-primary-50'
								: ''}"
					on:click={() => selectDate(dayInfo)}
					on:keydown={(e) => handleKeydown(e, dayInfo)}
					disabled={dayInfo.isDisabled}
					aria-label="Select {dayInfo.date.toLocaleDateString()}"
					aria-selected={dayInfo.isSelected}
					tabindex={dayInfo.isDisabled ? -1 : 0}
				>
					<span class="day-number relative z-10">
						{dayInfo.day}
					</span>

					<!-- Available date indicator -->
					{#if dayInfo.isAvailable && !dayInfo.isSelected}
						<div
							class="bg-primary-600 absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full"
						></div>
					{/if}

					<!-- Today indicator -->
					{#if dayInfo.isToday && !dayInfo.isSelected}
						<div
							class="border-accent-500 pointer-events-none absolute inset-0 rounded-md border-2"
						></div>
					{/if}
				</button>
			{:else}
				<!-- Empty cell for days before month starts -->
				<div class="day-cell-empty h-12 p-3"></div>
			{/if}
		{/each}
	</div>

	<!-- Footer with date selection info -->
	<div class="calendar-footer border-t border-neutral-200 bg-neutral-50 p-4">
		<div class="flex items-center justify-between text-xs text-neutral-600">
			<div class="flex items-center space-x-4">
				<div class="flex items-center space-x-1">
					<div class="bg-primary-600 h-2 w-2 rounded-full"></div>
					<span>Available</span>
				</div>
				<div class="flex items-center space-x-1">
					<div class="bg-accent-500 h-2 w-2 rounded-full"></div>
					<span>Today</span>
				</div>
			</div>

			{#if $selectedDate}
				<div class="text-primary-700 font-medium">
					Selected: {$selectedDate.toLocaleDateString()}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.calendar {
		/* Ensure calendar has proper min-width for readability */
		min-width: 320px;
		max-width: 100%;
	}

	.day-cell {
		/* Ensure consistent day cell sizing */
		aspect-ratio: 1;
		min-height: 48px;
	}

	@media (max-width: 640px) {
		.calendar-header {
			padding: 0.75rem;
		}

		.day-cell {
			min-height: 40px;
			padding: 0.5rem;
		}

		.day-label {
			padding: 0.5rem;
		}
	}

	/* Hover effects for available dates */
	.day-cell:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	/* Focus ring for accessibility */
	.day-cell:focus {
		outline: 2px solid #2563eb;
		outline-offset: 2px;
	}

	/* Disabled state styling */
	.day-cell:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Animation for date selection */
	.day-cell {
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
