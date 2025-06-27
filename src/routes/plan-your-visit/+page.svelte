<!--
/**
* @file +page.svelte (Plan Your Visit Page)
* @description Renders the 'Plan Your Visit' page, displaying content from the CMS,
* a map, and key visitor information like opening hours and ticket prices.
*
* @dependencies
* - ./$types: For typing the `data` prop.
* - lucide-svelte: For icons.
* - $lib/components/ui/Button.svelte: Reusable button component.
*/
-->

<script lang="ts">
	import type { PageData } from './$types';
	import { Clock, MapPin, Ticket, Users, ArrowRight } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let { data }: { data: PageData } = $props();
	const { content } = data;
</script>

<svelte:head>
	<title>{content.title} - Museo di Zungri</title>
	<meta
		name="description"
		content="Plan your visit to the Zungri Museum. Find opening hours, ticket prices, location, and accessibility information."
	/>
</svelte:head>

<div class="bg-gray-50">
	<!-- Header Section -->
	<div class="bg-blue-800 text-white">
		<div class="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
			<h1 class="text-4xl font-bold tracking-tight sm:text-5xl">{content.title}</h1>
			<p class="mx-auto mt-4 max-w-2xl text-lg text-blue-200">
				All the information you need for an unforgettable experience at the Zungri Museum.
			</p>
		</div>
	</div>

	<!-- Main Content Grid -->
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-16 lg:grid-cols-3">
			<!-- Left Column: Dynamic Content -->
			<div class="prose prose-lg max-w-none text-gray-700 lg:col-span-2">
				{@html content.content}
			</div>

			<!-- Right Column: Key Information Cards -->
			<aside class="space-y-8">
				<!-- Opening Hours -->
				<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
					<div class="flex items-center space-x-3">
						<Clock class="h-6 w-6 text-blue-600" />
						<h3 class="text-xl font-semibold text-gray-900">Opening Hours</h3>
					</div>
					<ul class="mt-4 space-y-2 text-gray-600">
						<li class="flex justify-between">
							<span>Tuesday - Sunday</span>
							<span class="font-medium">9:00 - 17:00</span>
						</li>
						<li class="flex justify-between">
							<span>Monday</span>
							<span class="font-medium text-red-600">Closed</span>
						</li>
					</ul>
					<p class="mt-2 text-sm text-gray-500">Last admission 30 minutes before closing.</p>
				</div>

				<!-- Ticket Information -->
				<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
					<div class="flex items-center space-x-3">
						<Ticket class="h-6 w-6 text-green-600" />
						<h3 class="text-xl font-semibold text-gray-900">Tickets</h3>
					</div>
					<ul class="mt-4 space-y-2 text-gray-600">
						<li class="flex justify-between">
							<span>Full Price</span>
							<span class="font-medium">€5.00</span>
						</li>
						<li class="flex justify-between">
							<span>Reduced (6-18, 65+)</span>
							<span class="font-medium">€3.00</span>
						</li>
						<li class="flex justify-between">
							<span>Children (under 6)</span>
							<span class="font-medium">Free</span>
						</li>
					</ul>
					<Button href="/book" class="mt-6 w-full">
						Book Tickets Online
						<ArrowRight class="ml-2 h-4 w-4" />
					</Button>
				</div>

				<!-- Group Visits -->
				<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
					<div class="flex items-center space-x-3">
						<Users class="h-6 w-6 text-purple-600" />
						<h3 class="text-xl font-semibold text-gray-900">Group & School Visits</h3>
					</div>
					<p class="mt-4 text-gray-600">
						We offer special rates and guided tours for groups and schools. Please contact us to
						arrange your visit.
					</p>
					<Button href="/contact" variant="outline" class="mt-4 w-full">Contact Us</Button>
				</div>
			</aside>
		</div>
	</div>

	<!-- Map Section -->
	<div class="border-t border-gray-200">
		<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
			<div class="text-center">
				<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
					<MapPin class="h-6 w-6 text-blue-600" />
				</div>
				<h2 class="mt-4 text-3xl font-bold tracking-tight text-gray-900">How to Find Us</h2>
				<p class="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
					We are located in the historic center of Zungri, easily accessible by car.
				</p>
			</div>
			<div class="mt-8 aspect-[16/9] overflow-hidden rounded-lg bg-gray-200 shadow-md">
				<!-- Embedded Google Map -->
				<iframe
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3148.835497985854!2d16.00230131532019!3d38.65999897960786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13151b72b8c0677b%3A0x9d32095f9e944b2c!2sInsediamento%20Rupestre%20e%20Museo%20della%20Civilt%C3%A0%20Rupestre%20e%20Contadina!5e0!3m2!1sen!2sit!4v1678886400000!5m2!1sen!2sit"
					width="100%"
					height="100%"
					style="border:0;"
					allowfullscreen={true}
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
					title="Map showing location of Zungri Museum"
				></iframe>
			</div>
		</div>
	</div>
</div>
