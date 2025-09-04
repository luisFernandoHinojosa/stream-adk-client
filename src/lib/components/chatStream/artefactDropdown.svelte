<script lang="ts">
	import { CheckIcon, PhotoIcon, ChevronDownIcon } from '$lib/icons/outline';
	import ChevronRightIcon from '$lib/icons/outline/chevronRightIcon.svelte';
	import XmarkIcon from '$lib/icons/outline/xmarkIcon.svelte';
	import FilePencilIcon from '$lib/icons/solid/filePencilIcon.svelte';
	import { onMount } from 'svelte';
	import { scale, slide } from 'svelte/transition';

	// Props
	export let isOpen = false;
	export let currentArtifactType: number = 1;
	export let currentArtifactChild: string | null = null;
	export let onSelect: (type: any, child?: any) => void;
	export let onToggle: (isOpen: boolean) => void;
	export let id: string;

	// Estado para controlar qué artefactos tienen sus hijos expandidos
	let expandedArtifacts = new Set<number>();

	// Definición de tipos de artefactos con sus hijos
	const artifactTypes = [
		{
			id: 1,
			name: 'Documento',
			description: 'Archivos de texto y documentos',
			icon: FilePencilIcon,
			children: [
				{ id: 'doc1', name: 'documento1.txt', description: 'Archivo de texto principal' },
				{ id: 'doc2', name: 'notas.txt', description: 'Notas personales' },
				{ id: 'doc3', name: 'readme.txt', description: 'Documentación del proyecto' }
			]
		},
		{
			id: 2,
			name: 'Imagen',
			description: 'Archivos imágenes',
			icon: PhotoIcon,
			children: [
				{ id: 'img1', name: 'image1.png', description: 'Captura de pantalla' },
				{ id: 'img2', name: 'image2.jpg', description: 'Fotografía del evento' },
				{ id: 'img3', name: 'image3.png', description: 'Logo de la empresa' },
				{ id: 'img4', name: 'banner.jpg', description: 'Banner promocional' }
			]
		},
		{
			id: 3,
			name: 'Markdown',
			description: 'Documentos con formato MD',
			icon: FilePencilIcon,
			children: [
				{ id: 'md1', name: 'README.md', description: 'Documentación principal' },
				{ id: 'md2', name: 'CHANGELOG.md', description: 'Registro de cambios' }
			]
		},
		{
			id: 4,
			name: 'Pdf',
			description: 'Documentos con formato PDF',
			icon: FilePencilIcon,
			children: [
				{ id: 'pdf1', name: 'manual.pdf', description: 'Manual de usuario' },
				{ id: 'pdf2', name: 'diagrama.pdf', description: 'Diagrama técnico' }
			]
		},
		{
			id: 5,
			name: 'Csv',
			description: 'Documentos con formato CSV',
			icon: FilePencilIcon,
			children: [
				{ id: 'csv1', name: 'datos.csv', description: 'Base de datos principal' },
				{ id: 'csv2', name: 'usuarios.csv', description: 'Lista de usuarios' }
			]
		},
		{
			id: 6,
			name: 'Html',
			description: 'Documentos con formato HTML',
			icon: FilePencilIcon,
			children: [
				{ id: 'html1', name: 'datos.html', description: 'Base de datos principal' },
				{ id: 'html2', name: 'usuarios.html', description: 'Lista de usuarios' }
			]
		}
	];

	function toggleDropdown() {
		isOpen = !isOpen;
		//onToggle?.(isOpen);
	}

	function toggleArtifactExpansion(artifactId: number) {
		if (expandedArtifacts.has(artifactId)) {
			expandedArtifacts.delete(artifactId);
		} else {
			expandedArtifacts.add(artifactId);
		}
		expandedArtifacts = expandedArtifacts;
	}

	function selectArtifact(type: (typeof artifactTypes)[0], child?: any) {
		currentArtifactType = type.id;
		currentArtifactChild = child?.id || null;
		isOpen = false;
		onSelect?.(type, child);
		onToggle?.(false);
	}

	// onMount(() => {
	// 	document.addEventListener('click', handleClickOutside);
	// 	return () => {
	// 		document.removeEventListener('click', handleClickOutside);
	// 	};
	// });

	// Obtener el tipo actual
	$: currentType =
		artifactTypes.find((type) => type.id === currentArtifactType) || artifactTypes[0];
	$: currentChildData = currentType.children?.find((child) => child.id === currentArtifactChild);
</script>

<div class="relative flex items-center justify-center">
	<!-- Botón principal -->
	<button
		class="group flex transform items-center justify-center rounded-full bg-light-two p-1 text-light-one shadow-xl transition-all duration-300 hover:scale-110 hover:bg-light-two_d hover:shadow-2xl focus:ring-2 focus:ring-light-three focus:ring-offset-2 focus:outline-none lg:h-14 lg:w-14 dark:bg-dark-two dark:text-dark-one dark:hover:bg-dark-two_d dark:focus:ring-offset-dark-one"
		on:click={toggleDropdown}
		aria-label="Seleccionar tipo de artefacto"
		aria-expanded={isOpen}
		aria-haspopup="true"
	>
		<svelte:component
			this={currentType.icon}
			class="h-6 w-6 transition-transform duration-200 lg:h-10 lg:w-10 {isOpen ? 'rotate-12' : ''}"
		/>
	</button>

	{#if isOpen}
		<!-- Overlay para mobile -->
		<div class="fixed inset-0 z-40 bg-black/50 md:hidden"></div>

		<!-- Dropdown Container -->
		<div
			class="
				ring-opacity-5 dark:ring-opacity-10 fixed inset-x-0 bottom-0 z-50 max-h-[85vh]
				w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl ring-1 ring-black backdrop-blur-sm
				md:absolute md:inset-x-auto md:top-12 md:right-0 md:bottom-auto md:max-h-80 md:w-80
				md:rounded-xl dark:bg-gray-800 dark:ring-white
			"
			transition:scale={{ duration: 200, start: 0.95 }}
		>
			<!-- Header del dropdown -->
			<div
				class="sticky top-0 z-10 border-b border-gray-100 bg-white px-4 py-3 md:py-2 dark:border-gray-700 dark:bg-gray-800"
			>
				<div class="flex items-center justify-between">
					<div>
						<h3 class="text-base font-semibold text-gray-900 md:text-sm dark:text-gray-100">
							Tipos de Artefactos
						</h3>
						{#if currentChildData}
							<p class="mt-1 text-sm text-blue-600 md:text-xs dark:text-blue-400">
								{currentChildData.name}
							</p>
						{/if}
					</div>

					<!-- Botón cerrar solo en mobile -->
					<button
						class="p-2 text-gray-400 transition-colors hover:text-gray-600 md:hidden dark:hover:text-gray-200"
						on:click={toggleDropdown}
						aria-label="Cerrar"
					>
						<XmarkIcon className="h-6 w-6" />
					</button>
				</div>

				<!-- Indicador de deslizamiento en mobile -->
				<div class="flex justify-center pt-2 md:hidden">
					<div class="h-1 w-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
				</div>
			</div>

			<!-- Lista de artefactos -->
			<div class="flex-1 overflow-y-auto">
				{#each artifactTypes as artifactType (artifactType.id)}
					<div class="border-b border-gray-50 last:border-b-0 dark:border-gray-700">
						<!-- Artefacto padre -->
						<div class="flex">
							<!-- Botón para seleccionar el artefacto padre -->
							<button
								class="group flex flex-1 items-center gap-3 px-4 py-4 text-left transition-all duration-200 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none md:py-3 dark:hover:bg-gray-700 dark:focus:bg-gray-700 {currentArtifactType ===
									artifactType.id && !currentArtifactChild
									? 'bg-blue-50 dark:bg-blue-900/20'
									: ''}"
								on:click={() => selectArtifact(artifactType)}
								aria-label="Seleccionar {artifactType.name}"
							>
								<!-- Icono -->
								<div
									class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 transition-colors duration-200 group-hover:bg-gray-200 md:h-10 md:w-10 dark:bg-gray-700 dark:group-hover:bg-gray-600 {currentArtifactType ===
										artifactType.id && !currentArtifactChild
										? 'bg-blue-100 dark:bg-blue-900/40'
										: ''}"
								>
									<svelte:component this={artifactType.icon} class="h-6 w-6 md:h-5 md:w-5" />
								</div>

								<!-- Contenido -->
								<div class="min-w-0 flex-1">
									<div class="flex items-center gap-2">
										<h4 class="text-base font-medium text-gray-900 md:text-sm dark:text-gray-100">
											{artifactType.name}
										</h4>
										{#if artifactType.children?.length}
											<span
												class="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-600 dark:text-gray-300"
											>
												{artifactType.children.length}
											</span>
										{/if}
									</div>
									<p class="text-sm text-gray-500 md:text-xs dark:text-gray-400">
										{artifactType.description}
									</p>
								</div>

								<!-- Indicador visual -->
								<div
									class="opacity-0 transition-opacity duration-200 {currentArtifactType ===
										artifactType.id && !currentArtifactChild
										? 'opacity-100'
										: ''}"
								>
									<CheckIcon class="h-5 w-5 text-blue-600 md:h-4 md:w-4 dark:text-blue-400" />
								</div>
							</button>

							<!-- Botón para expandir/colapsar hijos -->
							{#if artifactType.children?.length}
								<button
									class="flex w-12 items-center justify-center px-2 py-4 text-gray-400 transition-colors duration-200 hover:text-gray-600 md:w-10 md:py-3 dark:hover:text-gray-200"
									on:click={() => toggleArtifactExpansion(artifactType.id)}
									aria-label="{expandedArtifacts.has(artifactType.id)
										? 'Colapsar'
										: 'Expandir'} archivos de {artifactType.name}"
								>
									{#if expandedArtifacts.has(artifactType.id)}
										<ChevronDownIcon className="h-5 w-5 md:h-4 md:w-4" />
									{:else}
										<ChevronRightIcon class="h-5 w-5 md:h-4 md:w-4" />
									{/if}
								</button>
							{/if}
						</div>

						<!-- Lista de hijos (archivos) -->
						{#if artifactType.children?.length && expandedArtifacts.has(artifactType.id)}
							<div class="dark:bg-gray-850 bg-gray-50" transition:slide={{ duration: 200 }}>
								{#each artifactType.children as child (child.id)}
									<button
										class="group flex w-full items-center gap-3 py-3 pr-4 pl-8 text-left transition-all duration-200 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none md:py-2 dark:hover:bg-gray-700 dark:focus:bg-gray-700 {currentArtifactChild ===
										child.id
											? 'bg-blue-50 dark:bg-blue-900/20'
											: ''}"
										on:click={() => selectArtifact(artifactType, child)}
										aria-label="Seleccionar archivo {child.name}"
									>
										<!-- Icono de archivo -->
										<div
											class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 transition-colors duration-200 group-hover:bg-gray-200 md:h-8 md:w-8 dark:bg-gray-700 dark:group-hover:bg-gray-600 {currentArtifactChild ===
											child.id
												? 'bg-blue-100 dark:bg-blue-900/40'
												: ''}"
										>
											<svelte:component this={artifactType.icon} class="h-5 w-5 md:h-4 md:w-4" />
										</div>

										<!-- Contenido del archivo -->
										<div class="min-w-0 flex-1">
											<h5
												class="truncate text-base font-medium text-gray-800 md:text-sm dark:text-gray-200"
											>
												{child.name}
											</h5>
											<p class="truncate text-sm text-gray-500 md:text-xs dark:text-gray-400">
												{child.description}
											</p>
										</div>

										<!-- Indicador de selección -->
										<div
											class="opacity-0 transition-opacity duration-200 {currentArtifactChild ===
											child.id
												? 'opacity-100'
												: ''}"
										>
											<CheckIcon class="h-4 w-4 text-blue-600 md:h-3 md:w-3 dark:text-blue-400" />
										</div>
									</button>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
