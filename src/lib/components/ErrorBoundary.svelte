<!-- File: frontend/src/lib/components/ErrorBoundary.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	let hasError = $state(false);
	let errorMessage = $state('');

	function handleError(event: ErrorEvent) {
		hasError = true;
		errorMessage = event.error?.message || 'Si è verificato un errore imprevisto';
		console.error('Error caught by boundary:', event.error);
	}

	function retry() {
		hasError = false;
		errorMessage = '';
		window.location.reload();
	}

	onMount(() => {
		window.addEventListener('error', handleError);
		return () => window.removeEventListener('error', handleError);
	});
</script>

{#if hasError}
	<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
		<div class="max-w-md text-center">
			<div class="mb-4">
				<svg
					class="mx-auto h-12 w-12 text-red-500"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>
			<h1 class="mb-2 text-2xl font-bold text-gray-900">Qualcosa è andato storto</h1>
			<p class="mb-6 text-gray-600">{errorMessage}</p>
			<button
				on:click={retry}
				class="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				Riprova
			</button>
		</div>
	</div>
{:else}
	<slot />
{/if}
