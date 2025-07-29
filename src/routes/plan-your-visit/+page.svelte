<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { fade } from 'svelte/transition';
	import {
		MapPin,
		Clock,
		Users,
		Camera,
		Star,
		ArrowRight,
		ChevronRight,
		ChevronLeft,
		Ticket,
		Calendar,
		ImageOff
	} from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';

	// Stato per la navigazione della timeline
	let currentTimelineIndex = $state(0);

	// Stato per il caricamento delle immagini
	let imageLoadStates = $state(new Map());
	let imageErrorStates = $state(new Map());

	const timelineItems = [
		{
			year: 'Preistorico',
			title: 'Primi Insediamenti',
			description:
				"Le prove archeologiche suggeriscono la presenza umana fin dai tempi preistorici, con fossili e manufatti delle epoche greca e romana che indicano un'abitazione continua.",
			image: 'prehistoric.jpg',
			alt: 'Reperti archeologici preistorici di Zungri'
		},
		{
			year: 'VIII-XII Secolo',
			title: 'Fondazione de La Città di Pietra',
			description:
				'Insediamento rupestre stabilito, possibilmente da popolazioni orientali o rifugiati ("Sbariati"). Caratterizzato da abitazioni scavate nella roccia, sistemi di gestione dell\'acqua e aree produttive.',
			image: 'cave.jpeg',
			alt: "Abitazioni rupestri dell'VIII-XII secolo"
		},
		{
			year: '1811',
			title: 'Istituzione Ufficiale',
			description:
				'Zungri fu ufficialmente istituita come comune. Il nome deriva probabilmente dal greco "zugrion" che significa "collina" o "altura", riflettendo la sua posizione sull\'altopiano del Poro.',
			image: 'Zungri-Stemma.png',
			alt: 'Stemma storico del comune di Zungri'
		},
		{
			year: '1952',
			title: 'La Grande Alluvione',
			description:
				"Un'alluvione devastante portò all'abbandono della frazione di Papaglionti. Questo evento ha modellato il moderno schema insediativo di Zungri.",
			image: 'papa.jpeg',
			alt: "Frazione di Papaglionti prima dell'alluvione del 1952"
		},
		{
			year: '2022',
			title: 'Riconoscimento Cinematografico',
			description:
				'Ha ottenuto attenzione internazionale come location per le riprese de "Il monaco che vinse l\'Apocalisse", rappresentando l\'antica Gerusalemme nel film.',
			image: 'monaco.jpeg',
			alt: 'Set cinematografico del film "Il monaco che vinse l\'Apocalisse"'
		}
	];

	// Stato per la sezione informazioni visitatori
	let selectedInfoSection = $state('hours');

	// Funzioni di gestione immagini
	function handleImageLoad(imageId: string) {
		imageLoadStates.set(imageId, true);
		imageErrorStates.set(imageId, false);
	}

	function handleImageError(imageId: string) {
		imageLoadStates.set(imageId, true);
		imageErrorStates.set(imageId, true);
	}

	function isImageLoaded(imageId: string): boolean {
		return imageLoadStates.get(imageId) || false;
	}

	function hasImageError(imageId: string): boolean {
		return imageErrorStates.get(imageId) || false;
	}

	// Funzioni di navigazione
	function goToNextTimeline() {
		if (currentTimelineIndex < timelineItems.length - 1) {
			currentTimelineIndex++;
		}
	}

	function goToPreviousTimeline() {
		if (currentTimelineIndex > 0) {
			currentTimelineIndex--;
		}
	}

	function selectInfoSection(section: string) {
		selectedInfoSection = section;
	}

	// Contenuto statico
	const content = {
		title: 'Pianifica la Tua Visita',
		description:
			"Pianifica la tua visita al Museo di Zungri ed esplora l'antica città rupestre di Zungri. Scopri la storia, gli orari di apertura e come arrivarci."
	};
</script>

<svelte:head>
	<title>{content.title} - Museo di Zungri</title>
	<meta name="description" content={content.description} />
</svelte:head>

<div class="bg-background-DEFAULT">
	<!-- Sezione Hero - Esperienza Cinematografica -->
	<section
		class="from-background-DEFAULT to-primary-900 relative h-screen overflow-hidden bg-gradient-to-b"
	>
		<!-- Video di sfondo/effetto parallax -->
		<div class="absolute inset-0 z-0">
			<div
				class="h-full w-full bg-[url('pattern.jpg')] bg-cover bg-center bg-no-repeat opacity-80"
				aria-hidden="true"
			></div>
			<div class="from-background-DEFAULT absolute inset-0 bg-gradient-to-t to-transparent"></div>
		</div>

		<div class="relative z-10 mx-auto max-w-7xl px-4 pt-32 sm:px-6 lg:px-8">
			<div class="text-center">
				<h1
					class="font-display mb-6 text-5xl font-bold text-white sm:text-6xl lg:text-7xl"
					in:fade={{ duration: 800, delay: 200 }}
				>
					Pianifica il Tuo Viaggio nella <span
						class="from-terracotta-500 to-terracotta-400 bg-gradient-to-r bg-clip-text text-transparent"
						>Città di Pietra</span
					>
				</h1>
				<p
					class="font-body mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-white/90"
					in:fade={{ duration: 800, delay: 400 }}
				>
					Fai un passo indietro nel tempo nell'antica città rupestre di Zungri, dove storia, cultura
					e natura convergono nel cuore della Calabria.
				</p>

				<div
					class="bg-background-DEFAULT/90 shadow-soft mx-auto mb-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-neutral-700 backdrop-blur-sm"
					in:fade={{ duration: 800, delay: 600 }}
				>
					<MapPin class="text-terracotta-600 h-4 w-4" />
					Zungri, Provincia di Vibo Valentia, Calabria
				</div>

				<div
					class="mx-auto flex max-w-md flex-col gap-4 sm:flex-row"
					in:fade={{ duration: 800, delay: 800 }}
				>
					<Button
						href="/book"
						class="from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 bg-gradient-to-r text-white"
						size="lg"
					>
						<Calendar class="mr-2 h-5 w-5" />
						Prenota la Tua Visita
					</Button>
					<Button
						variant="outline"
						class="border-white text-white hover:bg-white/10"
						size="lg"
						href="#history"
					>
						Esplora la Storia
						<ChevronRight class="ml-2 h-5 w-5" />
					</Button>
				</div>
			</div>
		</div>

		<!-- Statistiche fluttuanti -->
		<div class="absolute bottom-10 left-1/2 z-20 hidden -translate-x-1/2 transform sm:flex">
			<div
				class="rounded-artifact border-terracotta-500 bg-terracotta-50/90 mx-2 flex flex-col items-center justify-center border-l-4 p-4 backdrop-blur-sm"
			>
				<div class="text-terracotta-800 text-3xl font-bold">3.000</div>
				<div class="text-terracotta-700 text-sm">Metri Quadrati</div>
			</div>
			<div
				class="rounded-artifact border-primary-500 bg-primary-50/90 mx-2 flex flex-col items-center justify-center border-l-4 p-4 backdrop-blur-sm"
			>
				<div class="text-primary-800 text-3xl font-bold">VIII-XII</div>
				<div class="text-primary-700 text-sm">Secolo</div>
			</div>
			<div
				class="rounded-artifact border-secondary-500 bg-secondary-50/90 mx-2 flex flex-col items-center justify-center border-l-4 p-4 backdrop-blur-sm"
			>
				<div class="text-secondary-800 text-3xl font-bold">100+</div>
				<div class="text-secondary-700 text-sm">Abitazioni</div>
			</div>
		</div>
	</section>

	<!-- Timeline Storica -->
	<section id="history" class="bg-background-secondary py-20">
		<div class="mx-auto max-w-7xl px-6">
			<div class="text-center">
				<h2
					class="font-display mb-4 text-3xl font-bold text-neutral-900 md:text-4xl"
					in:fade={{ duration: 500 }}
				>
					Un Viaggio nel Tempo
				</h2>
				<p
					class="font-body mx-auto mb-16 max-w-2xl text-lg text-neutral-600"
					in:fade={{ duration: 500, delay: 100 }}
				>
					Esplora la ricca storia di Zungri e del suo straordinario insediamento rupestre, dai tempi
					antichi ai giorni nostri.
				</p>
			</div>

			<div class="relative">
				<!-- Linea della timeline -->
				<div class="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 transform bg-neutral-200">
					<!-- Punti della timeline -->
					{#each timelineItems as _, index}
						<div
							class="bg-primary-600 absolute h-3 w-3 -translate-x-1/2 transform rounded-full transition-all duration-300"
							class:scale-150={index === currentTimelineIndex}
							class:bg-terracotta-600={index === currentTimelineIndex}
							style="top: {(index / (timelineItems.length - 1)) * 100}%"
						></div>
					{/each}
				</div>

				<!-- Contenuto della timeline -->
				{#each timelineItems as item, index}
					<div
						class="mb-20 flex items-center {index % 2 === 0 ? 'justify-start' : 'justify-end'}"
						in:fade={{ duration: 500, delay: index * 100 }}
					>
						<div class="grid w-5/12 grid-cols-1 gap-6 {index % 2 === 0 ? 'pr-8' : 'pl-8'}">
							<!-- Contenuto testuale -->
							<div
								class="rounded-card bg-background-DEFAULT shadow-soft hover:shadow-medium order-2 p-6 transition-all duration-300 {index %
									2 ===
								0
									? 'text-right'
									: 'text-left'}"
								class:order-1={index % 2 !== 0}
							>
								<div class="font-body text-primary-600 mb-2 text-sm font-medium">{item.year}</div>
								<h3 class="font-heading mb-3 text-xl font-bold text-neutral-900">{item.title}</h3>
								<p class="font-body text-neutral-600">{item.description}</p>
							</div>

							<!-- Immagine della timeline -->
							<div
								class="rounded-card bg-background-DEFAULT shadow-soft order-1 overflow-hidden"
								class:order-2={index % 2 !== 0}
							>
								<div class="relative h-48 w-full">
									{#if !isImageLoaded(`timeline-${index}`)}
										<div class="absolute inset-0 flex items-center justify-center bg-neutral-100">
											<div
												class="border-primary-600 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
											></div>
										</div>
									{/if}

									{#if hasImageError(`timeline-${index}`)}
										<div
											class="absolute inset-0 flex flex-col items-center justify-center bg-neutral-100 text-neutral-500"
										>
											<ImageOff class="mb-2 h-8 w-8" />
											<span class="text-sm">Immagine non disponibile</span>
										</div>
									{:else}
										<img
											src={item.image}
											alt={item.alt}
											class="h-full w-full object-cover transition-all duration-500 hover:scale-105"
											class:opacity-0={!isImageLoaded(`timeline-${index}`)}
											class:opacity-100={isImageLoaded(`timeline-${index}`)}
											loading="lazy"
											onload={() => handleImageLoad(`timeline-${index}`)}
											onerror={() => handleImageError(`timeline-${index}`)}
										/>
									{/if}
								</div>
							</div>
						</div>

						<!-- Punto della timeline -->
						<div
							class="bg-primary-100 shadow-medium absolute left-1/2 flex h-12 w-12 -translate-x-1/2 transform items-center justify-center rounded-full"
							class:scale-125={index === currentTimelineIndex}
							class:ring-4={index === currentTimelineIndex}
							class:ring-primary-200={index === currentTimelineIndex}
							class:bg-terracotta-100={index === currentTimelineIndex}
							class:ring-terracotta-200={index === currentTimelineIndex}
						>
							<div
								class="bg-primary-500 h-8 w-8 rounded-full"
								class:bg-terracotta-500={index === currentTimelineIndex}
							></div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Navigazione Timeline -->
			<div class="mt-12 flex justify-center">
				<div class="flex items-center space-x-6">
					<button
						type="button"
						aria-label="Elemento precedente della timeline"
						class="bg-background-DEFAULT hover:bg-primary-50 rounded-full p-3 shadow-sm transition-all hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
						onclick={goToPreviousTimeline}
						disabled={currentTimelineIndex === 0}
					>
						<ChevronLeft class="text-primary-600 h-6 w-6" />
					</button>
					<div class="text-primary-600 text-lg font-medium">
						{currentTimelineIndex + 1} / {timelineItems.length}
					</div>
					<button
						type="button"
						aria-label="Prossimo elemento della timeline"
						class="bg-background-DEFAULT hover:bg-primary-50 rounded-full p-3 shadow-sm transition-all hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
						onclick={goToNextTimeline}
						disabled={currentTimelineIndex === timelineItems.length - 1}
					>
						<ChevronRight class="text-primary-600 h-6 w-6" />
					</button>
				</div>
			</div>
		</div>
	</section>

	<!-- Sezione La Città Rupestre -->
	<section class="bg-background-DEFAULT py-20">
		<div class="mx-auto max-w-7xl px-6">
			<div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
				<div class="order-2 lg:order-1">
					<div class="rounded-card bg-background-secondary shadow-soft mb-8 overflow-hidden">
						<div class="relative h-96 w-full">
							{#if !isImageLoaded('main-grotte')}
								<div class="absolute inset-0 flex items-center justify-center bg-neutral-100">
									<div
										class="border-primary-600 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
									></div>
								</div>
							{/if}

							{#if hasImageError('main-grotte')}
								<div
									class="absolute inset-0 flex flex-col items-center justify-center bg-neutral-100 text-neutral-500"
								>
									<ImageOff class="mb-2 h-12 w-12" />
									<span>Immagine non disponibile</span>
								</div>
							{:else}
								<img
									src="grotte-citt.jpeg"
									alt="La Città di Pietra di Zungri"
									class="h-full w-full object-cover transition-all duration-500 hover:scale-105"
									class:opacity-0={!isImageLoaded('main-grotte')}
									class:opacity-100={isImageLoaded('main-grotte')}
									loading="lazy"
									onload={() => handleImageLoad('main-grotte')}
									onerror={() => handleImageError('main-grotte')}
								/>
							{/if}
						</div>
					</div>
					<div class="grid grid-cols-2 gap-4">
						<div class="rounded-card bg-background-secondary shadow-soft overflow-hidden">
							<div class="relative h-48 w-full">
								{#if !isImageLoaded('grotte-1')}
									<div class="absolute inset-0 flex items-center justify-center bg-neutral-100">
										<div
											class="border-primary-600 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"
										></div>
									</div>
								{/if}

								{#if hasImageError('grotte-1')}
									<div
										class="absolute inset-0 flex flex-col items-center justify-center bg-neutral-100 text-neutral-500"
									>
										<ImageOff class="mb-1 h-6 w-6" />
										<span class="text-xs">Non disponibile</span>
									</div>
								{:else}
									<img
										src="grotte.jpg"
										alt="Abitazioni scavate nella roccia"
										class="h-full w-full object-cover transition-all duration-500 hover:scale-105"
										class:opacity-0={!isImageLoaded('grotte-1')}
										class:opacity-100={isImageLoaded('grotte-1')}
										loading="lazy"
										onload={() => handleImageLoad('grotte-1')}
										onerror={() => handleImageError('grotte-1')}
									/>
								{/if}
							</div>
						</div>
						<div class="rounded-card bg-background-secondary shadow-soft overflow-hidden">
							<div class="relative h-48 w-full">
								{#if !isImageLoaded('grotte-2')}
									<div class="absolute inset-0 flex items-center justify-center bg-neutral-100">
										<div
											class="border-primary-600 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"
										></div>
									</div>
								{/if}

								{#if hasImageError('grotte-2')}
									<div
										class="absolute inset-0 flex flex-col items-center justify-center bg-neutral-100 text-neutral-500"
									>
										<ImageOff class="mb-1 h-6 w-6" />
										<span class="text-xs">Non disponibile</span>
									</div>
								{:else}
									<img
										src="grotte-acqua.jpeg"
										alt="Sistema di gestione dell'acqua"
										class="h-full w-full object-cover transition-all duration-500 hover:scale-105"
										class:opacity-0={!isImageLoaded('grotte-2')}
										class:opacity-100={isImageLoaded('grotte-2')}
										loading="lazy"
										onload={() => handleImageLoad('grotte-2')}
										onerror={() => handleImageError('grotte-2')}
									/>
								{/if}
							</div>
						</div>
					</div>
				</div>

				<div class="order-1 lg:order-2">
					<h2
						class="font-display mb-6 text-3xl font-bold text-neutral-900 md:text-4xl"
						in:fade={{ duration: 500 }}
					>
						La Città di Pietra di Zungri
					</h2>
					<p
						class="font-body mb-6 text-lg text-neutral-600"
						in:fade={{ duration: 500, delay: 100 }}
					>
						Conosciuto anche come le "Grotte degli Sbariati", questo straordinario insediamento
						rupestre copre circa 3.000 metri quadrati e rappresenta un esempio unico di architettura
						rupestre in Calabria.
					</p>

					<div class="mb-8 space-y-6">
						<div
							class="rounded-artifact border-terracotta-500 bg-terracotta-50 border-l-4 p-6"
							in:fade={{ duration: 500, delay: 200 }}
						>
							<h3 class="font-heading text-terracotta-900 mb-2 text-xl font-bold">
								Origini e Scopo
							</h3>
							<p class="text-terracotta-800">
								Le ricerche suggeriscono che l'insediamento risale all'VIII-XII secolo,
								possibilmente fondato da popolazioni orientali o abitato dagli "Sbariati" (vagabondi
								o rifugiati), potenzialmente monaci orientali in fuga dalle persecuzioni. Il sito
								presenta abitazioni scavate nella roccia, sistemi di gestione dell'acqua e aree
								produttive.
							</p>
						</div>

						<div
							class="rounded-artifact border-primary-500 bg-primary-50 border-l-4 p-6"
							in:fade={{ duration: 500, delay: 300 }}
						>
							<h3 class="font-heading text-primary-900 mb-2 text-xl font-bold">
								Caratteristiche Architettoniche
							</h3>
							<p class="text-primary-800">
								Circa 100 abitazioni scavate nella roccia con ingressi quadrangolari o ad arco,
								alcune caratterizzate da portali in pietra scolpita. Include un torchio per il vino
								(palmento), fornace per la calce ("calcara"), aree di stoccaggio del grano e un
								intricato sistema di gestione dell'acqua per la raccolta dell'acqua piovana.
							</p>
						</div>

						<div
							class="rounded-artifact border-secondary-500 bg-secondary-50 border-l-4 p-6"
							in:fade={{ duration: 500, delay: 400 }}
						>
							<h3 class="font-heading text-secondary-900 mb-2 text-xl font-bold">
								Significato Storico
							</h3>
							<p class="text-secondary-800">
								Spesso paragonato a Matera o Petra, guadagnandosi soprannomi come "piccola Petra
								della Calabria" o "piccola Cappadocia". Il layout del sito differenzia le aree
								residenziali da quelle produttive e agropastorali, con sistemi di canalizzazione
								dell'acqua per prevenire le inondazioni.
							</p>
						</div>
					</div>

					<Button
						href="/book"
						class="from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 bg-gradient-to-r text-white"
						size="lg"
					>
						<Calendar class="mr-2 h-5 w-5" />
						Prenota la Tua Visita
					</Button>
				</div>
			</div>
		</div>
	</section>

	<!-- Sezione Informazioni per i Visitatori -->
	<section class="bg-background-secondary py-20">
		<div class="mx-auto max-w-7xl px-6">
			<div class="text-center">
				<h2
					class="font-display mb-4 text-3xl font-bold text-neutral-900 md:text-4xl"
					in:fade={{ duration: 500 }}
				>
					Pianifica la Tua Visita
				</h2>
				<p
					class="font-body mx-auto mb-16 max-w-2xl text-lg text-neutral-600"
					in:fade={{ duration: 500, delay: 100 }}
				>
					Tutte le informazioni necessarie per un'esperienza indimenticabile alla Città Rupestre di
					Zungri.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<!-- Navigazione Informazioni Visitatori -->
				<div class="space-y-4">
					<div
						class="rounded-card bg-background-DEFAULT shadow-soft hover:bg-primary-50 p-4 transition-colors"
						class:bg-primary-50={selectedInfoSection === 'hours'}
					>
						<button
							type="button"
							class="flex w-full items-center justify-between text-left"
							onclick={() => selectInfoSection('hours')}
						>
							<div class="flex items-center">
								<Clock class="text-primary-600 mr-3 h-6 w-6" />
								<span class="font-heading text-lg font-semibold text-neutral-900"
									>Orari di Apertura</span
								>
							</div>
							<ChevronRight class="h-5 w-5 text-neutral-400" />
						</button>
					</div>

					<div
						class="rounded-card bg-background-DEFAULT shadow-soft hover:bg-primary-50 p-4 transition-colors"
						class:bg-primary-50={selectedInfoSection === 'tickets'}
					>
						<button
							type="button"
							class="flex w-full items-center justify-between text-left"
							onclick={() => selectInfoSection('tickets')}
						>
							<div class="flex items-center">
								<Ticket class="text-primary-600 mr-3 h-6 w-6" />
								<span class="font-heading text-lg font-semibold text-neutral-900"
									>Biglietti e Prezzi</span
								>
							</div>
							<ChevronRight class="h-5 w-5 text-neutral-400" />
						</button>
					</div>

					<div
						class="rounded-card bg-background-DEFAULT shadow-soft hover:bg-primary-50 p-4 transition-colors"
						class:bg-primary-50={selectedInfoSection === 'accessibility'}
					>
						<button
							type="button"
							class="flex w-full items-center justify-between text-left"
							onclick={() => selectInfoSection('accessibility')}
						>
							<div class="flex items-center">
								<Users class="text-primary-600 mr-3 h-6 w-6" />
								<span class="font-heading text-lg font-semibold text-neutral-900"
									>Accessibilità</span
								>
							</div>
							<ChevronRight class="h-5 w-5 text-neutral-400" />
						</button>
					</div>

					<div
						class="rounded-card bg-background-DEFAULT shadow-soft hover:bg-primary-50 p-4 transition-colors"
						class:bg-primary-50={selectedInfoSection === 'tips'}
					>
						<button
							type="button"
							class="flex w-full items-center justify-between text-left"
							onclick={() => selectInfoSection('tips')}
						>
							<div class="flex items-center">
								<Camera class="text-primary-600 mr-3 h-6 w-6" />
								<span class="font-heading text-lg font-semibold text-neutral-900"
									>Consigli per i Visitatori</span
								>
							</div>
							<ChevronRight class="h-5 w-5 text-neutral-400" />
						</button>
					</div>
				</div>

				<!-- Contenuto Informazioni Visitatori -->
				<div class="lg:col-span-2">
					{#if selectedInfoSection === 'hours'}
						<div class="rounded-card bg-background-DEFAULT shadow-soft p-6">
							<h3 class="font-heading mb-4 text-2xl font-bold text-neutral-900">
								Orari di Apertura
							</h3>
							<div class="space-y-4">
								<div class="flex justify-between border-b border-neutral-200 pb-3">
									<span class="font-medium text-neutral-700">Martedì - Domenica</span>
									<span class="font-semibold text-neutral-900">9:00 - 17:00</span>
								</div>
								<div class="flex justify-between border-b border-neutral-200 pb-3">
									<span class="font-medium text-neutral-700">Lunedì</span>
									<span class="font-semibold text-neutral-900">Chiuso</span>
								</div>
								<div class="flex justify-between border-b border-neutral-200 pb-3">
									<span class="font-medium text-neutral-700">Giorni Festivi</span>
									<span class="font-semibold text-neutral-900">9:00 - 13:00</span>
								</div>
								<div class="pt-3">
									<p class="text-neutral-600">
										L'ultimo ingresso è 30 minuti prima della chiusura. Il sito potrebbe chiudere
										temporaneamente durante condizioni meteorologiche avverse per la sicurezza dei
										visitatori.
									</p>
								</div>
							</div>
						</div>
					{:else if selectedInfoSection === 'tickets'}
						<div class="rounded-card bg-background-DEFAULT shadow-soft p-6">
							<h3 class="font-heading mb-4 text-2xl font-bold text-neutral-900">
								Biglietti e Prezzi
							</h3>
							<div class="space-y-4">
								<div class="flex justify-between border-b border-neutral-200 pb-3">
									<span class="font-medium text-neutral-700">Adulti</span>
									<span class="font-semibold text-neutral-900">€8,00</span>
								</div>
								<div class="flex justify-between border-b border-neutral-200 pb-3">
									<span class="font-medium text-neutral-700">Bambini (6-18 anni)</span>
									<span class="font-semibold text-neutral-900">€5,00</span>
								</div>
								<div class="flex justify-between border-b border-neutral-200 pb-3">
									<span class="font-medium text-neutral-700">Bambini sotto i 6 anni</span>
									<span class="font-semibold text-neutral-900">Gratuito</span>
								</div>
								<div class="flex justify-between border-b border-neutral-200 pb-3">
									<span class="font-medium text-neutral-700">Studenti (con documento)</span>
									<span class="font-semibold text-neutral-900">€6,00</span>
								</div>
								<div class="flex justify-between border-b border-neutral-200 pb-3">
									<span class="font-medium text-neutral-700">Over 65</span>
									<span class="font-semibold text-neutral-900">€6,00</span>
								</div>
								<div class="flex justify-between border-b border-neutral-200 pb-3">
									<span class="font-medium text-neutral-700">Gruppi (10+ persone)</span>
									<span class="font-semibold text-neutral-900">€6,50 a persona</span>
								</div>
								<div class="pt-3">
									<p class="text-neutral-600">
										Tutti i biglietti includono l'accesso al Museo della Civiltà Rupestre e
										Contadina. Visite guidate disponibili a un costo aggiuntivo di €3,00 a persona.
										Le prenotazioni di gruppo richiedono prenotazione anticipata.
									</p>
								</div>
							</div>
						</div>
					{:else if selectedInfoSection === 'accessibility'}
						<div class="rounded-card bg-background-DEFAULT shadow-soft p-6">
							<h3 class="font-heading mb-4 text-2xl font-bold text-neutral-900">Accessibilità</h3>
							<div class="space-y-4">
								<div class="rounded-artifact border-terracotta-500 bg-terracotta-50 border-l-4 p-4">
									<p class="text-terracotta-800">
										Sebbene il terreno naturale della città rupestre presenti alcune sfide, ci
										impegniamo a rendere il sito il più accessibile possibile.
									</p>
								</div>
								<div class="space-y-3">
									<h4 class="font-heading font-semibold text-neutral-800">
										Caratteristiche di Accessibilità:
									</h4>
									<ul class="list-inside list-disc space-y-2 text-neutral-600">
										<li>
											Posti auto riservati per visitatori con disabilità vicino all'ingresso
											principale
										</li>
										<li>
											Servizi igienici accessibili all'ingresso del museo e al centro visitatori
										</li>
										<li>
											Diversi percorsi accessibili attraverso le principali aree dell'insediamento
											(circa il 60% del sito)
										</li>
										<li>
											Piattaforme panoramiche accessibili in sedia a rotelle con viste panoramiche
											della città rupestre
										</li>
										<li>
											Visite guidate accessibili disponibili con prenotazione anticipata (48 ore di
											preavviso)
										</li>
									</ul>
								</div>
								<div class="pt-3">
									<p class="text-neutral-600">
										Si prega di notare che a causa della natura storica del sito e della sua
										posizione su formazioni rocciose naturali, alcune aree potrebbero avere
										superfici irregolari, gradini o accessibilità limitata. Il nostro staff è sempre
										disponibile per assistere e fornire opzioni di visualizzazione alternative.
									</p>
								</div>
							</div>
						</div>
					{:else if selectedInfoSection === 'tips'}
						<div class="rounded-card bg-background-DEFAULT shadow-soft p-6">
							<h3 class="font-heading mb-4 text-2xl font-bold text-neutral-900">
								Consigli per i Visitatori
							</h3>
							<div class="space-y-4">
								<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div
										class="rounded-artifact border-terracotta-500 bg-terracotta-50 border-l-4 p-4"
									>
										<h4 class="font-heading text-terracotta-900 mb-2 font-semibold">
											Cosa Portare
										</h4>
										<ul class="text-terracotta-800 list-inside list-disc space-y-1">
											<li>Scarpe comode da camminata con buona presa</li>
											<li>Bottiglia d'acqua (punti di ricarica disponibili)</li>
											<li>Protezione solare (cappello, occhiali da sole, crema solare)</li>
											<li>Giacca leggera per i mesi più freschi</li>
										</ul>
									</div>
									<div class="rounded-artifact border-primary-500 bg-primary-50 border-l-4 p-4">
										<h4 class="font-heading text-primary-900 mb-2 font-semibold">Fotografia</h4>
										<ul class="text-primary-800 list-inside list-disc space-y-1">
											<li>La fotografia è consentita per uso personale in tutto il sito</li>
											<li>La fotografia commerciale richiede autorizzazione preventiva</li>
											<li>L'uso di droni è severamente vietato senza permesso speciale</li>
											<li>Rispetta gli altri visitatori quando scatti foto</li>
										</ul>
									</div>
								</div>
								<div class="pt-3">
									<h4 class="font-heading mb-2 font-semibold text-neutral-800">
										Consigli Aggiuntivi:
									</h4>
									<ul class="list-inside list-disc space-y-2 text-neutral-600">
										<li>
											Arriva presto per evitare le folle, specialmente durante l'alta stagione
											(giugno-agosto)
										</li>
										<li>
											Prevedi almeno 2-3 ore per una visita completa alla città rupestre e al museo
										</li>
										<li>
											Considera di prenotare una visita guidata per approfondimenti storici
											(disponibile in più lingue)
										</li>
										<li>Visita il negozio del museo per souvenir unici e artigianato locale</li>
										<li>
											Controlla le previsioni meteo prima della visita; alcune aree potrebbero
											essere chiuse durante forti piogge
										</li>
									</ul>
								</div>
							</div>
						</div>
					{/if}

					<div class="mt-8 flex justify-center">
						<Button
							href="/book"
							class="from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 bg-gradient-to-r text-white"
							size="lg"
						>
							<Calendar class="mr-2 h-5 w-5" />
							Prenota Ora la Tua Visita
						</Button>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Sezione Mappa -->
	<section class="bg-background-DEFAULT py-20">
		<div class="mx-auto max-w-7xl px-6">
			<div class="text-center">
				<div
					class="bg-terracotta-100 mx-auto flex h-12 w-12 items-center justify-center rounded-full"
				>
					<MapPin class="text-terracotta-600 h-6 w-6" />
				</div>
				<h2
					class="font-display mt-4 text-3xl font-bold text-neutral-900"
					in:fade={{ duration: 500 }}
				>
					Come Trovarci
				</h2>
				<p
					class="font-body mx-auto mt-4 max-w-2xl text-lg text-neutral-600"
					in:fade={{ duration: 500, delay: 100 }}
				>
					Siamo situati nel centro storico di Zungri, facilmente raggiungibile in auto o con i mezzi
					pubblici.
				</p>
			</div>

			<div class="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
				<div class="rounded-card bg-background-DEFAULT shadow-soft overflow-hidden">
					<iframe
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3148.835497985854!2d16.00230131532019!3d38.65999897960786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13151b72b8c0677b%3A0x9d32095f9e944b2c!2sInsediamento%20Rupestre%20e%20Museo%20della%20Civilt%C3%A0%20Rupestre%20e%20Contadina!5e0!3m2!1sen!2sit!4v1678886400000!5m2!1sen!2sit"
						width="100%"
						height="450"
						style="border:0;"
						allowfullscreen
						loading="lazy"
						referrerpolicy="no-referrer-when-downgrade"
						title="Mappa che mostra la posizione della Città Rupestre di Zungri"
					></iframe>
				</div>

				<div class="space-y-6">
					<div class="rounded-artifact border-terracotta-500 bg-terracotta-50 border-l-4 p-6">
						<h3 class="font-heading text-terracotta-900 mb-2 text-xl font-bold">Indirizzo</h3>
						<p class="text-terracotta-800">
							Insediamento Rupestre di Zungri<br />
							Via Roma, 123<br />
							89020 Zungri (VV), Calabria, Italia
						</p>
					</div>

					<div class="rounded-artifact border-primary-500 bg-primary-50 border-l-4 p-6">
						<h3 class="font-heading text-primary-900 mb-2 text-xl font-bold">Come Arrivare</h3>
						<div class="text-primary-800 space-y-3">
							<div>
								<p class="font-medium">In Auto:</p>
								<p>
									Da Vibo Valentia: Prendere la SP20 verso Zungri (circa 20 minuti). Seguire le
									indicazioni per "Insediamento Rupestre".
								</p>
							</div>
							<div>
								<p class="font-medium">Con i Mezzi Pubblici:</p>
								<p>
									Autobus regionale da Vibo Valentia a Zungri (circa 30 minuti). Dal centro città,
									sono 10 minuti a piedi fino al sito.
								</p>
							</div>
							<div>
								<p class="font-medium">Parcheggio:</p>
								<p>
									Parcheggio designato disponibile vicino all'ingresso (€2,00 per 2 ore, gratuito
									per visitatori con disabilità).
								</p>
							</div>
						</div>
					</div>

					<div class="rounded-artifact border-secondary-500 bg-secondary-50 border-l-4 p-6">
						<h3 class="font-heading text-secondary-900 mb-2 text-xl font-bold">
							Attrazioni Vicine
						</h3>
						<ul class="text-secondary-800 list-inside list-disc space-y-2">
							<li>
								<strong>Centro Storico di Zungri:</strong> Esplora il centro storico con l'architettura
								tradizionale calabrese
							</li>
							<li>
								<strong>Altopiano del Poro:</strong> Goditi le viste panoramiche del Mar Tirreno
							</li>
							<li>
								<strong>Spiagge Costiere:</strong> Belle spiagge a soli 15 minuti di distanza
							</li>
							<li>
								<strong>Cantine Locali:</strong> Assaggia i vini tradizionali calabresi nelle tenute
								vicine
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Sezione Call to Action -->
	<section
		class="from-terracotta-600 to-terracotta-500 bg-gradient-to-r py-16"
		in:fade={{ duration: 500 }}
	>
		<div class="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
			<h2 class="font-display mb-4 text-3xl font-bold text-white">Pronto a Vivere la Storia?</h2>
			<p class="text-terracotta-100 mb-8 text-xl">
				Prenota oggi la tua visita e scopri l'antica città rupestre di Zungri, dove la storia prende
				vita.
			</p>

			<div class="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
				<Button href="/book" class="text-terracotta-600 hover:bg-terracotta-50 bg-white" size="lg">
					<Calendar class="mr-2 h-5 w-5" />
					Prenota la Tua Visita
				</Button>
				<Button
					href="/exhibitions"
					variant="outline"
					class="hover:text-terracotta-600 border-white text-white hover:bg-white"
					size="lg"
				>
					Esplora le Mostre
					<ArrowRight class="ml-2 h-5 w-5" />
				</Button>
			</div>

			<div
				class="text-terracotta-100 mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-6"
			>
				<div class="flex items-center gap-2">
					<Camera class="h-5 w-5" />
					<span>Fotografia Consentita</span>
				</div>
				<div class="flex items-center gap-2">
					<Star class="h-5 w-5" />
					<span>Valutazione Visitatori 4,8/5</span>
				</div>
				<div class="flex items-center gap-2">
					<Users class="h-5 w-5" />
					<span>Visite Guidate Disponibili</span>
				</div>
			</div>
		</div>
	</section>
</div>
