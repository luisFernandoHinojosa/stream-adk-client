<script lang="ts">
	import type { HTMLTdAttributes } from 'svelte/elements';

	interface $$Props extends HTMLTdAttributes {
		class?: string;
	}

	let className = '';
	export { className as class };
</script>

<td
	class="border-b p-4 align-middle [&:has([role=checkbox])]:pr-0 [:last-child_>_&]:border-b-0 {className}"
	{...$$restProps}
>
	<slot />
</td>
