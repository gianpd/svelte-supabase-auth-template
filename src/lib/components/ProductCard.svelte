<!-- File: frontend/src/lib/components/ProductCard.svelte -->
<script lang="ts">
	/**
	 * @file ProductCard.svelte
	 * @purpose A reusable component to display a single merchandise item in a list or grid, now with image support.
	 * @description Un componente riutilizzabile per visualizzare un singolo articolo di merchandising in una lista o griglia.
	 *
	 * @dependencies
	 * - svelte: For component logic and Svelte 5 runes.
	 * - lucide-svelte: For icons.
	 * - $lib/api/apiClient: For the `Merchandise` type definition.
	 * - $lib/stores/cartStore: For the `addToCart` action.
	 * - $lib/components/ImageWithLoader.svelte: For lazy-loading images with loading/error states.
	 *
	 * @notes
	 * - Now displays the primary product image using the `ImageWithLoader` component, with a fallback SVG placeholder if no images are available.
	 * - The "Add to Cart" button is disabled if the product inventory is zero.
	 * - The entire card is a link to the product's detail page.
	 * - `e.preventDefault()` is used on the button's click handler to prevent navigating when adding to cart, which is a critical bug fix.
	 * - Di default mostra la traduzione 'it' per il nome del prodotto, con fallback a 'en'.
	 */
	import type { Merchandise } from '$lib/api/apiClient';
	import { cart } from '$lib/stores/cartStore';
	import { ShoppingCart } from 'lucide-svelte';
	import ImageWithLoader from '$lib/components/ImageWithLoader.svelte';

	let { product, class: className = '' }: { product: Merchandise; class?: string } = $props();

	/**
	 * Handles the click event for the "Add to Cart" button.
	 * Prevents the parent link from being followed.
	 * @param e The mouse event.
	 */
	function handleAddToCart(e: MouseEvent) {
		e.preventDefault(); // Stop the <a> tag from navigating
		e.stopPropagation(); // Stop event bubbling
		cart.addToCart(product, 1);
		// In un'applicazione completa, qui potrebbe essere mostrata una notifica toast.
	}

	// Determines the name to display, falling back from 'it' to 'en' to the first available translation.
	const lang = 'it';
	const name = $derived(() => {
		if (!product.name_translations) return 'Prodotto senza nome';
		return (
			product.name_translations[lang] ||
			product.name_translations['en'] ||
			Object.values(product.name_translations)[0] ||
			'Prodotto senza nome'
		);
	});

	// Get description with same fallback logic
	const description = $derived(() => {
		if (!product.description_translations) return '';
		return (
			product.description_translations[lang] ||
			product.description_translations['en'] ||
			Object.values(product.description_translations)[0] ||
			''
		);
	});

	/**
	 * Finds the primary image for the product, or falls back to the first available image.
	 * @returns The primary `MerchandiseImage` object or the first image, or null if none exist.
	 */
	const primaryImage = $derived(() => {
		if (!product.images || product.images.length === 0) return null;
		return product.images.find((img) => img.is_primary) || product.images[0];
	});

	/**
	 * Safely formats a number as a currency string in Italian style.
	 * @param price The price to format.
	 * @returns A formatted currency string (e.g., "€12,50").
	 */
	function formatPrice(price: any): string {
		const numPrice = typeof price === 'string' ? parseFloat(price) : Number(price);
		if (isNaN(numPrice) || !isFinite(numPrice)) {
			return '€0,00';
		}
		return new Intl.NumberFormat('it-IT', {
			style: 'currency',
			currency: 'EUR'
		}).format(numPrice);
	}

	/**
	 * Safely checks if the product is in stock.
	 * @param inventory The inventory count.
	 * @returns True if the product is in stock, false otherwise.
	 */
	function isInStock(inventory: any): boolean {
		const stock = typeof inventory === 'string' ? parseInt(inventory) : Number(inventory);
		return !isNaN(stock) && stock > 0;
	}

	const inStock = $derived(() => isInStock(product.inventory));
	const formattedPrice = $derived(() => formatPrice(product.price));
</script>

<div
	class="group relative flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg {className}"
>
	<a href="/shop/{product.id}" class="block flex-1" aria-label="Visualizza dettagli per {name()}">
		<div class="aspect-square w-full overflow-hidden bg-neutral-100">
			{#if primaryImage()}
				<ImageWithLoader
					src={primaryImage().image_path}
					alt={name()}
					class="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
					loading="lazy"
				/>
			{:else}
				<!-- Placeholder per l'immagine del prodotto. -->
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
						aria-hidden="true"
					>
						<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
						<circle cx="8.5" cy="8.5" r="1.5"></circle>
						<polyline points="21 15 16 10 5 21"></polyline>
					</svg>
				</div>
			{/if}
		</div>

		<div class="p-4">
			<h3 class="mb-2 line-clamp-2 text-lg font-semibold text-neutral-800" title={name()}>
				{name()}
			</h3>
			{#if description()}
				<p class="mb-3 line-clamp-2 text-sm text-neutral-600">
					{description()}
				</p>
			{/if}
			<p class="text-primary-600 text-xl font-bold">
				{formattedPrice()}
			</p>
			{#if !inStock()}
				<p class="mt-1 text-sm font-medium text-red-600">Esaurito</p>
			{/if}
		</div>
	</a>

	<div class="p-4 pt-0">
		<button
			type="button"
			class="bg-primary-500 text-primary-50 hover:bg-primary-600 flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
			onclick={handleAddToCart}
			disabled={!inStock()}
		>
			<ShoppingCart class="h-4 w-4" aria-hidden="true" />
			<span>{inStock() ? 'Aggiungi al Carrello' : 'Esaurito'}</span>
		</button>
	</div>
</div>

<style>
	.line-clamp-2 {
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}
</style>
