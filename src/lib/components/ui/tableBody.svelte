<!-- TableBody.svelte -->
<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface $$Props extends HTMLAttributes<HTMLTableSectionElement> {
		class?: string;
	}

	let className = '';
	export { className as class };
</script>

<tbody class="text-xs [&_tr:last-child]:border-0 {className}" {...$$restProps}>
	<slot />
</tbody>
