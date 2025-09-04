<script lang="ts">
	import { goto } from '$app/navigation';
	import { Heading, Subheading, Text } from '$lib/components';
	import {
		ArrowLeftIcon,
		CharBarIcon,
		ChevronLeftIcon,
		KeyIcon,
		UsersIcon
	} from '$lib/icons/outline';
	import ArrowNarrowRightIcon from '$lib/icons/outline/arrowNarrowRightIcon.svelte';
	import BotsiIcon from '$lib/icons/solid/botsiIcon.svelte';
	import FilePencilIcon from '$lib/icons/solid/filePencilIcon.svelte';

	interface SettingOption {
		id: string;
		title: string;
		description: string;
		icon: any;
		route: string;
	}

	const settingOptions: SettingOption[] = [
		{
			id: 'system-prompts',
			title: 'System Prompts',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec metus vel ante placerat finibus.',
			icon: FilePencilIcon,
			route: '/settings/system-prompts'
		},
		{
			id: 'statistics',
			title: 'Estadísticas',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec metus vel ante placerat finibus.',
			icon: CharBarIcon,
			route: '/settings/statistics'
		},
		{
			id: 'users',
			title: 'Usuarios',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec metus vel ante placerat finibus.',
			icon: UsersIcon,
			route: '/settings/users'
		},
		{
			id: 'api-keys',
			title: 'API Key Management',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec metus vel ante placerat finibus.',
			icon: KeyIcon,
			route: '/settings/api-keys'
		},
		{
			id: 'agents',
			title: 'Agentes',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec metus vel ante placerat finibus.',
			icon: BotsiIcon,
			route: '/settings/agents'
		}
	];

	function navigateTo(route: string): void {
		goto(route);
	}

	function goToStream(): void {
		goto('/stream');
	}

	function handleKeyPress(event: KeyboardEvent, route: string): void {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			navigateTo(route);
		}
	}

	function handleStreamKeyPress(event: KeyboardEvent): void {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			goToStream();
		}
	}
</script>

<div class="min-dvh bg-light-one px-4 py-8 sm:px-6 lg:px-8 dark:bg-dark-one">
	<div class="mx-auto max-w-4xl">
		<!-- Back to Stream button -->
		<div class="mb-8">
			<button
				on:click={goToStream}
				on:keypress={handleStreamKeyPress}
				class="group flex items-center space-x-2 rounded-lg px-4 py-2 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
				aria-label="Volver a stream"
			>
				<ChevronLeftIcon
					class="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1"
				/>
				<span class="text-sm font-medium">Back to Stream</span>
			</button>
		</div>

		<!-- Header -->
		<div class="mb-12 text-center">
			<Heading level="h1">Configuración</Heading>
			<Text variant="body-base" class="mt-6"
				>Gestiona todos los aspectos de tu aplicación desde un solo lugar</Text
			>
		</div>

		<!-- Settings List -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			{#each settingOptions as option (option.id)}
				<div
					class="group relative transform cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800"
					on:click={() => navigateTo(option.route)}
					on:keypress={(e) => handleKeyPress(e, option.route)}
					role="button"
					tabindex="0"
					aria-label={`Ir a ${option.title}`}
				>
					<!-- Content -->
					<div class="relative flex items-center p-6">
						<!-- Icon -->
						<div
							class="flex h-16 w-16 flex-shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110"
						>
							<svelte:component
								this={option.icon}
								class="h-10 w-10 transition-transform duration-200 lg:h-16 lg:w-16"
							/>
						</div>

						<!-- Content -->
						<div class="ml-6 flex-1">
							<Subheading level="h3">
								{option.title}
							</Subheading>

							<Text variant="body-sm" class="mt-2">
								{option.description}
							</Text>
						</div>

						<!-- Arrow Icon -->
						<div
							class="ml-4 h-6 w-6 flex-shrink-0 text-gray-400 opacity-0 transition-colors duration-300 group-hover:text-gray-600 group-hover:opacity-100 dark:text-gray-500 dark:group-hover:text-gray-300"
						>
							<ArrowNarrowRightIcon />
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
<!-- <script lang="ts">
	//settings/+page.svelte
	import { goto } from '$app/navigation';
	import { Heading, Subheading, Text } from '$lib/components';
	import { CharBarIcon, KeyIcon, UsersIcon } from '$lib/icons/outline';
	import ArrowNarrowRightIcon from '$lib/icons/outline/arrowNarrowRightIcon.svelte';
	import BotsiIcon from '$lib/icons/solid/botsiIcon.svelte';
	import FilePencilIcon from '$lib/icons/solid/filePencilIcon.svelte';

	interface SettingOption {
		id: string;
		title: string;
		description: string;
		icon: any;
		route: string;
	}

	const settingOptions: SettingOption[] = [
		{
			id: 'system-prompts',
			title: 'System Prompts',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec metus vel ante placerat finibus.',
			icon: FilePencilIcon,
			route: '/settings/system-prompts'
		},
		{
			id: 'statistics',
			title: 'Estadísticas',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec metus vel ante placerat finibus.',
			icon: CharBarIcon,
			route: '/settings/statistics'
		},
		{
			id: 'users',
			title: 'Usuarios',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec metus vel ante placerat finibus.',
			icon: UsersIcon,
			route: '/settings/users'
		},
		{
			id: 'api-keys',
			title: 'API Key Management',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec metus vel ante placerat finibus.',
			icon: KeyIcon,
			route: '/settings/api-keys'
		},
		{
			id: 'agents',
			title: 'Agentes',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec metus vel ante placerat finibus.',
			icon: BotsiIcon,
			route: '/settings/agents'
		}
	];

	function navigateTo(route: string): void {
		goto(route);
	}

	function handleKeyPress(event: KeyboardEvent, route: string): void {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			navigateTo(route);
		}
	}
</script>

<div class="min-dvh bg-light-one px-4 py-8 sm:px-6 lg:px-8 dark:bg-dark-one">
	<div class="mx-auto max-w-4xl">
		<div class="mb-12 text-center">
			<Heading level="h1">Configuración</Heading>
			<Text variant="body-base"
				>Gestiona todos los aspectos de tu aplicación desde un solo lugar</Text
			>
		</div>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			{#each settingOptions as option (option.id)}
				<div
					class="group relative transform cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800"
					on:click={() => navigateTo(option.route)}
					on:keypress={(e) => handleKeyPress(e, option.route)}
					role="button"
					tabindex="0"
					aria-label={`Ir a ${option.title}`}
				>
					<div class="relative flex items-center p-6">
						<div
							class="flex h-16 w-16 flex-shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110"
						>
							<svelte:component
								this={option.icon}
								class="h-10 w-10 transition-transform duration-200 lg:h-16 lg:w-16"
							/>
						</div>

						
						<div class="ml-6 flex-1">
							<Subheading level="h3">
								{option.title}
							</Subheading>

							<Text variant="body-sm" class="mt-2">
								{option.description}
							</Text>
						</div>

						
						<div
							class="ml-4 h-6 w-6 flex-shrink-0 text-gray-400 opacity-0 transition-colors duration-300 group-hover:text-gray-600 group-hover:opacity-100 dark:text-gray-500 dark:group-hover:text-gray-300"
						>
							<ArrowNarrowRightIcon />
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div> -->
