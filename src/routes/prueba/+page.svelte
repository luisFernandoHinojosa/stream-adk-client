<script>
	import { Button } from '$lib/components';
	import { onMount } from 'svelte';

	let isSupported = false;
	let sourceText = '';
	let translatedText = '';
	let sourceLanguage = 'en';
	let targetLanguage = 'es';
	let isTranslating = false;
	let downloadProgress = 0;
	let isDownloading = false;
	let error = '';
	let translator = null;
	let detectedLanguage = '';

	// Idiomas disponibles (comunes)
	const languages = [
		{ code: 'en', name: 'English' },
		{ code: 'es', name: 'Espanol' },
		{ code: 'fr', name: 'Frances' },
		{ code: 'de', name: 'Aleman' },
		{ code: 'it', name: 'Italiano' },
		{ code: 'pt', name: 'Portugues' }
	];

	onMount(() => {
		// Verificar si la API está disponible
		if ('Translator' in self) {
			isSupported = true;
			console.log('Translator API is supported');
		} else {
			console.log('Translator API is not supported');
			error =
				'La API de Translator no está disponible en este navegador. Necesitas Chrome 124+ con la función habilitada.';
		}

		// También verificar Language Detector API
		if ('LanguageDetector' in self) {
			console.log('Language Detector API is also supported');
		}
	});

	async function detectLanguage() {
		if (!sourceText.trim() || !('LanguageDetector' in self)) return;

		try {
			const detector = await LanguageDetector.create();
			const results = await detector.detect(sourceText);
			if (results && results.length > 0) {
				detectedLanguage = results[0].detectedLanguage;
				sourceLanguage = detectedLanguage;
				console.log('Detected language:', detectedLanguage);
			}
		} catch (err) {
			console.error('Error detecting language:', err);
		}
	}

	async function createTranslator() {
		try {
			error = '';

			// Verificar disponibilidad del par de idiomas
			const capabilities = await Translator.availability({
				sourceLanguage,
				targetLanguage
			});

			console.log('Translator capabilities:', capabilities);

			if (capabilities === 'no') {
				error = `La traducción de ${sourceLanguage} a ${targetLanguage} no está disponible.`;
				return null;
			}

			// Crear el traductor con monitor de progreso
			const newTranslator = await Translator.create({
				sourceLanguage,
				targetLanguage,
				monitor(m) {
					m.addEventListener('downloadprogress', (e) => {
						downloadProgress = Math.round(e.loaded * 100);
						isDownloading = true;
						console.log(`Downloaded ${downloadProgress}%`);
					});

					m.addEventListener('downloadcomplete', () => {
						isDownloading = false;
						downloadProgress = 100;
						console.log('Download complete');
					});
				}
			});

			return newTranslator;
		} catch (err) {
			error = `Error creando el traductor: ${err.message}`;
			console.error('Error creating translator:', err);
			return null;
		}
	}

	async function translateText() {
		if (!sourceText.trim()) {
			error = 'Por favor ingresa texto para traducir.';
			return;
		}

		try {
			isTranslating = true;
			error = '';
			translatedText = '';

			// Crear nuevo traductor si es necesario o si cambió el par de idiomas
			if (!translator) {
				translator = await createTranslator();
				if (!translator) {
					isTranslating = false;
					return;
				}
			}

			// Realizar la traducción
			const result = await translator.translate(sourceText);
			translatedText = result;
		} catch (err) {
			error = `Error en la traducción: ${err.message}`;
			console.error('Translation error:', err);
		} finally {
			isTranslating = false;
		}
	}

	async function streamTranslate() {
		if (!sourceText.trim()) {
			error = 'Por favor ingresa texto para traducir.';
			return;
		}

		try {
			isTranslating = true;
			error = '';
			translatedText = '';

			if (!translator) {
				translator = await createTranslator();
				if (!translator) {
					isTranslating = false;
					return;
				}
			}

			// Usar traducción streaming para textos largos
			const stream = translator.translateStreaming(sourceText);
			for await (const chunk of stream) {
				translatedText += chunk;
			}
		} catch (err) {
			error = `Error en la traducción streaming: ${err.message}`;
			console.error('Streaming translation error:', err);
		} finally {
			isTranslating = false;
		}
	}

	// Limpiar traductor cuando cambien los idiomas
	function onLanguageChange() {
		translator = null;
		translatedText = '';
		downloadProgress = 0;
		isDownloading = false;
	}

	function clearAll() {
		sourceText = '';
		translatedText = '';
		error = '';
		detectedLanguage = '';
		downloadProgress = 0;
		isDownloading = false;
	}

	// Texto de ejemplo
	function loadExample() {
		sourceText = 'Hello';
		sourceLanguage = 'en';
		targetLanguage = 'es';
		onLanguageChange();
	}
</script>

<div class="mx-auto min-h-screen max-w-4xl bg-white p-6">
	{#if !isSupported}
		<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
			<div class="flex">
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800">API no disponible</h3>
					<div class="mt-2 text-sm text-red-700">
						<p>{error}</p>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="space-y-6">
			<!-- Controles de idioma -->
			<div class="rounded-lg bg-gray-50 p-4">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label for="sourceLanguage" class="mb-2 block text-sm font-medium text-gray-700">
							Idioma origen
						</label>
						<select
							id="sourceLanguage"
							bind:value={sourceLanguage}
							on:change={onLanguageChange}
							class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						>
							{#each languages as lang}
								<option value={lang.code}>{lang.name} ({lang.code})</option>
							{/each}
						</select>
						{#if detectedLanguage}
							<p class="mt-1 text-xs text-green-600">Idioma detectado: {detectedLanguage}</p>
						{/if}
					</div>
					<div>
						<label for="targetLanguage" class="mb-2 block text-sm font-medium text-gray-700">
							Idioma destino
						</label>
						<select
							id="targetLanguage"
							bind:value={targetLanguage}
							on:change={onLanguageChange}
							class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						>
							{#each languages as lang}
								<option value={lang.code}>{lang.name} ({lang.code})</option>
							{/each}
						</select>
					</div>
				</div>
			</div>

			<!-- Área de texto origen -->
			<div>
				<div class="mb-2 flex items-center justify-between">
					<label for="sourceText" class="block text-sm font-medium text-gray-700">
						Texto a traducir
					</label>
					<div class="flex space-x-2">
						<Button onclick={detectLanguage} disabled={!sourceText.trim()} variant="outline">
							Detectar idioma
						</Button>
						<button
							on:click={loadExample}
							class="rounded bg-gray-600 px-2 py-1 text-xs text-white hover:bg-gray-700"
						>
							Cargar ejemplo
						</button>
					</div>
				</div>
				<textarea
					id="sourceText"
					bind:value={sourceText}
					placeholder="Escribe el texto que quieres traducir..."
					rows="6"
					class="resize-vertical w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
				></textarea>
			</div>

			<!-- Botones de acción -->
			<div class="flex flex-wrap gap-3">
				<Button
					onclick={translateText}
					disabled={isTranslating || !sourceText.trim()}
					variant="outline"
				>
					{#if isTranslating}
						<div class="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
					{/if}
					<span>Traducir</span>
				</Button>
				<Button onclick={clearAll}>Limp</Button>
			</div>

			<!-- Errores -->
			{#if error}
				<div class="rounded-lg border border-red-200 bg-red-50 p-4">
					<div class="flex">
						<div class="ml-3">
							<h3 class="text-sm font-medium text-red-800">Error</h3>
							<p class="mt-1 text-sm text-red-700">{error}</p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Resultado de la traducción -->
			{#if translatedText}
				<div>
					<label class="mb-2 block text-sm font-medium text-gray-700">
						Texto traducido ({targetLanguage})
					</label>
					<div
						class="min-h-[150px] w-full rounded-md border border-gray-300 bg-green-50 p-3 whitespace-pre-wrap"
					>
						{translatedText}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
<!-- <script lang="ts">
	import { onMount } from 'svelte';

	let writer: any = null;
	let apiStatus: 'checking' | 'unsupported' | 'downloading' | 'ready' = 'checking';
	let downloadProgress = 0;
	let isLoading = false;
	let prompt =
		'Escribe un post para redes sociales anunciando el lanzamiento de una nueva app de café.';
	let result = '';
	let errorMessage = ''; // <-- Variable para el nuevo manejo de errores

	onMount(async () => {
		try {
			// <-- Inicio del manejo de errores
			if (!('Writer' in self)) {
				apiStatus = 'unsupported';
				return;
			}

			const availability = await Writer.availability();
			if (availability === 'available') {
				apiStatus = 'ready';
				// Modificación 1: Añadir outputLanguage
				writer = await Writer.create({ outputLanguage: 'es' });
			} else if (availability === 'downloadable') {
				apiStatus = 'downloading';
				// Modificación 2: Añadir outputLanguage
				writer = await Writer.create({
					outputLanguage: 'es',
					monitor(m) {
						m.addEventListener('downloadprogress', (e: any) => {
							downloadProgress = Math.round(e.loaded * 100);
							if (e.loaded === 1) {
								apiStatus = 'ready';
							}
						});
					}
				});
			} else {
				apiStatus = 'unsupported';
				errorMessage = 'La función de IA no está disponible en este momento en tu dispositivo.';
			}
		} catch (error) {
			// <-- Captura de errores
			console.error(error);
			if (error.message.includes('not enough space')) {
				errorMessage =
					'No se pudo activar la IA. Por favor, libera espacio de almacenamiento en tu dispositivo.';
			} else {
				errorMessage = 'Ocurrió un error inesperado al inicializar la IA.';
			}
			apiStatus = 'unsupported';
		}
	});

	async function generateText() {
		if (apiStatus !== 'ready' || !prompt) return;
		isLoading = true;
		result = '';

		try {
			const generation = await writer.write(prompt);
			result = generation;
		} catch (e) {
			console.error(e);
			result = 'Ocurrió un error al generar el texto.';
		} finally {
			isLoading = false;
		}
	}
</script>

<main class="mx-auto max-w-2xl space-y-6 p-4 sm:p-8">
	<h1 class="text-3xl font-bold text-gray-800">Ejemplo 1: Generador Básico con Tailwind</h1>

	{#if errorMessage}
		<div class="rounded-md border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
			{errorMessage}
		</div>
	{/if}

	{#if apiStatus === 'unsupported' && !errorMessage}
		<div class="rounded-md border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
			Tu navegador no es compatible con la Writer API.
		</div>
	{:else if apiStatus === 'downloading'}
		<div class="space-y-2 rounded-md border border-blue-400 bg-blue-100 px-4 py-3 text-blue-700">
			<p>Descargando modelo de IA... {downloadProgress}%</p>
			<div class="h-2.5 w-full rounded-full bg-gray-200">
				<div class="h-2.5 rounded-full bg-blue-600" style="width: {downloadProgress}%"></div>
			</div>
		</div>
	{:else if apiStatus === 'ready'}
		<div
			class="rounded-md border border-green-400 bg-green-100 px-4 py-3 text-green-700"
			role="alert"
		>
			API lista para usar.
		</div>
	{/if}

	<div class="space-y-4">
		<textarea
			bind:value={prompt}
			class="h-24 w-full rounded-md border border-gray-300 p-3 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
			disabled={apiStatus !== 'ready' || isLoading}
		></textarea>
		<button
			on:click={generateText}
			class="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
			disabled={apiStatus !== 'ready' || isLoading}
		>
			{#if isLoading}
				<svg
					class="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				Generando...
			{:else}
				Generar Texto
			{/if}
		</button>
	</div>

	{#if result}
		<div class="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
			<h2 class="mb-2 text-xl font-semibold text-gray-900">Resultado:</h2>
			<p class="whitespace-pre-wrap text-gray-700">{result}</p>
		</div>
	{/if}
</main> -->
