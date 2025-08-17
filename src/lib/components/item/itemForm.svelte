<script lang="ts">
	import ImageUploader from '../ui/imageUploader.svelte';
	import Input from '../ui/input.svelte';
	import Button from '../ui/button.svelte';
	import type { ImageItem, ItemResponse } from '$lib/interface/item.interface';
	import type { CategoryResponse } from '$lib/interface/category.interface';
	import PlusIcon from '$lib/icons/outline/plusIcon.svelte';
	import XIcon from '$lib/icons/outline/xIcon.svelte';
	import CategoryList from '../category/categoryList.svelte';
	import { businessStore } from '$lib/stores/businessStore';
	import BoltIcon from '$lib/icons/solid/boltIcon.svelte';
	import LockIcon from '$lib/icons/solid/lockIcon.svelte';
	import { redirect } from '$lib/utils/redirect';
	import { itemService } from '$lib/services';
	import { imageItemStore } from '$lib/stores';

	interface Props {
		product: ItemResponse;
		categories: CategoryResponse[];
		onSuccess: (newProduct: ItemResponse, mode: 'create' | 'update') => void;
		onClose: () => void;
		onSuccessCategory: (newCategory: CategoryResponse, mode: 'create' | 'update') => void;
		onDeleteCategory: (categoryId: number, callback: () => void) => void;
		class?: string;
	}
	let {
		product = $bindable(),
		categories,
		onSuccess,
		onClose,
		onSuccessCategory,
		onDeleteCategory,
		class: className = ''
	}: Props = $props();

	// Loading state
	let isLoading: boolean = $state(false);
	let errorMessage: string = $state('');
	let successMessage: string = $state('');
	let isCategoryModalOpen: boolean = $state(false);
	let showCategoryList: boolean = $state(false);
	let business_id: number = Number($businessStore.business_id);

	// ========== NUEVAS VARIABLES PARA EL CONTADOR ==========
	let init: number = $state(1);
	let max: number = $state(10);

	// Cálculos reactivos para el círculo
	let percentage = $derived((init / max) * 100);
	let isAtLimit = $derived(init === max);
	let radius = $derived(45);
	let circumference = $derived(2 * Math.PI * radius);
	let strokeDasharray = $derived(circumference);
	let strokeDashoffset = $derived(circumference - (percentage / 100) * circumference);

	// Colores dinámicos
	let circleColor = $derived(isAtLimit ? 'stroke-light-three' : 'stroke-light-two');

	let textColor = $derived(isAtLimit ? 'text-light-three' : 'text-light-two');
	// ========== FIN NUEVAS VARIABLES ==========

	let products = localStorage.getItem('agent_adk_items');
	let listProducts = JSON.parse(products || '[]');
	// Handle form submission
	async function handleSubmit() {
		// Prevenir submit si está en el límite
		if (isAtLimit) return;

		isLoading = true;
		errorMessage = '';
		successMessage = '';
		let itemSubmit: ItemResponse = {
			...product,
			categories: product.categories.map((category: number) => category),
			created_at: '',
			updated_at: '',
			business_id: business_id
		};
		try {
			if (product.item_id !== 0) {
				//const updatedProduct = await itemService.updateProduct(productSubmit);
				onSuccess(itemSubmit, 'update');
			} else {
				itemSubmit.item_id = Date.now();
				listProducts.push(itemSubmit);
				localStorage.setItem('agent_adk_items', JSON.stringify(listProducts));
				const createdProduct = await itemService.createProduct(itemSubmit);
				const imageItem: ImageItem = {
					item_id: createdProduct.item_id,
					business_id: business_id,
					image: product.image
				};
				imageItemStore.addImageItem(imageItem);
				onSuccess(createdProduct, 'create');
			}
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = 'Ocurrió un error inesperado';
			}
		} finally {
			isLoading = false;
		}
	}

	// Handle category toggle
	function toggleCategory(categoryId: number) {
		if (isAtLimit) return; // Prevenir acción si está en el límite

		const index = product.categories.indexOf(categoryId);
		if (index === -1) {
			product.categories = [...product.categories, categoryId];
		} else {
			product.categories = product.categories.filter((id: number) => id !== categoryId);
		}
	}

	const handleShowCategoryList = () => {
		if (isAtLimit) return; // Prevenir acción si está en el límite
		showCategoryList = !showCategoryList;
	};
</script>

<div
	class="bg-light-one mx-auto h-full w-full overflow-y-auto px-4 py-4 shadow-md md:px-20 md:py-8 lg:px-52 lg:py-16 {className} relative"
>
	<Button
		type="button"
		ariaLabel="Close"
		variant="ghost"
		onclick={() => onClose()}
		className="absolute top-3 right-3"
	>
		<XIcon class="text-light-two hover:text-light-two_d size-6" />
	</Button>

	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-800">
			{product.item_id !== 0 ? 'Editar producto' : 'Crear nuevo producto'}
		</h1>
	</div>

	{#if isAtLimit}
		<div
			class="border-light-three text-light-three mb-6 flex items-center gap-3 rounded-lg border px-4 py-3"
		>
			<LockIcon class="text-light-three size-5 min-h-5 min-w-5" />
			<div>
				<div class="font-medium">Límite de productos alcanzado</div>
				<div class="text-light-two text-sm">
					Has alcanzado el límite de tu plan actual. Mejora tu plan para crear más productos.
				</div>
			</div>
		</div>
	{/if}

	{#if errorMessage}
		<div class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
			<span class="block sm:inline">{errorMessage}</span>
		</div>
	{/if}

	{#if successMessage}
		<div
			class="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700"
			role="alert"
		>
			<span class="block sm:inline">{successMessage}</span>
		</div>
	{/if}

	<div class="relative">
		<form onsubmit={handleSubmit} class="space-y-6">
			<div class="space-y-4">
				<h2 class="text-light-two border-light-four border-b pb-2 text-lg font-semibold">
					Información básica
				</h2>

				<div class="grid grid-cols-1 gap-3">
					<div class="flex flex-col gap-3 md:flex-row">
						<Input
							type="text"
							id="name"
							bind:value={product.item_name}
							label="Nombre del producto"
							placeholder="Nombre del producto"
							required
							disabled={isAtLimit}
						/>

						<Input
							label="Precio original"
							type="number"
							id="price"
							bind:value={product.price}
							placeholder="0.00"
							required
							disabled={isAtLimit}
						/>

						<Input
							label="Precio con descuento"
							type="number"
							id="discount_price"
							bind:value={product.price_discount}
							placeholder="0.00"
							required
							disabled={isAtLimit}
						/>
					</div>
					<div>
						<Input
							label="Descripción"
							id="description"
							bind:value={product.item_description}
							type="textarea"
							rows={4}
							placeholder="Descripción detallada del producto"
							disabled={isAtLimit}
						/>
					</div>
				</div>
				<div class="">
					<div class="border-light-four flex items-center border-b pb-2">
						<h2 class="text-light-two text-lg font-semibold">Categorías *</h2>
					</div>

					<div class="mt-4 flex flex-wrap gap-3">
						{#each categories as category}
							<button
								type="button"
								class="flex items-center justify-center rounded-md border p-2 text-sm font-medium transition-colors duration-200 {isAtLimit
									? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
									: product.categories.includes(category.category_id)
										? 'text-light-two_d border-light-three'
										: 'text-light-two_d hover:border-light-three_d'}"
								onclick={() => toggleCategory(category.category_id)}
								disabled={isAtLimit}
							>
								{category.category_name}
							</button>
						{/each}

						<Button
							type="button"
							variant="secondary"
							onclick={handleShowCategoryList}
							disabled={isAtLimit}
							className={isAtLimit ? 'opacity-50 cursor-not-allowed' : ''}
						>
							<PlusIcon class="mr-1 size-4" />
						</Button>
					</div>

					{#if product.categories.length > 0}
						<p class="text-light-two_d mt-1 text-sm">
							<span class="font-semibold">Categorías seleccionadas:</span>
							{product.categories
								.map(
									(id: number) =>
										categories.find((cat: CategoryResponse) => cat.category_id === id)
											?.category_name
								)
								.join(', ')}
						</p>
					{/if}
					{#if showCategoryList}
						<CategoryList
							{categories}
							onclose={handleShowCategoryList}
							{onSuccessCategory}
							{onDeleteCategory}
						/>
					{/if}
				</div>

				<div class="relative space-y-4">
					<h2 class="text-light-two border-light-four border-b pb-2 text-lg font-semibold">
						Imágen del producto *
					</h2>

					<!-- <ImageUploader
						imageUrls={imagesParsed()}
						multiple={true}
						maxFiles={3}
						id="product-photos"
						disabled={false}
						callback={(value: any) => (product.images = value)}
						enableOptimization={true}
						quality={1}
						maxHeight={900}
						maxWidth={1200}
						convertToWebP={true}
					/> -->
					<ImageUploader
						label="Imágenes del producto"
						storageMode="compressed"
						maxWidth={800}
						maxHeight={600}
						quality={0.6}
						maxSizeKB={200}
						callback={(value: any) => (product.image = value)}
					/>
					<div class="border-light-four flex justify-end space-x-3 border-t pt-4">
						<Button type="button" variant="secondary" onclick={onClose} disabled={isLoading}>
							Cancelar
						</Button>
						<Button
							type="submit"
							variant="primary"
							disabled={isLoading || isAtLimit}
							className={isAtLimit ? 'opacity-50 cursor-not-allowed flex items-center gap-2' : ''}
						>
							{#if isAtLimit}
								<BoltIcon class="size-4" />
								Producto bloqueado
							{:else}
								{isLoading
									? 'Guardando...'
									: product.item_id !== 0
										? 'Actualizar producto'
										: 'Crear producto'}
							{/if}
						</Button>
					</div>
				</div>
			</div>
		</form>

		{#if isAtLimit}
			<div class="bg-light-one bg-opacity-50 pointer-events-none absolute inset-0 rounded-lg"></div>
		{/if}
	</div>
	<div class="mx-auto mt-4 flex items-center justify-center gap-4">
		{#if !isAtLimit}
			<div class="text-right">
				<div class="text-light-two_d text-sm">Productos creados</div>
				<div class="text-light-two_d text-xs">Plan actual</div>
			</div>
		{/if}

		<div class="relative flex h-20 w-20 items-center justify-center md:h-28 md:w-28">
			<svg class="h-20 w-20 -rotate-90 transform md:h-28 md:w-28" viewBox="0 0 100 100">
				<circle
					cx="50"
					cy="50"
					r={radius}
					stroke="currentColor"
					stroke-width="8"
					fill="transparent"
					class="text-light-four"
				/>
				<circle
					cx="50"
					cy="50"
					r={radius}
					stroke="currentColor"
					stroke-width="8"
					fill="transparent"
					stroke-dasharray={strokeDasharray}
					stroke-dashoffset={strokeDashoffset}
					class="transition-all duration-300 {circleColor}"
					stroke-linecap="round"
				/>
			</svg>

			<div class="absolute inset-0 flex flex-col items-center justify-center">
				<div class="text-light-two text-sm font-bold md:text-lg">
					{init}/{max}
				</div>
				<div class="text-light-two text-xs font-medium">
					{Math.round(percentage)}%
				</div>
			</div>
		</div>

		{#if isAtLimit}
			<Button
				variant="primary"
				ariaLabel="Mejorar plan"
				onclick={() => redirect('#')}
				className="animate-pulse"
			>
				<BoltIcon class="h-4 w-4" />
				Mejorar Plan
			</Button>
		{/if}
	</div>
</div>
