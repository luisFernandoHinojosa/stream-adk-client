<!-- ProductCardSkeleton.svelte -->
<script lang="ts">
	// Skeleton para ProductCard (vista móvil)
</script>

<div
	class="bg-light-one_d grid animate-pulse grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg p-4 shadow"
>
	<!-- Image skeleton -->
	<div class="bg-light-four h-16 w-16 flex-shrink-0 rounded-md"></div>

	<!-- Content skeleton -->
	<div class="min-w-0 flex-1 space-y-2">
		<!-- Product name skeleton (2 lines) -->
		<div class="space-y-1">
			<div class="bg-light-four h-4 w-full rounded"></div>
			<div class="bg-light-four h-4 w-3/4 rounded"></div>
		</div>

		<!-- Category skeleton -->
		<div class="bg-light-four h-3 w-2/3 rounded"></div>

		<!-- Price skeleton -->
		<div class="bg-light-four h-4 w-20 rounded"></div>
	</div>

	<!-- Actions skeleton -->
	<div class="relative flex items-start justify-end">
		<div class="bg-light-four h-5 w-5 rounded"></div>
	</div>
</div>
