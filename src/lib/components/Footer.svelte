<!--
/**
 * @file Footer.svelte
 * @description Footer component for the Zungri Museum website.
 * Contains museum contact information, navigation links, social media,
 * and legal information.
 *
 * Key features:
 * - Museum contact information and location
 * - Quick navigation links
 * - Social media links
 * - Legal and policy links
 * - Responsive design with proper spacing
 * - Multilingual support
 *
 * @dependencies
 * - $lib/paraglide/messages: Internationalization messages
 * - lucide-svelte: Icons for contact info and social media
 *
 * @notes
 * - Uses Tailwind CSS for responsive layout
 * - Implements structured contact information
 * - Includes accessibility considerations
 */
-->
<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-svelte';

	// Quick navigation links
	const quickLinks = [
		{ href: '/', label: m.navigation_home },
		{ href: '/about', label: m.navigation_about },
		{ href: '/plan-your-visit', label: m.navigation_visit },
		{ href: '/exhibitions', label: m.navigation_exhibitions },
		{ href: '/contact', label: m.navigation_contact }
	];

	// Legal and policy links
	const legalLinks = [
		{ href: '/privacy', label: m.footer_privacy },
		{ href: '/terms', label: m.footer_terms }
	];

	// Social media links
	const socialLinks = [
		{
			href: 'https://facebook.com/museozungri',
			label: 'Facebook',
			icon: Facebook,
			ariaLabel: 'Visit our Facebook page'
		},
		{
			href: 'https://instagram.com/museozungri',
			label: 'Instagram',
			icon: Instagram,
			ariaLabel: 'Visit our Instagram page'
		},
		{
			href: 'https://twitter.com/museozungri',
			label: 'Twitter',
			icon: Twitter,
			ariaLabel: 'Visit our Twitter page'
		}
	];

	// Museum contact information
	const contactInfo = {
		address: 'Via Roma, 123\n89020 Zungri (VV)\nCalabria, Italia',
		phone: '+39 0963 123456',
		email: 'info@museozungri.it',
		hours: {
			weekdays: '9:00 - 17:00',
			weekends: '10:00 - 18:00',
			closed: 'Lunedì / Monday / Montag'
		}
	};
</script>

<footer class="bg-gray-900 text-white">
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<!-- Main Footer Content -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
			<!-- Museum Information -->
			<div class="lg:col-span-1">
				<div class="flex items-center space-x-3 text-blue-400">
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900">
						<svg
							class="h-6 w-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
							/>
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-bold">Museo di Zungri</h3>
						<p class="text-sm text-gray-400">Calabria, Italia</p>
					</div>
				</div>
				<p class="mt-4 text-sm text-gray-300">
					{m.museum_welcomeSubtitle()}
				</p>

				<!-- Social Media Links -->
				<div class="mt-6">
					<h4 class="text-sm font-semibold text-gray-200">{m.footer_followUs()}</h4>
					<div class="mt-2 flex space-x-3">
						{#each socialLinks as social}
							<a
								href={social.href}
								class="text-gray-400 transition-colors duration-200 hover:text-blue-400"
								aria-label={social.ariaLabel}
								target="_blank"
								rel="noopener noreferrer"
							>
								<svelte:component this={social.icon} class="h-5 w-5" />
							</a>
						{/each}
					</div>
				</div>
			</div>

			<!-- Contact Information -->
			<div>
				<h3 class="text-lg font-semibold text-white">{m.contact_getInTouch()}</h3>
				<div class="mt-4 space-y-3">
					<!-- Address -->
					<div class="flex items-start space-x-3">
						<MapPin class="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400" />
						<div>
							<h4 class="text-sm font-medium text-gray-200">{m.contact_address()}</h4>
							<p class="mt-1 whitespace-pre-line text-sm text-gray-400">
								{contactInfo.address}
							</p>
						</div>
					</div>

					<!-- Phone -->
					<div class="flex items-center space-x-3">
						<Phone class="h-5 w-5 flex-shrink-0 text-blue-400" />
						<div>
							<h4 class="text-sm font-medium text-gray-200">{m.contact_phone()}</h4>
							<a
								href="tel:{contactInfo.phone}"
								class="mt-1 text-sm text-gray-400 hover:text-blue-400"
							>
								{contactInfo.phone}
							</a>
						</div>
					</div>

					<!-- Email -->
					<div class="flex items-center space-x-3">
						<Mail class="h-5 w-5 flex-shrink-0 text-blue-400" />
						<div>
							<h4 class="text-sm font-medium text-gray-200">{m.contact_email()}</h4>
							<a
								href="mailto:{contactInfo.email}"
								class="mt-1 text-sm text-gray-400 hover:text-blue-400"
							>
								{contactInfo.email}
							</a>
						</div>
					</div>
				</div>
			</div>

			<!-- Opening Hours -->
			<div>
				<h3 class="text-lg font-semibold text-white">{m.museum_openingHours()}</h3>
				<div class="mt-4 space-y-2">
					<div class="flex items-center space-x-3">
						<Clock class="h-5 w-5 flex-shrink-0 text-blue-400" />
						<div>
							<div class="text-sm text-gray-300">
								<p class="font-medium">Mar - Dom</p>
								<p class="text-gray-400">{contactInfo.hours.weekdays}</p>
							</div>
						</div>
					</div>
					<div class="ml-8">
						<p class="text-sm text-gray-300">
							<span class="font-medium">Sab - Dom:</span>
							<span class="text-gray-400">{contactInfo.hours.weekends}</span>
						</p>
						<p class="text-sm text-red-400">
							<span class="font-medium">Chiuso:</span>
							{contactInfo.hours.closed}
						</p>
					</div>
				</div>
			</div>

			<!-- Quick Links -->
			<div>
				<h3 class="text-lg font-semibold text-white">Link Rapidi</h3>
				<div class="mt-4">
					<ul class="space-y-2">
						{#each quickLinks as link}
							<li>
								<a
									href={link.href}
									class="text-sm text-gray-400 transition-colors duration-200 hover:text-blue-400"
								>
									{link.label()}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<!-- Newsletter Signup -->
				<div class="mt-6">
					<h4 class="text-sm font-semibold text-gray-200">{m.footer_newsletter()}</h4>
					<p class="mt-2 text-xs text-gray-400">
						Ricevi aggiornamenti su mostre ed eventi del museo.
					</p>
					<div class="mt-3 flex">
						<input
							type="email"
							placeholder="La tua email"
							class="flex-grow rounded-l-md border-0 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
						/>
						<button
							type="button"
							class="rounded-r-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							Iscriviti
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Footer Bottom -->
		<div class="mt-12 border-t border-gray-800 pt-8">
			<div class="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
				<!-- Copyright -->
				<div class="text-center text-sm text-gray-400 md:text-left">
					<p>{m.footer_copyright()}</p>
				</div>

				<!-- Legal Links -->
				<div class="flex space-x-6">
					{#each legalLinks as link}
						<a
							href={link.href}
							class="text-sm text-gray-400 transition-colors duration-200 hover:text-blue-400"
						>
							{link.label()}
						</a>
					{/each}
				</div>

				<!-- Support Information -->
				<div class="text-center text-xs text-gray-500 md:text-right">
					<p>{m.footer_supportedBy()}</p>
					<p>Regione Calabria • Comune di Zungri</p>
				</div>
			</div>
		</div>
	</div>
</footer>
