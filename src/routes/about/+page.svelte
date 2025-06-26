<!--
/**
* @file +page.svelte (About Page)
* @description Renders the 'About Us' page for the Zungri Museum, displaying
* content fetched from the backend.
*
* Key features:
* - Displays dynamic title and content.
* - Uses `{@html}` to render HTML content securely fetched from the CMS.
* - Includes SEO metadata via svelte:head.
* - Provides a clean, readable layout for text-heavy content.
*
* @dependencies
* - ./$types: For typing the `data` prop from the load function.
* - lucide-svelte: For icons.
*/
-->

<script lang="ts">
	import { BookOpen, Landmark } from 'lucide-svelte';

	let { data } = $props();
	const { content } = data;
</script>

<svelte:head>
	<title>{content.title} - Museo di Zungri</title>
	<meta
		name="description"
		content="Scopri la storia, la missione e le collezioni del Museo di Zungri. Un viaggio nel cuore della cultura rupestre calabrese."
	/>
</svelte:head>

<div class="bg-gray-50 py-12 sm:py-16">
	<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
		<header class="text-center">
			<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
				<Landmark class="h-8 w-8 text-blue-600" />
			</div>
			<h1 class="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
				{content.title}
			</h1>
			<p class="mt-4 text-lg text-gray-600">
				Un viaggio nella storia e nella cultura del territorio di Zungri.
			</p>
		</header>

		<div class="prose prose-lg mx-auto mt-12 max-w-none text-gray-700">
			<!--
    The `content.content` is rendered using `{@html}`.
    This is safe because the content is managed by trusted administrators
    in the backend CMS. It allows for rich text formatting (bold, italics, lists, etc.)
    to be controlled from the backend.
    Sanitization should be performed on the backend before saving if untrusted
    users can edit content.
  -->
			{@html content.content}
		</div>
	</div>
</div>
