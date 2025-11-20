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
	import WorldIcon from '$lib/icons/outline/worldIcon.svelte';
	import BotsiIcon from '$lib/icons/solid/botsiIcon.svelte';
	import FilePencilIcon from '$lib/icons/solid/filePencilIcon.svelte';
	import type { LanguageCodeType } from '$lib/interface';
	import { getI18nContext } from '$lib/stores/i18nContext';
	import { languageStore } from '$lib/stores/languajeStore';
	import { onDestroy } from 'svelte';

	interface SettingOption {
		id: string;
		title: string;
		description: string;
		icon: any;
		route: string;
	}

	const i18n = getI18nContext();

	const settingOptions: SettingOption[] = [
		{
			id: 'system-prompts',
			title: 'System Prompts',
			description: 'Manage system prompts',
			icon: FilePencilIcon,
			route: '/settings/system-prompts'
		},
		{
			id: 'statistics',
			title: 'Statistics',
			description: 'Manage statistics',
			icon: CharBarIcon,
			route: '/settings/statistics'
		},
		{
			id: 'users',
			title: 'Users',
			description: 'Manage users',
			icon: UsersIcon,
			route: '/settings/users'
		},
		{
			id: 'api-keys',
			title: 'API Keys',
			description: 'Manage API keys',
			icon: KeyIcon,
			route: '/settings/api-keys'
		},
		{
			id: 'agents',
			title: 'Agents',
			description: 'Manage agents',
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

	const languages = [
		{ code: 'en' as LanguageCodeType, name: 'English', flag: '🇺🇸' },
		{ code: 'es' as LanguageCodeType, name: 'Español', flag: '🇪🇸' }
	];

	let currentLanguage: string = $state('');

	const unsubscribe = languageStore.subscribe((lang) => {
		currentLanguage = lang;
		$i18n.changeLanguage(lang);
	});

	function updateLanguage(lang: LanguageCodeType) {
		languageStore.set(lang);
	}

	onDestroy(() => {
		unsubscribe();
	});
</script>

<div class="min-dvh bg-light-one px-4 py-8 sm:px-6 lg:px-8 dark:bg-dark-one">
	<div class="mx-auto max-w-4xl">
		<!-- Back to Stream button -->
		<div class="mb-8">
			<button
				onclick={goToStream}
				onkeypress={handleStreamKeyPress}
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
			<Heading level="h1">{$i18n.t('settings.tittle')}</Heading>
			<!-- <Text variant="body-base" class="mt-6"
				>Gestiona todos los aspectos de tu aplicación desde un solo lugar</Text
			> -->
		</div>
		<div class="mb-8">
			<div class="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
				<div class="mb-6 flex items-center space-x-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full bg-light-one_d dark:bg-dark-one_d"
					>
						<WorldIcon class="h-6 w-6 text-light-two dark:text-dark-two" />
					</div>
					<div>
						<Subheading level="h3">Idioma / Language</Subheading>
					</div>
				</div>

				<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
					{#each languages as lang (lang.code)}
						<button
							onclick={() => updateLanguage(lang.code)}
							class="relative flex items-center justify-between rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md {currentLanguage ===
							lang.code
								? 'border-light-three dark:border-dark-three'
								: 'border-light-four dark:border-dark-four dark:hover:border-light-four_d'}"
							aria-label={`Seleccionar idioma ${lang.name}`}
						>
							<div class="flex items-center justify-center space-x-3">
								<span class="text-2xl">{lang.flag}</span>
								<span class="font-medium text-light-two dark:text-dark-two">{lang.name}</span>
							</div>

							{#if currentLanguage === lang.code}
								<div
									class="flex h-5 w-5 items-center justify-center rounded-full bg-light-three dark:bg-dark-three"
								>
									<div class="h-2 w-2 rounded-full bg-white"></div>
								</div>
							{:else}
								<div
									class="h-5 w-5 rounded-full border-2 border-gray-300 dark:border-gray-500"
								></div>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Settings List -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			{#each settingOptions as option (option.id)}
				<div
					class="group relative transform cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800"
					onclick={() => navigateTo(option.route)}
					onkeypress={(e) => handleKeyPress(e, option.route)}
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
