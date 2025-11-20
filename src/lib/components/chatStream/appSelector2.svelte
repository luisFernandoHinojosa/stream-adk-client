<script lang="ts">
	import { LayoutGridIcon } from '$lib/icons/solid';
	import type { Aplication } from '$lib/interface';

	const apps: Aplication[] = [
		{ aplication_id: 1, aplication_name: 'Botsi' },
		{ aplication_id: 2, aplication_name: 'Vizta' },
		{ aplication_id: 3, aplication_name: 'Softia' },
		{ aplication_id: 4, aplication_name: 'Nuevo' }
	];

	interface Props {
		value?: number;
		onAppChange?: (aplication: Aplication) => void;
	}

	let { value = 1, onAppChange }: Props = $props();
	let isOpen = $state(false);
	let dropdownRef: HTMLDivElement;

	const selectedApp = $derived(apps.find((app) => app.aplication_id === value));

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function selectApp(app: Aplication) {
		onAppChange?.(app);
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

<div class="" bind:this={dropdownRef}>
	<button
		onclick={toggleDropdown}
		class="flex items-center justify-between text-sm transition-all"
		aria-label="Seleccionar aplicación"
	>
		<LayoutGridIcon class="mr-1 h-4 w-4 transition-transform duration-200 " />
		<span class="truncate text-base font-medium text-light-two dark:text-dark-two"
			>{selectedApp?.aplication_name || 'Seleccionar app'}</span
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
			class="ring-opacity-5 dark:ring-opacity-10 absolute bottom-full z-50 mb-1 w-[200px] overflow-hidden rounded-lg bg-light-one shadow-lg ring-1 ring-black md:w-48 dark:bg-dark-one dark:ring-white"
		>
			<div class="px-3 py-2 text-xs font-medium text-light-two_d dark:text-dark-two_d">
				Aplicaciones
			</div>
			<div class="py-1">
				{#each apps as app}
					<button
						onclick={() => selectApp(app)}
						class="flex w-full items-center px-3 py-2 text-base transition-colors duration-150 {value ===
						app.aplication_id
							? 'bg-light-two text-light-one dark:bg-dark-two dark:text-dark-one'
							: 'text-light-two hover:bg-light-two_d hover:text-light-one dark:text-dark-two dark:hover:bg-dark-two_d'}"
					>
						<span class="truncate text-base">{app.aplication_name}</span>
						{#if value === app.aplication_id}
							<div class="ml-auto h-2 w-2 rounded-full bg-current"></div>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
