<script lang="ts">
	/** 
     * * @file ProductCard.svelte 
     * * @purpose A reusable component to display a single merchandise item
in a list or grid. * 
* @dependencies * - svelte: For component logic and transitions. * -
lucide-svelte: For icons. * - $lib/api/apiClient: For the `Merchandise` type definition. * -
$lib/stores/cartStore: For the `addToCart` action. * 
* @notes * - It displays a placeholder image,
as actual image serving is handled elsewhere. 
* - The "Add to Cart" button is disabled if the
product inventory is zero. 
* - The entire card is a link to the product's detail page. 
* - It
defaults to showing the 'en' translation for the product name. */

	import type { Merchandise } from '$lib/api/apiClient';
	import { cart } from '$lib/stores/cartStore';
	import { ShoppingCart } from 'lucide-svelte';

	let { product }: { product: Merchandise } = $props();

	/** Handles the click event for the "Add to Cart" button. */
	function handleAddToCart() {
		cart.addToCart(product, 1);
		// In a full application, a toast notification could be shown here.
	}

	// Determine the name to display, falling back from 'en' to the first available translation.
	const lang = 'en';
	const name = product.name_translations[lang] || Object.values(product.name_translations)[0];
</script>

<div
	class="rounded-card shadow-soft hover:shadow-large group relative flex h-full flex-col overflow-hidden border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1"
>
	<a href="/shop/{product.id}" class="block" aria-label="View details for {name}">
		<div class="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-neutral-100">
			<!-- Placeholder for product image. -->
			<div class="flex h-full w-full items-center justify-center text-neutral-400">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="48"
					height="48"
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
			<!-- Example of how a real image would be used:
    			<img src={`/api/v1/merchandise/image/${product.primary_image_path}`} alt={name} class="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105" />
    			-->
		</div>
		<div class="p-4">
			<h3 class="font-heading truncate text-lg font-semibold text-neutral-800" title={name}>
				{name}
			</h3>
			<p class="text-primary-600 mt-2 text-xl font-bold">
				€{product.price.toFixed(2)}
			</p>
		</div>
	</a>
	<div class="mt-auto p-4 pt-0">
		<button
			type="button"
			class="bg-primary-500 text-primary-50 hover:bg-primary-600 flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
			onclick={handleAddToCart}
			disabled={product.inventory <= 0}
		>
			<ShoppingCart class="h-4 w-4" />
			<span>{product.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
		</button>
	</div>
</div>
