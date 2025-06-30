<script lang="ts">
	/**
	 * @file PaymentForm.svelte
	 * @purpose A reusable component that encapsulates the Stripe Payment Element for secure payment processing.
	 * @dependencies
	 * - @stripe/stripe-js: For loading Stripe.js and interacting with the Stripe API.
	 * - svelte: For component logic and lifecycle hooks.
	 * - lucide-svelte: For icons.
	 * @notes
	 * - The component is responsible for mounting the Stripe Payment Element.
	 * - It handles the payment submission process, including calling `stripe.confirmPayment`.
	 * - It displays loading states and error messages returned from the Stripe API.
	 * - It expects a `clientSecret` prop to initialize the Payment Element.
	 */
	import {
		loadStripe,
		type Stripe,
		type StripeElements,
		type StripePaymentElement
	} from '@stripe/stripe-js';
	import { Loader2 } from 'lucide-svelte';
	import { env } from '$env/dynamic/public';

	// Define props interface for type safety
	interface Props {
		clientSecret: string;
	}
	let { clientSecret }: Props = $props();

	let stripe: Stripe | null = null;
	let elements: StripeElements | undefined;
	let paymentElement: StripePaymentElement | undefined;
	let isLoading = $state(true); // Loading state for the form itself
	let isProcessing = $state(false); // Processing state for payment submission
	let errorMessage = $state<string | undefined>();
	let paymentElementContainer: HTMLElement;

	$effect(() => {
		// Ensure this runs only on the client
		if (typeof window === 'undefined') {
			isLoading = false;
			return;
		}

		const stripeKey = env.PUBLIC_STRIPE_PUBLISHABLE_KEY;
		if (!stripeKey) {
			console.error('Stripe public key is not set.');
			errorMessage = 'Payment system is not configured correctly.';
			isLoading = false;
			return;
		}

		// Async effect to load and mount Stripe
		(async () => {
			stripe = await loadStripe(stripeKey);
			if (!stripe || !clientSecret) {
				isLoading = false;
				return;
			}

			elements = stripe.elements({ clientSecret });
			paymentElement = elements.create('payment');
			paymentElement.mount(paymentElementContainer);
			isLoading = false;
		})();

		// Cleanup function to unmount the payment element
		return () => {
			if (paymentElement) {
				paymentElement.unmount();
				paymentElement.destroy();
			}
		};
	});

	async function handleSubmit(event: Event) {
		event.preventDefault(); // Handle preventDefault inside the function

		if (!stripe || !elements) {
			errorMessage = 'Payment system is not ready.';
			return;
		}

		isProcessing = true;

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				// Make sure to change this to your payment completion page
				return_url: `${window.location.origin}/payment-success`
			}
		});

		// This point will only be reached if there is an immediate error when
		// confirming the payment. Otherwise, the customer will be redirected to
		// the `return_url`. For some payment methods like iDEAL, the customer will
		// be redirected to an intermediate site first to authorize the payment, then
		// redirected to the `return_url`.
		if (error.type === 'card_error' || error.type === 'validation_error') {
			errorMessage = error.message;
		} else {
			errorMessage = 'An unexpected error occurred.';
		}

		isProcessing = false;
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6">
	<div id="payment-element" bind:this={paymentElementContainer}>
		{#if isLoading}
			<div
				class="flex h-32 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-neutral-500"
			>
				<Loader2 class="mr-2 h-5 w-5 animate-spin" />
				<span>Loading Payment Form...</span>
			</div>
		{/if}
	</div>

	<button
		disabled={isProcessing || isLoading || !stripe || !elements}
		class="bg-primary-600 hover:bg-primary-700 focus-visible:outline-primary-600 w-full rounded-md px-4 py-3 font-semibold text-white shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
	>
		{#if isProcessing}
			<div class="flex items-center justify-center">
				<Loader2 class="mr-2 h-5 w-5 animate-spin" />
				<span>Processing...</span>
			</div>
		{:else}
			<span>Pay Now</span>
		{/if}
	</button>

	<!-- Show any error that happens when confirming the payment -->
	{#if errorMessage}
		<div class="mt-4 text-center text-sm text-red-600" role="alert">
			{errorMessage}
		</div>
	{/if}
</form>
