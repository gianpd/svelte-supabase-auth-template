<script lang="ts">
	/**
	 * @file +page.svelte for /shop/[productId]
	 * @purpose Renders the detailed view for a single merchandise product.
	 * @dependencies
	 * - svelte: For component logic and transitions.
	 * - lucide-svelte: For icons.
	 * - $lib/stores/cartStore: For adding items to the cart.
	 * @notes
	 * - Receives product data from its `+page.server.ts` load function.
	 * - Displays product details including name, price, description, and stock status.
	 * - Provides an input to select quantity and an "Add to Cart" button.
	 * - The "Add to Cart" button is disabled for out-of-stock items.
	 */
	import { cart } from '$lib/stores/cartStore';
	import { fade } from 'svelte/transition';
	import { ShoppingCart } from 'lucide-svelte';

	let { data } = $props();
	const { product } = data;

	// Use $state for reactive state variable
	let quantity = $state(1);

	/** Adds the selected quantity of the current product to the cart. */
	function handleAddToCart() {
		cart.addToCart(product, quantity);
		// A toast notification could be triggered here for user feedback.
	}

	// Determine display language and fallbacks for name and description.
	const lang = 'en';
	const name = product.name_translations[lang] || Object.values(product.name_translations)[0];
	const description =
		product.description_translations?.[lang] ||
		Object.values(product.description_translations || {})[0] ||
		'<p>No description available.</p>';

	// Use $derived for reactive stock status
	const stockStatus = $derived(
		product.inventory > 0
			? product.inventory > 10
				? 'In Stock'
				: `Low Stock (${product.inventory} left)`
			: 'Out of Stock'
	);
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.metaDescription} />
</svelte:head>

<div class="bg-white py-12 md:py-16" in:fade={{ duration: 300 }}>
	<div class="container mx-auto max-w-5xl px-4">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
			<!-- Image Section -->
			<div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-neutral-100">
				<!-- Placeholder for product image. -->
				<div class="flex h-full w-full items-center justify-center text-neutral-400">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="96"
						height="96"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1"
						stroke-linecap="round"
						stroke-linejoin="round"
						><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle
							cx="8.5"
							cy="8.5"
							r="1.5"
						></circle><polyline points="21 15 16 10 5 21"></polyline></svg
					>
				</div>
			</div>

			<!-- Details Section -->
			<div class="flex flex-col">
				<h1 class="font-display text-3xl font-bold text-neutral-900 md:text-4xl">{name}</h1>

				<p class="text-primary-600 mt-4 text-3xl font-bold">
					€{product.price.toFixed(2)}
				</p>

				<div class="mt-4">
					<span
						class="text-sm font-medium"
						class:text-success={product.inventory > 10}
						class:text-warning={product.inventory > 0 && product.inventory <= 10}
						class:text-error={product.inventory <= 0}
					>
						{stockStatus}
					</span>
				</div>

				<div class="prose prose-neutral mt-6 max-w-none text-neutral-600">
					{@html description}
				</div>

				<div class="mt-8 flex items-center gap-4">
					<label for="quantity" class="font-medium text-neutral-700">Quantity:</label>
					<input
						type="number"
						id="quantity"
						bind:value={quantity}
						min="1"
						max={product.inventory}
						class="focus:border-primary-500 focus:ring-primary-500 w-20 rounded-md border-neutral-300 text-center shadow-sm"
						disabled={product.inventory <= 0}
						aria-label="Product quantity"
					/>
				</div>

				<div class="mt-auto pt-8">
					<button
						type="button"
						class="bg-primary-500 text-primary-50 hover:bg-primary-600 flex w-full items-center justify-center gap-2 rounded-md px-8 py-3 text-base font-medium shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
						onclick={handleAddToCart}
						disabled={product.inventory <= 0 || quantity > product.inventory || quantity < 1}
					>
						<ShoppingCart class="h-5 w-5" />
						<span>{product.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
					</button>
					{#if quantity > product.inventory && product.inventory > 0}
						<p class="text-error mt-2 text-center text-sm">
							Only {product.inventory} available in stock.
						</p>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
