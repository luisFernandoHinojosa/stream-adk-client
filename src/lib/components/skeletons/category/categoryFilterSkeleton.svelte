<!-- CategoryFilterSkeleton.svelte -->
<script lang="ts">
	interface Props {
		itemCount?: number;
	}

	let { itemCount = 6 }: Props = $props();
</script>

<div class="flex animate-pulse flex-wrap items-center gap-2">
	<!-- "Filtrar:" label skeleton -->
	<div class="bg-light-four mr-2 h-4 w-12 rounded"></div>

	<!-- "Todos" button skeleton -->
	<div class="bg-light-four h-7 w-20 rounded-md"></div>

	<!-- Category buttons skeleton with varying widths -->
	{#each Array(itemCount) as _, i}
		<div class="bg-light-four h-7 rounded-md w-{16 + (i % 4) * 4}"></div>
	{/each}

	<!-- Add category button skeleton -->
	<div class="bg-light-four h-7 w-8 rounded-md"></div>
</div>

<style>
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	.w-16 {
		width: 4rem;
	}
	.w-20 {
		width: 5rem;
	}
	.w-24 {
		width: 6rem;
	}
	.w-28 {
		width: 7rem;
	}
</style>
