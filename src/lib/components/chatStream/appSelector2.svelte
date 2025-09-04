<script lang="ts">
	import { LayoutGridIcon } from '$lib/icons/solid';

	const apps = [
		{ id: '1', name: 'Botsi' },
		{ id: '2', name: 'Vizta' },
		{ id: '3', name: 'Softia' },
		{ id: '4', name: 'Nuevo' }
	];

	interface Props {
		value?: string;
		onAppChange?: (appId: string) => void;
	}

	let { value = '1', onAppChange }: Props = $props();
	let isOpen = $state(false);
	let dropdownRef: HTMLDivElement;

	const selectedApp = $derived(apps.find((app) => app.id === value));

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function selectApp(appId: string) {
		onAppChange?.(appId);
		isOpen = false;
	}

	function handleClickOutside(event: Event) {
		if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	$effect(() => {
		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});
</script>

<div class="relative" bind:this={dropdownRef}>
	<button
		onclick={toggleDropdown}
		class="flex items-center justify-between text-sm transition-all"
		aria-label="Seleccionar aplicación"
	>
		<LayoutGridIcon class="mr-1 h-4 w-4 transition-transform duration-200 " />
		<span class="truncate font-medium text-light-two dark:text-dark-two"
			>{selectedApp?.name || 'Seleccionar app'}</span
		>
		<svg
			class="ml-2 h-4 w-4 flex-shrink-0 transition-transform duration-200 {isOpen
				? 'rotate-0'
				: 'rotate-180'}"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	{#if isOpen}
		<div
			class="ring-opacity-5 dark:ring-opacity-10 absolute bottom-full z-50 mb-1 w-full overflow-hidden rounded-lg bg-light-one shadow-lg ring-1 ring-black md:w-48 dark:bg-dark-one dark:ring-white"
		>
			<div class="px-3 py-2 text-xs font-medium text-light-two_d dark:text-dark-two_d">
				Aplicaciones
			</div>
			<div class="py-1">
				{#each apps as app}
					<button
						onclick={() => selectApp(app.id)}
						class="flex w-full items-center px-3 py-2 text-sm transition-colors duration-150 {value ===
						app.id
							? 'bg-light-two text-light-one dark:bg-dark-two dark:text-dark-one'
							: 'text-light-two hover:bg-light-two_d hover:text-light-one dark:text-dark-two dark:hover:bg-dark-two_d'}"
					>
						<span class="truncate">{app.name}</span>
						{#if value === app.id}
							<div class="ml-auto h-2 w-2 rounded-full bg-current"></div>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
