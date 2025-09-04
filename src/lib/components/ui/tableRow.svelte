<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface $$Props extends HTMLAttributes<HTMLTableRowElement> {
		class?: string;
	}

	let className = '';
	export { className as class };
</script>

<tr
	class="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors {className}"
	{...$$restProps}
>
	<slot />
</tr>
