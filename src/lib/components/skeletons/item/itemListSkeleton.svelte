<!-- ProductListSkeleton.svelte -->
<script lang="ts">
	interface Props {
		viewMode?: 'grid' | 'list';
		itemCount?: number;
	}

	let { viewMode = 'grid', itemCount = 8 }: Props = $props();
</script>

<div class="w-full animate-pulse">
	<!-- Header skeleton -->

	<!-- Content skeleton based on view mode -->
	{#if viewMode === 'grid'}
		<!-- Grid view skeleton -->
		<div class="grid grid-cols-1 gap-4 p-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each Array(itemCount) as _, index}
				<div class="bg-light-one border-light-four rounded-lg border">
					<!-- Image skeleton -->
					<div class="bg-light-four aspect-square rounded-t-lg"></div>
					<!-- Content skeleton -->
					<div class="space-y-3 p-4">
						<!-- Title skeleton -->
						<div class="bg-light-four h-4 w-3/4 rounded"></div>
						<!-- Description skeleton -->
						<div class="space-y-2">
							<div class="bg-light-four h-3 w-full rounded"></div>
							<div class="bg-light-four h-3 w-2/3 rounded"></div>
						</div>
						<!-- Price and status skeleton -->
						<div class="flex items-center justify-between">
							<div class="bg-light-four h-4 w-16 rounded"></div>
							<div class="bg-light-four h-5 w-12 rounded-full"></div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- List view skeleton -->
		<div class="hidden overflow-hidden rounded-lg shadow md:block">
			<table class="w-full table-auto">
				<thead class="bg-light-one_d">
					<tr>
						<th class="px-4 py-3">
							<div class="bg-light-four h-3 w-16 rounded"></div>
						</th>
						<th class="px-4 py-3">
							<div class="bg-light-four h-3 w-20 rounded"></div>
						</th>
						<th class="px-4 py-3">
							<div class="bg-light-four h-3 w-12 rounded"></div>
						</th>
						<th class="px-4 py-3">
							<div class="bg-light-four h-3 w-16 rounded"></div>
						</th>
					</tr>
				</thead>
				<tbody class="divide-light-one_d divide-y-2">
					{#each Array(itemCount) as _, index}
						<tr>
							<td class="px-4 py-4">
								<div class="flex items-center space-x-3">
									<!-- Product image skeleton -->
									<div class="bg-light-four h-12 w-12 rounded-md"></div>
									<div class="space-y-2">
										<!-- Product name skeleton -->
										<div class="bg-light-four h-4 w-32 rounded"></div>
										<!-- Product description skeleton -->
										<div class="bg-light-four h-3 w-48 rounded"></div>
									</div>
								</div>
							</td>
							<td class="px-4 py-4">
								<!-- Category skeleton -->
								<div class="bg-light-four h-3 w-20 rounded"></div>
							</td>
							<td class="px-4 py-4">
								<!-- Price skeleton -->
								<div class="bg-light-four h-4 w-16 rounded"></div>
							</td>
							<td class="px-4 py-4">
								<div class="flex items-center space-x-2">
									<!-- Action buttons skeleton -->
									<div class="bg-light-four h-8 w-8 rounded"></div>
									<div class="bg-light-four h-8 w-8 rounded"></div>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Mobile list view skeleton -->
		<div class="mt-4 space-y-4 md:hidden">
			{#each Array(itemCount) as _, index}
				<div class="bg-light-one border-light-four rounded-lg border p-4">
					<div class="flex items-start space-x-3">
						<!-- Mobile product image skeleton -->
						<div class="bg-light-four h-16 w-16 flex-shrink-0 rounded-md"></div>
						<div class="flex-1 space-y-3">
							<!-- Mobile product info skeleton -->
							<div class="space-y-2">
								<div class="bg-light-four h-4 w-3/4 rounded"></div>
								<div class="bg-light-four h-3 w-full rounded"></div>
								<div class="bg-light-four h-3 w-2/3 rounded"></div>
							</div>
							<!-- Mobile price and actions skeleton -->
							<div class="flex items-center justify-between">
								<div class="bg-light-four h-4 w-16 rounded"></div>
								<div class="bg-light-four h-8 w-8 rounded"></div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
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

	/* Tailwind classes for dynamic widths in skeleton */
	.w-16 {
		width: 4rem;
	}
	.w-18 {
		width: 4.5rem;
	}
	.w-20 {
		width: 5rem;
	}
	.w-22 {
		width: 5.5rem;
	}
	.w-24 {
		width: 6rem;
	}
</style>
