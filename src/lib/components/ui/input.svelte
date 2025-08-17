<script lang="ts">
	//input.svelte
	interface Props {
		value: string | number | null | undefined;
		label?: string;
		id?: string;
		type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url' | 'textarea';
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string | null;
		rows?: number;
		callback?: (value: string | number | null | undefined) => void;
	}

	let {
		value = $bindable(),
		label = '',
		id,
		type = 'text',
		placeholder = '',
		required = false,
		disabled = false,
		error = null,
		rows = 3,
		callback
	}: Props = $props();
	id = label.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 7);

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement | HTMLTextAreaElement;
		value = target.value;
		callback?.(value);
	}

	const baseInputClasses =
		'block w-full rounded-md border-light-four dark:border-dark-four shadow-sm focus:border-light-four_d dark:focus:border-dark-four_d focus:ring-light-four_d dark:focus:ring-dark-four_d sm:text-sm disabled:cursor-not-allowed disabled:bg-light-one disabled:text-light-four outline outline-1 -outline-offset-1 outline-light-four dark:outline-dark-four placeholder:text-light-four_d focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-light-two dark:focus:outline-dark-two sm:text-sm/6';
	const errorInputClasses = 'border-red-500 focus:border-red-600 focus:ring-red-600';
	const normalInputClasses = 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500';

	let inputClasses = `${baseInputClasses} ${error ? errorInputClasses : normalInputClasses}`;
</script>

<div class="w-full">
	{#if label}
		<label for={id} class="mb-1 block text-sm font-medium text-light-two dark:text-dark-two"
			>{label}</label
		>
	{/if}

	{#if type === 'textarea'}
		<textarea
			{id}
			name={id}
			{placeholder}
			{required}
			{disabled}
			{rows}
			class="{inputClasses} px-3 py-2"
			bind:value
			oninput={handleInput}
			aria-invalid={!!error}
			aria-describedby={error ? `${id}-error` : undefined}
		></textarea>
	{:else}
		<input
			{type}
			{id}
			name={id}
			{placeholder}
			{required}
			{disabled}
			class="{inputClasses} px-3 py-2 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-light-two sm:text-sm/6"
			bind:value
			oninput={handleInput}
			aria-invalid={!!error}
			aria-describedby={error ? `${id}-error` : undefined}
		/>
	{/if}

	{#if error}
		<p id="{id}-error" class="mt-1 text-xs text-red-600">{error}</p>
	{/if}
</div>
