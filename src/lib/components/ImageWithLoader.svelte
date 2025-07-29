<script lang="ts">
	import { ImageOff } from 'lucide-svelte';

	type Props = {
		src: string;
		alt: string;
		containerClass?: string;
		class?: string;
		loading?: 'lazy' | 'eager';
		errorText?: string;
		errorTextSmall?: string;
	};

	let {
		src,
		alt,
		containerClass = 'relative w-full h-full',
		class: imageClass = 'w-full h-full object-cover',
		loading = 'lazy',
		errorText = 'Image not available',
		errorTextSmall
	}: Props = $props();

	let loaded = $state(false);
	let error = $state(false);

	function handleLoad() {
		loaded = true;
		error = false;
	}

	function handleError() {
		loaded = true; // The loading process is complete, even if it's an error
		error = true;
	}
</script>

<div class={containerClass}>
	{#if !loaded}
		<div class="absolute inset-0 flex items-center justify-center bg-neutral-100">
			<div
				class="border-primary-600 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
				role="status"
				aria-label="Loading image..."
			></div>
		</div>
	{/if}

	{#if error}
		<div
			class="absolute inset-0 flex flex-col items-center justify-center bg-neutral-100 text-neutral-500"
		>
			<ImageOff class={errorTextSmall ? 'mb-1 h-6 w-6' : 'mb-2 h-8 w-8'} />
			<span class={errorTextSmall ? 'text-xs' : 'text-sm'}>
				{errorTextSmall || errorText}
			</span>
		</div>
	{:else}
		<img
			{src}
			{alt}
			{loading}
			class="{imageClass} transition-opacity duration-500 {loaded ? 'opacity-100' : 'opacity-0'}"
			onload={handleLoad}
			onerror={handleError}
		/>
	{/if}
</div>
