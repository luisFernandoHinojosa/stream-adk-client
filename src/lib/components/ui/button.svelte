<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		type?: 'button' | 'submit' | 'reset';
		variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link' | 'outline';
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		disabled?: boolean;
		fullWidth?: boolean;
		ariaLabel?: string | undefined;
		className?: string;
		onclick?: () => void;
		iconLeft?: Snippet | null;
		iconRight?: Snippet | null;
		loading?: boolean;
		children: Snippet;
		rounded?: boolean;
		badge?: string | number | null;
		badgeColor?: 'red' | 'green' | 'blue' | 'yellow' | 'gray';
	}

	let {
		children,
		type = 'button',
		variant = 'primary',
		size = 'md',
		disabled = false,
		fullWidth = false,
		ariaLabel,
		className = '',
		onclick,
		iconLeft = null,
		iconRight = null,
		loading = false,
		rounded = false,
		badge = null,
		badgeColor = 'red'
	}: Props = $props();

	// Base classes
	let base =
		'inline-flex items-center justify-center font-medium transition ease-in-out duration-150 group cursor-pointer';

	// Variant classes
	let variants = {
		primary:
			'bg-light-two dark:bg-dark-two text-light-one hover:bg-light-two_d dark:hover:bg-dark-two_d shadow-sm',
		secondary:
			'bg-light-one dark:bg-dark-one text-light-two focus:ring-light-two border border-light-four hover:border-light-four_d shadow-sm flex items-center',
		danger:
			'bg-light-three dark:bg-dark-three text-light-one hover:bg-light-three_d dark:hover:bg-dark-three_d focus:ring-light-three shadow-sm',
		ghost:
			'text-light-three dark:text-dark-three hover:text-light-three_d dark:hover:text-dark-three_d',
		link: 'bg-transparent text-light-two dark:text-dark-two hover:text-light-two_d dark:hover:text-dark-two_d shadow-none px-0',
		outline:
			'bg-transparent text-light-two dark:text-dark-two hover:bg-light-two_d dark:hover:bg-dark-two_d focus:ring-light-two border border-light-two'
	};

	// Size classes
	const sizes = {
		xs: 'px-2 py-1 text-xs',
		sm: 'px-3 py-1.5 text-xs',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base',
		xl: 'px-8 py-4 text-lg'
	};

	// Icon spacing
	let iconSpacing = {
		xs: 'space-x-1',
		sm: 'space-x-1.5',
		md: 'space-x-2',
		lg: 'space-x-2.5',
		xl: 'space-x-3'
	};

	// Radius classes
	const radiusClass = rounded ? 'rounded-full' : 'rounded-md';

	// Disabled classes
	const disabledClasses = 'opacity-50 cursor-not-allowed';

	// Width class
	const widthClass = fullWidth ? 'w-full' : '';

	// Badge colors
	const badgeColors = {
		red: 'bg-red-500 text-white',
		green: 'bg-green-500 text-white',
		blue: 'bg-blue-500 text-white',
		yellow: 'bg-yellow-500 text-white',
		gray: 'bg-gray-500 text-white'
	};

	// Loading spinner styles
	const spinnerClass: string = 'animate-spin -ml-1 mr-2 h-4 w-4 text-white';

	// Compute final classes
	let buttonClasses: string = $state('');

	$effect(() => {
		buttonClasses = [
			base,
			variants[variant],
			sizes[size],
			iconLeft || iconRight ? iconSpacing[size] : '',
			radiusClass,
			widthClass,
			disabled || loading ? disabledClasses : '',
			className
		].join(' ');
	});
</script>

<button
	{type}
	class={buttonClasses}
	disabled={disabled || loading}
	aria-label={ariaLabel}
	aria-busy={loading}
	{onclick}
>
	{#if loading}
		<svg class={spinnerClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
			></circle>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
	{:else if iconLeft}
		<span class="inline-flex items-center">
			{@render iconLeft()}
		</span>
	{/if}

	<span class="flex items-center">
		{@render children()}
	</span>

	{#if iconRight && !loading}
		<span class="inline-flex items-center">
			{@render iconRight()}
		</span>
	{/if}

	{#if badge !== null}
		<span
			class="ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium {badgeColors[
				badgeColor
			]}"
		>
			{badge}
		</span>
	{/if}
</button>
