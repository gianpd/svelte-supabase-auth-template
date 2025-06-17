<!--
/**
 * @file Alert.svelte
 * @description A reusable alert component for displaying messages.
 *
 * @props
 * - type (string, default 'info'): The type of alert ('info', 'success', 'warning', 'error').
 * - message (string, required): The message to display in the alert.
 * - class (string, default ''): Additional CSS classes to apply to the alert.
 * - show (boolean, default true): Controls the visibility of the alert.
 *
 * @slots
 * - icon: Optional slot for a custom icon.
 *
 * @notes
 * - Uses Tailwind CSS for styling.
 * - Automatically selects icon and colors based on the type.
 */
-->
<script lang="ts">
	interface $$Props {
		type?: 'info' | 'success' | 'warning' | 'error';
		message: string;
		class?: string;
		show?: boolean;
	}

	let { type = 'info', message, class: customClass = '', show = true }: $$Props = $props();

	const alertStyles = {
		info: {
			bg: 'bg-blue-900 border-blue-700',
			text: 'text-blue-300',
			icon: `M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z` // Heroicon information-circle
		},
		success: {
			bg: 'bg-green-900 border-green-700',
			text: 'text-green-300',
			icon: `M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z` // Heroicon check-circle
		},
		warning: {
			bg: 'bg-yellow-900 border-yellow-700',
			text: 'text-yellow-300',
			icon: `M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z` // Heroicon exclamation
		},
		error: {
			bg: 'bg-red-900 border-red-700',
			text: 'text-red-300',
			icon: `M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z` // Heroicon x-circle
		}
	};

	let currentStyle = $derived(alertStyles[type]);
</script>

{#if show && message}
	<div
		class="mb-4 rounded-md border p-4 {currentStyle.bg} {currentStyle.text} {customClass}"
		role="alert"
	>
		<div class="flex items-center">
			<slot name="icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mr-2 h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d={currentStyle.icon}
					/>
				</svg>
			</slot>
			<span class="font-medium">{message}</span>
		</div>
	</div>
{/if}
