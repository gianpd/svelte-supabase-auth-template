<script lang="ts">
	interface TimelineItem {
		period: string;
		title: string;
		description: string;
		image: string;
		color: 'primary' | 'terracotta' | 'olive';
	}

	interface TimelineColors {
		[key: string]: {
			gradient: string;
			dot: string;
		};
	}

	interface InfoTab {
		title: string;
		icon: string;
		content: string;
	}

	interface InfoTabs {
		[key: string]: InfoTab;
	}

	// Svelte 5: Use $state for reactive variables
	let currentTimelineItem = $state(1);
	let activeInfoTab = $state('orari');
	let mounted = $state(false);

	const timelineItems: TimelineItem[] = [
		{
			period: 'Preistorico',
			title: 'Primi Insediamenti',
			description:
				"Le prove archeologiche suggeriscono la presenza umana fin dai tempi preistorici, con fossili e manufatti delle epoche greca e romana che indicano un'abitazione continua.",
			image: 'prehistoric.jpg',
			color: 'primary'
		},
		{
			period: 'VIII-XII Secolo',
			title: 'Fondazione de La Città di Pietra',
			description:
				'Insediamento rupestre stabilito, possibilmente da popolazioni orientali o rifugiati ("Sbariati"). Caratterizzato da abitazioni scavate nella roccia, sistemi di gestione dell\'acqua e aree produttive.',
			image: 'pietra-zungri.jpg',
			color: 'terracotta'
		},
		{
			period: '1811',
			title: 'Istituzione Ufficiale',
			description:
				'Zungri fu ufficialmente istituita come comune. Il nome deriva probabilmente dal greco "zugrion" che significa "collina" o "altura", riflettendo la sua posizione sull\'altopiano del Poro.',
			image: 'Zungri-Stemma.png',
			color: 'olive'
		}
	];

	// Helper object for dynamic Tailwind classes to ensure JIT compiler compatibility
	const timelineColors: TimelineColors = {
		primary: {
			gradient: 'from-[#dbeafe] to-[#bfdbfe]',
			dot: 'bg-[#2563eb]'
		},
		terracotta: {
			gradient: 'from-[#feecdc] to-[#fcd9bd]',
			dot: 'bg-[#cd853f]'
		},
		olive: {
			gradient: 'from-[#eef0e5] to-[#dde2cc]',
			dot: 'bg-[#6b7c32]'
		}
	};

	const infoTabs: InfoTabs = {
		orari: {
			title: 'Orari di Apertura',
			icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
			content: `
        <div class="space-y-4">
          <div class="flex justify-between items-center py-3 border-b border-gray-100">
            <span class="font-medium">Lunedì - Venerdì</span>
            <span class="text-terracotta-600">9:00 - 17:00</span>
          </div>
          <div class="flex justify-between items-center py-3 border-b border-gray-100">
            <span class="font-medium">Sabato - Domenica</span>
            <span class="text-terracotta-600">9:00 - 19:00</span>
          </div>
          <div class="bg-primary-50 p-4 rounded-lg mt-4">
            <p class="text-sm text-primary-800">
              <strong>Nota:</strong> Gli orari possono variare durante i periodi festivi. Si consiglia di contattare il museo prima della visita.
            </p>
          </div>
        </div>
      `
		},
		prezzi: {
			title: 'Prezzi e Biglietti',
			icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
			content: `
        <div class="space-y-4">
          <div class="bg-white border border-terracotta-100 rounded-lg p-4">
            <div class="flex justify-between items-center">
              <span class="font-medium">Biglietto Intero</span>
              <span class="text-2xl font-bold text-terracotta-600">€8</span>
            </div>
          </div>
          <div class="bg-white border border-primary-100 rounded-lg p-4">
            <div class="flex justify-between items-center">
              <span class="font-medium">Biglietto Ridotto</span>
              <span class="text-2xl font-bold text-primary-600">€5</span>
            </div>
            <p class="text-sm text-gray-600 mt-2">Studenti, over 65, gruppi 10+</p>
          </div>
          <div class="bg-olive-50 border border-olive-100 rounded-lg p-4">
            <div class="flex justify-between items-center">
              <span class="font-medium">Gratuito</span>
              <span class="text-2xl font-bold text-olive-600">€0</span>
            </div>
            <p class="text-sm text-olive-700 mt-2">Bambini sotto i 6 anni, disabili</p>
          </div>
        </div>
      `
		},
		accesso: {
			title: 'Come Arrivare',
			icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
			content: `
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <div class="bg-primary-100 p-2 rounded-lg">
              <svg class="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-semibold mb-1">In Auto</h4>
              <p class="text-sm text-gray-600">Da Vibo Valentia: SS18 direzione Pizzo, seguire indicazioni per Zungri</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="bg-terracotta-100 p-2 rounded-lg">
              <svg class="w-5 h-5 text-terracotta-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-semibold mb-1">Trasporto Pubblico</h4>
              <p class="text-sm text-gray-600">Autobus da Vibo Valentia, fermata Zungri Centro</p>
            </div>
          </div>
        </div>
      `
		}
	};

	function nextTimelineItem() {
		currentTimelineItem = (currentTimelineItem % timelineItems.length) + 1;
	}

	function prevTimelineItem() {
		currentTimelineItem =
			currentTimelineItem === 1 ? timelineItems.length : currentTimelineItem - 1;
	}

	function setActiveTab(tab: string) {
		activeInfoTab = tab;
	}

	$effect(() => {
		mounted = true;

		// Intersection Observer per animazioni
		const observerOptions = {
			threshold: 0.1,
			rootMargin: '0px 0px -50px 0px'
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('animate-in');
				}
			});
		}, observerOptions);

		document.querySelectorAll('.fade-in, .slide-up').forEach((el) => {
			observer.observe(el);
		});

		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>Pianifica la Tua Visita - Museo di Zungri</title>
	<meta
		name="description"
		content="Pianifica la tua visita al Museo di Zungri ed esplora l'antica città rupestre di Zungri. Scopri la storia, gli orari di apertura e come arrivarci."
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&family=Cinzel:wght@400;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main class="bg-[#fefdf9] font-['Inter'] text-[#1c1917]">
	<!-- Hero Section -->
	<section
		class="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fefdf9] to-[#1e3a8a]"
		style="background-image: url('pattern.jpg'); background-attachment: fixed; background-position: center; background-repeat: no-repeat; background-size: cover;"
	>
		<!-- Background overlay -->
		<div
			class="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
		></div>

		<!-- Floating particles effect -->
		<div class="z-5 absolute inset-0">
			<div
				class="absolute left-10 top-20 h-3 w-3 animate-bounce rounded-full bg-[#ff8a4c] opacity-60"
				style="animation-delay: 0s;"
			></div>
			<div
				class="absolute right-20 top-40 h-2 w-2 animate-bounce rounded-full bg-[#60a5fa] opacity-70"
				style="animation-delay: 1s;"
			></div>
			<div
				class="absolute bottom-32 left-1/4 h-4 w-4 animate-bounce rounded-full bg-[#a8ba7f] opacity-50"
				style="animation-delay: 2s;"
			></div>
		</div>

		<div
			class="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8"
		>
			<div class="mx-auto mb-16 max-w-5xl text-center">
				<h1
					class="fade-in mb-6 font-['Cinzel'] text-5xl font-bold text-white sm:text-6xl lg:text-8xl"
				>
					Pianifica il Tuo Viaggio nella
					<span
						class="mt-2 block bg-gradient-to-r from-[#cd853f] to-[#c2410c] bg-clip-text text-transparent"
						>Città di Pietra</span
					>
				</h1>
				<p
					class="fade-in mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-white/90 sm:text-2xl"
				>
					Fai un passo indietro nel tempo nell'antica città rupestre di Zungri, dove storia, cultura
					e natura convergono nel cuore della Calabria.
				</p>

				<div
					class="fade-in mb-10 inline-flex items-center gap-3 rounded-full bg-white/90 px-6 py-3 backdrop-blur-md"
				>
					<svg class="h-5 w-5 text-[#c2410c]" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
							clip-rule="evenodd"
						></path>
					</svg>
					<span class="font-medium text-[#78716c]"
						>Zungri, Provincia di Vibo Valentia, Calabria</span
					>
				</div>

				<div class="fade-in flex flex-col items-center justify-center gap-4 sm:flex-row">
					<button
						class="group transform rounded-lg bg-gradient-to-r from-[#cd853f] to-[#c2410c] px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-[#cd853f]/25 transition-all duration-300 hover:scale-105 hover:from-[#c2410c] hover:to-[#9a3412]"
					>
						<div class="flex items-center gap-3">
							<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
									clip-rule="evenodd"
								></path>
							</svg>
							Prenota la Tua Visita
						</div>
					</button>
					<button
						class="group rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white/10"
					>
						<div class="flex items-center gap-3">
							Esplora la Storia
							<svg
								class="h-5 w-5 transition-transform group-hover:translate-x-1"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fill-rule="evenodd"
									d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
									clip-rule="evenodd"
								></path>
							</svg>
						</div>
					</button>
				</div>
			</div>

			<!-- Floating statistics moved below content -->
			<div class="z-20 flex flex-wrap justify-center gap-6">
				<div
					class="animate-bounce rounded-lg border-l-4 border-[#cd853f] bg-white/90 px-6 py-4 text-center backdrop-blur-md"
				>
					<div class="text-3xl font-bold text-[#7c2d12]">3.000</div>
					<div class="text-sm text-[#9a3412]">Metri Quadrati</div>
				</div>
				<div
					class="animate-bounce rounded-lg border-l-4 border-[#2563eb] bg-white/90 px-6 py-4 text-center backdrop-blur-md"
					style="animation-delay: 0.5s;"
				>
					<div class="text-3xl font-bold text-[#1e40af]">VIII-XII</div>
					<div class="text-sm text-[#1d4ed8]">Secolo</div>
				</div>
				<div
					class="animate-bounce rounded-lg border-l-4 border-[#a8ba7f] bg-white/90 px-6 py-4 text-center backdrop-blur-md"
					style="animation-delay: 1s;"
				>
					<div class="text-3xl font-bold text-[#4a5623]">100+</div>
					<div class="text-sm text-[#5a6b2a]">Abitazioni</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Timeline Section -->
	<section id="history" class="bg-[#f8f7f4] py-20">
		<div class="mx-auto max-w-7xl px-6">
			<div class="mb-16 text-center">
				<h2
					class="fade-in mb-6 font-['Playfair_Display'] text-4xl font-bold text-[#1c1917] md:text-5xl"
				>
					Un Viaggio nel Tempo
				</h2>
				<p class="fade-in mx-auto max-w-3xl text-xl leading-relaxed text-[#57534e]">
					Esplora la ricca storia di Zungri e del suo straordinario insediamento rupestre, dai tempi
					antichi ai giorni nostri.
				</p>
			</div>

			<div class="relative">
				<!-- Timeline line -->
				<div
					class="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 transform bg-gradient-to-b from-[#2563eb] to-[#cd853f] md:block"
				></div>

				<!-- Current Timeline Item -->
				{#each timelineItems as item, index}
					{#if index + 1 === currentTimelineItem}
						<div class="slide-up flex items-center {index % 2 === 1 ? 'flex-row-reverse' : ''}">
							<div class="w-full md:w-5/12 {index % 2 === 1 ? 'md:pl-8' : 'md:pr-8'}">
								<div
									class="rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl"
								>
									<div class="mb-2 text-sm font-semibold text-[#2563eb]">{item.period}</div>
									<h3 class="mb-4 font-['Playfair_Display'] text-2xl font-bold text-[#1c1917]">
										{item.title}
									</h3>
									<p class="leading-relaxed text-[#57534e]">{item.description}</p>
								</div>
							</div>

							<div
								class="absolute left-1/2 hidden h-16 w-16 -translate-x-1/2 transform bg-gradient-to-br md:flex {timelineColors[
									item.color
								].gradient} items-center justify-center rounded-full shadow-lg"
							>
								<div class="h-8 w-8 {timelineColors[item.color].dot} rounded-full"></div>
							</div>

							<div class="hidden w-5/12 md:block {index % 2 === 1 ? 'pr-8' : 'pl-8'}">
								<div
									class="transform overflow-hidden rounded-xl bg-white shadow-lg transition-transform hover:scale-105"
								>
									<img src={item.image} alt={item.title} class="h-64 w-full object-cover" />
								</div>
							</div>
						</div>
					{/if}
				{/each}

				<!-- Timeline Navigation -->
				<div class="mt-16 flex justify-center">
					<div class="flex items-center space-x-6">
						<button
							on:click={prevTimelineItem}
							class="rounded-full bg-white p-4 shadow-md transition-all hover:scale-110 hover:bg-[#eff6ff]"
						>
							<svg class="h-6 w-6 text-[#2563eb]" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
									clip-rule="evenodd"
								></path>
							</svg>
						</button>
						<div class="text-lg font-medium text-[#2563eb]">
							{currentTimelineItem} / {timelineItems.length}
						</div>
						<button
							on:click={nextTimelineItem}
							class="rounded-full bg-white p-4 shadow-md transition-all hover:scale-110 hover:bg-[#eff6ff]"
						>
							<svg class="h-6 w-6 text-[#2563eb]" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
									clip-rule="evenodd"
								></path>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Rock Settlement Section -->
	<section class="bg-[#fefdf9] py-20">
		<div class="mx-auto max-w-7xl px-6">
			<div class="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
				<div class="order-2 lg:order-1">
					<div class="grid grid-cols-1 gap-6">
						<div
							class="transform overflow-hidden rounded-xl bg-[#f8f7f4] shadow-lg transition-transform hover:scale-105"
						>
							<img
								src="cave.jpeg"
								alt="La Città di Pietra di Zungri"
								class="h-80 w-full object-cover"
							/>
						</div>
						<div class="grid grid-cols-2 gap-4">
							<div
								class="transform overflow-hidden rounded-xl bg-[#f8f7f4] shadow-lg transition-transform hover:scale-105"
							>
								<img
									src="zungri-cave.jpg"
									alt="Abitazioni scavate nella roccia"
									class="h-48 w-full object-cover"
								/>
							</div>
							<div
								class="transform overflow-hidden rounded-xl bg-[#f8f7f4] shadow-lg transition-transform hover:scale-105"
							>
								<img
									src="grotte-acqua.jpeg"
									alt="Sistema di gestione dell'acqua"
									class="h-48 w-full object-cover"
								/>
							</div>
						</div>
					</div>
				</div>

				<div class="order-1 lg:order-2">
					<h2
						class="fade-in mb-8 font-['Playfair_Display'] text-4xl font-bold text-[#1c1917] md:text-5xl"
					>
						La Città di Pietra di Zungri
					</h2>
					<p class="fade-in mb-8 text-xl leading-relaxed text-[#57534e]">
						Conosciuto anche come le "Grotte degli Sbariati", questo straordinario insediamento
						rupestre copre circa 3.000 metri quadrati e rappresenta un esempio unico di architettura
						rupestre in Calabria.
					</p>

					<div class="mb-10 space-y-6">
						<div class="fade-in rounded-lg border-l-4 border-[#cd853f] bg-[#fef7f0] p-6">
							<h3 class="mb-3 font-['Playfair_Display'] text-xl font-bold text-[#431407]">
								Origini e Scopo
							</h3>
							<p class="leading-relaxed text-[#7c2d12]">
								Le ricerche suggeriscono che l'insediamento risale all'VIII-XII secolo,
								possibilmente fondato da popolazioni orientali o abitato dagli "Sbariati" (vagabondi
								o rifugiati), potenzialmente monaci orientali in fuga dalle persecuzioni.
							</p>
						</div>

						<div class="fade-in rounded-lg border-l-4 border-[#2563eb] bg-[#eff6ff] p-6">
							<h3 class="mb-3 font-['Playfair_Display'] text-xl font-bold text-[#172554]">
								Caratteristiche Architettoniche
							</h3>
							<p class="leading-relaxed text-[#1e40af]">
								Circa 100 abitazioni scavate nella roccia con ingressi quadrangolari o ad arco,
								alcune caratterizzate da portali in pietra scolpita. Include un torchio per il vino
								(palmento), fornace per la calce ("calcara"), aree di stoccaggio del grano.
							</p>
						</div>

						<div class="fade-in rounded-lg border-l-4 border-[#6b7c32] bg-[#f7f8f3] p-6">
							<h3 class="mb-3 font-['Playfair_Display'] text-xl font-bold text-[#1a200e]">
								Significato Storico
							</h3>
							<p class="leading-relaxed text-[#4a5623]">
								Spesso paragonato a Matera o Petra, guadagnandosi soprannomi come "piccola Petra
								della Calabria" o "piccola Cappadocia". Il layout del sito differenzia le aree
								residenziali da quelle produttive e agropastorali.
							</p>
						</div>
					</div>

					<button
						class="group transform rounded-lg bg-gradient-to-r from-[#cd853f] to-[#c2410c] px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-[#cd853f]/25 transition-all duration-300 hover:scale-105 hover:from-[#c2410c] hover:to-[#9a3412]"
					>
						<div class="flex items-center gap-3">
							<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
									clip-rule="evenodd"
								></path>
							</svg>
							Prenota la Tua Visita
						</div>
					</button>
				</div>
			</div>
		</div>
	</section>

	<!-- Visitor Information Section -->
	<section class="bg-[#f8f7f4] py-20">
		<div class="mx-auto max-w-7xl px-6">
			<div class="mb-16 text-center">
				<h2
					class="fade-in mb-6 font-['Playfair_Display'] text-4xl font-bold text-[#1c1917] md:text-5xl"
				>
					Pianifica la Tua Visita
				</h2>
				<p class="fade-in mx-auto max-w-3xl text-xl leading-relaxed text-[#57534e]">
					Tutte le informazioni necessarie per un'esperienza indimenticabile alla Città Rupestre di
					Zungri.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<!-- Info Navigation -->
				<div class="space-y-4">
					{#each Object.entries(infoTabs) as [key, tab]}
						<button
							on:click={() => setActiveTab(key)}
							class="focus-visible:ring-terracotta-500 flex w-full items-center gap-4 rounded-xl p-5 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 {activeInfoTab ===
							key
								? 'bg-terracotta-500 scale-105 text-white shadow-lg'
								: 'bg-white hover:bg-gray-50 hover:shadow-md'}"
						>
							<svg
								class="h-7 w-7 flex-shrink-0"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								viewBox="0 0 24 24"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d={tab.icon}></path>
							</svg>
							<div>
								<span class="text-lg font-semibold">{tab.title}</span>
							</div>
						</button>
					{/each}
				</div>

				<!-- Info Content -->
				<div class="rounded-xl bg-white p-8 shadow-lg lg:col-span-2 lg:p-12">
					{#key activeInfoTab}
						{@html infoTabs[activeInfoTab].content}
					{/key}
				</div>
			</div>
		</div>
	</section>
</main>

<style>
	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.animate-bounce {
		animation: bounce 2s infinite;
	}
</style>
