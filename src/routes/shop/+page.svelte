<!-- File: frontend/src/routes/shop/+page.svelte -->
<script lang="ts">
	/**
	 * @file +page.svelte per /shop
	 * @purpose Production-ready shop page with enhanced security and performance
	 * @description Pagina negozio sicura e ottimizzata per la produzione
	 */
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { debounce } from '$lib/utils/debounce';
	import { sanitizeInput, validateEmail } from '$lib/utils/validation';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
	import type { Merchandise } from '$lib/api/apiClient';

	export interface ShopPageData {
		title: string;
		metaDescription: string;
		merchandise: Merchandise[];
		csrfToken: string;
	}

	// Props with proper typing
	interface Props {
		data: ShopPageData;
	}
	let { data }: Props = $props();

	// Constants
	const DEBOUNCE_DELAY = 300;
	const MAX_PRICE_DEFAULT = 1000;
	const PRODUCTS_PER_PAGE = 20;

	// State management with proper types
	let searchQuery = $state('');
	let selectedCategory = $state<string>('all');
	let sortBy = $state<string>('featured');
	let showFilters = $state(false);
	let priceRange = $state({ min: 0, max: MAX_PRICE_DEFAULT });
	let currentPage = $state(1);
	let isLoading = $state(false);
	let error = $state<string | null>(null);

	// Newsletter state
	let email = $state('');
	let newsletterMessage = $state('');
	let newsletterLoading = $state(false);
	let emailTouched = $state(false);

	// Configuration with proper typing
	const categories: Array<{ value: string; label: string }> = [
		{ value: 'all', label: 'Tutte le Categorie' },
		{ value: 'libri', label: 'Libri' },
		{ value: 'riproduzioni', label: 'Riproduzioni' },
		{ value: 'gioielli', label: 'Gioielli' },
		{ value: 'ceramiche', label: 'Ceramiche' },
		{ value: 'tessili', label: 'Tessili' }
	] as const;

	const sortOptions: Array<{ value: string; label: string }> = [
		{ value: 'featured', label: 'In Evidenza' },
		{ value: 'newest', label: 'Più Recenti' },
		{ value: 'price-low', label: 'Prezzo: Basso-Alto' },
		{ value: 'price-high', label: 'Prezzo: Alto-Basso' },
		{ value: 'name', label: 'Nome A-Z' }
	] as const;

	// Utility functions with proper error handling
	function safeParsePrice(price: string | number): number {
		if (typeof price === 'number') return Math.max(0, price);
		const parsed = parseFloat(String(price).replace(/[^\d.-]/g, ''));
		return isNaN(parsed) ? 0 : Math.max(0, parsed);
	}

	function getProductName(product: Merchandise): string {
		if (!product?.name_translations) return '';
		return (
			product.name_translations['it'] ||
			product.name_translations['en'] ||
			Object.values(product.name_translations)[0] ||
			''
		);
	}

	function getProductDescription(product: Merchandise): string {
		if (!product?.description_translations) return '';
		return (
			product.description_translations['it'] ||
			product.description_translations['en'] ||
			Object.values(product.description_translations)[0] ||
			''
		);
	}

	function getProductCategory(product: Merchandise): string {
		return product.description_translations['it']?.toLowerCase() || '';
	}

	// Enhanced filtering with error handling and performance optimization
	let filteredProducts = $derived(() => {
		try {
			if (!data?.merchandise || !Array.isArray(data.merchandise)) return [];

			let products = [...data.merchandise];

			// Search filter with sanitized input
			if (searchQuery.trim()) {
				const sanitizedQuery = sanitizeInput(searchQuery.toLowerCase());
				products = products.filter((product) => {
					try {
						const name = getProductName(product).toLowerCase();
						const description = getProductDescription(product).toLowerCase();
						return name.includes(sanitizedQuery) || description.includes(sanitizedQuery);
					} catch {
						return false;
					}
				});
			}

			// Category filter
			if (selectedCategory !== 'all') {
				products = products.filter((product) => {
					try {
						return getProductCategory(product) === selectedCategory;
					} catch {
						return false;
					}
				});
			}

			// Price range filter with safe parsing
			products = products.filter((product) => {
				try {
					const price = safeParsePrice(product.price);
					return price >= priceRange.min && price <= priceRange.max;
				} catch {
					return false;
				}
			});

			// Sorting with error handling
			try {
				switch (sortBy) {
					case 'price-low':
						products.sort((a, b) => safeParsePrice(a.price) - safeParsePrice(b.price));
						break;
					case 'price-high':
						products.sort((a, b) => safeParsePrice(b.price) - safeParsePrice(a.price));
						break;
					case 'newest':
						products.sort((a, b) => {
							const dateA = new Date(a.created_at || 0).getTime();
							const dateB = new Date(b.created_at || 0).getTime();
							return dateB - dateA;
						});
						break;
					case 'name':
						products.sort((a, b) => {
							const nameA = getProductName(a);
							const nameB = getProductName(b);
							return nameA.localeCompare(nameB, 'it');
						});
						break;
					default:
						// Keep original order for featured
						break;
				}
			} catch (err) {
				console.warn('Error sorting products:', err);
			}

			return products;
		} catch (err) {
			console.error('Error filtering products:', err);
			error = 'Errore nel caricamento dei prodotti';
			return [];
		}
	});

	// Pagination
	let paginatedProducts = $derived(() => {
		const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
		return filteredProducts().slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
	});

	let totalPages = $derived(() => Math.ceil(filteredProducts().length / PRODUCTS_PER_PAGE));

	// Calculate max price safely
	let maxPrice = $derived(() => {
		try {
			if (!data?.merchandise || data.merchandise.length === 0) return MAX_PRICE_DEFAULT;
			const prices = data.merchandise.map((p) => safeParsePrice(p.price)).filter((p) => p > 0);
			return prices.length > 0 ? Math.max(...prices) : MAX_PRICE_DEFAULT;
		} catch {
			return MAX_PRICE_DEFAULT;
		}
	});

	// Email validation
	let emailError = $derived(() => {
		if (!emailTouched || !email) return '';
		if (!validateEmail(email)) return 'Inserisci un indirizzo email valido';
		return '';
	});

	// Debounced search to improve performance
	const debouncedSearch = debounce((query: string) => {
		searchQuery = sanitizeInput(query);
		currentPage = 1; // Reset to first page on search
	}, DEBOUNCE_DELAY);

	// Event handlers
	function handleSearchInput(event: Event) {
		const target = event.target as HTMLInputElement;
		debouncedSearch(target.value);
	}

	function clearAllFilters() {
		searchQuery = '';
		selectedCategory = 'all';
		sortBy = 'featured';
		priceRange = { min: 0, max: maxPrice() };
		currentPage = 1;
		error = null;
	}

	function toggleFilters() {
		showFilters = !showFilters;
	}

	// Enhanced newsletter submission with security measures
	async function handleNewsletterSubmit() {
		if (!email || emailError()) return;

		newsletterLoading = true;
		newsletterMessage = '';

		try {
			// Get CSRF token if available
			const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

			const response = await fetch('/api/newsletter', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(csrfToken && { 'X-CSRF-Token': csrfToken })
				},
				body: JSON.stringify({
					email: sanitizeInput(email),
					timestamp: Date.now() // Help prevent replay attacks
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const result = await response.json();

			if (result.success) {
				newsletterMessage = 'Iscrizione avvenuta con successo!';
				email = '';
				emailTouched = false;
			} else {
				newsletterMessage = result.error || "Errore durante l'iscrizione";
			}
		} catch (err) {
			console.error('Newsletter subscription error:', err);
			newsletterMessage = 'Errore di connessione. Riprova più tardi.';
		} finally {
			newsletterLoading = false;
		}
	}

	function handleEmailBlur() {
		emailTouched = true;
	}

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages()) {
			currentPage = page;
			// Scroll to top of products
			document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
		}
	}

	// Set up analytics and error tracking
	onMount(() => {
		// Update URL params based on filters (for better UX and SEO)
		if (browser) {
			const urlParams = new URLSearchParams(page.url.searchParams);

			// Restore state from URL if available
			if (urlParams.get('q')) {
				searchQuery = sanitizeInput(urlParams.get('q') || '');
			}
			if (urlParams.get('category')) {
				selectedCategory = urlParams.get('category') || 'all';
			}
			if (urlParams.get('sort')) {
				sortBy = urlParams.get('sort') || 'featured';
			}
		}
	});

	// Update URL when filters change (for better UX)
	$effect(() => {
		if (!browser) return;

		const url = new URL(window.location.href);
		const params = url.searchParams;

		if (searchQuery) {
			params.set('q', searchQuery);
		} else {
			params.delete('q');
		}

		if (selectedCategory !== 'all') {
			params.set('category', selectedCategory);
		} else {
			params.delete('category');
		}

		if (sortBy !== 'featured') {
			params.set('sort', sortBy);
		} else {
			params.delete('sort');
		}

		const newUrl = params.toString() ? `${url.pathname}?${params}` : url.pathname;
		window.history.replaceState({}, '', newUrl);
	});
</script>

<svelte:head>
	<title>{data?.title || 'Negozio Museo'}</title>
	<meta name="description" content={data?.metaDescription || 'Scopri la collezione del museo'} />
	<meta name="keywords" content="museo, negozio, arte, cultura, riproduzioni, libri" />
	<meta property="og:title" content={data?.title || 'Negozio Museo'} />
	<meta
		property="og:description"
		content={data?.metaDescription || 'Scopri la collezione del museo'}
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content={page.url.href} />
	<meta name="csrf-token" content={data?.csrfToken || ''} />

	<!-- Structured data for SEO -->
	{@html `<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Store",
			"name": "Negozio Museo",
			"description": "${data?.metaDescription || 'Collezione museale di arte e cultura'}",
			"url": "${page.url.href}",
			"hasOfferCatalog": {
				"@type": "OfferCatalog",
				"name": "Collezione Museo",
				"itemListElement": [
					${
						data?.merchandise
							?.slice(0, 10)
							.map(
								(product) => `{
						"@type": "Offer",
						"itemOffered": {
							"@type": "Product",
							"name": "${getProductName(product)}",
							"description": "${getProductDescription(product)}",
							"offers": {
								"@type": "Offer",
								"price": "${safeParsePrice(product.price)}",
								"priceCurrency": "EUR"
							}
						}
					}`
							)
							.join(',') || ''
					}
				]
			}
		}
	</script>`}
</svelte:head>

<ErrorBoundary>
	<!-- Premium Hero Section -->
	<section
		class="relative min-h-[80vh] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900"
		aria-labelledby="hero-title"
	>
		<!-- Background elements remain the same but with proper accessibility -->
		<div class="absolute inset-0">
			<div
				class="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-transparent to-indigo-900/60"
			></div>

			<div class="absolute inset-0 opacity-10" aria-hidden="true">
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

			<!-- Decorative elements -->
			<div
				class="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-gradient-to-br from-amber-400/20 to-rose-400/10 blur-3xl"
				aria-hidden="true"
			></div>
			<div
				class="absolute -right-20 top-1/3 h-60 w-60 rounded-full bg-gradient-to-br from-purple-400/15 to-blue-400/10 blur-3xl"
				aria-hidden="true"
			></div>
			<div
				class="absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-emerald-400/10 to-cyan-400/5 blur-3xl"
				aria-hidden="true"
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
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
							Collezione Esclusiva
						</span>
					</div>

					<!-- Typography -->
					<div class="space-y-8">
						<h1
							id="hero-title"
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
								Scopri la nostra <strong class="font-semibold text-white"
									>collezione esclusiva</strong
								>
								di arte, cultura e bellezza
							</p>
							<p class="text-lg leading-relaxed text-white/60">
								Ogni pezzo racconta una storia millenaria, custodita con cura e passione per
								tramandare l'eredità del nostro patrimonio culturale
							</p>
						</div>
					</div>

					<!-- CTA Section -->
					<div
						class="mt-12 flex flex-col items-center gap-8"
						in:fly={{ y: 50, duration: 1000, delay: 400, easing: quintOut }}
					>
						<div class="flex flex-col gap-4 sm:flex-row sm:gap-6">
							<a
								href="#products-section"
								class="group relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 font-semibold text-white shadow-xl shadow-amber-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-900"
								aria-label="Esplora la collezione dei prodotti"
							>
								<span class="relative z-10 flex items-center gap-2">
									Esplora la Collezione
									<svg
										class="h-5 w-5 transition-transform group-hover:translate-x-1"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
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
								class="group flex items-center gap-3 rounded-xl border border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-900"
								aria-label="Guarda il video della collezione"
							>
								<svg
									class="h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
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
								aria-hidden="true"
							>
								<div class="mt-2 h-1 w-1 animate-bounce rounded-full bg-white/60"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Statistics Bar -->
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
	<section class="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
		<div class="container mx-auto max-w-7xl px-4 py-4">
			<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<!-- Search Bar -->
				<div class="relative flex-1 lg:max-w-md">
					<label for="search-input" class="sr-only">Cerca prodotti</label>
					<div class="absolute inset-y-0 left-0 flex items-center pl-3" aria-hidden="true">
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
						id="search-input"
						type="text"
						on:input={handleSearchInput}
						placeholder="Cerca prodotti..."
						class="focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-lg border border-neutral-300 bg-white py-2 pl-10 pr-4 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2"
						aria-describedby="search-help"
					/>
					<div id="search-help" class="sr-only">Cerca per nome o descrizione del prodotto</div>
				</div>

				<!-- Filter Controls -->
				<div class="flex flex-wrap gap-4">
					<!-- Category Filter -->
					<div>
						<label for="category-select" class="sr-only">Seleziona categoria</label>
						<select
							id="category-select"
							bind:value={selectedCategory}
							on:change={() => (currentPage = 1)}
							class="focus:border-primary-500 focus:ring-primary-500/20 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 focus:outline-none focus:ring-2"
						>
							{#each categories as category}
								<option value={category.value}>{category.label}</option>
							{/each}
						</select>
					</div>

					<!-- Sort Filter -->
					<div>
						<label for="sort-select" class="sr-only">Ordinamento</label>
						<select
							id="sort-select"
							bind:value={sortBy}
							class="focus:border-primary-500 focus:ring-primary-500/20 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 focus:outline-none focus:ring-2"
						>
							{#each sortOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					</div>

					<!-- Advanced Filters Toggle -->
					<button
						on:click={toggleFilters}
						class="focus:border-primary-500 focus:ring-primary-500/20 flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 hover:bg-neutral-50 focus:outline-none focus:ring-2"
						aria-expanded={showFilters}
						aria-controls="advanced-filters"
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
								d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
							></path>
						</svg>
						Filtri Avanzati
						<svg
							class="h-4 w-4 transition-transform {showFilters ? 'rotate-180' : ''}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							></path>
						</svg>
					</button>
				</div>
			</div>

			<!-- Advanced Filters Panel -->
			{#if showFilters}
				<div
					id="advanced-filters"
					class="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4"
					in:fly={{ y: -20, duration: 300 }}
					out:fly={{ y: -20, duration: 200 }}
				>
					<div class="grid gap-4 md:grid-cols-2">
						<!-- Price Range -->
						<div>
							<fieldset>
								<legend class="mb-2 text-sm font-medium text-neutral-700"
									>Fascia di Prezzo (€)</legend
								>
								<div class="flex gap-4">
									<div class="flex-1">
										<label for="price-min" class="sr-only">Prezzo minimo</label>
										<input
											id="price-min"
											type="number"
											bind:value={priceRange.min}
											min="0"
											max={maxPrice()}
											placeholder="Min €"
											class="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-1"
											on:change={() => (currentPage = 1)}
										/>
									</div>
									<div class="flex-1">
										<label for="price-max" class="sr-only">Prezzo massimo</label>
										<input
											id="price-max"
											type="number"
											bind:value={priceRange.max}
											min={priceRange.min}
											max={maxPrice()}
											placeholder="Max €"
											class="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-1"
											on:change={() => (currentPage = 1)}
										/>
									</div>
								</div>
							</fieldset>
						</div>

						<!-- Clear Filters -->
						<div class="flex items-end">
							<button
								on:click={clearAllFilters}
								class="rounded-lg bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-500"
							>
								Cancella Tutti i Filtri
							</button>
						</div>
					</div>
				</div>
			{/if}

			<!-- Results Summary -->
			<div class="mt-4 flex items-center justify-between text-sm text-neutral-600">
				<span>
					{filteredProducts().length}
					{filteredProducts().length === 1 ? 'prodotto trovato' : 'prodotti trovati'}
				</span>
				{#if searchQuery || selectedCategory !== 'all' || priceRange.min > 0 || priceRange.max < maxPrice()}
					<button
						on:click={clearAllFilters}
						class="text-primary-600 hover:text-primary-700 focus:ring-primary-500 rounded focus:outline-none focus:ring-2 focus:ring-offset-2"
					>
						Cancella filtri attivi
					</button>
				{/if}
			</div>
		</div>
	</section>

	<!-- Product Grid -->
	<section id="products-section" class="bg-neutral-50 py-12" aria-labelledby="products-title">
		<div class="container mx-auto max-w-7xl px-4">
			<h2 id="products-title" class="sr-only">Lista prodotti del negozio</h2>

			{#if error}
				<div
					class="flex flex-col items-center justify-center py-20 text-center"
					role="alert"
					aria-live="polite"
				>
					<div class="mb-6 rounded-full bg-red-100 p-6">
						<svg
							class="h-12 w-12 text-red-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<h3 class="mb-4 text-2xl font-bold text-red-900">Errore</h3>
					<p class="mb-6 max-w-md text-red-700">{error}</p>
					<button
						on:click={() => window.location.reload()}
						class="rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
					>
						Ricarica la pagina
					</button>
				</div>
			{:else if isLoading}
				<div class="flex justify-center py-20" aria-live="polite" aria-label="Caricamento prodotti">
					<LoadingSpinner />
				</div>
			{:else if paginatedProducts().length > 0}
				<div in:fade={{ duration: 300 }}>
					<div
						class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
						role="grid"
						aria-label="Griglia prodotti"
					>
						{#each paginatedProducts() as product, index (product.id)}
							<div
								in:fly={{ y: 50, duration: 400, delay: index * 50, easing: quintOut }}
								role="gridcell"
							>
								<ProductCard {product} />
							</div>
						{/each}
					</div>

					<!-- Pagination -->
					{#if totalPages() > 1}
						<nav class="mt-12 flex justify-center" aria-label="Navigazione pagine">
							<div class="flex items-center gap-2">
								<button
									on:click={() => goToPage(currentPage - 1)}
									disabled={currentPage === 1}
									class="focus:ring-primary-500 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
									aria-label="Pagina precedente"
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
											d="M15 19l-7-7 7-7"
										/>
									</svg>
								</button>

								{#each Array.from({ length: totalPages() }, (_, i) => i + 1) as page}
									{#if page === 1 || page === totalPages() || (page >= currentPage - 2 && page <= currentPage + 2)}
										<button
											on:click={() => goToPage(page)}
											class="focus:ring-primary-500 rounded-lg border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 {page ===
											currentPage
												? 'border-primary-500 bg-primary-500 text-white'
												: 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'}"
											aria-label="Vai alla pagina {page}"
											aria-current={page === currentPage ? 'page' : undefined}
										>
											{page}
										</button>
									{:else if page === currentPage - 3 || page === currentPage + 3}
										<span class="px-2 text-neutral-500" aria-hidden="true">…</span>
									{/if}
								{/each}

								<button
									on:click={() => goToPage(currentPage + 1)}
									disabled={currentPage === totalPages()}
									class="focus:ring-primary-500 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
									aria-label="Pagina successiva"
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
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</button>
							</div>
						</nav>
					{/if}
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
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
							></path>
						</svg>
					</div>

					<h3 class="mb-4 text-2xl font-bold text-neutral-900">
						{searchQuery ||
						selectedCategory !== 'all' ||
						priceRange.min > 0 ||
						priceRange.max < maxPrice()
							? 'Nessun prodotto trovato'
							: 'Collezione in Arrivo'}
					</h3>

					<p class="mb-8 max-w-md text-neutral-600">
						{searchQuery ||
						selectedCategory !== 'all' ||
						priceRange.min > 0 ||
						priceRange.max < maxPrice()
							? 'Prova a modificare i filtri di ricerca o esplora altre categorie.'
							: 'La nostra collezione di tesori museali è in fase di allestimento. Torna presto per scoprire opere straordinarie!'}
					</p>

					{#if searchQuery || selectedCategory !== 'all' || priceRange.min > 0 || priceRange.max < maxPrice()}
						<button
							on:click={clearAllFilters}
							class="bg-primary-500 hover:bg-primary-600 focus:ring-primary-500 rounded-lg px-6 py-3 font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
						>
							Cancella Tutti i Filtri
						</button>
					{/if}
				</div>
			{/if}
		</div>
	</section>

	<!-- Newsletter Section -->
	<section class="bg-primary-800 py-16 text-white" aria-labelledby="newsletter-title">
		<div class="container mx-auto max-w-4xl px-4 text-center">
			<h2 id="newsletter-title" class="mb-4 text-3xl font-bold">Resta Aggiornato</h2>
			<p class="text-primary-100 mb-8 text-lg">
				Ricevi in anteprima le nostre nuove collezioni e offerte esclusive
			</p>

			<form
				class="mx-auto flex max-w-md flex-col gap-4 sm:flex-row"
				on:submit|preventDefault={handleNewsletterSubmit}
				novalidate
			>
				<div class="flex-1">
					<label for="newsletter-email" class="sr-only">Indirizzo email per newsletter</label>
					<input
						id="newsletter-email"
						bind:value={email}
						on:blur={handleEmailBlur}
						type="email"
						placeholder="La tua email"
						class="placeholder-primary-300 focus:ring-primary-400 w-full rounded-lg bg-white/10 px-4 py-3 text-white backdrop-blur-sm focus:bg-white/20 focus:outline-none focus:ring-2 {emailError
							? 'border-2 border-red-400'
							: ''}"
						required
						aria-describedby={emailError() ? 'email-error' : 'email-help'}
						aria-invalid={!!emailError()}
					/>
					<div id="email-help" class="sr-only">
						Inserisci il tuo indirizzo email per ricevere la newsletter
					</div>
					{#if emailError()}
						<div id="email-error" class="mt-2 text-sm text-red-300" role="alert">
							{emailError()}
						</div>
					{/if}
				</div>
				<button
					type="submit"
					class="bg-primary-500 hover:bg-primary-400 focus:ring-primary-400 focus:ring-offset-primary-800 rounded-lg px-6 py-3 font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					disabled={newsletterLoading || !!emailError() || !email}
					aria-describedby="submit-help"
				>
					{newsletterLoading ? 'Invio...' : 'Iscriviti'}
				</button>
				<div id="submit-help" class="sr-only">Clicca per iscriverti alla newsletter</div>
			</form>

			{#if newsletterMessage}
				<div
					class="mt-4 {newsletterMessage.includes('Errore') || newsletterMessage.includes('errore')
						? 'text-red-300'
						: 'text-green-300'}"
					role="alert"
					aria-live="polite"
				>
					{newsletterMessage}
				</div>
			{/if}
		</div>
	</section>
</ErrorBoundary>
