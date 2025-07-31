<script lang="ts">
	/**
	 * @file ProductCard.svelte
	 * @purpose Reusable product card component with demo mode support and image handling
	 *
	 * @dependencies
	 * - $lib/api/apiClient: For Merchandise and MerchandiseImage type definitions
	 * - $lib/data/mockMerchandise: For getPrimaryImage utility
	 * - svelte/transition: For animations
	 *
	 * @notes
	 * - Supports both live and demo mode display
	 * - Handles missing product data gracefully
	 * - Includes proper image handling with fallbacks
	 * - Shows inventory information and availability
	 * - Includes accessibility features and proper error handling
	 */

	import type { Merchandise, MerchandiseImage } from '$lib/api/apiClient';
	import { getPrimaryImage } from '$lib/data/mockMerchandise';
	import { fade } from 'svelte/transition';

	interface Props {
		product: Merchandise;
		isDemo?: boolean;
	}

	let { product, isDemo = false }: Props = $props();

	/**
	 * Safely extracts product name with fallback handling
	 * @param product - The merchandise product
	 * @returns Localized product name or fallback
	 */
	function getProductName(product: Merchandise): string {
		if (!product?.name_translations) return 'Prodotto Senza Nome';
		return (
			product.name_translations['it'] ||
			product.name_translations['en'] ||
			Object.values(product.name_translations)[0] ||
			'Prodotto Senza Nome'
		);
	}

	/**
	 * Safely extracts product description with fallback handling
	 * @param product - The merchandise product
	 * @returns Localized product description or fallback
	 */
	function getProductDescription(product: Merchandise): string {
		if (!product?.description_translations) return '';
		return (
			product.description_translations['it'] ||
			product.description_translations['en'] ||
			Object.values(product.description_translations)[0] ||
			''
		);
	}

	/**
	 * Formats product price as EUR currency
	 * @param price - The product price (number)
	 * @returns Formatted price string
	 */
	function formatPrice(price: number): string {
		try {
			if (typeof price !== 'number' || isNaN(price)) return '€ 0,00';
			return `€ ${price.toFixed(2).replace('.', ',')}`;
		} catch {
			return '€ 0,00';
		}
	}

	/**
	 * Gets category display name with proper formatting
	 * @param product - The merchandise product
	 * @returns Formatted category name
	 */
	function getCategoryName(product: Merchandise): string {
		const description = getProductDescription(product).toLowerCase();

		// Map category keys to display names
		const categoryMap: Record<string, string> = {
			libri: 'Libri',
			riproduzioni: 'Riproduzioni',
			gioielli: 'Gioielli',
			ceramiche: 'Ceramiche',
			tessili: 'Tessili'
		};

		return categoryMap[description] || 'Varie';
	}

	/**
	 * Determines inventory status and styling
	 * @param inventory - Current inventory count
	 * @returns Inventory status object
	 */
	function getInventoryStatus(inventory: number) {
		if (inventory <= 0) {
			return {
				text: 'Esaurito',
				class: 'bg-red-100 text-red-800',
				available: false
			};
		} else if (inventory <= 3) {
			return {
				text: `Ultimi ${inventory} disponibili`,
				class: 'bg-orange-100 text-orange-800',
				available: true
			};
		} else if (inventory <= 10) {
			return {
				text: 'Disponibile',
				class: 'bg-green-100 text-green-800',
				available: true
			};
		} else {
			return {
				text: 'Disponibile',
				class: 'bg-green-100 text-green-800',
				available: true
			};
		}
	}

	/**
	 * Handles card click navigation
	 * In demo mode, shows a message instead of navigating
	 */
	function handleCardClick() {
		if (isDemo) {
			alert(
				'Questo è un prodotto dimostrativo. La visualizzazione dettagliata non è disponibile in modalità offline.'
			);
			return;
		}

		// Navigate to product detail page when implemented
		console.log('Navigate to product:', product.id);
	}

	/**
	 * Handles add to cart action
	 */
	function handleAddToCart() {
		if (isDemo) {
			alert('Funzione non disponibile in modalità demo');
			return;
		}

		if (!inventoryStatus.available) {
			alert('Prodotto non disponibile');
			return;
		}

		console.log('Add to cart:', product.id);
		// Implement actual cart functionality
	}

	/**
	 * Handles image load error with fallback
	 * @param event - Image error event
	 */
	function handleImageError(event: Event) {
		const img = event.target as HTMLImageElement;
		img.style.display = 'none';
		console.warn('Failed to load image:', img.src);
	}

	// Derived values for template
	const productName = $derived(getProductName(product));
	const productDescription = $derived(getProductDescription(product));
	const formattedPrice = $derived(formatPrice(product.price));
	const categoryName = $derived(getCategoryName(product));
	const primaryImage = $derived(getPrimaryImage(product));
	const inventoryStatus = $derived(getInventoryStatus(product.inventory));
	const hasValidImage = $derived(primaryImage && primaryImage.image_path && !isDemo);
</script>

<article
	class="focus-within:ring-primary-500 group relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-offset-2 hover:shadow-lg hover:shadow-neutral-200/50"
	in:fade={{ duration: 300 }}
>
	<!-- Demo Badge -->
	{#if isDemo}
		<div class="absolute left-3 top-3 z-10">
			<span
				class="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800"
			>
				Demo
			</span>
		</div>
	{/if}

	<!-- Inventory Status Badge -->
	{#if !inventoryStatus.available}
		<div class="absolute right-3 top-3 z-10">
			<span
				class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium {inventoryStatus.class}"
			>
				{inventoryStatus.text}
			</span>
		</div>
	{/if}

	<!-- Product Image -->
	<div
		class="aspect-square w-full overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200"
	>
		{#if hasValidImage}
			<img
				src={primaryImage.image_path}
				alt={productName}
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
				on:error={handleImageError}
				loading="lazy"
			/>
		{:else}
			<!-- Fallback placeholder -->
			<div class="flex h-full items-center justify-center">
				<div class="text-center">
					<svg
						class="mx-auto h-16 w-16 text-neutral-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					<p class="mt-2 text-sm text-neutral-500">
						{isDemo ? 'Immagine Demo' : 'Immagine'}
					</p>
				</div>
			</div>
		{/if}
	</div>

	<!-- Product Information -->
	<div class="p-4">
		<!-- Category and Inventory Status -->
		<div class="mb-2 flex items-center justify-between">
			<span
				class="bg-primary-100 text-primary-800 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
			>
				{categoryName}
			</span>

			{#if inventoryStatus.available && product.inventory <= 10}
				<span
					class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium {inventoryStatus.class}"
				>
					{inventoryStatus.text}
				</span>
			{/if}
		</div>

		<!-- Product Name -->
		<h3 class="group-hover:text-primary-700 mb-2 text-lg font-semibold text-neutral-900">
			<button
				on:click={handleCardClick}
				class="text-left focus:outline-none"
				aria-label="Visualizza dettagli di {productName}"
			>
				<span class="absolute inset-0" aria-hidden="true"></span>
				{productName}
			</button>
		</h3>

		<!-- Product Description -->
		{#if productDescription}
			<p class="mb-3 line-clamp-2 text-sm text-neutral-600">
				Categoria: {getCategoryName(product)}
			</p>
		{/if}

		<!-- Price and Actions -->
		<div class="flex items-center justify-between">
			<div class="text-primary-600 text-xl font-bold">
				{formattedPrice}
			</div>

			<button
				on:click|stopPropagation={handleAddToCart}
				disabled={isDemo || !inventoryStatus.available}
				class="bg-primary-500 hover:bg-primary-600 focus:ring-primary-500 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:opacity-50"
				aria-label="Aggiungi {productName} al carrello"
			>
				<svg
					class="h-4 w-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 00 5 16v0a1 1 0 01 1 1h11M7 13v4a2 2 0 002 2h7a2 2 0 002-2v-4"
					/>
				</svg>
				{#if !inventoryStatus.available}
					Esaurito
				{:else if isDemo}
					Demo
				{:else}
					Carrello
				{/if}
			</button>
		</div>

		<!-- Demo Mode Notice -->
		{#if isDemo}
			<div class="mt-3 rounded-md bg-amber-50 p-2">
				<p class="text-xs text-amber-700">Prodotto dimostrativo - Non disponibile per l'acquisto</p>
			</div>
		{/if}

		<!-- Inventory Info -->
		{#if !isDemo && product.inventory > 0}
			<div class="mt-2 text-xs text-neutral-500">
				{product.inventory}
				{product.inventory === 1 ? 'pezzo disponibile' : 'pezzi disponibili'}
			</div>
		{/if}
	</div>

	<!-- Hover Overlay -->
	<div
		class="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
		aria-hidden="true"
	></div>
</article>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
