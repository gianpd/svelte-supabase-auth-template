<!--
@file TicketSelector Component - Ticket type and quantity selection
@description 
Interactive component for selecting ticket types and quantities for museum visits.
Displays pricing, handles quantity changes, and calculates totals.

Key features:
- Multiple ticket type support
- Quantity increment/decrement controls
- Real-time price calculations
- Multilingual ticket names and descriptions
- Group ticket handling
- Input validation and error display
- Responsive design for all screen sizes

@dependencies
- Svelte 5: For reactive state management with runes
- Lucide Icons: For UI icons (plus, minus, ticket, users)
- Tailwind CSS: For styling and responsive design
- bookingStore: For ticket selection state management

@notes
- Supports both individual and group ticket types
- Prices are displayed in EUR format
- Maximum quantity limits can be configured
- Integrates with time slot capacity checking
- Handles multilingual content via translation props
-->

<script lang="ts">
	import { Plus, Minus, Ticket, Users, Info, AlertTriangle } from 'lucide-svelte';
	import {
		selectedTicketTypes,
		availableTicketTypes,
		totalPrice,
		totalTickets,
		validationErrors,
		bookingActions
	} from '$lib/stores/bookingStore';
	import type { TicketType } from '$lib/stores/bookingStore'; // Assuming TicketType interface is exported from bookingStore

	// Type definitions
	interface Props {
		language?: string;
		maxQuantityPerType?: number;
		maxTotalTickets?: number;
		showDescriptions?: boolean;
		class?: string;
		disabled?: boolean;
	}

	interface Translations {
		[key: string]: string;
	}

	// Props for customization
	let {
		language = 'en',
		maxQuantityPerType = 10,
		maxTotalTickets = 20,
		showDescriptions = true,
		class: className = '',
		disabled = false
	}: Props = $props();

	// Helper function to get localized text
	function getLocalizedText(translations: Translations | undefined, fallback: string = ''): string {
		if (!translations || typeof translations !== 'object') return fallback;
		return translations[language] || translations['en'] || translations['it'] || fallback;
	}

	// Format price for display
	function formatPrice(price: number): string {
		return new Intl.NumberFormat('en-EU', {
			style: 'currency',
			currency: 'EUR',
			minimumFractionDigits: 2
		}).format(price);
	}

	// Get current quantity for a ticket type
	function getQuantity(ticketTypeId: string): number {
		return $selectedTicketTypes.get(ticketTypeId) || 0;
	}

	// Update quantity for a ticket type
	function updateQuantity(ticketTypeId: string, newQuantity: number): void {
		// Validate quantity limits
		const clampedQuantity = Math.max(0, Math.min(newQuantity, maxQuantityPerType));

		// Check total tickets limit
		const currentTotal: number = $totalTickets;
		const currentQuantity = getQuantity(ticketTypeId);
		const quantityDiff = clampedQuantity - currentQuantity;

		if (currentTotal + quantityDiff > maxTotalTickets) {
			return; // Don't update if it would exceed total limit
		}

		bookingActions.updateTicketQuantity(ticketTypeId, clampedQuantity);
	}

	// Increment quantity
	function incrementQuantity(ticketTypeId: string): void {
		const currentQuantity = getQuantity(ticketTypeId);
		updateQuantity(ticketTypeId, currentQuantity + 1);
	}

	// Decrement quantity
	function decrementQuantity(ticketTypeId: string): void {
		const currentQuantity = getQuantity(ticketTypeId);
		updateQuantity(ticketTypeId, currentQuantity - 1);
	}

	// Handle direct input change
	function handleInputChange(ticketTypeId: string, event: Event): void {
		const target = event.target as HTMLInputElement;
		const value = parseInt(target.value) || 0;
		updateQuantity(ticketTypeId, value);
	}

	// Check if increment is disabled
	function isIncrementDisabled(ticketTypeId: string): boolean {
		if (disabled) return true;
		const currentQuantity = getQuantity(ticketTypeId);
		const currentTotal: number = $totalTickets;

		return currentQuantity >= maxQuantityPerType || currentTotal >= maxTotalTickets;
	}

	// Check if decrement is disabled
	function isDecrementDisabled(ticketTypeId: string): boolean {
		if (disabled) return true;
		return getQuantity(ticketTypeId) <= 0;
	}

	// Get ticket type subtitle (group size info)
	function getTicketSubtitle(ticketType: TicketType): string {
		if (ticketType.group_size && ticketType.group_size > 1) {
			return `Group of ${ticketType.group_size} people`;
		}
		return 'Individual ticket';
	}

	// Calculate subtotal for a ticket type
	function calculateSubtotal(ticketType: TicketType): number {
		const quantity = getQuantity(ticketType.id);
		return ticketType.price * quantity;
	}
</script>

<div class="ticket-selector {className}">
	<!-- Header -->
	<div class="header mb-6">
		<div class="mb-2 flex items-center space-x-2">
			<Ticket class="text-primary-600 h-5 w-5" />
			<h3 class="text-lg font-semibold text-neutral-900">Select Tickets</h3>
		</div>
		<p class="text-sm text-neutral-600">Choose your ticket types and quantities</p>
	</div>

	<!-- Validation Errors -->
	{#if $validationErrors.tickets}
		<div class="error-message bg-error/10 border-error/20 mb-4 rounded-lg border p-3">
			<div class="flex items-center space-x-2">
				<AlertTriangle class="text-error h-4 w-4" />
				<span class="text-error font-medium">{$validationErrors.tickets}</span>
			</div>
		</div>
	{/if}

	<!-- Ticket Types List -->
	<div class="ticket-types-list space-y-4">
		{#each $availableTicketTypes as ticketType (ticketType.id)}
			{@const quantity = getQuantity(ticketType.id)}
			{@const subtotal = calculateSubtotal(ticketType)}
			{@const name = getLocalizedText(ticketType.name_translations, 'Ticket')}
			{@const description = getLocalizedText(ticketType.description_translations, '')}

			<div
				class="ticket-type-card hover:shadow-medium rounded-lg border border-neutral-200 bg-white p-4 transition-shadow"
			>
				<!-- Ticket Type Header -->
				<div class="ticket-header mb-3 flex items-start justify-between">
					<div class="ticket-info flex-1">
						<h4 class="ticket-name mb-1 text-lg font-semibold text-neutral-900">
							{name}
						</h4>

						<div class="ticket-meta flex items-center space-x-4 text-sm text-neutral-600">
							<span class="subtitle">
								{getTicketSubtitle(ticketType)}
							</span>

							{#if ticketType.group_size}
								<div class="group-indicator flex items-center space-x-1">
									<Users class="h-3 w-3" />
									<span>{ticketType.group_size}</span>
								</div>
							{/if}
						</div>

						{#if showDescriptions && description}
							<p class="ticket-description mt-2 text-sm text-neutral-600">
								{description}
							</p>
						{/if}
					</div>

					<div class="price-info text-right">
						<div class="price text-xl font-bold text-neutral-900">
							{formatPrice(ticketType.price)}
						</div>
						{#if ticketType.group_size && ticketType.group_size > 1}
							<div class="price-per-person text-xs text-neutral-500">
								{formatPrice(ticketType.price / ticketType.group_size)} per person
							</div>
						{/if}
					</div>
				</div>

				<!-- Quantity Controls -->
				<div class="quantity-controls flex items-center justify-between">
					<div class="quantity-input flex items-center space-x-3">
						<!-- Decrement Button -->
						<button
							type="button"
							class="quantity-btn decrement-btn flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 transition-colors
                                {isDecrementDisabled(ticketType.id)
								? 'cursor-not-allowed bg-neutral-100 text-neutral-400'
								: 'focus:ring-primary-500 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 focus:outline-none focus:ring-2'}"
							on:click={() => decrementQuantity(ticketType.id)}
							disabled={isDecrementDisabled(ticketType.id)}
							aria-label="Decrease quantity for {name}"
						>
							<Minus class="h-4 w-4" />
						</button>

						<!-- Quantity Display/Input -->
						<div class="quantity-display relative">
							<input
								type="number"
								class="quantity-input focus:ring-primary-500 focus:border-primary-500 h-8 w-16 rounded-md border border-neutral-300 text-center focus:outline-none focus:ring-2"
								value={quantity}
								min="0"
								max={maxQuantityPerType}
								{disabled}
								on:input={(e) => handleInputChange(ticketType.id, e)}
								aria-label="Quantity for {name}"
							/>
						</div>

						<!-- Increment Button -->
						<button
							type="button"
							class="quantity-btn increment-btn flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 transition-colors
                                {isIncrementDisabled(ticketType.id)
								? 'cursor-not-allowed bg-neutral-100 text-neutral-400'
								: 'focus:ring-primary-500 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 focus:outline-none focus:ring-2'}"
							on:click={() => incrementQuantity(ticketType.id)}
							disabled={isIncrementDisabled(ticketType.id)}
							aria-label="Increase quantity for {name}"
						>
							<Plus class="h-4 w-4" />
						</button>
					</div>

					<!-- Subtotal -->
					{#if quantity > 0}
						<div class="subtotal text-right">
							<div class="subtotal-amount text-primary-700 text-lg font-semibold">
								{formatPrice(subtotal)}
							</div>
							<div class="subtotal-label text-xs text-neutral-500">Subtotal</div>
						</div>
					{/if}
				</div>

				<!-- Quantity Info -->
				{#if quantity > 0}
					<div class="quantity-info mt-3 rounded-md bg-neutral-50 p-2">
						<div class="flex items-center justify-between text-xs text-neutral-600">
							<span>Selected: {quantity} ticket{quantity !== 1 ? 's' : ''}</span>
							{#if ticketType.group_size && ticketType.group_size > 1}
								<span>Total people: {quantity * ticketType.group_size}</span>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Booking Summary -->
	{#if $totalTickets > 0}
		<div class="booking-summary bg-primary-50 border-primary-200 mt-6 rounded-lg border p-4">
			<h4 class="summary-title text-primary-900 mb-3 text-lg font-semibold">Order Summary</h4>

			<div class="summary-details space-y-2">
				<!-- Total Tickets -->
				<div class="summary-row flex items-center justify-between">
					<span class="text-primary-800">Total Tickets:</span>
					<span class="text-primary-900 font-medium">{$totalTickets}</span>
				</div>

				<!-- Total Price -->
				<div class="summary-row flex items-center justify-between text-lg font-bold">
					<span class="text-primary-900">Total:</span>
					<span class="text-primary-900">{formatPrice($totalPrice)}</span>
				</div>
			</div>

			<!-- Limits Warning -->
			{#if $totalTickets >= maxTotalTickets * 0.8}
				<div class="limits-warning bg-warning/10 border-warning/20 mt-3 rounded-md border p-2">
					<div class="flex items-center space-x-2">
						<Info class="text-warning h-4 w-4" />
						<span class="text-warning text-xs">
							Maximum {maxTotalTickets} tickets per booking
						</span>
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<!-- Empty State -->
		<div
			class="empty-state mt-6 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 p-6 text-center"
		>
			<Ticket class="mx-auto mb-2 h-8 w-8 text-neutral-400" />
			<p class="text-neutral-600">No tickets selected</p>
			<p class="mt-1 text-sm text-neutral-500">Choose your ticket types above to continue</p>
		</div>
	{/if}
</div>

<style>
	/* Smooth transitions for all interactive elements */
	.quantity-btn,
	.quantity-input,
	.ticket-type-card {
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Hover effects for ticket cards */
	.ticket-type-card:hover {
		transform: translateY(-1px);
	}

	/* Focus ring for accessibility */
	.quantity-btn:focus,
	.quantity-input:focus {
		outline: 2px solid #2563eb;
		outline-offset: 2px;
	}

	/* Disabled state styling */
	.quantity-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Hide number input spinners on WebKit browsers */
	.quantity-input::-webkit-outer-spin-button,
	.quantity-input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Hide number input spinners on Firefox */
	.quantity-input[type='number'] {
		-moz-appearance: textfield;
	}

	/* Mobile responsive adjustments */
	@media (max-width: 640px) {
		.ticket-header {
			flex-direction: column;
			align-items: start;
		}

		.price-info {
			margin-top: 0.5rem;
			text-align: left;
		}

		.quantity-controls {
			flex-direction: column;
			align-items: start;
			gap: 1rem;
		}
	}

	/* Animation for subtotal appearance */
	.subtotal {
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(10px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
</style>
