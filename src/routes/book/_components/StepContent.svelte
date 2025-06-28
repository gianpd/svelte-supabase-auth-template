<!-- src/routes/book/_components/StepContent.svelte -->
<script lang="ts">
	let { step, currentStep }: { step: number; currentStep: number } = $props();
</script>

{#if step === currentStep}
	<div class="step-content">
		<slot />
	</div>
{/if}

<style>
	.step-content {
		animation: fadeIn 0.5s ease-out forwards;
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
