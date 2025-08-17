<script lang="ts">
	// productListTable.svelte
	import type { CategoryResponse } from '$lib/interface/category.interface';
	import type { ItemResponse } from '$lib/interface/item.interface'; // O la interfaz Product si filteredProducts es de ese tipo
	import ItemCardTable from './itemCardTable.svelte';
	import DotsVerticalIcon from '$lib/icons/outline/dotsVerticalIcon.svelte'; // Para el menú de opciones en móvil
	import ItemCard from './itemCard.svelte';

	interface Props {
		listProducts: ItemResponse[]; // Recibe los productos ya filtrados
		listCategories: CategoryResponse[]; // Para pasar a ProductCardTable o usar en la vista móvil
		onProductChange: (product: ItemResponse) => void;
		onDeleteProduct: (item_id: number, callback: () => void) => void;
	}
	let { listProducts, listCategories, onProductChange, onDeleteProduct }: Props = $props();

	// Funciones de edición/eliminación para la vista móvil (ejemplos)
	// En una app real, estas emitirían eventos al padre o llamarían a un servicio/store.
	function handleMobileEdit(product: ItemResponse) {
		console.log('Edit product (mobile):', product.item_name);
		// Ejemplo: dispatch('editProduct', product.item_id);
	}

	function handleMobileDelete(product: ItemResponse) {
		console.log('Delete product (mobile):', product.item_name);
		// Ejemplo: dispatch('deleteProduct', product.item_id);
	}

	// Función para obtener el nombre de una categoría (si es necesario para la vista móvil)
	function getCategoryNameById(categoryId: number): string {
		const category = listCategories.find((cat) => cat.category_id === categoryId);
		return category ? category.category_name : 'Desconocida';
	}

	function setSelectProduct(product: ItemResponse): void {
		onProductChange(product);
	}
	console.log(listProducts);
</script>

<div class="hidden rounded-lg shadow md:block">
	<table class="w-full table-auto">
		<thead class="bg-light-one_d text-light-two">
			<tr>
				<th class="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Producto</th>
				<th class="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Categoría</th>
				<th class="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Precio</th>
				<th class="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Opciones</th>
			</tr>
		</thead>
		<tbody class="divide-light-one_d divide-y-2">
			{#each listProducts as product (product.item_id)}
				<ItemCardTable {product} categories={listCategories} {setSelectProduct} {onDeleteProduct} />
			{/each}
		</tbody>
	</table>
</div>

<div class="mt-4 space-y-4 md:hidden">
	{#each listProducts as product (product.item_id)}
		<ItemCard {product} categories={listCategories} {setSelectProduct} {onDeleteProduct} />
	{/each}
</div>
