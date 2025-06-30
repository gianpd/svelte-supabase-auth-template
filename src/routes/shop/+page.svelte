<script lang="ts">
	/**
	 * @file +page.svelte for /shop
	 * @purpose Renders the main merchandise listing page for the museum shop.
	 *
	 * @dependencies
	 * - svelte: For component logic and transitions.
	 * - $lib/components/ProductCard.svelte: The component for displaying each product.
	 *
	 * @notes
	 * - Receives merchandise data from its corresponding `+page.server.ts` load function.
	 * - Displays products in a responsive grid.
	 * - Includes a fallback message if no products are available.
	 */
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { fade } from 'svelte/transition';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.metaDescription} />
</svelte:head>

<div class="bg-background-secondary py-12 md:py-16">
	<div class="container mx-auto max-w-7xl px-4">
		<header class="mb-12 text-center">
			<h1 class="font-display text-4xl font-bold text-neutral-900 md:text-5xl">Museum Shop</h1>
			<p class="font-body mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
				Take a piece of history home with you. Explore our collection of books, replicas, and unique
				souvenirs.
			</p>
		</header>

		{#if data.merchandise && data.merchandise.length > 0}
			<div
				class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
				in:fade={{ duration: 500 }}
			>
				{#each data.merchandise as product (product.id)}
					<ProductCard {product} />
				{/each}
			</div>
		{:else}
			<div class="py-16 text-center text-neutral-500">
				<p class="text-lg">Our online shop is currently being stocked.</p>
				<p class="mt-2">Please check back later for our unique collection!</p>
			</div>
		{/if}
	</div>
</div>
