<script lang="ts">
	import { API_CONFIG } from '$lib/config/api.config';
	import { SRC_IMG_DEFAULT } from '$lib/constants/assets';
	import DotsVerticalIcon from '$lib/icons/outline/dotsVerticalIcon.svelte';
	import type { CategoryResponse } from '$lib/interface/category.interface';
	import type { DropdownOption } from '$lib/interface/dropdownOption.interface';
	import type { ItemResponse } from '$lib/interface/item.interface';
	import { imageItemStore } from '$lib/stores';
	import DropdownMenu from '../ui/dropdownMenu.svelte';
	import ModalConfirm from '../ui/modalConfirm.svelte';

	interface Props {
		product: ItemResponse;
		categories: CategoryResponse[];
		setSelectProduct: (product: ItemResponse) => void;
		onDeleteProduct: (item_id: number, callback: () => void) => void;
	}

	let { product, categories, setSelectProduct, onDeleteProduct }: Props = $props();
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
		console.log('entre a delete');
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

	const categoriesMap = $derived(() => {
		const map = new Map<number, CategoryResponse>();
		for (const cat of categories) {
			map.set(cat.category_id, cat);
		}
		return map;
	});
</script>

<tr class="hover:bg-light-one_d transition-colors">
	<td class="px-4 py-4">
		<div class="flex items-center">
			<div class="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
				<img
					src={imageItemStore.getImageByBusinessAndItemId(product.business_id, product.item_id)}
					alt={product.item_name}
					class="h-full w-full object-cover"
					loading="lazy"
					onerror={(e) => ((e.currentTarget as HTMLImageElement).src = SRC_IMG_DEFAULT)}
				/>
			</div>
			<div class="ml-4">
				<div class="text-light-two text-sm font-medium break-words">{product.item_name}</div>
			</div>
		</div>
	</td>
	<td class="px-4 py-4">
		<div class="flex gap-2">
			<span class="text-xs whitespace-nowrap"
				>{#if product.categories.length > 0}
					{categoriesMap().get(product.categories[0])?.category_name ?? 'N/A'}
				{:else}
					N/A
				{/if}</span
			>
			{#if product.categories.length > 1}
				<span class="text-light-two text-xs whitespace-nowrap">...</span>
			{/if}
		</div>
	</td>
	<td class="px-4 py-4">
		<div class="text-light-two text-sm font-medium">
			BOB <span class="text-light-two_d">{Number(product.price).toFixed(2)}</span>
		</div>
	</td>
	<td class="px-4">
		<div class="relative h-fit w-fit">
			<button onclick={toggleDropdown}>
				<DotsVerticalIcon class="text-light-two group-hover:text-light-two_d size-5" />
			</button>
			<DropdownMenu {options} {width} isOpen={showDropdown} class="absolute right-0" />
		</div>
	</td>
</tr>

<ModalConfirm
	isOpen={showModal}
	message="¿Estás seguro de eliminar este producto?"
	onConfirm={confirmDelete}
	onCancel={cancelDelete}
	{loading}
/>
