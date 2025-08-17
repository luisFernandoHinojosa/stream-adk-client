<script lang="ts">
	import { API_CONFIG } from '$lib/config/api.config';
	import { SRC_IMG_DEFAULT } from '$lib/constants/assets';
	import DotsVerticalIcon from '$lib/icons/outline/dotsVerticalIcon.svelte';
	import type { CategoryResponse } from '$lib/interface/category.interface';
	import type { DropdownOption } from '$lib/interface/dropdownOption.interface';
	import type { ItemResponse } from '$lib/interface/item.interface';
	import { imageItemStore } from '$lib/stores';
	import Button from '../ui/button.svelte';
	import DropdownMenu from '../ui/dropdownMenu.svelte';
	import ModalConfirm from '../ui/modalConfirm.svelte';

	interface Props {
		product: ItemResponse;
		categories: CategoryResponse[];
		setSelectProduct: (product: ItemResponse) => void;
		onDeleteProduct: (item_id: number, callback: () => void) => void;
		isOptions?: boolean;
	}

	let {
		product,
		categories,
		setSelectProduct,
		onDeleteProduct,
		isOptions = true
	}: Props = $props();
	let position: 'left' | 'right' = $state('left');
	let width: string = $state('w-44');
	let menuClass: string = $state('');
	let showDropdown: boolean = $state(false);
	let showModal: boolean = $state(false);
	let loading: boolean = $state(false);

	const options: DropdownOption[] = [
		{
			id: 'edit',
			label: 'Edit',
			icon: `<svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
              <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
            </svg>`,
			action: () => handleEdit()
		},
		{
			id: 'delete',
			label: 'Delete',
			icon: `<svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
              <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clip-rule="evenodd" />
            </svg>`,
			action: () => handleDelete(),
			divider: true
		}
	];

	function handleEdit() {
		setSelectProduct(product);
	}
	function handleDelete(): void {
		showModal = true;
		showDropdown = false;
	}

	function confirmDelete() {
		loading = true;
		onDeleteProduct(product.item_id, () => {
			console.log('entre a callback');
			loading = false;
			showModal = false;
		});
	}

	function cancelDelete() {
		showModal = false;
		loading = false;
	}

	function toggleDropdown(): void {
		showDropdown = !showDropdown;
	}

	function getCategoryNameById(categoryId: number): string {
		const category = categories.find((cat) => cat.category_id === categoryId);
		return category ? category.category_name : 'Desconocida';
	}
</script>

<div class="bg-light-one_d grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg p-4 shadow">
	<div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
		<img
			src={imageItemStore.getImageByBusinessAndItemId(product.business_id, product.item_id)}
			alt={product.item_name}
			class="h-full w-full object-cover"
			loading="lazy"
			onerror={(e) => ((e.currentTarget as HTMLImageElement).src = SRC_IMG_DEFAULT)}
		/>
	</div>
	<div class="min-w-0 flex-1">
		<div class="text-light-two line-clamp-2 text-sm font-semibold break-words">
			{product.item_name}
		</div>
		<div class="text-light-two_d mt-1 text-xs">
			{#if product.categories && product.categories.length > 0}
				{product.categories.map((id) => getCategoryNameById(id)).join(', ')}
			{:else}
				Sin categoría
			{/if}
		</div>
		<div class="text-light-two mt-1 text-sm font-medium">
			BOB {product.price ? Number(product.price).toFixed(2) : 'N/A'}
		</div>
	</div>
	{#if isOptions}
		<div class="relative flex items-start justify-end">
			<button onclick={toggleDropdown}>
				<DotsVerticalIcon />
			</button>
			<DropdownMenu {options} {width} isOpen={showDropdown} class="absolute top-full right-0" />
		</div>
	{/if}
</div>

<ModalConfirm
	isOpen={showModal}
	message="¿Estás seguro de eliminar este producto?"
	onConfirm={confirmDelete}
	onCancel={cancelDelete}
	{loading}
/>

<style>
	@keyframes liquid-float {
		0%,
		100% {
			transform: translateY(0px) scale(1);
		}
		50% {
			transform: translateY(-8px) scale(1.1);
		}
	}
</style>
