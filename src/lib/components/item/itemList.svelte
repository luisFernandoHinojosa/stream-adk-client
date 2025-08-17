<!-- <script lang="ts">
	import type { ItemResponse } from '$lib/interface/item.interface';
	import ItemCardPreview from './itemCardPreview.svelte';

	interface Props {
		products: ItemResponse[];
		designCardType: number;
		class?: string;
	}

	let { products, designCardType, class: className }: Props = $props();
</script>

<div class="space-y-4">
	{#if products.length > 0}
		<div class="{className} [&>div]:mx-auto">
			{#each products as product (product.item_id)}
				<ProductCardPreview {product} {designCardType} />
			{/each}
		</div>
	{:else}
		<p class="text-center text-light-two py-6">No tienes productos agregados.</p>
	{/if}
</div> -->
