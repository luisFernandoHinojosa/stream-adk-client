<!-- ProductCardTableSkeleton.svelte -->
<script lang="ts">
	// Skeleton para ProductCardTable (fila de tabla)
</script>

<tr class="hover:bg-light-one_d animate-pulse transition-colors">
	<td class="px-4 py-4">
		<div class="flex items-center">
			<!-- Image skeleton -->
			<div class="bg-light-four h-10 w-10 flex-shrink-0 rounded-md"></div>
			<div class="ml-4">
				<!-- Product name skeleton -->
				<div class="bg-light-four h-4 w-32 rounded"></div>
			</div>
		</div>
	</td>
	<td class="px-4 py-4">
		<div class="flex gap-2">
			<!-- Category skeleton -->
			<div class="bg-light-four h-3 w-20 rounded"></div>
			<!-- Additional categories indicator skeleton -->
			<div class="bg-light-four h-3 w-4 rounded"></div>
		</div>
	</td>
	<td class="px-4 py-4">
		<!-- Price skeleton -->
		<div class="bg-light-four h-4 w-24 rounded"></div>
	</td>
	<td class="px-4">
		<div class="relative h-fit w-fit">
			<!-- Dots menu skeleton -->
			<div class="bg-light-four h-5 w-5 rounded"></div>
		</div>
	</td>
</tr>
