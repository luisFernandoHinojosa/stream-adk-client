<!-- TableHeader.svelte -->
<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface $$Props extends HTMLAttributes<HTMLTableSectionElement> {
		class?: string;
	}

	let className = '';
	export { className as class };
</script>

<thead class="[&_tr]:border-b {className}" {...$$restProps}>
	<slot />
</thead>
