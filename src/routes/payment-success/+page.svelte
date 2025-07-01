<!--
/**
 * @file +page.svelte (Payment Success Page)
 * @purpose Displays payment confirmation and order details after successful payment
 *
 * @dependencies
 * - $app/page: For accessing URL parameters
 * - lucide-svelte: For icons
 * - $lib/api/apiClient: For fetching order details
 *
 * @notes
 * - Shows payment confirmation with order details
 * - Handles both real and simulated payments
 * - Provides clear next steps for the user
 * - Includes download/email instructions for tickets
 */
-->
<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { Check, Download, Mail, Calendar, MapPin, Clock, Ticket } from 'lucide-svelte';

	// Get payment intent from URL parameters
	let paymentIntentId = $derived(page.url.searchParams.get('payment_intent'));
	let orderDetails = $state(null);
	let isLoading = $state(true);
	let error = $state(null);

	// Mock order details for simulation
	// TODO: Replace with real API call to fetch order details
	onMount(async () => {
		if (paymentIntentId) {
			try {
				// Simulate API call delay
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// Mock order details - in production, fetch from API
				orderDetails = {
					id: 'order_123456789',
					paymentIntentId: paymentIntentId,
					totalAmount: 25.0,
					status: 'PAID',
					customerEmail: 'customer@example.com',
					customerName: 'John Doe',
					createdAt: new Date().toISOString(),
					booking: {
						id: 'booking_123',
						visitDate: '2024-01-15',
						timeSlot: {
							startTime: '10:00',
							endTime: '11:30'
						},
						quantity: 2,
						ticketType: 'Standard Adult'
					},
					simulation: true
				};
			} catch (err) {
				error = 'Failed to load order details';
				console.error('Error loading order details:', err);
			} finally {
				isLoading = false;
			}
		} else {
			error = 'No payment information found';
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>Payment Successful - Zungri Museum</title>
	<meta name="description" content="Your payment has been processed successfully." />
</svelte:head>

<div class="bg-neutral-50 py-12 md:py-16">
	<div class="container mx-auto max-w-4xl px-4">
		{#if isLoading}
			<!-- Loading State -->
			<div class="text-center">
				<div
					class="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-neutral-300 border-t-blue-600"
				></div>
				<p class="mt-4 text-neutral-600">Loading your confirmation...</p>
			</div>
		{:else if error}
			<!-- Error State -->
			<div class="text-center">
				<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
					<svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						></path>
					</svg>
				</div>
				<h1 class="mt-4 text-2xl font-bold text-neutral-900">Error Loading Confirmation</h1>
				<p class="mt-2 text-neutral-600">{error}</p>
				<a
					href="/"
					class="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
				>
					Return to Homepage
				</a>
			</div>
		{:else if orderDetails}
			<!-- Success State -->
			<div class="text-center">
				<!-- Success Icon -->
				<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
					<Check class="h-8 w-8 text-green-600" />
				</div>

				<!-- Success Message -->
				<h1 class="mt-4 text-3xl font-bold text-neutral-900">Payment Successful!</h1>
				<p class="mt-2 text-lg text-neutral-600">
					Thank you for your booking. Your payment has been processed successfully.
				</p>

				{#if orderDetails.simulation}
					<!-- Simulation Notice -->
					<div class="mt-4 inline-block rounded-md bg-amber-50 px-4 py-2 text-sm text-amber-800">
						🎭 This is a simulated payment confirmation for development
					</div>
				{/if}

				<!-- Order Details Card -->
				<div class="mt-8 rounded-lg border border-neutral-200 bg-white p-6 text-left shadow-sm">
					<h2 class="text-xl font-semibold text-neutral-900">Order Confirmation</h2>

					<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
						<!-- Order Info -->
						<div>
							<h3 class="text-sm font-medium text-neutral-600">Order Details</h3>
							<div class="mt-2 space-y-1 text-sm text-neutral-800">
								<p><span class="font-medium">Order ID:</span> {orderDetails.id}</p>
								<p>
									<span class="font-medium">Total Paid:</span> €{orderDetails.totalAmount.toFixed(
										2
									)}
								</p>
								<p><span class="font-medium">Payment ID:</span> {orderDetails.paymentIntentId}</p>
								<p>
									<span class="font-medium">Status:</span>
									<span
										class="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
									>
										{orderDetails.status}
									</span>
								</p>
							</div>
						</div>

						<!-- Customer Info -->
						<div>
							<h3 class="text-sm font-medium text-neutral-600">Customer Information</h3>
							<div class="mt-2 space-y-1 text-sm text-neutral-800">
								<p><span class="font-medium">Name:</span> {orderDetails.customerName}</p>
								<p><span class="font-medium">Email:</span> {orderDetails.customerEmail}</p>
							</div>
						</div>
					</div>

					{#if orderDetails.booking}
						<!-- Booking Details -->
						<div class="mt-6 rounded-md bg-blue-50 p-4">
							<h3 class="flex items-center text-sm font-medium text-blue-800">
								<Ticket class="mr-2 h-4 w-4" />
								Your Museum Visit
							</h3>
							<div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
								<div class="flex items-center text-sm text-blue-700">
									<Calendar class="mr-2 h-4 w-4" />
									<span
										>{new Date(orderDetails.booking.visitDate).toLocaleDateString('en-US', {
											weekday: 'long',
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										})}</span
									>
								</div>
								<div class="flex items-center text-sm text-blue-700">
									<Clock class="mr-2 h-4 w-4" />
									<span
										>{orderDetails.booking.timeSlot.startTime} - {orderDetails.booking.timeSlot
											.endTime}</span
									>
								</div>
								<div class="flex items-center text-sm text-blue-700">
									<span>{orderDetails.booking.quantity} × {orderDetails.booking.ticketType}</span>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<!-- Action Buttons -->
				<div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
					<button
						type="button"
						class="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
						onclick={() => window.print()}
					>
						<Download class="mr-2 h-4 w-4" />
						Download Tickets
					</button>

					<a
						href="mailto:{orderDetails.customerEmail}?subject=Your Zungri Museum Tickets&body=Please find your tickets attached."
						class="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-6 py-3 text-neutral-700 hover:bg-neutral-50"
					>
						<Mail class="mr-2 h-4 w-4" />
						Email Tickets
					</a>
				</div>

				<!-- Additional Information -->
				<div class="mt-8 rounded-md bg-neutral-100 p-4 text-left">
					<h3 class="text-sm font-medium text-neutral-800">Important Information</h3>
					<ul class="mt-2 space-y-1 text-sm text-neutral-600">
						<li>• Please arrive 15 minutes before your scheduled time</li>
						<li>• Bring a valid ID for verification</li>
						<li>• Your e-tickets have been sent to {orderDetails.customerEmail}</li>
						<li>• For questions, contact us at info@museozungri.it</li>
					</ul>
				</div>

				<!-- Location Info -->
				<div class="mt-6 flex items-center justify-center text-sm text-neutral-600">
					<MapPin class="mr-2 h-4 w-4" />
					<span>Museo di Zungri, Via Roma 123, 89020 Zungri (VV), Calabria</span>
				</div>

				<!-- Navigation -->
				<div class="mt-8 flex justify-center gap-4">
					<a
						href="/"
						class="rounded-md bg-neutral-200 px-4 py-2 text-neutral-700 hover:bg-neutral-300"
					>
						Return to Homepage
					</a>
					<a
						href="/plan-your-visit"
						class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
					>
						Plan Your Visit
					</a>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- TODO: Production Implementation Notes -->
<!--
TODO: For production implementation:

1. Replace mock order details with real API call:
   const orderDetails = await apiClient.getOrderByPaymentIntent(paymentIntentId);

2. Add real ticket download functionality:
   - Generate PDF tickets on the backend
   - Provide secure download links
   - Include QR codes for ticket validation

3. Implement real email ticket delivery:
   - Send confirmation emails automatically after payment
   - Include PDF tickets as attachments
   - Use email templates with proper branding

4. Add order tracking:
   - Allow customers to view order status
   - Provide order lookup by email + order ID
   - Send status updates via email

5. Remove all simulation-related code and notices
-->
