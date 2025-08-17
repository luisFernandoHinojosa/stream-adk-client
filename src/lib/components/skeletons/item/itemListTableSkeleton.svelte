<!-- ProductListTableSkeleton.svelte (Actualizado para usar los skeletons individuales) -->
<script lang="ts">
	import ItemCardSkeleton from './itemCardSkeleton.svelte';
	import ItemCardTableSkeleton from './itemCardTableSkeleton.svelte';

	interface Props {
		itemCount?: number;
	}

	let { itemCount = 6 }: Props = $props();
</script>

<!-- Desktop table skeleton -->
<div class="hidden overflow-hidden rounded-lg shadow md:block">
	<table class="w-full table-auto">
		<thead class="bg-light-one_d text-light-two">
			<tr>
				<th class="px-4 py-3 text-left">
					<div class="bg-light-four h-3 w-16 animate-pulse rounded"></div>
				</th>
				<th class="px-4 py-3 text-left">
					<div class="bg-light-four h-3 w-20 animate-pulse rounded"></div>
				</th>
				<th class="px-4 py-3 text-left">
					<div class="bg-light-four h-3 w-12 animate-pulse rounded"></div>
				</th>
				<th class="px-4 py-3 text-left">
					<div class="bg-light-four h-3 w-16 animate-pulse rounded"></div>
				</th>
			</tr>
		</thead>
		<tbody class="divide-light-one_d divide-y-2">
			{#each Array(itemCount) as _, index}
				<ItemCardTableSkeleton />
			{/each}
		</tbody>
	</table>
</div>

<!-- Mobile cards skeleton -->
<div class="mt-4 space-y-4 md:hidden">
	{#each Array(itemCount) as _, index}
		<ItemCardSkeleton />
	{/each}
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
</style>
