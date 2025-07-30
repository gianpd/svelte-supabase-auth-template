<!-- File: frontend/src/routes/shop/+page.svelte -->
<script lang="ts">
	/**
	 * @file +page.svelte per /shop
	 * @purpose Clean, production-ready shop page for the museum
	 * @description Pagina negozio pulita e pronta per la produzione
	 */
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { Merchandise } from '$lib/api/apiClient';

	let { data } = $props();

	// State management
	let searchQuery = $state('');
	let selectedCategory = $state('all');
	let sortBy = $state('featured');
	let showFilters = $state(false);
	let priceRange = $state({ min: 0, max: 1000 });

	// Available categories - could be fetched from API in a real app
	const categories = [
		{ value: 'all', label: 'Tutte le Categorie' },
		{ value: 'libri', label: 'Libri' },
		{ value: 'riproduzioni', label: 'Riproduzioni' },
		{ value: 'gioielli', label: 'Gioielli' },
		{ value: 'ceramiche', label: 'Ceramiche' },
		{ value: 'tessili', label: 'Tessili' }
	];

	const sortOptions = [
		{ value: 'featured', label: 'In Evidenza' },
		{ value: 'newest', label: 'Più Recenti' },
		{ value: 'price-low', label: 'Prezzo: Basso-Alto' },
		{ value: 'price-high', label: 'Prezzo: Alto-Basso' },
		{ value: 'name', label: 'Nome A-Z' }
	];

	// Get product name for filtering/sorting
	function getProductName(product: Merchandise): string {
		if (!product.name_translations) return '';
		return (
			product.name_translations['it'] ||
			product.name_translations['en'] ||
			Object.values(product.name_translations)[0] ||
			''
		);
	}

	// Get product description for search
	function getProductDescription(product: Merchandise): string {
		if (!product.description_translations) return '';
		return (
			product.description_translations['it'] ||
			product.description_translations['en'] ||
			Object.values(product.description_translations)[0] ||
			''
		);
	}

	// Advanced filtering and search
	let filteredProducts = $derived(() => {
		if (!data.merchandise) return [];

		let products = [...data.merchandise];

		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			products = products.filter((product) => {
				const name = getProductName(product).toLowerCase();
				const description = getProductDescription(product).toLowerCase();
				return name.includes(query) || description.includes(query);
			});
		}

		// Price range filter
		products = products.filter((product) => {
			const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
			return price >= priceRange.min && price <= priceRange.max;
		});

		// Sort products
		switch (sortBy) {
			case 'price-low':
				products.sort((a, b) => {
					const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
					const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
					return priceA - priceB;
				});
				break;
			case 'price-high':
				products.sort((a, b) => {
					const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
					const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
					return priceB - priceA;
				});
				break;
			case 'newest':
				products.sort(
					(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
				);
				break;
			case 'name':
				products.sort((a, b) => {
					const nameA = getProductName(a);
					const nameB = getProductName(b);
					return nameA.localeCompare(nameB, 'it');
				});
				break;
			default: // featured - maintain original order or sort by ID
				// Keep original order for now
				break;
		}

		return products;
	});

	// Helper functions
	const clearAllFilters = () => {
		searchQuery = '';
		selectedCategory = 'all';
		sortBy = 'featured';
		priceRange = { min: 0, max: 1000 };
	};

	// Calculate max price for range slider
	const maxPrice = $derived(() => {
		if (!data.merchandise || data.merchandise.length === 0) return 1000;
		return Math.max(
			...data.merchandise.map((p) => (typeof p.price === 'string' ? parseFloat(p.price) : p.price))
		);
	});
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.metaDescription} />
	<meta name="keywords" content="museo, negozio, arte, cultura, riproduzioni, libri" />
	<meta property="og:title" content={data.title} />
	<meta property="og:description" content={data.metaDescription} />
	<meta property="og:type" content="website" />
</svelte:head>

<!-- Premium Hero Section -->
<section
	class="relative min-h-[80vh] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900"
>
	<!-- Sophisticated Background Elements -->
	<div class="absolute inset-0">
		<!-- Premium gradient overlay -->
		<div
			class="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-transparent to-indigo-900/60"
		></div>

		<!-- Elegant geometric patterns -->
		<div class="absolute inset-0 opacity-10">
			<svg class="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
				<defs>
					<pattern
						id="museum-pattern"
						x="0"
						y="0"
						width="20"
						height="20"
						patternUnits="userSpaceOnUse"
					>
						<circle cx="10" cy="10" r="1" fill="currentColor" opacity="0.3" />
						<rect
							x="8"
							y="8"
							width="4"
							height="4"
							fill="none"
							stroke="currentColor"
							stroke-width="0.5"
							opacity="0.2"
						/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill="url(#museum-pattern)" class="text-white" />
			</svg>
		</div>

		<!-- Artistic floating elements -->
		<div
			class="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-gradient-to-br from-amber-400/20 to-rose-400/10 blur-3xl"
		></div>
		<div
			class="absolute -right-20 top-1/3 h-60 w-60 rounded-full bg-gradient-to-br from-purple-400/15 to-blue-400/10 blur-3xl"
		></div>
		<div
			class="absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-emerald-400/10 to-cyan-400/5 blur-3xl"
		></div>
	</div>

	<!-- Content Container -->
	<div class="relative flex min-h-[80vh] items-center">
		<div class="container mx-auto max-w-7xl px-6 lg:px-8">
			<div class="mx-auto max-w-4xl text-center">
				<!-- Premium Badge -->
				<div class="mb-8 inline-flex" in:fly={{ y: 30, duration: 800, easing: quintOut }}>
					<span
						class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2 text-sm font-medium text-white/90 backdrop-blur-sm"
					>
						<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
							<path
								d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
							/>
						</svg>
						Collezione Esclusiva
					</span>
				</div>

				<!-- Premium Typography -->
				<div class="space-y-8">
					<h1
						class="font-display text-5xl font-light leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl"
						in:fly={{ y: 50, duration: 1000, easing: quintOut }}
					>
						<span class="block font-extralight text-white/80">Tesori del</span>
						<span
							class="bg-gradient-to-r from-amber-200 via-amber-100 to-rose-200 bg-clip-text font-bold text-transparent"
						>
							Museo
						</span>
					</h1>

					<div
						class="mx-auto max-w-3xl space-y-6"
						in:fly={{ y: 50, duration: 1000, delay: 200, easing: quintOut }}
					>
						<p class="text-xl leading-relaxed text-white/80 sm:text-2xl">
							Scopri la nostra <strong class="font-semibold text-white">collezione esclusiva</strong
							>
							di arte, cultura e bellezza
						</p>
						<p class="text-lg leading-relaxed text-white/60">
							Ogni pezzo racconta una storia millenaria, custodita con cura e passione per
							tramandare l'eredità del nostro patrimonio culturale
						</p>
					</div>
				</div>

				<!-- Premium CTA Section -->
				<div
					class="mt-12 flex flex-col items-center gap-8"
					in:fly={{ y: 50, duration: 1000, delay: 400, easing: quintOut }}
				>
					<!-- Main CTA Buttons -->
					<div class="flex flex-col gap-4 sm:flex-row sm:gap-6">
						<a
							href="#collezione"
							class="group relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 font-semibold text-white shadow-xl shadow-amber-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/40"
						>
							<span class="relative z-10 flex items-center gap-2">
								Esplora la Collezione
								<svg
									class="h-5 w-5 transition-transform group-hover:translate-x-1"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17 8l4 4m0 0l-4 4m4-4H3"
									/>
								</svg>
							</span>
							<div
								class="absolute inset-0 bg-gradient-to-r from-amber-600 to-rose-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							></div>
						</a>

						<button
							class="group flex items-center gap-3 rounded-xl border border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
								/>
							</svg>
							Guarda il Video
						</button>
					</div>

					<!-- Scroll Indicator -->
					<div class="mt-8 flex flex-col items-center gap-3 text-white/60">
						<span class="text-sm font-medium tracking-wide">Scorri per scoprire</span>
						<div
							class="flex h-8 w-5 items-start justify-center rounded-full border border-white/30"
						>
							<div class="mt-2 h-1 w-1 animate-bounce rounded-full bg-white/60"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Premium Statistics Bar -->
	<div
		class="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-white/5 backdrop-blur-sm"
	>
		<div class="container mx-auto max-w-7xl px-6 py-6">
			<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
				<div class="text-center">
					<div class="text-2xl font-bold text-white">500+</div>
					<div class="text-sm text-white/70">Opere Autentiche</div>
				</div>
				<div class="text-center">
					<div class="text-2xl font-bold text-white">2.000+</div>
					<div class="text-sm text-white/70">Clienti Soddisfatti</div>
				</div>
				<div class="text-center">
					<div class="text-2xl font-bold text-white">50+</div>
					<div class="text-sm text-white/70">Paesi Raggiunti</div>
				</div>
				<div class="text-center">
					<div class="flex items-center justify-center gap-1 text-2xl font-bold text-white">
						★ 4.9
					</div>
					<div class="text-sm text-white/70">Valutazione Media</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Filter & Search Bar -->
<section class="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur-sm">
	<div class="container mx-auto max-w-7xl px-4 py-4">
		<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
			<!-- Search Bar -->
			<div class="relative flex-1 lg:max-w-md">
				<div class="absolute inset-y-0 left-0 flex items-center pl-3">
					<svg
						class="h-5 w-5 text-neutral-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						></path>
					</svg>
				</div>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Cerca prodotti..."
					class="focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-lg border border-neutral-300 bg-white py-2 pl-10 pr-4 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2"
				/>
			</div>

			<!-- Filter Controls -->
			<div class="flex flex-wrap gap-4">
				<!-- Sort Filter -->
				<select
					bind:value={sortBy}
					class="focus:border-primary-500 focus:ring-primary-500/20 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 focus:outline-none focus:ring-2"
				>
					{#each sortOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>

				<!-- Advanced Filters Toggle -->
				<button
					onclick={() => (showFilters = !showFilters)}
					class="focus:border-primary-500 focus:ring-primary-500/20 flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 hover:bg-neutral-50 focus:outline-none focus:ring-2"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
						></path>
					</svg>
					Filtri
					{#if showFilters}
						<svg
							class="h-4 w-4 rotate-180 transition-transform"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							></path>
						</svg>
					{:else}
						<svg
							class="h-4 w-4 transition-transform"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							></path>
						</svg>
					{/if}
				</button>
			</div>
		</div>

		<!-- Advanced Filters Panel -->
		{#if showFilters}
			<div
				class="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4"
				in:fly={{ y: -20, duration: 300 }}
				out:fly={{ y: -20, duration: 200 }}
			>
				<div class="grid gap-4 md:grid-cols-2">
					<!-- Price Range -->
					<div>
						<label class="mb-2 block text-sm font-medium text-neutral-700">Fascia di Prezzo</label>
						<div class="flex gap-4">
							<div class="flex-1">
								<label class="sr-only">Prezzo minimo</label>
								<input
									type="number"
									bind:value={priceRange.min}
									min="0"
									max={maxPrice()}
									placeholder="Min €"
									class="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-1"
								/>
							</div>
							<div class="flex-1">
								<label class="sr-only">Prezzo massimo</label>
								<input
									type="number"
									bind:value={priceRange.max}
									min={priceRange.min}
									max={maxPrice()}
									placeholder="Max €"
									class="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-1"
								/>
							</div>
						</div>
					</div>

					<!-- Clear Filters -->
					<div class="flex items-end">
						<button
							onclick={clearAllFilters}
							class="rounded-lg bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-500"
						>
							Cancella Filtri
						</button>
					</div>
				</div>
			</div>
		{/if}

		<!-- Results Summary -->
		<div class="mt-4 flex items-center justify-between text-sm text-neutral-600">
			<span
				>{filteredProducts().length} prodotti {filteredProducts().length === 1 ? 'o' : 'i'} trovati {filteredProducts()
					.length === 1
					? 'o'
					: 'i'}</span
			>
			{#if searchQuery || priceRange.min > 0 || priceRange.max < maxPrice()}
				<button
					onclick={clearAllFilters}
					class="text-primary-600 hover:text-primary-700 focus:outline-none"
				>
					Cancella filtri
				</button>
			{/if}
		</div>
	</div>
</section>

<!-- Product Grid -->
<section class="bg-neutral-50 py-12">
	<div class="container mx-auto max-w-7xl px-4">
		{#if filteredProducts() && filteredProducts().length > 0}
			<div
				class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
				in:fade={{ duration: 300 }}
			>
				{#each filteredProducts() as product, index (product.id)}
					<div in:fly={{ y: 50, duration: 400, delay: index * 50, easing: quintOut }}>
						<ProductCard {product} />
					</div>
				{/each}
			</div>
		{:else}
			<!-- Empty State -->
			<div
				class="flex flex-col items-center justify-center py-20 text-center"
				in:fade={{ duration: 500 }}
			>
				<div class="mb-6 rounded-full bg-neutral-200 p-6">
					<svg
						class="h-12 w-12 text-neutral-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
						></path>
					</svg>
				</div>

				<h2 class="mb-4 text-2xl font-bold text-neutral-900">
					{searchQuery || priceRange.min > 0 || priceRange.max < maxPrice()
						? 'Nessun prodotto trovato'
						: 'Collezione in Arrivo'}
				</h2>

				<p class="mb-8 max-w-md text-neutral-600">
					{searchQuery || priceRange.min > 0 || priceRange.max < maxPrice()
						? 'Prova a modificare i filtri di ricerca o esplora altre categorie.'
						: 'La nostra collezione di tesori museali è in fase di allestimento. Torna presto per scoprire opere straordinarie!'}
				</p>

				{#if searchQuery || priceRange.min > 0 || priceRange.max < maxPrice()}
					<button
						onclick={clearAllFilters}
						class="bg-primary-500 hover:bg-primary-600 focus:ring-primary-500 rounded-lg px-6 py-3 font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
					>
						Cancella Filtri
					</button>
				{/if}
			</div>
		{/if}
	</div>
</section>

<!-- Newsletter Section -->
<section class="bg-primary-800 py-16 text-white">
	<div class="container mx-auto max-w-4xl px-4 text-center">
		<h2 class="mb-4 text-3xl font-bold">Resta Aggiornato</h2>
		<p class="text-primary-100 mb-8 text-lg">
			Ricevi in anteprima le nostre nuove collezioni e offerte esclusive
		</p>

		<form class="mx-auto flex max-w-md gap-4">
			<input
				type="email"
				placeholder="La tua email"
				class="placeholder-primary-300 focus:ring-primary-400 flex-1 rounded-lg bg-white/10 px-4 py-3 text-white backdrop-blur-sm focus:bg-white/20 focus:outline-none focus:ring-2"
			/>
			<button
				type="submit"
				class="bg-primary-500 hover:bg-primary-400 focus:ring-primary-400 focus:ring-offset-primary-800 rounded-lg px-6 py-3 font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
			>
				Iscriviti
			</button>
		</form>
	</div>
</section>
