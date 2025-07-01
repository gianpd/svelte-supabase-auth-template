<script lang="ts">
	/**
	 * @file PaymentForm.svelte
	 * @purpose A simulated payment component that mimics Stripe Payment Element for development
	 * @dependencies
	 * - svelte: For component logic and lifecycle hooks.
	 * - lucide-svelte: For icons.
	 * - $lib/api/apiClient: For calling the simulated payment success endpoint.
	 * @notes
	 * - 🎭 THIS IS A SIMULATION - NOT REAL STRIPE INTEGRATION!
	 * - The component simulates the Stripe payment flow for development/testing
	 * - In production, this should be replaced with the actual Stripe Payment Element
	 * - Includes realistic loading states and payment simulation
	 * - TODO: Replace with real Stripe integration using @stripe/stripe-js
	 */

	import { Loader2, CreditCard, Check, AlertTriangle } from 'lucide-svelte';
	import { apiClient } from '$lib/api/apiClient';

	// Define props interface for type safety
	interface Props {
		clientSecret: string;
	}
	let { clientSecret }: Props = $props();

	let isLoading = $state(false); // Loading state for payment simulation
	let isProcessing = $state(false); // Processing state for payment submission
	let errorMessage = $state<string | undefined>();
	let successMessage = $state<string | undefined>();
	let paymentCompleted = $state(false);

	// Extract payment intent ID from client secret for simulation
	const paymentIntentId = $derived(() => {
		// Simulated client secret format: "pi_sim_xxxx_secret_yyyy"
		if (clientSecret) {
			const parts = clientSecret.split('_secret_');
			return parts[0] || null;
		}
		return null;
	});

	// Simulate the payment form loading
	$effect(() => {
		if (clientSecret) {
			isLoading = true;
			// Simulate loading time
			setTimeout(() => {
				isLoading = false;
			}, 1500);
		}
	});

	async function handleSimulatedPayment(event: Event) {
		event.preventDefault();

		if (!paymentIntentId() || paymentCompleted) {
			return;
		}

		isProcessing = true;
		errorMessage = undefined;
		successMessage = undefined;

		try {
			// Simulate payment processing time
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Call the simulated payment success endpoint
			await apiClient.request(
				'/payments/simulate-success',
				{
					method: 'POST',
					body: JSON.stringify({ payment_intent_id: paymentIntentId() })
				},
				fetch
			);

			// Simulate successful payment
			paymentCompleted = true;
			successMessage = 'Payment completed successfully!';

			// Redirect to success page after a short delay
			setTimeout(() => {
				window.location.href = '/payment-success?payment_intent=' + paymentIntentId();
			}, 1500);
		} catch (error) {
			console.error('Simulated payment error:', error);
			errorMessage = 'Payment simulation failed. Please try again.';
		} finally {
			isProcessing = false;
		}
	}

	// Simulate random payment failure for testing (10% chance)
	function simulateRandomFailure() {
		if (Math.random() < 0.1) {
			throw new Error('Simulated payment failure for testing');
		}
	}
</script>

<!-- 🎭 SIMULATION NOTICE -->
<div class="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3">
	<div class="flex items-center space-x-2">
		<AlertTriangle class="h-4 w-4 text-amber-600" />
		<span class="text-sm font-medium text-amber-800">Simulation Mode</span>
	</div>
	<p class="mt-1 text-xs text-amber-700">
		This is a simulated payment form for development. No real payment will be processed.
	</p>
</div>

{#if paymentCompleted}
	<!-- Success State -->
	<div class="space-y-6">
		<div class="rounded-md border border-green-200 bg-green-50 p-4 text-center">
			<Check class="mx-auto h-12 w-12 text-green-600" />
			<h3 class="mt-2 text-lg font-semibold text-green-800">Payment Successful!</h3>
			<p class="mt-1 text-green-700">{successMessage}</p>
			<p class="mt-2 text-sm text-green-600">Redirecting to confirmation page...</p>
		</div>
	</div>
{:else}
	<!-- Simulated Payment Form -->
	<form onsubmit={handleSimulatedPayment} class="space-y-6">
		<!-- Simulated Payment Element -->
		<div class="space-y-4">
			{#if isLoading}
				<div
					class="flex h-32 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-neutral-500"
				>
					<Loader2 class="mr-2 h-5 w-5 animate-spin" />
					<span>Loading Payment Form...</span>
				</div>
			{:else}
				<!-- Simulated Card Input Fields -->
				<div class="space-y-3 rounded-md border border-neutral-200 bg-white p-4">
					<h4 class="flex items-center text-sm font-medium text-neutral-700">
						<CreditCard class="mr-2 h-4 w-4" />
						Simulated Payment Details
					</h4>

					<div class="grid grid-cols-1 gap-3">
						<!-- Simulated Card Number -->
						<div>
							<label for="sim-card-number" class="block text-xs font-medium text-neutral-600"
								>Card Number</label
							>
							<input
								id="sim-card-number"
								type="text"
								value="4242 4242 4242 4242"
								readonly
								class="mt-1 block w-full rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-500"
							/>
						</div>

						<div class="grid grid-cols-2 gap-3">
							<!-- Simulated Expiry -->
							<div>
								<label for="sim-expiry" class="block text-xs font-medium text-neutral-600"
									>Expiry</label
								>
								<input
									id="sim-expiry"
									type="text"
									value="12/34"
									readonly
									class="mt-1 block w-full rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-500"
								/>
							</div>

							<!-- Simulated CVC -->
							<div>
								<label for="sim-cvc" class="block text-xs font-medium text-neutral-600">CVC</label>
								<input
									id="sim-cvc"
									type="text"
									value="123"
									readonly
									class="mt-1 block w-full rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-500"
								/>
							</div>
						</div>

						<!-- Simulated Name -->
						<div>
							<label for="sim-name" class="block text-xs font-medium text-neutral-600"
								>Cardholder Name</label
							>
							<input
								id="sim-name"
								type="text"
								value="Test User"
								readonly
								class="mt-1 block w-full rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-500"
							/>
						</div>
					</div>

					<p class="text-xs text-neutral-500">
						These are simulated values for development testing.
					</p>
				</div>
			{/if}
		</div>

		<!-- Payment Button -->
		<button
			type="submit"
			disabled={isProcessing || isLoading || paymentCompleted}
			class="bg-primary-600 hover:bg-primary-700 focus-visible:outline-primary-600 w-full rounded-md px-4 py-3 font-semibold text-white shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{#if isProcessing}
				<div class="flex items-center justify-center">
					<Loader2 class="mr-2 h-5 w-5 animate-spin" />
					<span>Processing Payment...</span>
				</div>
			{:else}
				<span>🎭 Simulate Payment</span>
			{/if}
		</button>

		<!-- Error Message -->
		{#if errorMessage}
			<div class="mt-4 text-center text-sm text-red-600" role="alert">
				{errorMessage}
			</div>
		{/if}

		<!-- Success Message -->
		{#if successMessage}
			<div class="mt-4 text-center text-sm text-green-600" role="alert">
				{successMessage}
			</div>
		{/if}
	</form>
{/if}

<!-- TODO Comment for Production -->
<!--
TODO: Replace this simulated payment form with real Stripe integration:

1. Install Stripe dependencies:
   npm install @stripe/stripe-js

2. Replace this component with real Stripe Payment Element:
   import { loadStripe } from '@stripe/stripe-js';

3. Use the real client_secret to initialize Stripe Elements:
   const stripe = await loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);
   const elements = stripe.elements({ clientSecret });

4. Mount the real Payment Element:
   const paymentElement = elements.create('payment');
   paymentElement.mount('#payment-element');

5. Handle real payment confirmation:
   const {error} = await stripe.confirmPayment({
     elements,
     confirmParams: {
       return_url: `${window.location.origin}/payment-success`
     }
   });

6. Remove all simulation code and endpoints from backend.
-->
