<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface $$Props extends HTMLAttributes<HTMLTableSectionElement> {
		class?: string;
	}

	let className = '';
	export { className as class };
</script>

<tfoot class="bg-muted/50 border-t font-medium [&>tr]:last:border-b-0 {className}" {...$$restProps}>
	<slot />
</tfoot>
