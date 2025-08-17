<script lang="ts">
	interface Props {
		countStoreSkeleton?: number;
	}
	let { countStoreSkeleton = 3 }: Props = $props();
</script>

<div class="animate-pulse space-y-4">
	{#each Array(countStoreSkeleton) as _, i}
		<div
			class="relative flex w-full items-center space-x-4 rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100/50 p-4"
		>
			<!-- Logo skeleton -->
			<div class="flex-shrink-0">
				<div
					class="relative h-14 w-14 overflow-hidden rounded-lg bg-gradient-to-br from-gray-200 to-gray-300"
				>
					<div
						class="animate-shimmer absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
					></div>
				</div>
			</div>

			<!-- Content skeleton -->
			<div class="min-w-0 flex-1 space-y-2">
				<div
					class="relative h-5 w-3/4 overflow-hidden rounded-md bg-gradient-to-r from-gray-200 to-gray-300"
				>
					<div
						class="animate-shimmer absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
						style="animation-delay: {i * 0.2}s"
					></div>
				</div>
				<div
					class="relative h-4 w-full overflow-hidden rounded-md bg-gradient-to-r from-gray-200 to-gray-300"
				>
					<div
						class="animate-shimmer absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
						style="animation-delay: {i * 0.3}s"
					></div>
				</div>
			</div>

			<!-- Selection indicator skeleton -->
			<div class="h-5 w-5 rounded-full bg-gray-200"></div>
		</div>
	{/each}

	<!-- Create button skeleton -->
	<div class="mt-8 border-t border-gray-100 pt-6">
		<div
			class="relative h-12 overflow-hidden rounded-xl bg-gradient-to-r from-gray-200 to-gray-300"
		>
			<div
				class="animate-shimmer absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
			></div>
		</div>
	</div>

	<!-- Continue button skeleton -->
	<div class="pt-4">
		<div
			class="relative h-12 overflow-hidden rounded-xl bg-gradient-to-r from-gray-200 to-gray-300"
		>
			<div
				class="animate-shimmer absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
			></div>
		</div>
	</div>
</div>
