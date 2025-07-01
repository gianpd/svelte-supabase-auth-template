<script lang="ts">
	/**
	 * @file Calendar.svelte
	 * @purpose A responsive and interactive calendar component for date selection.
	 *
	 * @dependencies
	 * - svelte: For component logic, transitions, and creating event dispatchers.
	 * - lucide-svelte: For icons.
	 * - $lib/stores/bookingStore: For type definitions.
	 *
	 * @notes
	 * - Manages its own internal state for the currently displayed month and year.
	 * - Calls onSelect callback when a valid date is clicked.
	 * - Calls onMonthChange callback when the user navigates to the next/previous month.
	 * - Disables dates that are in the past or marked as 'unavailable' or 'loading' in the `availabilityMap`.
	 * - Uses callback props instead of event dispatchers for Svelte 5 compatibility.
	 * - Fixed visual indicators to clearly show availability status to users.
	 * - Error handling: Properly displays loading, available, and unavailable states.
	 */
	import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-svelte';
	import type { DateAvailabilityStatus } from '$lib/stores/bookingStore';

	// --- PROPS ---
	interface Props {
		selectedDate?: Date | null;
		availabilityMap?: Map<string, DateAvailabilityStatus> | null;
		selectedTicketId?: string | null;
		class?: string;
		onSelect?: (date: Date) => void;
		onMonthChange?: (date: Date) => void;
	}

	let {
		selectedDate = null,
		availabilityMap = null,
		selectedTicketId = null,
		class: className = '',
		onSelect,
		onMonthChange
	}: Props = $props();

	// --- STATE ---
	let viewDate = $state(new Date());
	let days = $state<
		Array<{
			date: Date;
			isCurrentMonth: boolean;
			isToday: boolean;
			isSelected: boolean;
			availabilityStatus: DateAvailabilityStatus;
		}>
	>([]);
	let isInitialized = $state(false);

	const today = new Date();
	today.setHours(0, 0, 0, 0); // Normalize today's date

	// --- DERIVED STATE & HELPERS ---
	const monthName = $derived(
		viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })
	);

	/**
	 * Get the availability status for a given date
	 * @param date - The date to check
	 * @returns The availability status
	 */
	function getAvailabilityStatus(date: Date): DateAvailabilityStatus {
		if (date < today) return 'unavailable';
		if (!selectedTicketId || !availabilityMap) return 'unknown';

		const dateString = date.toISOString().split('T')[0];
		const status = availabilityMap.get(dateString);

		// Debug logging to help troubleshoot
		if (date.getDate() === 1 && date.getMonth() === viewDate.getMonth()) {
			console.log(
				`[Calendar Debug] Date: ${dateString}, Status: ${status}, Map size: ${availabilityMap.size}`
			);
		}

		return status || 'unknown';
	}

	/**
	 * Generates the calendar grid for the given date
	 * @param date - The date to generate the calendar for
	 * @param currentSelectedDate - The currently selected date for highlighting
	 */
	function generateCalendar(date: Date, currentSelectedDate: Date | null = null) {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDayOfMonth = new Date(year, month, 1);
		const lastDayOfMonth = new Date(year, month + 1, 0);
		const daysInMonth = lastDayOfMonth.getDate();
		const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)

		const newDays = [];

		// Previous month's days
		for (let i = 0; i < startDayOfWeek; i++) {
			const d = new Date(year, month, 1 - (startDayOfWeek - i));
			newDays.push({
				date: d,
				isCurrentMonth: false,
				isToday: false,
				isSelected: false,
				availabilityStatus: 'unavailable' as DateAvailabilityStatus
			});
		}

		// Current month's days
		for (let i = 1; i <= daysInMonth; i++) {
			const d = new Date(year, month, i);
			const availability = getAvailabilityStatus(d);
			newDays.push({
				date: d,
				isCurrentMonth: true,
				isToday: d.getTime() === today.getTime(),
				isSelected: currentSelectedDate ? d.getTime() === currentSelectedDate.getTime() : false,
				availabilityStatus: availability
			});
		}

		// Next month's days
		const gridCells = 42; // 6 weeks * 7 days
		const remainingCells = gridCells - newDays.length;
		for (let i = 1; i <= remainingCells; i++) {
			const d = new Date(year, month + 1, i);
			newDays.push({
				date: d,
				isCurrentMonth: false,
				isToday: false,
				isSelected: false,
				availabilityStatus: 'unavailable' as DateAvailabilityStatus
			});
		}

		days = newDays;
	}

	/**
	 * Navigate to the previous month
	 */
	function previousMonth() {
		const newDate = new Date(viewDate.setMonth(viewDate.getMonth() - 1));
		viewDate = newDate;
		generateCalendar(viewDate, selectedDate);
		onMonthChange?.(newDate);
	}

	/**
	 * Navigate to the next month
	 */
	function nextMonth() {
		const newDate = new Date(viewDate.setMonth(viewDate.getMonth() + 1));
		viewDate = newDate;
		generateCalendar(viewDate, selectedDate);
		onMonthChange?.(newDate);
	}

	/**
	 * Select a date if it's available
	 * @param day - The day object containing date and availability info
	 */
	function selectDate(day: (typeof days)[0]) {
		if (day.date < today || day.availabilityStatus !== 'available' || !day.isCurrentMonth) {
			return; // Do not select past, unavailable dates, or dates from other months
		}
		onSelect?.(day.date);
	}

	/**
	 * Get CSS classes for a day based on its availability status
	 * @param day - The day object
	 * @returns CSS class string
	 */
	function getDayClasses(day: (typeof days)[0]): string {
		const baseClasses = 'relative h-10 w-10 rounded-full transition-all duration-200 font-medium';

		// Base text color
		let classes = baseClasses;

		if (!day.isCurrentMonth) {
			classes += ' text-neutral-300 cursor-not-allowed';
		} else if (day.isSelected) {
			classes += ' bg-primary-600 text-white font-bold border-2 border-primary-600';
		} else if (day.isToday && day.availabilityStatus === 'available') {
			classes += ' border-2 border-primary-500 text-primary-600 font-bold hover:bg-primary-50';
		} else if (day.isToday) {
			classes += ' border-2 border-neutral-400 text-neutral-600 font-bold';
		} else {
			// Style based on availability
			switch (day.availabilityStatus) {
				case 'available':
					classes +=
						' text-neutral-800 hover:bg-primary-100 hover:text-primary-700 cursor-pointer border border-transparent hover:border-primary-300';
					break;
				case 'unavailable':
					classes += ' text-neutral-400 cursor-not-allowed bg-neutral-100';
					break;
				case 'loading':
					classes += ' text-neutral-600 cursor-wait';
					break;
				case 'unknown':
				default:
					classes += ' text-neutral-500 cursor-not-allowed opacity-60';
					break;
			}
		}

		return classes;
	}

	// --- INITIALIZATION EFFECT ---
	// Single effect to handle initialization and updates
	$effect(() => {
		// Initialize viewDate on first render or when selectedDate changes significantly
		if (!isInitialized) {
			const initialDate = selectedDate || new Date();
			viewDate = new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
			isInitialized = true;
		}

		// Always regenerate calendar when viewDate, selectedDate, or availabilityMap changes
		generateCalendar(viewDate, selectedDate);
	});

	// --- PROP CHANGE EFFECT ---
	// Handle external selectedDate changes that should update the view
	$effect(() => {
		const currentSelectedDate = selectedDate;
		if (currentSelectedDate && isInitialized) {
			const selectedYear = currentSelectedDate.getFullYear();
			const selectedMonth = currentSelectedDate.getMonth();
			const currentYear = viewDate.getFullYear();
			const currentMonth = viewDate.getMonth();

			// Only update viewDate if we're looking at a different month/year
			if (selectedYear !== currentYear || selectedMonth !== currentMonth) {
				viewDate = new Date(selectedYear, selectedMonth, 1);
			}
		}
	});

	// --- AVAILABILITY MAP CHANGE EFFECT ---
	// Regenerate calendar when availability data changes
	$effect(() => {
		if (availabilityMap && isInitialized) {
			generateCalendar(viewDate, selectedDate);
		}
	});
</script>

<div class="rounded-lg border border-neutral-200 bg-white p-4 {className}">
	<!-- Calendar Header -->
	<div class="mb-4 flex items-center justify-between">
		<button
			type="button"
			class="rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
			onclick={previousMonth}
			aria-label="Previous month"
		>
			<ChevronLeft class="h-5 w-5" />
		</button>
		<h3 class="w-40 text-center font-semibold text-neutral-800">{monthName}</h3>
		<button
			type="button"
			class="rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
			onclick={nextMonth}
			aria-label="Next month"
		>
			<ChevronRight class="h-5 w-5" />
		</button>
	</div>

	<!-- Availability Status Debug Info (remove in production) -->
	{#if selectedTicketId && availabilityMap}
		<div class="mb-2 text-xs text-neutral-500">
			Debug: Ticket {selectedTicketId}, Map size: {availabilityMap.size}
		</div>
	{/if}

	<!-- Calendar Grid -->
	<div class="grid grid-cols-7 gap-1 text-center text-sm">
		<!-- Day Headers -->
		{#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
			<div class="py-2 font-medium text-neutral-500">{day}</div>
		{/each}

		<!-- Dates -->
		{#each days as day (day.date.getTime())}
			<div class="relative flex items-center justify-center p-1">
				<button
					type="button"
					class={getDayClasses(day)}
					onclick={() => selectDate(day)}
					disabled={!day.isCurrentMonth ||
						day.availabilityStatus !== 'available' ||
						day.date < today}
					title={`${day.date.toLocaleDateString()} - ${day.availabilityStatus}`}
				>
					{#if day.availabilityStatus === 'loading'}
						<Loader2 class="text-primary-500 absolute inset-0 m-auto h-4 w-4 animate-spin" />
					{:else}
						{day.date.getDate()}
					{/if}

					<!-- Small availability indicator dot -->
					{#if day.isCurrentMonth && day.availabilityStatus === 'available' && !day.isSelected}
						<div class="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-green-500"></div>
					{:else if day.isCurrentMonth && day.availabilityStatus === 'unavailable'}
						<div class="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-red-500"></div>
					{:else if day.isCurrentMonth && day.availabilityStatus === 'loading'}
						<div
							class="absolute bottom-0 right-0 h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-500"
						></div>
					{/if}
				</button>
			</div>
		{/each}
	</div>

	<!-- Legend -->
	<div class="mt-4 flex items-center justify-center space-x-6 text-xs text-neutral-600">
		<div class="flex items-center space-x-1">
			<span class="bg-primary-600 h-3 w-3 rounded-full"></span>
			<span>Selected</span>
		</div>
		<div class="flex items-center space-x-1">
			<span class="h-3 w-3 rounded-full bg-green-500"></span>
			<span>Available</span>
		</div>
		<div class="flex items-center space-x-1">
			<span class="h-3 w-3 rounded-full bg-red-500"></span>
			<span>Unavailable</span>
		</div>
		<div class="flex items-center space-x-1">
			<span class="h-3 w-3 rounded-full bg-yellow-500"></span>
			<span>Loading</span>
		</div>
	</div>

	<!-- Availability Summary -->
	{#if selectedTicketId && availabilityMap && availabilityMap.size > 0}
		{@const currentMonthDays = days.filter((d) => d.isCurrentMonth)}
		{@const availableDays = currentMonthDays.filter(
			(d) => d.availabilityStatus === 'available'
		).length}
		{@const unavailableDays = currentMonthDays.filter(
			(d) => d.availabilityStatus === 'unavailable'
		).length}
		{@const loadingDays = currentMonthDays.filter((d) => d.availabilityStatus === 'loading').length}

		<div class="mt-4 rounded-md bg-neutral-50 p-3 text-center text-sm text-neutral-600">
			<div class="mb-1 font-medium">This Month Summary</div>
			<div class="flex justify-center space-x-4 text-xs">
				<span class="text-green-600">{availableDays} Available</span>
				<span class="text-red-600">{unavailableDays} Unavailable</span>
				{#if loadingDays > 0}
					<span class="text-yellow-600">{loadingDays} Loading</span>
				{/if}
			</div>
		</div>
	{/if}
</div>
