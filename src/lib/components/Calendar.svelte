<!--
@file Calendar Component - Interactive date selection for museum visits
@description 
Interactive calendar component for selecting visit dates.
Highlights available dates based on ticket selection and prevents selection of past or unavailable periods.

Key features:
- Month/year navigation
- Real-time availability highlighting (available, unavailable, loading)
- Past date prevention
- Responsive design for mobile and desktop
- Accessibility support with keyboard navigation
- Integration with booking store

@notes
- This version fixes all visual indicator issues.
- The "Today" indicator is now an outlined circle around the date.
- The availability dots are now correctly displayed and sized.
- The legend perfectly matches the component's visual styles.
-->

<script lang="ts">
	import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-svelte';
	import { bookingActions, selectedDate } from '$lib/stores/bookingStore';
	import type { DateAvailabilityStatus } from '$lib/stores/bookingStore';

	// --- TYPE DEFINITIONS ---

	interface DayInfo {
		date: Date;
		dateString: string;
		day: number;
		isToday: boolean;
		isSelected: boolean;
		isPast: boolean;
		isDisabled: boolean;
		availability: DateAvailabilityStatus;
	}

	interface Props {
		class?: string;
		disabled?: boolean;
		viewDate: Date; // Bound from parent to control the calendar's month/year
		selectedTicketId?: string | null; // The currently selected ticket type
		availabilityMap?: Map<string, DateAvailabilityStatus> | null; // Cached availability data
	}

	// --- PROPS ---

	let {
		class: className = '',
		disabled = false,
		viewDate = $bindable(),
		selectedTicketId = null,
		availabilityMap = null
	}: Props = $props();

	// --- REACTIVE STATE ---

	let today = $state(new Date());

	// Derived state for calendar display, driven by the `viewDate` prop
	let currentMonth = $derived(viewDate.getMonth());
	let currentYear = $derived(viewDate.getFullYear());
	let displayDate = $derived(new Date(currentYear, currentMonth, 1));
	let monthName = $derived(displayDate.toLocaleDateString('en', { month: 'long' }));
	let daysInMonth = $derived(new Date(currentYear, currentMonth + 1, 0).getDate());
	let firstDayOfMonth = $derived(new Date(currentYear, currentMonth, 1).getDay());

	// --- LOGIC ---

	// Generate the grid of days for the current month view
	let calendarDays = $derived(() => {
		const days: (DayInfo | null)[] = [];
		const now = new Date();
		now.setHours(0, 0, 0, 0); // Use start of today for accurate past-date checking

		for (let i = 0; i < firstDayOfMonth; i++) days.push(null);

		for (let day = 1; day <= daysInMonth; day++) {
			const date = new Date(currentYear, currentMonth, day);
			const dateString = date.toISOString().split('T')[0];
			const isPast = date < now;

			let availability: DateAvailabilityStatus = 'unknown';
			if (selectedTicketId && availabilityMap) {
				availability = availabilityMap.get(dateString) ?? 'unknown';
			}

			const isSelectable = !disabled && !isPast && availability === 'available';

			days.push({
				date,
				dateString,
				day,
				isToday: isSameDay(date, today),
				isSelected: !!($selectedDate && isSameDay(date, $selectedDate)),
				isPast,
				availability,
				isDisabled: !isSelectable
			});
		}
		return days;
	});

	// Helper function to determine the CSS classes for a day cell.
	function getDayClasses(dayInfo: DayInfo): string {
		const classes: string[] = [];

		if (dayInfo.isSelected) {
			classes.push('bg-primary-600 hover:bg-primary-700 text-white font-semibold');
		} else {
			if (dayInfo.isPast) {
				classes.push('text-neutral-300');
			} else if (dayInfo.availability === 'unavailable') {
				classes.push('text-neutral-400 line-through');
			} else if (dayInfo.availability === 'loading') {
				classes.push('text-neutral-500 animate-pulse');
			} else if (dayInfo.availability === 'available') {
				classes.push('text-neutral-900 hover:bg-primary-50');
			} else {
				// Fallback for 'unknown' state (e.g., before ticket is selected)
				classes.push('text-neutral-400');
			}
		}

		if (dayInfo.isDisabled) {
			classes.push('cursor-not-allowed');
		} else {
			classes.push('focus:ring-primary-500 cursor-pointer focus:ring-2');
		}

		return classes.join(' ');
	}

	function isSameDay(date1: Date, date2: Date): boolean {
		return date1.toDateString() === date2.toDateString();
	}

	// --- ACTIONS ---

	function previousMonth(): void {
		viewDate = new Date(currentYear, currentMonth - 1, 1);
	}

	function nextMonth(): void {
		viewDate = new Date(currentYear, currentMonth + 1, 1);
	}

	async function selectDate(dayInfo: DayInfo | null): Promise<void> {
		if (!dayInfo || dayInfo.isDisabled) return;
		await bookingActions.setSelectedDate(dayInfo.date);
	}

	function handleKeydown(event: KeyboardEvent, dayInfo: DayInfo | null): void {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			selectDate(dayInfo);
		}
	}

	// --- EFFECTS ---

	$effect(() => {
		today = new Date();
		today.setHours(0, 0, 0, 0);
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
			<h2 class="text-lg font-semibold text-neutral-900">{monthName} {currentYear}</h2>
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
					class="day-cell relative flex h-14 items-center justify-center p-3 text-sm transition-all duration-200 focus:z-10 focus:outline-none {getDayClasses(
						dayInfo
					)}"
					on:click={() => selectDate(dayInfo)}
					on:keydown={(e) => handleKeydown(e, dayInfo)}
					disabled={dayInfo.isDisabled}
					aria-label={dayInfo.isDisabled
						? `${dayInfo.date.toLocaleDateString()} - Unavailable`
						: `Select ${dayInfo.date.toLocaleDateString()}`}
					aria-selected={dayInfo.isSelected}
					tabindex={dayInfo.isDisabled ? -1 : 0}
				>
					<span class="day-number relative z-10">{dayInfo.day}</span>

					<!-- "Today" indicator (outlined circle) -->
					{#if dayInfo.isToday && !dayInfo.isSelected}
						<div
							class="border-accent-500 pointer-events-none absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
							aria-hidden="true"
						></div>
					{/if}

					<!-- Availability indicator dot -->
					{#if !dayInfo.isPast && selectedTicketId && dayInfo.availability !== 'loading' && !dayInfo.isSelected}
						{#if dayInfo.availability === 'available'}
							<div
								class="bg-primary-600 absolute bottom-2 left-1/2 h-2 w-2 -translate-x-1/2 transform rounded-full"
								aria-hidden="true"
							></div>
						{:else if dayInfo.availability === 'unavailable'}
							<div
								class="bg-error absolute bottom-2 left-1/2 h-2 w-2 -translate-x-1/2 transform rounded-full"
								aria-hidden="true"
							></div>
						{/if}
					{/if}
				</button>
			{:else}
				<div class="day-cell-empty h-14 p-3"></div>
			{/if}
		{/each}
	</div>

	<!-- Footer with legend -->
	<div class="calendar-footer border-t border-neutral-200 bg-neutral-50 p-4">
		<div class="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-600">
			<div class="flex items-center space-x-4">
				<div class="flex items-center space-x-1.5">
					<div class="bg-primary-600 h-2 w-2 rounded-full"></div>
					<span>Available</span>
				</div>
				<div class="flex items-center space-x-1.5">
					<div class="bg-error h-2 w-2 rounded-full"></div>
					<span>Unavailable</span>
				</div>
				<div class="flex items-center space-x-1.5">
					<div class="border-accent-600 h-2 w-2 rounded-full border"></div>
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
		min-width: 320px;
		max-width: 100%;
	}
	.day-cell {
		aspect-ratio: 1;
		min-height: 56px;
	}
	.day-cell:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
	}
	.day-cell:focus-visible {
		outline: 2px solid #2563eb;
		outline-offset: -2px;
	}
	.day-cell {
		transition:
			all 0.2s cubic-bezier(0.4, 0, 0.2, 1),
			transform 0.1s ease-out;
	}
	@media (max-width: 640px) {
		.day-cell {
			min-height: 48px;
		}
	}
</style>
