<script lang="ts">
	import { User } from 'lucide-svelte';
	import { customerInfo, validationErrors } from '$lib/stores/bookingStore';
</script>

<div class="customer-form-card">
	<header class="card-header">
		<User class="icon-primary" />
		<h3>Your Information</h3>
	</header>
	<p class="card-description">Please provide your contact details for the booking confirmation.</p>

	<div class="form-fields">
		<!-- Name Field -->
		<div class="form-field">
			<label for="customer-name">Full Name *</label>
			<input
				id="customer-name"
				type="text"
				placeholder="Enter your full name"
				bind:value={$customerInfo.name}
				class:invalid={$validationErrors.name}
				required
				aria-invalid={$validationErrors.name ? 'true' : 'false'}
				aria-describedby="name-error"
			/>
			{#if $validationErrors.name}
				<p id="name-error" class="error-text">{$validationErrors.name}</p>
			{/if}
		</div>

		<!-- Email Field -->
		<div class="form-field">
			<label for="customer-email">Email Address *</label>
			<input
				id="customer-email"
				type="email"
				placeholder="Enter your email address"
				bind:value={$customerInfo.email}
				class:invalid={$validationErrors.email}
				required
				aria-invalid={$validationErrors.email ? 'true' : 'false'}
				aria-describedby="email-error"
			/>
			{#if $validationErrors.email}
				<p id="email-error" class="error-text">{$validationErrors.email}</p>
			{:else}
				<p class="help-text">We'll send your e-tickets to this email address.</p>
			{/if}
		</div>
	</div>
</div>

<style>
	/* --- FORMS --- */
	.customer-form-card {
		background-color: var(--card);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 1.5rem;
	}
	.card-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}
	.card-header h3 {
		font-size: 1.125rem;
		font-weight: 600;
	}
	.card-description {
		font-size: 0.875rem;
		color: var(--muted-foreground);
		margin-bottom: 1.5rem;
	}
	.form-fields {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.form-field label {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		margin-bottom: 0.25rem;
	}
	.form-field input {
		width: 100%;
		padding: 0.5rem 0.75rem;
		border-radius: var(--radius);
		border: 1px solid var(--input);
		background-color: var(--background);
		transition: all 0.2s ease-in-out;
	}
	.form-field input:focus {
		outline: 2px solid var(--ring);
		outline-offset: 2px;
		border-color: var(--ring);
	}
	.form-field input.invalid {
		border-color: var(--destructive);
	}
	.form-field input.invalid:focus {
		outline-color: var(--destructive);
	}
	.error-text {
		font-size: 0.75rem;
		color: var(--destructive);
		margin-top: 0.25rem;
	}
	.help-text {
		font-size: 0.75rem;
		color: var(--muted-foreground);
		margin-top: 0.25rem;
	}
	.icon-primary {
		color: var(--primary);
		width: 1.25rem;
		height: 1.25rem;
	}
</style>
