<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { defaultBusiness } from '$lib/defaults/businessDefault';

	import BusinessSelectorSkeleton from '../skeletons/business/businessSelectorSkeleton.svelte';
	import ImageUploader from '../ui/imageUploader.svelte';
	import {
		BuildindStoreIcon,
		CheckIcon,
		ChevronLeftIcon,
		PlusIcon,
		XIcon
	} from '$lib/icons/outline';
	import { Confetti, Heading, Text } from '../ui';
	import ChevronRightIcon from '$lib/icons/outline/chevronRightIcon.svelte';
	import { businessService } from '$lib/services';
	import type { BusinessResponse, LogoBusiness } from '$lib/interface';
	import { businessStore, logoBusinessStore } from '$lib/stores';
	import { blockScroll } from '$lib/utils/blockScroll';
	import { redirect } from '$lib/utils/redirect';
	import { SRC_IMG_DEFAULT, SRC_LOGO_APP } from '$lib/constants';
	import { ExclamationCircleIcon } from '$lib/icons/solid';
	import Button from '../ui/button.svelte';
	import Input from '../ui/input.svelte';
	import { AnimatedIconBackground, PruebaAnimated } from '../animations';
	import FloatingShapesBackground from '../animations/floatingShapesBackground.svelte';

	// Store selector state
	let stores: BusinessResponse[] = $state([]);
	let selectedStoreId: number | null = $state(null);
	let isNotSelectedStore: boolean = $state(true);
	let isLoading: boolean = $state(false);
	let isLoadingToApp: boolean = $state(false);
	let error: string | null = $state(null);

	// Create store modal state
	let isCreateModalOpen: boolean = $state(false);
	let newStore: BusinessResponse = $state(defaultBusiness);
	let logoPreview: string | null = $state(null);
	let isCreatingStore: boolean = $state(false);
	let createStoreError: string = $state('');
	let confettiComponent: Confetti | null = $state(null);

	onMount(async () => {
		try {
			await fetchUserStores();
		} catch (error) {
			console.error('Error fetching stores:', error);
		}
	});

	// Simulate fetching stores
	async function fetchUserStores() {
		try {
			isLoading = true;
			const storesResponses = await businessService.getBusinesses();
			stores = storesResponses;
		} catch (error) {
			error = error;
			console.error('Error fetching stores:', error);
		} finally {
			isLoading = false;
		}
	}

	function selectStore(storeId: number): void {
		selectedStoreId = storeId;
		isNotSelectedStore = false;
	}

	async function continueToApp(): Promise<void> {
		if (!selectedStoreId) return;

		try {
			isLoadingToApp = true;
			// localStorage.setItem('activeStoreId', selectedStoreId.toString());
			const findStore = stores.find((store) => store.business_id === selectedStoreId);
			if (!findStore) {
				throw new Error('Store not found');
			}

			businessStore.set({ ...findStore });
			const redirectTo = page.url.searchParams.get('redirect') || '/app/chat';
			redirect(redirectTo);
		} catch (err: any) {
			error = err.message || 'Failed to select store';
		} finally {
			isNotSelectedStore = false;
			isLoadingToApp = false;
		}
	}

	// Create store modal functions
	function openCreateModal(): void {
		isCreateModalOpen = true;
		blockScroll(true);
		resetNewStoreForm();
	}

	function closeCreateModal(): void {
		isCreateModalOpen = false;
		blockScroll(isCreateModalOpen);
		resetNewStoreForm();
	}

	function resetNewStoreForm(): void {
		newStore = {
			business_id: 0,
			business_name: '',
			business_description: '',
			whatsapp_url: '',
			instagram_url: '',
			facebook_url: '',
			tiktok_url: '',
			email: '',
			address: '',
			address_url: '',
			created_at: '',
			updated_at: '',
			logo_path: null
		};
		logoPreview = '';
		createStoreError = '';
	}

	async function createStore(): Promise<void> {
		// Validation
		if (!newStore.business_name.trim()) {
			createStoreError = 'El nombre de la tienda es obligatorio';
			return;
		}
		try {
			isCreatingStore = true;
			createStoreError = '';

			if (!logoPreview) {
				createStoreError = 'El logo de la tienda es obligatorio';
				return;
			}
			// Crear la nueva tienda con un ID único
			const newStoreData: BusinessResponse = {
				...newStore,
				business_id: Date.now(),
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				logo_path: logoPreview
			};

			// Agregar a la lista de tiendas
			stores = [...stores, newStoreData];

			// Guardar en localStorage

			const newBusness = await businessService.createBusiness(newStoreData);
			const logoBusiness: LogoBusiness = {
				business_id: newBusness.business_id,
				logo_path: logoPreview
			};
			logoBusinessStore.addLogoBusiness(logoBusiness);

			// localStorage.setItem('agent_adk_logo_business', JSON.stringify(newBusness));
			businessStore.set({ ...newBusness });
			console.log('Tiendas guardadas en localStorage');
			// Selecciona la tienda recién creada
			selectStore(newStoreData.business_id);

			// Cierra el modal
			closeCreateModal();
			setTimeout(() => {
				if (confettiComponent) {
					confettiComponent.explode();
				}
			}, 300);
		} catch (err: any) {
			createStoreError = err.message || 'No se pudo crear la tienda';
		} finally {
			isCreatingStore = false;
		}
	}
</script>

<div class="h-screen">
	<div class="grid h-full w-full grid-cols-1 bg-indigo-100 lg:grid-cols-2">
		<div class="lg:p- relative mt-8 flex flex-col justify-center space-y-8">
			<FloatingShapesBackground
				colorScheme="purple"
				shapeCount={7}
				particleCount={5}
				density="dense"
			/>
			<div class="z-10 flex justify-center">
				<img class="h-24 w-auto drop-shadow-2xl sm:h-28 lg:h-32" src={SRC_LOGO_APP} alt="Vizta" />
			</div>

			<div class="z-10 text-center">
				<Heading level="h1">
					{stores.length > 0 ? 'Selecciona tu tienda' : 'Tus tiendas'}
				</Heading>
				<Text variant="body-lg" class="my-4">
					{stores.length > 0
						? 'Elige la tienda que deseas gestionar y comienza a hacer crecer tu negocio'
						: 'Comienza creando tu primera tienda y da el primer paso hacia el éxito digital'}
				</Text>
			</div>
			<div class="z-10 mt-12 hidden justify-center lg:flex">
				<Button type="button" variant="link" onclick={() => redirect('/auth/sign-in')}>
					<ChevronLeftIcon class="mr-2 h-5 w-5" />
					Volver al login
				</Button>
			</div>
		</div>
		<div
			class="text-light-three relative flex min-h-screen flex-col justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 shadow-inner lg:min-h-0"
		>
			<AnimatedIconBackground
				position="top"
				iconClass="text-purple-500 opacity-30 size-10 lg:size-14"
				class="px-8"
				iconCount={10}
			/>

			<AnimatedIconBackground position="bottom" iconClass="text-blue-500 opacity-30 size-6" />
			<!-- Contenido principal -->
			<div class="relative z-10 mx-auto w-full max-w-lg lg:max-w-none">
				<div class="m-4 transition-all duration-300 lg:m-8">
					<div class="px-6 py-6 sm:px-8 sm:py-8">
						{#if isLoading}
							<BusinessSelectorSkeleton />
						{:else if error}
							<div class="flex flex-col items-center justify-center gap-6 py-8">
								<div
									class="flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-100 bg-red-50 shadow-lg"
								>
									<ExclamationCircleIcon class="size-8 text-red-500" />
								</div>
								<div class="text-center">
									<Heading level="h3" color="error">Error al cargar tus tiendas</Heading>
									<Text variant="error" color="error" class="mt-3">{error}</Text>
								</div>
							</div>
						{:else if stores.length === 0}
							<div class="py-8 text-center">
								<div class="relative mx-auto mb-6 flex h-28 w-28 items-center justify-center">
									<div
										class="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/30"
									></div>
									<div
										class="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-blue-100 bg-white shadow-xl"
									>
										<BuildindStoreIcon class="h-12 w-12 text-blue-600" />
									</div>
								</div>
								<Heading level="h4" class="mb-4 text-xl text-gray-800">No tienes tiendas</Heading>
								<Text variant="body-base" class="mb-8 text-gray-600">
									Crea tu primera tienda para comenzar tu negocio digital
								</Text>
								<Button variant="primary" onclick={openCreateModal}>
									<PlusIcon class="mr-3 h-6 w-6" />
									Crear mi primera tienda
								</Button>
							</div>
						{:else}
							<div class="space-y-6">
								<div class="text-center lg:text-left">
									<Text variant="body-sm">
										Mis tiendas ({stores.length})
									</Text>
								</div>

								<div class="mi-scroll max-h-80 space-y-4 overflow-y-auto p-4 lg:max-h-96">
									{#each stores as store}
										<button
											type="button"
											class="group from-light-one to-light-one_d relative flex w-full items-center rounded-2xl bg-gradient-to-l p-5 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] focus:ring-4 focus:outline-none active:scale-[0.98] {selectedStoreId ===
											store.business_id
												? 'border-light-three/20 ring-light-three_d/30 border-2 shadow-xl ring-4'
												: 'hover:ring-light-four  hover:shadow-lg hover:ring'}"
											onclick={() => selectStore(store.business_id)}
										>
											{#if selectedStoreId === store.business_id}
												<div
													class="from-light-two to-light-two_d absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br shadow-lg"
												>
													<CheckIcon class="text-light-one size-4" />
												</div>
												<div class="pointer-events-none absolute inset-0">
													<Confetti
														bind:this={confettiComponent}
														autoStart={false}
														particleCount={200}
														duration={5000}
														explosionForce={0.3}
														shapes={['square', 'rectangle']}
														fullscreen={true}
														minParticleSize={10}
														originX={window.innerWidth / 2}
														originY={window.innerHeight / 4}
														usePixelCoordinates={true}
													/>
												</div>
											{/if}

											<div class="flex min-w-0 flex-1 items-center gap-4">
												<div class="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
													<div class="absolute inset-0 rounded-xl"></div>
													<img
														src={logoBusinessStore.getLogoByBusinessId(store.business_id) ||
															SRC_IMG_DEFAULT}
														alt={store.business_name}
														class="relative h-full w-full rounded-xl object-cover shadow-md"
													/>
												</div>

												<div class="min-w-0 flex-1 text-left">
													<Text
														variant="body-lg"
														color="primary"
														truncate
														weight="bold"
														class="text-gray-800"
													>
														{store.business_name}
													</Text>
													<Text variant="body-sm" truncate class="text-gray-600">
														{store.business_description}
													</Text>
												</div>
											</div>

											<div class="ml-4 flex-shrink-0">
												<ChevronRightIcon
													class="size-5 text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-500"
												/>
											</div>
										</button>
									{/each}
								</div>

								<!-- Botones de acción -->
								<div class="space-y-4 pt-6">
									<Button type="button" variant="secondary" fullWidth onclick={openCreateModal}>
										<PlusIcon class="mr-3 h-5 w-5" />
										Crear nueva tienda
									</Button>

									<Button
										type="button"
										variant="primary"
										fullWidth
										disabled={isNotSelectedStore || isLoadingToApp}
										loading={isLoadingToApp}
										onclick={continueToApp}
									>
										Continuar
									</Button>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Botón de volver (móvil) -->
	<div class="mt-6 flex justify-center px-4 lg:hidden">
		<Button type="button" variant="link" onclick={() => redirect('/auth/sign-in')}>
			<ChevronLeftIcon class="mr-2 h-5 w-5" />
			Volver al login
		</Button>
	</div>
</div>
<!-- <div class="h-screen">
	<div class="grid h-full w-full grid-cols-1 lg:grid-cols-2">
		<div class="relative flex flex-col justify-center space-y-8 lg:p-8">
			<AnimatedIconBackground />
			<div class="flex justify-center">
				<img class="h-24 w-auto drop-shadow-2xl sm:h-28 lg:h-32" src={SRC_LOGO_APP} alt="Vizta" />
			</div>

			<div class="text-center lg:text-left">
				<Heading level="h1">
					{stores.length > 0 ? 'Selecciona tu tienda' : 'Tus tiendas'}
				</Heading>
				<Text variant="body-lg" class="mt-4">
					{stores.length > 0
						? 'Elige la tienda que deseas gestionar y comienza a hacer crecer tu negocio'
						: 'Comienza creando tu primera tienda y da el primer paso hacia el éxito digital'}
				</Text>
			</div>
			<div class="mt-12 hidden justify-center lg:flex">
				<Button type="button" variant="link" onclick={() => redirect('/auth/sign-in')}>
					<ChevronLeftIcon class="mr-2 h-5 w-5" />
					Volver al login
				</Button>
			</div>
		</div>

		<div
			class="relative flex flex-col justify-center overflow-hidden bg-gradient-to-br from-indigo-50 to-indigo-100"
		>
			<div
				class="bg-opacity-10 absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-blue-500"
			></div>
			<div class="mx-auto w-full max-w-lg lg:max-w-none">
				<div class=" transition-all duration-300">
					<div class="px-6 py-4 sm:px-8 sm:py-8">
						{#if isLoading}
							<BusinessSelectorSkeleton />
						{:else if error}
							<div class="flex flex-col items-center justify-center gap-6 py-8">
								<div
									class="bg-light-four flex h-16 w-16 items-center justify-center rounded-full shadow-lg"
								>
									<ExclamationCircleIcon class="text-light-error size-8" />
								</div>
								<div class="text-center">
									<Heading level="h3" color="error">Error al cargar tus tiendas</Heading>
									<Text variant="error" color="error" class="mt-3">{error}</Text>
								</div>
							</div>
						{:else if stores.length === 0}
							<div class="py-8 text-center">
								<div
									class="ring-light-four bg-light-one_d mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full shadow-lg ring-2"
								>
									<BuildindStoreIcon class="text-light-two h-14 w-14" />
								</div>
								<Heading level="h4" class="mb-4 text-xl">No tienes tiendas</Heading>
								<Text variant="body-base" class="mb-8">
									Crea tu primera tienda para comenzar tu negocio digital
								</Text>
								<Button variant="primary" onclick={openCreateModal}>
									<PlusIcon class="mr-3 h-6 w-6" />
									Crear mi primera tienda
								</Button>
							</div>
						{:else}
							<div class="space-y-4">
								<div class="mb-6">
									<Text variant="body-sm">
										Mis tiendas ({stores.length})
									</Text>
								</div>
								<div
									class="scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-red-500 space-y-6 overflow-y-auto p-4 md:max-h-96"
								>
									{#each stores as store}
										<button
											type="button"
											class="group focus:ring-light-four relative flex w-full items-center rounded-2xl p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] focus:ring-4 focus:outline-none active:scale-[0.98] {selectedStoreId ===
											store.business_id
												? 'border-light-four_d ring-light-four_d from-light-one_d to-light-four_d bg-gradient-to-r shadow-lg ring-2'
												: ' hover:border-light-four_d hover:bg-light-four  hover:shadow-lg'}"
											onclick={() => selectStore(store.business_id)}
										>
											{#if selectedStoreId === store.business_id}
												<div
													class="bg-light-two absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full shadow-lg"
												>
													<CheckIcon class="text-light-one size-4" />
												</div>
												<div class="pointer-events-none absolute inset-0">
													<Confetti
														bind:this={confettiComponent}
														autoStart={false}
														particleCount={200}
														duration={5000}
														explosionForce={0.3}
														shapes={['square', 'rectangle']}
														fullscreen={true}
														minParticleSize={10}
														originX={window.innerWidth / 2}
														originY={window.innerHeight / 4}
														usePixelCoordinates={true}
													/>
												</div>
											{/if}

											<div class="flex min-w-0 flex-1 items-center gap-4">
												<div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
													<img
														src={logoBusinessStore.getLogoByBusinessId(store.business_id) ||
															SRC_IMG_DEFAULT}
														alt={store.business_name}
														class="h-full w-full object-cover"
													/>
												</div>

												<div class="min-w-0 flex-1 text-left">
													<Text variant="body-lg" color="primary" truncate weight="bold">
														{store.business_name}
													</Text>
													<Text variant="body-sm" truncate>
														{store.business_description}
													</Text>
												</div>
											</div>

											<div class="ml-4 flex-shrink-0">
												<ChevronRightIcon
													class="text-light-three group-hover:text-light-three_d size-5 font-bold transition-all duration-300 group-hover:translate-x-1"
												/>
											</div>
										</button>
									{/each}
								</div>

								
								<div class="space-y-4 pt-6">
									<Button type="button" variant="secondary" fullWidth onclick={openCreateModal}>
										<PlusIcon class="mr-3 h-5 w-5" />
										Crear nueva tienda
									</Button>

									<Button
										type="button"
										variant="primary"
										fullWidth
										disabled={isNotSelectedStore || isLoadingToApp}
										loading={isLoadingToApp}
										onclick={continueToApp}
									>
										Continuar
									</Button>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-12 flex justify-center lg:hidden">
		<Button type="button" variant="link" onclick={() => redirect('/auth/sign-in')}>
			<ChevronLeftIcon class="mr-2 h-5 w-5" />
			Volver al login
		</Button>
	</div>

</div> -->

{#if isCreateModalOpen}
	<div
		class="fixed inset-0 z-50 overflow-y-auto"
		aria-labelledby="modal-title"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="bg-light-one_d flex h-full min-h-screen items-end justify-center text-center sm:block sm:p-0"
		>
			<div
				class="bg-light-one_d relative inline-block transform overflow-hidden rounded-lg text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
			>
				<div class="absolute top-0 right-0">
					<Button type="button" variant="ghost" onclick={closeCreateModal}>
						<XIcon class="text-light-two hover:text-light-two_d h-6 w-6" />
					</Button>
				</div>

				<div class="px-4 py-4 md:px-6">
					<div class="sm:flex sm:items-start">
						<div class="mt-3 w-full text-center sm:mt-0 sm:text-left">
							<Heading level="h3" class="text-center">Crear nueva tienda</Heading>
							<Text variant="body-sm" class="mt-1 text-center">
								Completa la información para crear tu tienda. Podrás editar estos datos más
								adelante.
							</Text>

							{#if createStoreError}
								<div class="mt-4 rounded-md bg-red-50 p-4">
									<div class="flex">
										<div class="flex-shrink-0">
											<ExclamationCircleIcon />
										</div>
										<div class="ml-3">
											<Text variant="error" color="error">{createStoreError}</Text>
										</div>
									</div>
								</div>
							{/if}

							<form class="mt-6 space-y-6">
								<Input
									label="Nombre de la tienda"
									placeholder="Ej: Mi Tienda Online"
									required
									bind:value={newStore.business_name}
								/>
								<Input
									label="Descripción de la tienda"
									placeholder="Ej: Venta de productos artesanales"
									required
									type="textarea"
									bind:value={newStore.business_description}
								/>
								<ImageUploader
									label="Logo de la tienda"
									storageMode="thumbnail"
									thumbnailSize={150}
									quality={0.7}
									returnDataUrl={true}
									callback={(value: any) => (logoPreview = value)}
								/>

								<div class="flex justify-between gap-2">
									<Button type="button" variant="secondary" onclick={closeCreateModal}
										>Cancelar</Button
									>
									<Button
										type="button"
										variant="primary"
										loading={isCreatingStore}
										disabled={isCreatingStore}
										onclick={createStore}
									>
										Crear tienda
									</Button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
