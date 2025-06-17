<!--
  /**
   * @file Input.svelte
   * @description A reusable input component for forms.
   *
   * @props
   * - type (string, default 'text'): The type of the input (e.g., 'text', 'email', 'password').
   * - id (string, required): The ID of the input, used for associating with a label.
   * - name (string, optional): The name of the input, useful for form submission. Defaults to id if not provided.
   * - label (string, optional): The label text to display for the input.
   * - placeholder (string, default ''): The placeholder text for the input.
   * - value (string, default '', bindable): The current value of the input. Two-way bindable using `bind:value`.
   * - required (boolean, default false): Whether the input is required.
   * - disabled (boolean, default false): Whether the input is disabled.
   * - class (string, default ''): Additional CSS classes to apply to the input wrapper.
   * - inputClass (string, default ''): Additional CSS classes to apply directly to the input element.
   * - labelClass (string, default ''): Additional CSS classes to apply directly to the label element.
   *
   * @events
   * - input: Fired when the input value changes. The event detail contains the new value.
   * - change: Fired when the input value changes and the element loses focus.
   * - blur: Fired when the input loses focus.
   * - focus: Fired when the input gains focus.
   *
   * @notes
   * - Uses Tailwind CSS for styling.
   * - Supports Svelte 5 runes for two-way binding with `bind:value`.
   * - The `value` prop is made bindable using `$bindable()`.
   */
  -->
<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface $$Props extends Omit<HTMLInputAttributes, 'value'> {
		// Omit original value from HTMLInputAttributes
		type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
		id: string;
		name?: string;
		label?: string;
		placeholder?: string;
		value?: string; // This will be the prop passed in for binding
		required?: boolean;
		disabled?: boolean;
		class?: string; // For the wrapper div
		inputClass?: string;
		labelClass?: string;
	}

	let {
		type = 'text',
		id,
		name = id,
		label = '',
		placeholder = '',
		value: initialValue = $bindable(''), // Use $bindable() for the prop intended for two-way binding
		required = false,
		disabled = false,
		class: wrapperClass = '',
		inputClass = '',
		labelClass = '',
		...restProps
	}: $$Props = $props();

	// The `initialValue` prop, which is now bindable, will automatically update
	// when `bind:value` is used on the component instance.
	// No need for an internal $state variable for `value` that mirrors the prop if using $bindable directly with the prop name.
	// The `value` in `<input bind:value... />` will now directly bind to the `initialValue` prop.
</script>

<div class="mb-4 {wrapperClass}">
	{#if label}
		<label for={id} class="mb-1 block text-sm font-medium text-gray-300 {labelClass}">
			{label}
			{#if required}<span class="text-red-500">*</span>{/if}
		</label>
	{/if}
	<input
		{type}
		{id}
		{name}
		{placeholder}
		bind:value={initialValue}
		{required}
		{disabled}
		class="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none {inputClass}"
		on:input
		on:change
		on:blur
		on:focus
		on:keydown
		on:keyup
		on:keypress
		{...restProps}
	/>
</div>
