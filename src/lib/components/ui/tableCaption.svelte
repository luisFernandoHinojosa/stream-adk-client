<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface $$Props extends HTMLAttributes<HTMLTableCaptionElement> {
		class?: string;
	}

	let className = '';
	export { className as class };
</script>

<caption class="text-muted foreground mt-4 text-sm {className}" {...$$restProps}>
	<slot />
</caption>
