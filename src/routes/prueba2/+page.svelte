<script>
	import { onMount } from 'svelte';

	// Variables reactivas
	let session = null;
	let isLoading = false;
	let isModelReady = false;
	let selectedImage = null;
	let imagePreview = null;
	let response = '';
	let error = '';
	let downloadProgress = 0;
	let isDownloading = false;
	let diagnosticInfo = '';

	// Verificar disponibilidad y crear sesión al montar el componente
	onMount(async () => {
		await checkAvailabilityAndCreateSession();
	});

	// Función para verificar disponibilidad y crear sesión
	async function checkAvailabilityAndCreateSession() {
		try {
			error = '';
			diagnosticInfo = '';

			// Diagnóstico detallado
			const diagnostics = [];

			// Verificar APIs disponibles
			diagnostics.push(`LanguageModel disponible: ${!!window.LanguageModel}`);
			diagnostics.push(`AI disponible: ${!!window.ai}`);
			diagnostics.push(
				`User Agent: ${navigator.userAgent.includes('Chrome') ? 'Chrome detectado' : 'Chrome no detectado'}`
			);

			if (!window.LanguageModel && !window.ai?.languageModel) {
				diagnosticInfo = diagnostics.join('\n');
				throw new Error(`La API de Prompt no está disponible.`);
			}

			// Intentar forzar la descarga primero
			let availability;

			try {
				// Llamar a availability SIN parámetros primero
				availability = await LanguageModel.availability();
				diagnostics.push(`Disponibilidad básica: ${availability}`);

				// Si no está disponible, intentar crear sesión para forzar descarga
				if (availability === 'unavailable') {
					diagnostics.push('Intentando forzar descarga del modelo...');

					// Intentar crear sesión básica para triggear descarga
					try {
						const testSession = await LanguageModel.create();
						diagnostics.push('Sesión de prueba creada exitosamente');
						await testSession.destroy();

						// Volver a verificar disponibilidad
						availability = await LanguageModel.availability();
						diagnostics.push(`Disponibilidad después de crear sesión: ${availability}`);
					} catch (createError) {
						diagnostics.push(`Error al crear sesión de prueba: ${createError.message}`);
					}
				}
			} catch (e) {
				diagnostics.push(`Error al verificar disponibilidad: ${e.message}`);
				throw e;
			}

			diagnosticInfo = diagnostics.join('\n');
			console.log('Diagnósticos:', diagnosticInfo);

			if (availability === 'unavailable') {
				throw new Error(`El modelo sigue sin estar disponible después de intentar forzar la descarga.

DIAGNÓSTICO COMPLETO:
${diagnosticInfo}

SOLUCIONES INMEDIATAS:
1. Ve a chrome://components/ → Busca "Optimization Guide On Device Model" → "Check for update"
2. Si no aparece ese componente, espera 30-60 minutos después de habilitar los flags
3. Verifica que tengas suficiente espacio en disco (2GB+)
4. Verifica RAM disponible (4GB+ libres)

COMANDOS PARA PROBAR EN CONSOLA:
LanguageModel.availability().then(console.log);
LanguageModel.create().then(s => console.log('Sesión creada:', s));`);
			}

			// Si el modelo necesita descarga
			if (availability === 'downloadable') {
				isDownloading = true;
				diagnostics.push('Modelo necesita descarga - iniciando...');
				console.log('Descargando modelo...');
			}

			// Crear sesión (empezar sin imágenes)
			session = await LanguageModel.create({
				monitor(monitor) {
					monitor.addEventListener('downloadprogress', (event) => {
						downloadProgress = Math.round(event.loaded * 100);
						console.log(`Descargado: ${downloadProgress}%`);
					});
				}
			});

			isDownloading = false;
			isModelReady = true;
			diagnostics.push('Sesión creada exitosamente');
			diagnosticInfo = diagnostics.join('\n');
			console.log('Sesión creada exitosamente');
		} catch (err) {
			error = err.message;
			isDownloading = false;
			console.error('Error al crear sesión:', err);
		}
	}

	// Función para manejar la selección de imagen
	function handleImageSelect(event) {
		const file = event.target.files[0];
		if (file && file.type.startsWith('image/')) {
			selectedImage = file;

			// Crear preview de la imagen
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreview = e.target.result;
			};
			reader.readAsDataURL(file);

			// Limpiar respuesta anterior
			response = '';
			error = '';
		} else {
			error = 'Por favor selecciona un archivo de imagen válido.';
		}
	}

	// Función para probar solo texto
	async function testTextOnly() {
		if (!session) {
			error = 'Sesión no está lista.';
			return;
		}

		try {
			isLoading = true;
			error = '';
			response = '';

			console.log('Probando funcionalidad de texto...');

			const result = await session.prompt('Escríbeme un poema corto sobre la tecnología.');
			response = `PRUEBA DE TEXTO EXITOSA:\n\n${result}`;
			console.log('Prueba de texto completada:', result);
		} catch (err) {
			error = `Error en prueba de texto: ${err.message}`;
			console.error('Error:', err);
		} finally {
			isLoading = false;
		}
	}

	// Función para analizar la imagen
	async function analyzeImage() {
		if (!session || !selectedImage) {
			error = 'No hay imagen seleccionada o sesión no está lista.';
			return;
		}

		try {
			isLoading = true;
			error = '';
			response = '';

			console.log('Analizando imagen...');

			// Intentar con contenido multimodal si es posible
			try {
				const result = await session.prompt([
					{
						role: 'user',
						content: [
							{
								type: 'text',
								value:
									'Describe detalladamente lo que ves en esta imagen. Menciona objetos, colores, personas, acciones y cualquier detalle relevante.'
							},
							{
								type: 'image',
								value: selectedImage
							}
						]
					}
				]);
				response = result;
			} catch (multimodalError) {
				console.warn('Error multimodal, intentando solo texto:', multimodalError);
				// Fallback: solo texto
				const result = await session.prompt(
					'Describe una imagen genérica para probar la funcionalidad de texto del modelo.'
				);
				response = `MODO TEXTO (imagen no procesada): ${result}`;
			}

			console.log('Análisis completado:', response);
		} catch (err) {
			error = `Error al analizar imagen: ${err.message}`;
			console.error('Error:', err);
		} finally {
			isLoading = false;
		}
	}

	// Función para limpiar la selección
	function clearSelection() {
		selectedImage = null;
		imagePreview = null;
		response = '';
		error = '';
	}

	// Limpiar recursos al desmontar
	onMount(() => {
		return () => {
			if (session) {
				session.destroy();
			}
		};
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1 class="mb-2 text-3xl font-bold text-gray-800">Analizador de Imágenes con Gemini Nano</h1>
			<p class="text-gray-600">
				Carga una imagen y obtén una descripción detallada usando IA local
			</p>
		</div>

		<!-- Estado del modelo -->
		<div class="mb-6 rounded-lg bg-white p-6 shadow-md">
			<h2 class="mb-3 text-lg font-semibold text-gray-800">Estado del Modelo</h2>

			{#if diagnosticInfo}
				<div class="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
					<p class="mb-2 text-sm font-medium text-blue-800">Información de diagnóstico:</p>
					<pre class="text-xs whitespace-pre-wrap text-blue-700">{diagnosticInfo}</pre>
				</div>
			{/if}

			{#if isDownloading}
				<div class="flex items-center space-x-3">
					<div class="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
					<span class="text-blue-600">Descargando modelo: {downloadProgress}%</span>
				</div>
				<div class="mt-2 h-2 rounded-full bg-gray-200">
					<div
						class="h-2 rounded-full bg-blue-600 transition-all duration-300"
						style="width: {downloadProgress}%"
					></div>
				</div>
			{:else if isModelReady}
				<div class="flex items-center space-x-2">
					<div class="h-3 w-3 rounded-full bg-green-500"></div>
					<span class="font-medium text-green-700">Modelo listo para usar</span>
				</div>
			{:else if error}
				<div class="flex items-center space-x-2">
					<div class="h-3 w-3 rounded-full bg-red-500"></div>
					<span class="font-medium text-red-700">Error en la inicialización</span>
				</div>
			{:else}
				<div class="flex items-center space-x-3">
					<div class="h-5 w-5 animate-spin rounded-full border-b-2 border-blue-600"></div>
					<span class="text-blue-600">Inicializando modelo...</span>
				</div>
			{/if}
		</div>

		<!-- Selector de imagen -->
		<div class="mb-6 rounded-lg bg-white p-6 shadow-md">
			<h2 class="mb-4 text-lg font-semibold text-gray-800">Seleccionar Imagen</h2>

			<div class="space-y-4">
				<div class="flex items-center space-x-4">
					<label
						class="relative cursor-pointer rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
					>
						<span>Seleccionar Imagen</span>
						<input
							type="file"
							class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
							accept="image/*"
							on:change={handleImageSelect}
							disabled={!isModelReady}
						/>
					</label>

					{#if selectedImage}
						<button
							on:click={clearSelection}
							class="rounded-md bg-gray-500 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-600"
						>
							Limpiar
						</button>
					{/if}
				</div>

				<!-- Preview de imagen -->
				{#if imagePreview}
					<div class="rounded-lg border-2 border-dashed border-gray-300 p-4">
						<img
							src={imagePreview}
							alt="Preview"
							class="mx-auto h-auto max-h-64 max-w-full rounded-lg shadow-sm"
						/>
						<p class="mt-2 text-center text-sm text-gray-600">
							{selectedImage.name} ({Math.round(selectedImage.size / 1024)} KB)
						</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- Botón de análisis -->
		{#if isModelReady}
			<div class="mb-6 space-y-3 text-center">
				<!-- Botón para probar solo texto -->
				<button
					on:click={() => testTextOnly()}
					disabled={isLoading}
					class="mx-auto flex items-center space-x-2 rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
				>
					{#if isLoading}
						<div class="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
						<span>Probando...</span>
					{:else}
						<span>Probar Solo Texto (Sin Imagen)</span>
					{/if}
				</button>

				<!-- Botón para analizar imagen -->
				{#if selectedImage}
					<button
						on:click={analyzeImage}
						disabled={isLoading}
						class="mx-auto flex items-center space-x-2 rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
					>
						{#if isLoading}
							<div class="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
							<span>Analizando...</span>
						{:else}
							<span>Analizar Imagen</span>
						{/if}
					</button>
				{/if}
			</div>
		{/if}

		<!-- Errores -->
		{#if error}
			<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
				<div class="flex items-start space-x-2">
					<div class="mt-1 text-red-600">
						<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="flex-1">
						<p class="font-medium text-red-800">Error:</p>
						<pre class="mt-1 text-sm whitespace-pre-wrap text-red-700">{error}</pre>
					</div>
				</div>
			</div>
		{/if}

		<!-- Respuesta -->
		{#if response}
			<div class="rounded-lg bg-white p-6 shadow-md">
				<h2 class="mb-4 text-lg font-semibold text-gray-800">Análisis de la Imagen</h2>
				<div class="rounded-lg border bg-gray-50 p-4">
					<p class="leading-relaxed whitespace-pre-wrap text-gray-800">{response}</p>
				</div>
			</div>
		{/if}
	</div>
</div>
