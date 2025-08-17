<script lang="ts">
	import type { CategoryResponse } from '$lib/interface/category.interface';
	import CheckIcon from '$lib/icons/outline/checkIcon.svelte';
	import ArrowLeftIcon from '$lib/icons/outline/arrowLeftIcon.svelte';
	import TrashIcon from '$lib/icons/outline/trashIcon.svelte';
	import PencilIcon from '$lib/icons/outline/pencilIcon.svelte';
	import { categoryService } from '$lib/services/category.service';
	import Input from '../ui/input.svelte';
	import Button from '../ui/button.svelte';

	interface Props {
		category: CategoryResponse;
		onSuccessCategory: (category: CategoryResponse, mode: 'create' | 'update') => void;
		onDeleteCategory: (categoryId: number, callback: () => void) => void;
	}

	let { category, onSuccessCategory, onDeleteCategory }: Props = $props();
	let isEditing: boolean = $state(false);
	let editedName: string = $state(category.category_name);

	function startEditing() {
		editedName = category.category_name;
		isEditing = true;
	}

	function cancelEditing() {
		isEditing = false;
		editedName = category.category_name;
	}

	async function updateCategory() {
		try {
			category.category_name = editedName;
			const updatedCategory = await categoryService.updateCategory(category);
			onSuccessCategory(updatedCategory, 'update');
			isEditing = false;
		} catch (error) {
			console.log(error);
		}
	}

	async function deleteCategory() {
		try {
			onDeleteCategory(category.category_id, () => {
				isEditing = false;
			});
		} catch (error) {
			console.log(error);
		}
	}
</script>

{#if isEditing}
	<div class="hover:bg-light-one_d rounded-md p-2 transition-colors">
		<div class="flex items-center gap-2">
			<Input type="text" bind:value={editedName} placeholder="Nombre de la categoría" />
			<div class="flex gap-1">
				<Button
					variant="ghost"
					size="xs"
					type="button"
					onclick={cancelEditing}
					ariaLabel="Volver atrás"
				>
					<ArrowLeftIcon class="text-light-two h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="xs"
					type="button"
					onclick={updateCategory}
					ariaLabel="Guardar cambios"
				>
					<CheckIcon class="text-light-two h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="xs"
					type="button"
					onclick={deleteCategory}
					ariaLabel="Eliminar categoría"
				>
					<TrashIcon class="h-4 w-4" />
				</Button>
			</div>
		</div>
	</div>
{:else}
	<div class="hover:bg-light-one_d rounded-md p-2 transition-colors">
		<div class="flex items-center justify-between">
			<span class="text-light-two text-sm">{category.category_name}</span>
			<Button
				variant="ghost"
				size="xs"
				type="button"
				onclick={startEditing}
				ariaLabel="Editar categoría"
				rounded
			>
				<PencilIcon class="text-light-two h-4 w-4" />
			</Button>
		</div>
	</div>
{/if}
