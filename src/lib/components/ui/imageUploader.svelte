<script lang="ts">
	import Button from './button.svelte';
	import PhotoIcon from '$lib/icons/outline/photoIcon.svelte';
	import XIcon from '$lib/icons/outline/xIcon.svelte';
	import PlusIcon from '$lib/icons/outline/plusIcon.svelte';

	interface Props {
		label?: string;
		imageUrl?: string | null;
		imageUrls?: string[];
		multiple?: boolean;
		maxFiles?: number;
		id?: string;
		callback?: (value: string | null | string[] | File | File[]) => void;
		acceptedTypes?: string;
		disabled?: boolean;
		enableOptimization?: boolean;
		maxWidth?: number;
		maxHeight?: number;
		quality?: number;
		convertToWebP?: boolean;
		maxSizeKB?: number;
		// Nuevas opciones para almacenamiento
		storageMode?: 'base64' | 'compressed' | 'thumbnail' | 'original';
		thumbnailSize?: number;
		returnDataUrl?: boolean;
	}

	let {
		label = '',
		imageUrl = null,
		imageUrls = [],
		multiple = false,
		maxFiles = 5,
		id = '',
		callback = (value) => {},
		acceptedTypes = 'image/*',
		disabled = false,
		enableOptimization = true,
		maxWidth = 1920,
		maxHeight = 1080,
		quality = 0.8,
		convertToWebP = true,
		maxSizeKB = 500,
		// Nuevos valores por defecto
		storageMode = 'compressed',
		thumbnailSize = 150,
		returnDataUrl = true
	}: Props = $props();

	if (!id) {
		id =
			label.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 7);
	}

	let previews: string[] = $state([]);
	let fileInput: HTMLInputElement;
	let dropzone: HTMLDivElement;
	let isDragging = $state(false);
	let isProcessing = $state(false);
	let fileObjects: File[] = $state([]);
	let processedData: string[] = $state([]); // Para guardar datos procesados

	$effect(() => {
		if (multiple) {
			if (imageUrl && !Array.isArray(imageUrls)) {
				previews = imageUrl ? [imageUrl] : [];
			} else {
				previews = [...imageUrls];
			}
		} else if (imageUrl) {
			previews = [imageUrl];
		} else {
			previews = [];
		}
	});

	// Función para procesar imagen según el modo de almacenamiento
	async function processImageForStorage(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			const img = new Image();

			img.onload = () => {
				let { width, height } = img;
				let targetQuality = quality;
				let targetFormat = 'image/jpeg';

				// Configurar según el modo de almacenamiento
				switch (storageMode) {
					case 'thumbnail':
						// Crear thumbnail pequeño para localStorage
						const maxDim = thumbnailSize;
						const ratio = Math.min(maxDim / width, maxDim / height);
						width = width * ratio;
						height = height * ratio;
						targetQuality = 0.7;
						targetFormat = 'image/jpeg';
						break;

					case 'compressed':
						// Comprimir manteniendo calidad visual
						if (width > maxWidth || height > maxHeight) {
							const ratio = Math.min(maxWidth / width, maxHeight / height);
							width *= ratio;
							height *= ratio;
						}
						targetFormat = convertToWebP && supportsWebP() ? 'image/webp' : 'image/jpeg';
						break;

					case 'base64':
						// Optimizar para base64 (más pequeño)
						const maxBase64Size = Math.min(maxWidth * 0.7, 800);
						if (width > maxBase64Size || height > maxBase64Size) {
							const ratio = Math.min(maxBase64Size / width, maxBase64Size / height);
							width *= ratio;
							height *= ratio;
						}
						targetQuality = 0.6;
						targetFormat = 'image/jpeg';
						break;

					case 'original':
						// Mantener tamaño original pero optimizar formato
						targetFormat = convertToWebP && supportsWebP() ? 'image/webp' : 'image/jpeg';
						break;
				}

				canvas.width = width;
				canvas.height = height;
				ctx?.drawImage(img, 0, 0, width, height);

				// Función recursiva para ajustar calidad
				const tryCompress = (currentQuality: number) => {
					canvas.toBlob(
						(blob) => {
							if (!blob) {
								reject(new Error('Error processing image'));
								return;
							}

							const sizeKB = blob.size / 1024;
							console.log(
								`📷 Imagen procesada: ${width}x${height}, ${sizeKB.toFixed(1)}KB, calidad: ${Math.round(currentQuality * 100)}%`
							);

							// Para localStorage, verificar límites más estrictos
							const maxLocalStorageKB = storageMode === 'thumbnail' ? 50 : maxSizeKB;

							if (sizeKB <= maxLocalStorageKB || currentQuality <= 0.1) {
								// Convertir a data URL si se requiere
								if (returnDataUrl) {
									const reader = new FileReader();
									reader.onload = () => {
										resolve(reader.result as string);
									};
									reader.onerror = () => reject(new Error('Error reading processed image'));
									reader.readAsDataURL(blob);
								} else {
									// Crear URL temporal
									resolve(URL.createObjectURL(blob));
								}
							} else {
								// Reducir calidad y probar nuevamente
								tryCompress(Math.max(currentQuality - 0.1, 0.1));
							}
						},
						targetFormat,
						currentQuality
					);
				};

				tryCompress(targetQuality);
			};

			img.onerror = () => reject(new Error('Error loading image'));
			img.src = URL.createObjectURL(file);
		});
	}

	// Detectar soporte para WebP
	function supportsWebP(): boolean {
		const canvas = document.createElement('canvas');
		canvas.width = 1;
		canvas.height = 1;
		return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
	}

	function triggerFileInput() {
		fileInput?.click();
	}

	async function processFiles(files: FileList | null) {
		if (!files) return;

		const filesToProcess = multiple ? Math.min(files.length, maxFiles - previews.length) : 1;

		if (!multiple) {
			previews = [];
			fileObjects = [];
			processedData = [];
		}

		isProcessing = true;

		try {
			const validFiles = Array.from(files)
				.filter((file) => file.type.startsWith('image/'))
				.slice(0, filesToProcess);

			const results = await Promise.all(
				validFiles.map(async (file) => {
					try {
						const processedImageData = await processImageForStorage(file);
						return {
							file,
							processedData: processedImageData,
							previewUrl: processedImageData.startsWith('data:')
								? processedImageData
								: URL.createObjectURL(file)
						};
					} catch (error) {
						console.error('Error procesando imagen:', error);
						return {
							file,
							processedData: URL.createObjectURL(file),
							previewUrl: URL.createObjectURL(file)
						};
					}
				})
			);

			if (multiple) {
				fileObjects = [...fileObjects, ...results.map((r) => r.file)];
				processedData = [...processedData, ...results.map((r) => r.processedData)];
				previews = [...previews, ...results.map((r) => r.previewUrl)];
				callback?.(returnDataUrl ? processedData : fileObjects);
			} else if (results.length > 0) {
				const result = results[0];
				fileObjects = [result.file];
				processedData = [result.processedData];
				previews = [result.previewUrl];
				callback?.(returnDataUrl ? result.processedData : result.file);
			}

			// Log de información
			console.log(`✅ Procesadas ${results.length} imágenes en modo: ${storageMode}`);
			if (returnDataUrl) {
				const totalSize = processedData.reduce((sum, data) => {
					return sum + (data.startsWith('data:') ? data.length * 0.75 : 0); // Aproximar tamaño base64
				}, 0);
				console.log(`💾 Tamaño estimado para almacenamiento: ${(totalSize / 1024).toFixed(1)}KB`);
			}
		} finally {
			isProcessing = false;
		}
	}

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		processFiles(target.files);
		target.value = '';
	}

	function handleDragEnter(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		isDragging = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		isDragging = false;
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		isDragging = true;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		isDragging = false;

		if (event.dataTransfer?.files) {
			processFiles(event.dataTransfer.files);
		}
	}

	function removePreview(index: number) {
		if (multiple) {
			// Limpiar URLs temporales
			if (previews[index] && !previews[index].startsWith('data:')) {
				URL.revokeObjectURL(previews[index]);
			}

			previews = previews.filter((_, i) => i !== index);
			fileObjects = fileObjects.filter((_, i) => i !== index);
			processedData = processedData.filter((_, i) => i !== index);
			callback?.(returnDataUrl ? processedData : fileObjects);
		} else {
			// Limpiar URL temporal
			if (previews[0] && !previews[0].startsWith('data:')) {
				URL.revokeObjectURL(previews[0]);
			}

			previews = [];
			fileObjects = [];
			processedData = [];
			callback?.(null);
		}
	}

	function getPreviewUrl(item: string | File): string {
		if (typeof item === 'string') {
			return item;
		} else {
			return URL.createObjectURL(item);
		}
	}

	// Función helper para obtener los datos procesados
	export function getProcessedData() {
		return multiple ? processedData : processedData[0] || null;
	}

	// Función para estimar el tamaño en localStorage
	export function getEstimatedStorageSize(): number {
		return processedData.reduce((sum, data) => {
			if (data.startsWith('data:')) {
				return sum + data.length * 0.75; // Base64 overhead
			}
			return sum;
		}, 0);
	}
</script>

<div class="w-full">
	{#if label}
		<span class="text-light-two mb-2 block text-start text-sm font-medium">{label}</span>
	{/if}

	<!-- {#if enableOptimization}
		<div class="bg-light-one_d mb-3 rounded-md p-2">
			<p class="text-light-two text-xs">
				<strong>Modo:</strong>
				{storageMode}
				{#if storageMode === 'thumbnail'}
					({thumbnailSize}px max)
				{:else if storageMode === 'compressed'}
					({maxWidth}x{maxHeight}px max, {maxSizeKB}KB max)
				{/if}
				• <strong>Formato:</strong>
				{convertToWebP && supportsWebP() ? 'WebP' : 'JPEG'}
			</p>
		</div>
	{/if} -->

	<div class="grid gap-4">
		<div
			bind:this={dropzone}
			class="bg-light-one hover:bg-light-one_d flex w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-6 transition-colors duration-200 {isDragging
				? 'border-blue-500 bg-blue-50'
				: 'border-gray-300'} {isProcessing ? 'pointer-events-none opacity-50' : ''}"
			ondragenter={!disabled ? handleDragEnter : null}
			ondragleave={!disabled ? handleDragLeave : null}
			ondragover={!disabled ? handleDragOver : null}
			ondrop={!disabled ? handleDrop : null}
			onclick={!disabled ? triggerFileInput : null}
			aria-label="Subir archivo"
		>
			{#if multiple}
				<div
					class="border-light-four flex h-16 w-16 items-center justify-center rounded-full border"
				>
					{#if isProcessing}
						<div class="border-light-two h-8 w-8 animate-spin rounded-full border-b-2"></div>
					{:else}
						<PhotoIcon class="text-light-two size-12" />
					{/if}
				</div>
			{:else}
				<div
					class="relative flex h-16 w-16 items-center justify-center rounded-full {previews.length >
					0
						? 'group'
						: 'border-light-four border'}"
				>
					{#if isProcessing}
						<div class="border-light-two h-8 w-8 animate-spin rounded-full border-b-2"></div>
					{:else if previews.length > 0}
						<img
							src={getPreviewUrl(previews[0])}
							alt="Preview"
							class="h-full w-full rounded-full object-cover"
						/>
						<button
							{disabled}
							onclick={(event) => {
								event.stopPropagation();
								removePreview(0);
							}}
							class="bg-light-three text-light-one absolute top-0 right-0 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100 {disabled &&
								'cursor-not-allowed opacity-50'}"
							aria-label="Remove image"
						>
							<XIcon />
						</button>
					{:else}
						<PhotoIcon class="text-light-two size-12" />
					{/if}
				</div>
			{/if}

			<!-- Text -->
			<div class="text-center">
				{#if isProcessing}
					<p class="text-light-three text-sm font-medium">Procesando imágenes...</p>
					<p class="text-light-two_d mt-1 text-xs">Optimizando para {storageMode}</p>
				{:else}
					<p class="text-light-two text-sm font-medium">
						Subir {multiple ? 'archivos' : 'un archivo'}
					</p>
					<p class="text-light-two_d mt-1 text-xs">o arrastrar y soltar</p>
				{/if}
				{#if multiple}
					<p class="text-light-two mt-1 text-xs font-medium">
						Seleccionar hasta {maxFiles} imágenes
					</p>
				{/if}
			</div>

			<!-- Button -->
			<Button
				type="button"
				variant="secondary"
				size="sm"
				disabled={disabled || isProcessing || (multiple && previews.length >= maxFiles)}
			>
				{#if isProcessing}
					Procesando...
				{:else if multiple}
					{#if previews.length > 0}
						Agregar más imágenes ({previews.length}/{maxFiles})
					{:else}
						Seleccionar múltiples imágenes ({maxFiles} max)
					{/if}
				{:else if previews.length > 0}
					Cambiar imagen
				{:else}
					Seleccionar archivo
				{/if}
			</Button>

			<input
				{disabled}
				type="file"
				{id}
				bind:this={fileInput}
				class="hidden"
				accept={acceptedTypes}
				{multiple}
				onchange={handleFileSelect}
			/>
		</div>
	</div>

	{#if multiple && previews.length > 0}
		<div class="mt-4">
			<p class="text-light-two_d mb-2 text-sm font-medium">
				Imágenes ({previews.length}/{maxFiles})
				{#if previews.length < maxFiles}
					<span class="text-light-two">
						- Arrastrar más imágenes o hacer clic en el botón de subir para agregar más
					</span>
				{:else}
					<span class="text-light-three"> - Máximo número de imágenes alcanzado</span>
				{/if}
			</p>
			<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
				{#each previews as previewUrl, index (previewUrl)}
					<div
						class="group border-light-four relative aspect-square overflow-hidden rounded-md border"
					>
						<img
							src={getPreviewUrl(previewUrl)}
							alt="Preview {index + 1}"
							class="h-full w-full object-cover"
						/>
						<div
							class="bg-opacity-0 group-hover:bg-opacity-10 absolute inset-0 bg-black transition-opacity"
						></div>
						<button
							{disabled}
							onclick={() => removePreview(index)}
							class="bg-light-three text-light-one absolute top-2 right-2 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100 {disabled &&
								'cursor-not-allowed opacity-50'}"
							aria-label="Remove image {index + 1}"
						>
							<XIcon />
						</button>
					</div>
				{/each}

				{#if previews.length < maxFiles}
					<div
						class="border-light-four hover:border-light-four_d flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors {isProcessing
							? 'pointer-events-none opacity-50'
							: ''}"
						onclick={!isProcessing ? triggerFileInput : null}
					>
						{#if isProcessing}
							<div class="border-light-two h-6 w-6 animate-spin rounded-full border-b-2"></div>
						{:else}
							<PlusIcon class="text-light-two size-10" />
							<span class="text-light-two_d mt-2 text-xs">Agregar más</span>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
