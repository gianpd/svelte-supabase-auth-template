<script lang="ts">
	/**
	 * @file +page.svelte for /checkout
	 * @purpose The main checkout page that orchestrates the payment process.
	 *
	 * @dependencies
	 * - svelte: For component logic and Svelte 5 runes.
	 * - $lib/stores/bookingStore: To get booking details for the order.
	 * - $lib/stores/cartStore: To get merchandise items for the order.
	 * - $lib/api/apiClient: To call the `create-payment-intent` endpoint.
	 * - $lib/components/PaymentForm.svelte: The Stripe payment form component.
	 *
	 * @notes
	 * - This page orchestrates the checkout process.
	 * - It uses a `$effect` to reactively fetch the payment intent `clientSecret` from the backend once all required data is available from the stores.
	 * - It handles loading and error states gracefully during the API call.
	 * - All type definitions are imported from their respective stores/schema files to ensure type safety.
	 */

	import { bookingSummary, customerInfo, type BookingSummary } from '$lib/stores/bookingStore';
	import { cart, cartTotal, type CartItem } from '$lib/stores/cartStore';
	import { apiClient, type ApiError } from '$lib/api/apiClient';
	import type { OrderCreatePayload } from '$lib/schemas/payment';
	import PaymentForm from '$lib/components/PaymentForm.svelte';
	import { Loader2 } from 'lucide-svelte';

	// Local reactive state for the component
	let clientSecret = $state<string | null>(null);
	let isLoading = $state(true);
	let errorMessage = $state<string | undefined>();

	// Derived value for the total amount, combines booking and cart totals.
	const totalAmount = $derived($bookingSummary.totalPrice + $cartTotal);

	// This effect runs on the client-side to prepare the payment.
	// It's triggered whenever its dependencies ($bookingSummary, $cart, totalAmount) change.
	$effect(() => {
		// Guard against running on the server
		if (typeof window === 'undefined') return;

		// Reset state for re-computation
		isLoading = true;
		errorMessage = undefined;
		clientSecret = null;

		if (totalAmount <= 0) {
			errorMessage = "Your cart is empty. There's nothing to check out.";
			isLoading = false;
			return;
		}

		// Prepare the payload for the backend API call
		const payload: OrderCreatePayload = {
			customer_name: $customerInfo.name,
			customer_email: $customerInfo.email
		};

		if ($bookingSummary.isComplete) {
			payload.booking = {
				time_slot_id: $bookingSummary.timeSlot!.id, // Non-null assertion is safe due to isComplete check
				quantity: $bookingSummary.totalTickets,
				customer_name: $customerInfo.name,
				customer_email: $customerInfo.email
			};
		}

		if ($cart.length > 0) {
			payload.merchandise_items = $cart.map((item) => ({
				merchandise_id: item.id,
				quantity: item.quantity
			}));
		}

		// Asynchronously fetch the client secret
		(async () => {
			try {
				const response = await apiClient.createPaymentIntent(payload);
				clientSecret = response.client_secret;
			} catch (e) {
				const error = e as ApiError;
				console.error('Failed to create payment intent:', error);
				errorMessage = error.detail || 'Could not initiate payment. Please try again.';
			} finally {
				isLoading = false;
			}
		})();
	});
</script>

<svelte:head>
	<title>Checkout - Zungri Museum</title>
	<meta name="description" content="Complete your purchase securely." />
</svelte:head>

<main class="bg-neutral-50 py-12 md:py-16">
	<div class="container mx-auto max-w-4xl px-4">
		<h1 class="font-display mb-8 text-center text-4xl font-bold text-neutral-900">Checkout</h1>

		<div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
			<!-- Order Summary -->
			<aside class="rounded-lg border bg-white p-6 shadow-sm lg:order-last">
				<h2 class="mb-4 text-xl font-semibold text-neutral-800">Order Summary</h2>
				<div class="space-y-4">
					<!-- Booking Items -->
					{#if $bookingSummary.tickets.length > 0}
						<div class="border-b pb-2">
							<h3 class="mb-2 font-medium text-neutral-600">Tickets</h3>
							{#each $bookingSummary.tickets as ticket}
								<div class="flex justify-between text-sm">
									<span>{ticket.quantity}x {ticket.type.name_translations?.en ?? 'Ticket'}</span>
									<span class="font-medium">€{ticket.subtotal.toFixed(2)}</span>
								</div>
							{/each}
						</div>
					{/if}

					<!-- Merchandise Items -->
					{#if $cart.length > 0}
						<div class="border-b pb-2">
							<h3 class="mb-2 font-medium text-neutral-600">Merchandise</h3>
							{#each $cart as item}
								<div class="flex justify-between text-sm">
									<span>{item.quantity}x {item.name_translations?.en ?? 'Item'}</span>
									<span class="font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
								</div>
							{/each}
						</div>
					{/if}

					<!-- Total -->
					<div class="flex justify-between pt-4 text-lg font-bold">
						<span>Total</span>
						<span>€{totalAmount.toFixed(2)}</span>
					</div>
				</div>
			</aside>

			<!-- Payment Form -->
			<section class="rounded-lg border bg-white p-6 shadow-sm">
				<h2 class="mb-6 text-xl font-semibold text-neutral-800">Payment Details</h2>
				{#if isLoading}
					<div class="flex h-48 items-center justify-center text-neutral-500">
						<Loader2 class="mr-2 h-6 w-6 animate-spin" />
						<span>Preparing secure payment...</span>
					</div>
				{:else if errorMessage}
					<div
						class="rounded-md border border-red-200 bg-red-50 p-4 text-center text-red-700"
						role="alert"
					>
						<p class="font-semibold">Payment Error</p>
						<p class="text-sm">{errorMessage}</p>
					</div>
				{:else if clientSecret}
					<PaymentForm {clientSecret} />
				{:else}
					<div
						class="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-center text-neutral-600"
						role="alert"
					>
						Could not load payment form.
					</div>
				{/if}
			</section>
		</div>
	</div>
</main>
