<script lang="ts">
	import type { Category, CategoryResponse } from '$lib/interface/category.interface';
	import CategoryCard from './categoryCard.svelte';
	import XIcon from '$lib/icons/outline/xIcon.svelte';
	import PlusIcon from '$lib/icons/outline/plusIcon.svelte';
	import Button from '../ui/button.svelte';
	import { categoryService } from '$lib/services/category.service';
	import Input from '../ui/input.svelte';
	import Subheading from '../ui/subheading.svelte';
	import ExclamationCircleIcon from '$lib/icons/solid/exclamationCircleIcon.svelte';
	import { businessStore } from '$lib/stores/businessStore';

	interface Props {
		categories: CategoryResponse[];
		onclose: () => void;
		onSuccessCategory: (newCategory: CategoryResponse, mode: 'create' | 'update') => void;
		onDeleteCategory: (categoryId: number, callback: () => void) => void;
	}

	let { categories, onclose, onSuccessCategory, onDeleteCategory }: Props = $props();
	let isCreatingCategory: boolean = $state(false);
	let newCategory: CategoryResponse = $state({
		category_name: '',
		icon: 1,
		business_id: $businessStore.business_id,
		category_id: Date.now(),
		created_at: '',
		updated_at: ''
	});
	let searchQuery: string = $state('');

	// Filtrar categorías basado en la búsqueda
	let filteredCategories = $derived(
		categories.filter((category) =>
			category.category_name.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	let categoriesStorage = localStorage.getItem('agent_adk_categories');
	let listCategories = JSON.parse(categoriesStorage || '[]');

	async function handleCreateCategory() {
		if (newCategory.category_name.trim()) {
			try {
				isCreatingCategory = true;
				const createdCategory = await categoryService.createCategory(newCategory);
				listCategories.push(createdCategory);
				localStorage.setItem('agent_adk_categories', JSON.stringify(listCategories));
				onSuccessCategory(createdCategory, 'create');
				newCategory.category_name = ''; // Reset form
				onclose();
			} catch (error) {
				onclose();
				console.error('Error creating category:', error);
			} finally {
				isCreatingCategory = false;
			}
		}
	}

	function cancelCreateCategory() {
		onclose();
		newCategory.category_name = '';
	}

	const MAX_CATEGORIES = 20;
	let isAtMaxCategories: boolean = $derived(categories.length >= MAX_CATEGORIES);
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center sm:items-start sm:pt-16">
	<!-- <div class="bg-opacity-50 absolute inset-0 bg-black" onclick={onclose}></div> -->

	<div
		class="bg-light-one relative z-10 mx-4 w-full max-w-md overflow-hidden rounded-lg shadow-lg sm:mx-auto"
	>
		<div class="border-light-four flex items-center justify-between border-b p-4">
			<Subheading level="h2">Categorías</Subheading>
			<Button variant="ghost" size="xs" type="button" onclick={onclose}>
				<XIcon class="text-light-two h-5 w-5" />
			</Button>
		</div>

		<!-- Buscador -->
		<div class="border-light-four border-b p-4">
			<div class="relative">
				<Input
					type="text"
					placeholder="Buscar categorías..."
					bind:value={searchQuery}
					callback={(value: any) => (searchQuery = value)}
				/>
				{#if searchQuery.length > 0}
					<button
						class="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
						onclick={() => (searchQuery = '')}
					>
						<XIcon class="h-4 w-4" />
					</button>
				{/if}
			</div>
		</div>

		<!-- Listado de categorias -->
		<div class="max-h-72 overflow-y-auto p-2">
			{#if filteredCategories.length === 0}
				<div class="text-light-two py-4 text-center">
					{#if searchQuery.length > 0}
						No se encontraron categorías con "{searchQuery}"
					{:else}
						No hay categorías disponibles
					{/if}
				</div>
			{:else}
				{#each filteredCategories as category (category.category_id)}
					<CategoryCard {category} {onSuccessCategory} {onDeleteCategory} />
				{/each}
			{/if}
		</div>

		<!-- Crear nueva categoria Section -->
		<div class="border-light-four border-t p-4">
			{#if isCreatingCategory}
				<div class="flex flex-col gap-2">
					<Input
						type="text"
						bind:value={newCategory.category_name}
						placeholder="Nombre de la categoría"
					/>
					<div class="flex justify-end gap-2">
						<Button variant="secondary" size="sm" type="button" onclick={cancelCreateCategory}>
							Cancelar
						</Button>
						<Button
							variant="primary"
							size="sm"
							type="button"
							onclick={handleCreateCategory}
							loading={!isCreatingCategory}
						>
							Guardar
						</Button>
					</div>
				</div>
			{:else}
				<Button
					variant="secondary"
					size="md"
					type="button"
					onclick={() => (isAtMaxCategories ? null : (isCreatingCategory = true))}
					fullWidth
				>
					{#if isAtMaxCategories}
						<div class="flex items-center justify-center gap-2">
							<ExclamationCircleIcon class="h-4 w-4" />
							<span>Has alcanzado el límite de categorías</span>
						</div>
					{:else}
						<div class="flex items-center justify-center gap-2">
							<PlusIcon class="h-4 w-4" />
							<span>Crear nueva categoría</span>
						</div>
					{/if}
				</Button>
			{/if}
		</div>
	</div>
</div>
