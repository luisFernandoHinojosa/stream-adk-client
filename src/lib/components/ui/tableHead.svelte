<script lang="ts">
	import type { HTMLThAttributes } from 'svelte/elements';

	interface $$Props extends HTMLThAttributes {
		class?: string;
	}

	let className = '';
	export { className as class };
</script>

<th
	class="bg-background text-muted-foreground relative h-10 border-b px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0 {className}"
	{...$$restProps}
>
	<slot />
</th>
