<!-- routes/about/+page.svelte -->
<!--
/**
* @file +page.svelte (About Page - Zungri Caves Museum)
* @description Rich, visually engaging About Us page for the Zungri Museum
* showcasing the history and significance of the cave settlement.
* Updated to use the South Italian Museum color palette and design system.
*
* Key features:
* - Hero section with Mediterranean-inspired visuals
* - Timeline of historical periods with terracotta accents
* - Interactive statistics with olive and stone tones
* - Image gallery sections with warm cream backgrounds
* - Enhanced typography using Italian-inspired fonts
* - Responsive design with cultural animations
*
* @dependencies
* - lucide-svelte: For icons
* - Tailwind CSS: For styling with custom South Italian palette
*/
-->
<script lang="ts">
	import {
		Landmark,
		Clock,
		Users,
		Mountain,
		Camera,
		BookOpen,
		MapPin,
		Calendar,
		Layers,
		Home
	} from 'lucide-svelte';

	// Static content - in production this would come from the server
	const pageTitle = 'Chi Siamo - Museo delle Grotte di Zungri';
	const heroDescription = 'Un viaggio nel cuore della cultura rupestre calabrese';

	const stats = [
		{ number: '100+', label: 'Case-Grotta', icon: Home },
		{ number: '3.000', label: 'Metri Quadrati', icon: Layers },
		{ number: '3.000', label: 'Manufatti', icon: BookOpen },
		{ number: 'IX-XIV', label: 'Secolo', icon: Calendar }
	];

	const timeline = [
		{
			period: 'IX-XIV Secolo',
			title: 'Insediamento Rupestre',
			description: 'Costruzione delle prime case-grotta scavate nella roccia arenaria',
			color: 'bg-terracotta-500',
			dotColor: 'bg-terracotta-600'
		},
		{
			period: 'Periodo Medievale',
			title: 'Comunità Italo-Greca',
			description: 'Insediamento di comunità monastiche basiliane e rifugiati',
			color: 'bg-primary-500',
			dotColor: 'bg-primary-600'
		},
		{
			period: 'Seconda Guerra Mondiale',
			title: 'Rifugi di Guerra',
			description: 'Le grotte vengono utilizzate come rifugi dai bombardamenti',
			color: 'bg-secondary-500',
			dotColor: 'bg-secondary-600'
		},
		{
			period: 'Oggi',
			title: 'Patrimonio Museale',
			description: 'Trasformazione in museo e sito turistico di interesse culturale',
			color: 'bg-olive-500',
			dotColor: 'bg-olive-600'
		}
	];

	const features = [
		{
			title: 'Architettura Rupestre',
			description:
				"Volte a cupola con fori centrali per l'aerazione e nicchie scavate nelle pareti",
			icon: Mountain,
			bgColor: 'bg-terracotta-50',
			iconColor: 'bg-gradient-to-br from-terracotta-500 to-terracotta-600'
		},
		{
			title: 'Rete di Collegamento',
			description: 'Scale e sentieri intagliati nella roccia collegano le diverse aree',
			icon: MapPin,
			bgColor: 'bg-primary-50',
			iconColor: 'bg-gradient-to-br from-primary-500 to-primary-600'
		},
		{
			title: 'Varietà Strutturale',
			description: 'Da ambienti monocellulari a complessi abitativi su più livelli',
			icon: Layers,
			bgColor: 'bg-secondary-50',
			iconColor: 'bg-gradient-to-br from-secondary-500 to-secondary-600'
		},
		{
			title: 'Conservazione Ottimale',
			description: "Condizioni naturali ideali: calde d'inverno e fresche d'estate",
			icon: Clock,
			bgColor: 'bg-olive-50',
			iconColor: 'bg-gradient-to-br from-olive-500 to-olive-600'
		}
	];
</script>

<svelte:head>
	<title>{pageTitle} - Museo di Zungri</title>
	<meta
		name="description"
		content="Scopri la storia millenaria e il patrimonio unico del Museo delle Grotte di Zungri, la 'Città di Pietra' in Calabria. Esplora insediamenti rupestri e la cultura contadina."
	/>
</svelte:head>

<!-- Hero Section -->
<section
	class="from-cream-50 via-background-DEFAULT to-secondary-50 relative bg-gradient-to-br py-16 sm:py-24"
>
	<div
		class="absolute inset-0 opacity-20"
		style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23cd853f&quot; fill-opacity=&quot;0.08&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
	></div>

	<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="text-center">
			<div
				class="from-terracotta-500 to-terracotta-600 shadow-warm animate-float mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br"
			>
				<Landmark class="h-10 w-10 text-white" />
			</div>

			<h1
				class="font-display mb-6 text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl"
			>
				Museo delle <span
					class="from-terracotta-600 to-terracotta-500 bg-gradient-to-r bg-clip-text text-transparent"
					>Grotte di Zungri</span
				>
			</h1>

			<p class="font-body mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-neutral-600">
				{heroDescription}
			</p>

			<div
				class="bg-background-DEFAULT/90 shadow-soft backdrop-blur-xs inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-neutral-700"
			>
				<MapPin class="text-terracotta-600 h-4 w-4" />
				Zungri, Provincia di Vibo Valentia, Calabria
			</div>
		</div>
	</div>
</section>

<!-- Stats Section -->
<section class="bg-background-DEFAULT py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-2 gap-8 lg:grid-cols-4">
			{#each stats as stat, index}
				<div class="group text-center transition-transform duration-300 hover:scale-105">
					<div
						class="rounded-artifact shadow-medium group-hover:shadow-exhibit mx-auto mb-4 flex h-12 w-12 items-center justify-center text-white transition-shadow
						{index === 0
							? 'from-terracotta-500 to-terracotta-600 bg-gradient-to-br'
							: index === 1
								? 'from-primary-500 to-primary-600 bg-gradient-to-br'
								: index === 2
									? 'from-secondary-500 to-secondary-600 bg-gradient-to-br'
									: 'from-olive-500 to-olive-600 bg-gradient-to-br'}"
					>
						<svelte:component this={stat.icon} class="h-6 w-6" />
					</div>
					<div class="font-heading text-3xl font-bold text-neutral-900">{stat.number}</div>
					<div class="font-body text-sm text-neutral-600">{stat.label}</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Main Content -->
<section class="bg-background-secondary py-16">
	<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
		<div class="mb-16 text-center">
			<h2 class="font-display mb-4 text-3xl font-bold text-neutral-900">
				Un Tesoro Nascosto nel Cuore della Calabria
			</h2>
			<p class="font-body mx-auto max-w-2xl text-lg text-neutral-600">
				Benvenuti al Museo delle Grotte di Zungri, un luogo dove la storia e la natura si fondono in
				un'esperienza indimenticabile.
			</p>
		</div>

		<!-- Features Grid -->
		<div class="mb-16 grid gap-8 md:grid-cols-2">
			{#each features as feature}
				<div
					class="rounded-card bg-background-DEFAULT shadow-soft hover:shadow-medium animate-fade-in group p-8 transition-all duration-300"
				>
					<div
						class="rounded-artifact mb-4 flex h-12 w-12 items-center justify-center {feature.iconColor} shadow-soft group-hover:shadow-medium text-white transition-shadow"
					>
						<svelte:component this={feature.icon} class="h-6 w-6" />
					</div>
					<h3 class="font-heading mb-3 text-xl font-semibold text-neutral-900">{feature.title}</h3>
					<p class="font-body text-neutral-600">{feature.description}</p>
				</div>
			{/each}
		</div>

		<!-- Detailed Content -->
		<div class="prose prose-lg font-body mx-auto max-w-none text-neutral-700">
			<div class="rounded-card bg-background-DEFAULT shadow-soft p-8">
				<h3 class="font-display mb-6 text-2xl font-bold text-neutral-900">
					L'Insediamento Rupestre: Un Viaggio nel Tempo
				</h3>

				<p class="mb-6 text-lg leading-relaxed">
					Esteso su circa <strong class="text-terracotta-600">3.000 metri quadrati</strong>,
					l'insediamento si compone di circa
					<strong class="text-terracotta-600">100 case-grotta</strong>, interamente scavate nella
					roccia arenaria. La loro datazione è stimata tra il
					<strong class="text-terracotta-600">IX e il XIV secolo</strong>, con alcune ricerche che
					suggeriscono un'origine ancora più antica.
				</p>

				<div class="rounded-artifact border-terracotta-500 bg-terracotta-50 mb-8 border-l-4 p-6">
					<p class="text-terracotta-900 font-medium">
						<span class="font-bold">Curiosità:</span> Le strutture variano da ambienti monocellulari
						a complessi abitativi su più livelli, presentando forme circolari, quadrate o rettangolari.
						Caratteristiche distintive includono volte a cupola con fori centrali per l'aerazione, nicchie
						scavate nelle pareti e persino incavi per letti.
					</p>
				</div>

				<h3 class="font-display mb-6 text-2xl font-bold text-neutral-900">
					Vita e Misteri degli "Sbariati"
				</h3>

				<p class="mb-6 text-lg leading-relaxed">
					La ricerca storica suggerisce che queste grotte fossero abitate da comunità, forse di
					origine <strong class="text-primary-600">italo-greca</strong>, o da gruppi in fuga in
					cerca di rifugio. Il nome stesso, "Sbariati" o "Sbandati", allude a una comunità di
					sfollati o rifugiati.
				</p>

				<div class="rounded-artifact border-primary-500 bg-primary-50 mb-8 border-l-4 p-6">
					<p class="text-primary-900 font-medium">
						<span class="font-bold">Connessioni Storiche:</span> Le similitudini con siti rupestri in
						Cappadocia (Turchia) e Matera (Italia) rafforzano l'ipotesi di una forte influenza monastica
						basiliana.
					</p>
				</div>

				<h3 class="font-display mb-6 text-2xl font-bold text-neutral-900">
					Il Museo della Civiltà Rupestre e Contadina
				</h3>

				<p class="mb-6 text-lg leading-relaxed">
					All'ingresso dell'Insediamento Rupestre si trova il <strong class="text-secondary-600"
						>Museo della Civiltà Rupestre e Contadina di Zungri</strong
					>, ospitato in un antico frantoio. Questo museo conserva circa
					<strong class="text-secondary-600">3.000 manufatti</strong> che offrono uno spaccato autentico
					della vita quotidiana.
				</p>

				<div class="rounded-artifact border-olive-500 bg-olive-50 mb-8 border-l-4 p-6">
					<p class="text-olive-900 font-medium">
						<span class="font-bold">Cinema e Turismo:</span> La bellezza del luogo ha attratto il mondo
						del cinema, trasformando le Grotte di Zungri in una suggestiva Gerusalemme per le riprese
						del film "Il monaco che vinse l'Apocalisse" nel 2022.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Timeline Section -->
<section class="bg-background-DEFAULT py-16">
	<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
		<div class="mb-12 text-center">
			<h2 class="font-display mb-4 text-3xl font-bold text-neutral-900">
				Storia attraverso i Secoli
			</h2>
			<p class="font-body mx-auto max-w-2xl text-lg text-neutral-600">
				Un viaggio cronologico attraverso le epoche che hanno segnato la vita delle grotte
			</p>
		</div>

		<div class="relative">
			<!-- Timeline line -->
			<div
				class="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 transform bg-neutral-200"
			></div>

			{#each timeline as item, index}
				<div
					class="animate-slide-up relative mb-12 flex items-center {index % 2 === 0
						? 'justify-start'
						: 'justify-end'}"
				>
					<div class="w-5/12 {index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}">
						<div
							class="rounded-card bg-background-secondary shadow-soft hover:shadow-medium p-6 transition-all duration-300"
						>
							<div class="font-body mb-2 text-sm font-medium text-neutral-500">{item.period}</div>
							<h3 class="font-heading mb-3 text-xl font-bold text-neutral-900">{item.title}</h3>
							<p class="font-body text-neutral-600">{item.description}</p>
						</div>
					</div>

					<!-- Timeline dot -->
					<div
						class="absolute left-1/2 flex h-8 w-8 items-center justify-center rounded-full {item.dotColor} shadow-medium -translate-x-1/2 transform"
					>
						<Clock class="h-4 w-4 text-white" />
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Call to Action -->
<section class="from-terracotta-600 to-terracotta-500 bg-gradient-to-r py-16">
	<div class="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
		<h2 class="font-display mb-4 text-3xl font-bold text-white">Scopri il Nostro Patrimonio</h2>
		<p class="font-body text-terracotta-100 mb-8 text-xl">
			Invitiamo tutti i visitatori a scoprire questo gioiello architettonico e storico,
			un'esperienza che combina la ricchezza della storia, l'ingegnosità umana e la bellezza
			mozzafiato del paesaggio calabrese.
		</p>

		<div class="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
			<div class="font-body text-terracotta-100 flex items-center gap-2">
				<Camera class="h-5 w-5" />
				<span>Visite Guidate Disponibili</span>
			</div>
			<div class="font-body text-terracotta-100 flex items-center gap-2">
				<BookOpen class="h-5 w-5" />
				<span>Percorso Esplorabile</span>
			</div>
			<div class="font-body text-terracotta-100 flex items-center gap-2">
				<Users class="h-5 w-5" />
				<span>Adatto a Tutte le Età</span>
			</div>
		</div>
	</div>
</section>
