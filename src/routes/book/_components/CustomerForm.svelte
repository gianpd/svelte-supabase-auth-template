<script lang="ts">
	import { User } from 'lucide-svelte';
	import { customerInfo, validationErrors } from '$lib/stores/bookingStore';
</script>

<div class="bg-cream-50 rounded-card border border-neutral-300 p-6">
	<header class="mb-2 flex items-center gap-2">
		<User class="text-primary-500 h-5 w-5" />
		<h3 class="font-heading text-xl font-semibold text-neutral-800">Your Information</h3>
	</header>
	<p class="mb-6 text-sm text-neutral-600">
		Please provide your contact details for the booking confirmation.
	</p>

	<div class="flex flex-col gap-4">
		<!-- Name Field -->
		<div>
			<label for="customer-name" class="mb-1 block text-sm font-medium text-neutral-900"
				>Full Name *</label
			>
			<input
				id="customer-name"
				type="text"
				placeholder="Enter your full name"
				bind:value={$customerInfo.name}
				class:invalid={$validationErrors.name}
				class="rounded-card focus:ring-primary-300 focus:border-primary-300 w-full border border-neutral-300 bg-white px-3 py-2 text-neutral-950 transition-all duration-200 focus:outline-none focus:ring-2"
				required
				aria-invalid={$validationErrors.name ? 'true' : 'false'}
				aria-describedby="name-error"
			/>
			{#if $validationErrors.name}
				<p id="name-error" class="text-error mt-1 text-xs">{$validationErrors.name}</p>
			{/if}
		</div>

		<!-- Email Field -->
		<div>
			<label for="customer-email" class="mb-1 block text-sm font-medium text-neutral-700"
				>Email Address *</label
			>
			<input
				id="customer-email"
				type="email"
				placeholder="Enter your email address"
				bind:value={$customerInfo.email}
				class:invalid={$validationErrors.email}
				class="rounded-card focus:ring-primary-300 focus:border-primary-300 invalid:border-error invalid:focus:ring-error/50 w-full border border-neutral-300 bg-white px-3 py-2 text-neutral-950 transition-all duration-200 focus:outline-none focus:ring-2"
				required
				aria-invalid={$validationErrors.email ? 'true' : 'false'}
				aria-describedby="email-error"
			/>
			{#if $validationErrors.email}
				<p id="email-error" class="text-error mt-1 text-xs">{$validationErrors.email}</p>
			{:else}
				<p class="mt-1 text-xs text-neutral-500">
					We'll send your e-tickets to this email address.
				</p>
			{/if}
		</div>
	</div>
</div>
