<script lang="ts">
	/**
	 * @file +page.svelte (Contact Page)
	 * @description Contact page for the Zungri Museum. Includes contact details,
	 * an interactive map, and a contact form handled by SvelteKit Superforms.
	 *
	 * @dependencies
	 * - sveltekit-superforms: For form handling and validation.
	 * - ./$types: For PageData type.
	 * - ./schema: Zod schema for the form.
	 * - $lib/components/ui/*: Reusable UI components.
	 * - lucide-svelte: For icons.
	 */
	import type { PageData } from './$types';
	import { formSchema } from './schema';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Mail, MapPin, Phone, Send } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		taintedMessage: null,
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				form.reset();
			}
		}
	});

	const { form: formData, errors, submitting, enhance, message: messageStore } = form;

	let isSuccessMessage = $derived($messageStore && !$messageStore.toLowerCase().includes('error'));
</script>

<svelte:head>
	<title>Contact Us - Zungri Museum</title>
	<meta
		name="description"
		content="Get in touch with the Zungri Museum. Find our address, phone number, email, and send us a message through our contact form."
	/>
</svelte:head>

<div class="bg-gray-900 text-white">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
		<div class="text-center">
			<h1 class="text-4xl font-bold tracking-tight sm:text-5xl">Get in Touch</h1>
			<p class="mt-4 text-lg text-gray-300">
				We'd love to hear from you. Whether you have a question about our collections, tickets, or
				anything else, our team is ready to answer all your questions.
			</p>
		</div>
		<div class="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3">
			<!-- Contact Information -->
			<div class="space-y-8">
				<div class="flex items-start space-x-4">
					<div class="flex-shrink-0">
						<div class="flex h-12 w-12 items-center justify-center rounded-md bg-blue-600">
							<MapPin class="h-6 w-6 text-white" />
						</div>
					</div>
					<div>
						<h3 class="text-lg font-semibold">Our Address</h3>
						<p class="mt-1 text-gray-400">
							Via Roma, 123<br />
							89020 Zungri (VV), Calabria, Italia
						</p>
					</div>
				</div>
				<div class="flex items-start space-x-4">
					<div class="flex-shrink-0">
						<div class="flex h-12 w-12 items-center justify-center rounded-md bg-blue-600">
							<Phone class="h-6 w-6 text-white" />
						</div>
					</div>
					<div>
						<h3 class="text-lg font-semibold">Call Us</h3>
						<a href="tel:+390963123456" class="mt-1 text-gray-400 hover:text-blue-400"
							>+39 0963 123456</a
						>
					</div>
				</div>
				<div class="flex items-start space-x-4">
					<div class="flex-shrink-0">
						<div class="flex h-12 w-12 items-center justify-center rounded-md bg-blue-600">
							<Mail class="h-6 w-6 text-white" />
						</div>
					</div>
					<div>
						<h3 class="text-lg font-semibold">Email Us</h3>
						<a href="mailto:info@museozungri.it" class="mt-1 text-gray-400 hover:text-blue-400"
							>info@museozungri.it</a
						>
					</div>
				</div>
			</div>

			<!-- Contact Form -->
			<div class="lg:col-span-2">
				<div class="rounded-lg bg-gray-800 p-8 shadow-lg">
					<h2 class="text-2xl font-bold">Send us a message</h2>
					<form method="POST" use:enhance class="mt-6 space-y-6">
						{#if $messageStore}
							<Alert type={isSuccessMessage ? 'success' : 'error'} message={$messageStore} />
						{/if}

						<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<Input
								id="name"
								name="name"
								label="Full Name"
								placeholder="Your Name"
								required
								bind:value={$formData.name}
								disabled={$submitting}
								inputClass={$errors.name ? 'border-red-500' : ''}
							/>
							<Input
								type="email"
								id="email"
								name="email"
								label="Email Address"
								placeholder="you@example.com"
								required
								bind:value={$formData.email}
								disabled={$submitting}
								inputClass={$errors.email ? 'border-red-500' : ''}
							/>
						</div>

						<Input
							id="subject"
							name="subject"
							label="Subject"
							placeholder="e.g., Question about tickets"
							required
							bind:value={$formData.subject}
							disabled={$submitting}
							inputClass={$errors.subject ? 'border-red-500' : ''}
						/>

						<div>
							<label for="message" class="mb-1 block text-sm font-medium text-gray-300"
								>Message</label
							>
							<textarea
								id="message"
								name="message"
								rows="4"
								placeholder="Your message..."
								required
								bind:value={$formData.message}
								disabled={$submitting}
								class="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 {$errors.message
									? 'border-red-500'
									: ''}"
							></textarea>
						</div>

						<div class="text-right">
							<Button
								type="submit"
								loading={$submitting}
								disabled={$submitting}
								class="min-w-[150px]"
							>
								{#if !$submitting}
									<Send class="mr-2 h-4 w-4" />
								{/if}
								Send Message
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
