<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Heading } from '$lib/components';
	import { ArrowLeftIcon } from '$lib/icons/outline';
	import BotsiIcon from '$lib/icons/solid/botsiIcon.svelte';
	import SettingsIcon from '$lib/icons/outline/settingsIcon.svelte';
	import ChevronLeftIcon from '$lib/icons/outline/chevronLeftIcon.svelte';

	// Mapeo de rutas a títulos y descripciones
	const pageInfo: Record<string, { title: string; description: string }> = {
		'/settings/system-prompts': {
			title: 'System Prompts',
			description: 'Configura y gestiona los prompts del sistema'
		},
		'/settings/statistics': {
			title: 'Statistics',
			description: 'Visualiza métricas y análisis de uso'
		},
		'/settings/users': {
			title: 'Users',
			description: 'Administra usuarios y permisos'
		},
		'/settings/api-keys': {
			title: 'API Key Management',
			description: 'Gestiona las claves de API y accesos'
		},
		'/settings/agents': {
			title: 'Agents',
			description: 'Configura y administra agentes inteligentes'
		}
	};

	$: currentPath = $page.url.pathname;
	$: currentPageInfo = pageInfo[currentPath];

	function goBack(): void {
		goto('/settings');
	}

	function goToStream(): void {
		goto('/stream');
	}

	function handleKeyPress(event: KeyboardEvent, action: () => void): void {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			action();
		}
	}
</script>

<!-- Settings Header -->
<header
	class="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80"
>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between py-4">
			<!-- Left side: Back navigation and breadcrumb -->
			<div class="flex items-center space-x-4">
				<!-- Back button -->
				<button
					on:click={goBack}
					on:keypress={(e) => handleKeyPress(e, goBack)}
					class="group flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
					aria-label="Volver a configuración"
				>
					<ChevronLeftIcon
						class="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1"
					/>
					<span class="hidden text-sm font-medium sm:inline">Back</span>
				</button>

				<!-- Breadcrumb -->
				<nav class="flex items-center space-x-2" aria-label="Breadcrumb">
					<!-- Home/Stream link -->
					<!-- <button
						on:click={goToStream}
						on:keypress={(e) => handleKeyPress(e, goToStream)}
						class="flex items-center text-sm text-gray-500 transition-colors duration-200 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
						aria-label="Ir a stream"
					>
						<BotsiIcon class="h-4 w-4" />
						<span class="ml-1 hidden sm:inline">Stream</span>
					</button> -->

					<!-- Separator -->
					<svg
						class="h-4 w-4 text-gray-300 dark:text-gray-600"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
							clip-rule="evenodd"
						/>
					</svg>

					<!-- Settings link -->
					<button
						on:click={goBack}
						on:keypress={(e) => handleKeyPress(e, goBack)}
						class="flex items-center text-sm text-gray-500 transition-colors duration-200 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
						aria-label="Ir a configuración"
					>
						<SettingsIcon class="h-4 w-4" />
						<span class="ml-1">Settings</span>
					</button>

					<!-- Separator -->
					<svg
						class="h-4 w-4 text-gray-300 dark:text-gray-600"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
							clip-rule="evenodd"
						/>
					</svg>

					<!-- Current page -->
					<span class="text-sm font-medium text-gray-900 dark:text-white">
						{currentPageInfo?.title || 'Página'}
					</span>
				</nav>
			</div>

			<!-- Right side: Optional actions -->
			<div class="flex items-center space-x-3">
				<!-- Optional: Add action buttons here -->
				<div class="hidden sm:flex sm:items-center sm:space-x-2">
					<!-- Placeholder for future actions -->
				</div>
			</div>
		</div>
	</div>
</header>
