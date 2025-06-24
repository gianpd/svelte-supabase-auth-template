<!--
/**
 * @file +page.svelte (Homepage)
 * @description Homepage for the Zungri Museum website featuring hero section,
 * featured exhibitions, visitor information, and calls-to-action.
 *
 * Key features:
 * - Hero section with museum introduction and primary CTAs
 * - Featured exhibitions showcase
 * - Visitor information and opening hours
 * - Newsletter signup
 * - Responsive design with engaging visuals
 * - Multilingual content support
 *
 * @dependencies
 * - $lib/paraglide/messages: Internationalization messages
 * - $lib/components/ui/Button.svelte: Reusable button component
 * - lucide-svelte: Icons for various sections
 *
 * @notes
 * - Uses Tailwind CSS for responsive design
 * - Implements museum branding and color scheme
 * - Includes accessibility considerations
 * - Features call-to-action buttons for booking and shopping
 */
-->
<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import Button from '$lib/components/ui/Button.svelte';
	import {
		Calendar,
		Clock,
		MapPin,
		Users,
		Camera,
		Star,
		ArrowRight,
		ChevronRight
	} from 'lucide-svelte';

	// Featured exhibitions data (this would typically come from a CMS or API)
	const featuredExhibitions = [
		{
			id: 1,
			title: 'Insediamenti Rupestri di Zungri',
			description: 'Scopri gli antichi insediamenti rupestri scavati nella roccia.',
			image: '/images/rupestri.jpeg',
			duration: 'Permanente',
			category: 'Archeologico'
		},
		{
			id: 2,
			title: 'Tradizioni Contadine Calabresi',
			description: 'Un viaggio attraverso le tradizioni agricole della Calabria.',
			image: '/images/storia.jpg',
			duration: 'Marzo - Giugno 2024',
			category: 'Etnografico'
		},
		{
			id: 3,
			title: 'Arte Sacra del Territorio',
			description: 'Tesori artistici delle chiese e dei monasteri locali.',
			image: '/images/arte-sacra.jpg',
			duration: 'Aprile - Settembre 2024',
			category: 'Arte'
		}
	];

	// Quick facts about the museum
	const museumFacts = [
		{
			icon: Clock,
			title: "Aperto tutto l'anno",
			description: 'Mar-Dom 9:00-17:00',
			color: 'text-blue-600'
		},
		{
			icon: Users,
			title: 'Visite guidate',
			description: 'Disponibili su prenotazione',
			color: 'text-green-600'
		},
		{
			icon: Camera,
			title: 'Fotografie benvenute',
			description: 'Cattura i tuoi momenti',
			color: 'text-purple-600'
		},
		{
			icon: MapPin,
			title: 'Nel cuore della Calabria',
			description: 'Facilmente raggiungibile',
			color: 'text-red-600'
		}
	];
</script>

<svelte:head>
	<title>{m.museum_welcomeTitle()} - Museo di Zungri</title>
	<meta name="description" content={m.museum_welcomeSubtitle()} />
	<meta property="og:title" content="{m.museum_welcomeTitle()} - Museo di Zungri" />
	<meta property="og:description" content={m.museum_welcomeSubtitle()} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<!-- Hero Section -->
<section class="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
	<!-- Background pattern/overlay -->
	<div class="absolute inset-0 bg-black/20"></div>
	<div class="absolute inset-0 bg-[url('/images/pattern.jpg')] opacity-10" aria-hidden="true"></div>

	<div class="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
		<div class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
			<!-- Hero Content -->
			<div class="text-center lg:text-left">
				<h1 class="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
					{m.museum_welcomeTitle()}
				</h1>
				<p class="mt-6 text-xl leading-8 text-blue-100">
					{m.museum_welcomeSubtitle()}
				</p>
				<p class="mt-4 text-lg text-blue-200">
					Esplora la storia millenaria degli insediamenti rupestri e immergiti nelle tradizioni
					della Calabria autentica.
				</p>

				<!-- CTA Buttons -->
				<div class="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
					<Button
						class="inline-flex items-center justify-center space-x-2 bg-white text-blue-900 hover:bg-blue-50"
						size="lg"
					>
						<Calendar class="h-5 w-5" />
						<span>{m.navigation_book()}</span>
					</Button>
					<Button
						variant="outline"
						class="inline-flex items-center justify-center space-x-2 border-white text-white hover:bg-white hover:text-blue-900"
						size="lg"
					>
						<span>{m.navigation_visit()}</span>
						<ArrowRight class="h-5 w-5" />
					</Button>
				</div>
			</div>

			<!-- Hero Image/Visual -->
			<div class="relative">
				<div class="aspect-[4/3] overflow-hidden rounded-2xl bg-blue-800/50 shadow-2xl">
					<img
						src="/images/zungri-cave.jpg"
						alt="Insediamenti rupestri di Zungri"
						class="h-full w-full object-cover"
						loading="eager"
					/>
				</div>
				<!-- Floating stats card -->
				<div
					class="absolute -bottom-6 -right-6 rounded-xl bg-white p-6 shadow-lg lg:-bottom-8 lg:-right-8"
				>
					<div class="flex items-center space-x-4">
						<div class="flex -space-x-2">
							<div class="h-8 w-8 rounded-full bg-blue-100"></div>
							<div class="h-8 w-8 rounded-full bg-green-100"></div>
							<div class="h-8 w-8 rounded-full bg-purple-100"></div>
						</div>
						<div>
							<p class="text-sm font-semibold text-gray-900">500+ visitatori/mese</p>
							<div class="flex items-center space-x-1">
								{#each Array(5) as _}
									<Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
								{/each}
								<span class="text-sm text-gray-600">4.8/5</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Quick Facts Section -->
<section class="bg-white py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
			{#each museumFacts as fact}
				<div class="text-center">
					<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
						<svelte:component this={fact.icon} class="h-8 w-8 {fact.color}" />
					</div>
					<h3 class="mt-6 text-lg font-semibold text-gray-900">{fact.title}</h3>
					<p class="mt-2 text-gray-600">{fact.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Featured Exhibitions -->
<section class="bg-gray-50 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="text-center">
			<h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
				{m.exhibitions_featured()}
			</h2>
			<p class="mt-4 text-lg text-gray-600">
				Scopri le nostre collezioni permanenti e le esposizioni temporanee
			</p>
		</div>

		<div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each featuredExhibitions as exhibition}
				<article
					class="group overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
				>
					<div class="aspect-[16/9] overflow-hidden bg-gray-200">
						<img
							src={exhibition.image}
							alt={exhibition.title}
							class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
							loading="lazy"
						/>
					</div>
					<div class="p-6">
						<div class="flex items-center justify-between">
							<span
								class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
							>
								{exhibition.category}
							</span>
							<span class="text-sm text-gray-500">{exhibition.duration}</span>
						</div>
						<h3 class="mt-4 text-xl font-semibold text-gray-900 group-hover:text-blue-600">
							{exhibition.title}
						</h3>
						<p class="mt-2 text-gray-600">{exhibition.description}</p>
						<div class="mt-4">
							<a
								href="/exhibitions/{exhibition.id}"
								class="inline-flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-700"
							>
								<span>{m.exhibitions_viewDetails()}</span>
								<ChevronRight class="h-4 w-4" />
							</a>
						</div>
					</div>
				</article>
			{/each}
		</div>

		<div class="mt-12 text-center">
			<Button
				variant="outline"
				class="inline-flex items-center space-x-2"
				onclick={() => (window.location.href = '/exhibitions')}
			>
				<span>Vedi tutte le mostre</span>
				<ArrowRight class="h-5 w-5" />
			</Button>
		</div>
	</div>
</section>

<!-- Visit Information & CTA -->
<section class="bg-blue-900 py-16 text-white">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
			<!-- Visit Info -->
			<div>
				<h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
					{m.visit_planYourVisit()}
				</h2>
				<p class="mt-4 text-xl text-blue-100">
					Pianifica la tua visita al Museo di Zungri e vivi un'esperienza indimenticabile tra
					storia, cultura e tradizioni.
				</p>

				<div class="mt-8 space-y-4">
					<div class="flex items-center space-x-3">
						<Clock class="h-6 w-6 text-blue-300" />
						<div>
							<p class="font-semibold">{m.museum_openingHours()}</p>
							<p class="text-blue-200">Martedì - Domenica: 9:00 - 17:00</p>
						</div>
					</div>
					<div class="flex items-center space-x-3">
						<MapPin class="h-6 w-6 text-blue-300" />
						<div>
							<p class="font-semibold">Come Raggiungerci</p>
							<p class="text-blue-200">Via Roma, 123 - 89020 Zungri (VV)</p>
						</div>
					</div>
					<div class="flex items-center space-x-3">
						<Users class="h-6 w-6 text-blue-300" />
						<div>
							<p class="font-semibold">Visite Guidate</p>
							<p class="text-blue-200">Disponibili su prenotazione</p>
						</div>
					</div>
				</div>
			</div>

			<!-- CTA Card -->
			<div class="rounded-2xl bg-white p-8 text-center text-gray-900 shadow-xl">
				<h3 class="text-2xl font-bold">Prenota la Tua Visita</h3>
				<p class="mt-4 text-gray-600">
					Evita le code e assicurati il tuo posto. Prenota online e risparmia tempo.
				</p>

				<div class="mt-6 space-y-4">
					<Button
						class="w-full bg-blue-600 text-white hover:bg-blue-700"
						size="lg"
						onclick={() => (window.location.href = '/book')}
					>
						<Calendar class="mr-2 h-5 w-5" />
						{m.navigation_book()}
					</Button>

					<Button
						variant="outline"
						class="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
						size="lg"
						onclick={() => (window.location.href = '/shop')}
					>
						<span>{m.navigation_shop()}</span>
					</Button>
				</div>

				<p class="mt-4 text-sm text-gray-500">
					Cancellazione gratuita fino a 24 ore prima della visita
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Newsletter Section -->
<section class="bg-gray-900 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="text-center">
			<h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Resta Aggiornato</h2>
			<p class="mt-4 text-lg text-gray-300">
				Iscriviti alla nostra newsletter per ricevere aggiornamenti su eventi, mostre e novità del
				museo.
			</p>
		</div>

		<div class="mx-auto mt-8 max-w-md">
			<div class="flex rounded-md shadow-sm">
				<input
					type="email"
					placeholder="La tua email"
					class="block w-full rounded-l-md border-0 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
				/>
				<Button
					class="rounded-l-none bg-blue-600 px-6 text-white hover:bg-blue-700"
					onclick={() => console.log('Newsletter signup')}
				>
					Iscriviti
				</Button>
			</div>
			<p class="mt-3 text-center text-sm text-gray-400">
				Rispettiamo la tua privacy. Cancellazione facile in qualsiasi momento.
			</p>
		</div>
	</div>
</section>
