<script lang="ts">
	import { LayoutGridIcon } from '$lib/icons/solid';
	import type { Aplication } from '$lib/interface';
	import { aplicationStore } from '$lib/stores';

	const apps: Aplication[] = [
		{ aplication_id: 1, aplication_name: 'Botsi' },
		{ aplication_id: 2, aplication_name: 'Vizta' },
		{ aplication_id: 3, aplication_name: 'Softia' },
		{ aplication_id: 4, aplication_name: 'Nuevo' }
	];

	interface Props {
		collapsed?: boolean;
	}

	let { collapsed = false }: Props = $props();
	let isOpen = $state(false);
	let dropdownRef: HTMLDivElement;

	const onAppChange = (app: Aplication) => {
		aplicationStore.set(app);
	};

	const selectedApp = $derived(
		apps.find((app) => app.aplication_id === $aplicationStore.aplication_id)
	);

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function selectApp(app: Aplication) {
		onAppChange(app);
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
		class="flex items-center justify-center rounded-lg bg-light-two p-1 text-light-one shadow-md transition-all hover:bg-light-two_d hover:shadow-lg dark:bg-dark-two dark:text-dark-one dark:hover:bg-dark-two_d"
		aria-label="Seleccionar aplicación"
	>
		<LayoutGridIcon class="h-7 w-7 transition-transform duration-200 {isOpen ? 'rotate-12' : ''}" />
	</button>

	{#if isOpen}
		<div
			class="ring-opacity-5 dark:ring-opacity-10 absolute top-full z-50 mt-1 w-48 overflow-hidden rounded-lg bg-light-one shadow-lg ring-1 ring-black dark:bg-dark-one dark:ring-white {collapsed
				? 'left-0'
				: 'left-0'}"
		>
			<div class="px-2 py-2 text-xs font-medium text-light-two_d dark:text-dark-two_d">
				Aplicaciones
			</div>
			<div class="py-1">
				{#each apps as app}
					<button
						onclick={() => selectApp(app)}
						class="flex w-full items-center px-3 py-2 text-sm transition-colors duration-150 {selectedApp?.aplication_id ===
						app.aplication_id
							? 'bg-light-two text-light-one dark:bg-dark-two dark:text-dark-one'
							: 'text-light-two hover:bg-light-two_d hover:text-light-one dark:text-dark-two dark:hover:bg-dark-two_d'}"
					>
						<span class="truncate">{app.aplication_name}</span>
						{#if selectedApp?.aplication_id === app.aplication_id}
							<div class="ml-auto h-2 w-2 rounded-full bg-current"></div>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
