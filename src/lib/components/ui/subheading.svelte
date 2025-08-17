<script lang="ts">
	import type { Snippet } from 'svelte';
	type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	interface Props {
		children: Snippet;
		level: HeadingLevel;
		class?: string;
	}
	let { children, level, class: className }: Props = $props();
</script>

{#if level === 'h1'}
	<h1 class="text-xl/10 font-semibold text-light-two sm:text-lg dark:text-dark-two {className}">
		{@render children()}
	</h1>
{:else if level === 'h2'}
	<h2 class="text-xl/10 font-semibold text-light-two sm:text-lg dark:text-dark-two {className}">
		{@render children()}
	</h2>
{:else if level === 'h3'}
	<h3 class="text-xl/10 font-semibold text-light-two sm:text-lg dark:text-dark-two {className}">
		{@render children()}
	</h3>
{:else if level === 'h4'}
	<h4 class="text-xl/10 font-semibold text-light-two sm:text-lg dark:text-dark-two {className}">
		{@render children()}
	</h4>
{:else if level === 'h5'}
	<h5 class="text-xl/10 font-semibold text-light-two sm:text-lg dark:text-dark-two {className}">
		{@render children()}
	</h5>
{:else if level === 'h6'}
	<h6 class="text-xl/10 font-semibold text-light-two sm:text-lg dark:text-dark-two {className}">
		{@render children()}
	</h6>
{/if}
