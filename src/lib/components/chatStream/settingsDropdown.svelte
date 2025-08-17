<script lang="ts">
	import { goto } from '$app/navigation';
	import { Permission } from '$lib/config/permissions';
	import { UsersIcon } from '$lib/icons/outline';
	import ChevronRightIcon from '$lib/icons/outline/chevronRightIcon.svelte';
	import { LogoutIcon, MoonIcon, SunIcon } from '$lib/icons/solid';
	import { themeStore } from '$lib/stores/themeStore';
	import { userStore } from '$lib/stores/userStore';
	import { redirect } from '$lib/utils/redirect';
	import PermissionGuard from '../auth/permissionGuard.svelte';

	interface Props {
		collapsed?: boolean;
	}

	let { collapsed = false }: Props = $props();
	let isOpen = $state(false);
	let dropdownRef: HTMLDivElement;

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function handleThemeToggle() {
		themeStore.toggleTheme();
		if (!collapsed) isOpen = false;
	}

	const onLogout = () => {
		goto('/auth/sign-in');
	};

	function handleLogout() {
		onLogout();
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
		class="flex items-center justify-center transition-all duration-200 hover:scale-105 {collapsed
			? 'h-10 w-10'
			: 'h-10 w-10'}"
		aria-label="Perfil"
	>
		<div
			class="flex h-9 w-9 items-center justify-center rounded-full bg-white p-1 shadow-md ring-2 ring-light-two_d transition-all duration-200 hover:shadow-lg hover:ring-light-two dark:ring-dark-two_d dark:hover:ring-dark-two"
		>
			<span class="text-lg uppercase">
				{$userStore.user_name.charAt(0).toUpperCase() +
					$userStore.user_name.charAt(1).toLowerCase()}
			</span>
		</div>
	</button>

	{#if isOpen}
		<div
			class="absolute bottom-full z-50 mb-1 {collapsed ? 'left-0' : 'right-0 left-0'} {collapsed
				? 'w-48'
				: ''} ring-opacity-5 dark:ring-opacity-10 overflow-hidden rounded-lg bg-light-one shadow-lg ring-1 ring-black dark:bg-dark-one dark:ring-white"
		>
			<div class="">
				<button
					onclick={handleThemeToggle}
					class="flex w-full items-center px-3 py-2 text-sm text-light-two transition-colors duration-150 hover:bg-light-two_d hover:text-light-one dark:text-dark-two dark:hover:bg-dark-two_d"
				>
					{#if $themeStore === 'dark'}
						<SunIcon class="mr-3 h-4 w-4" />
						<span>Modo claro</span>
					{:else}
						<MoonIcon class="mr-3 h-4 w-4" />
						<span>Modo oscuro</span>
					{/if}
				</button>

				<!-- <div class="my-1 h-px bg-light-two_d dark:bg-dark-two_d"></div> -->
				<PermissionGuard permission={Permission.VIEW_USERS}>
					<button
						onclick={() => redirect('/users')}
						class="flex w-full items-center px-3 py-2 text-sm text-light-two transition-colors duration-150 hover:bg-light-two_d hover:text-light-one dark:text-dark-two dark:hover:bg-dark-two_d"
					>
						<UsersIcon class="mr-3 h-4 w-4" />
						<span>Users</span>
					</button>
				</PermissionGuard>

				<button
					onclick={handleLogout}
					class="flex w-full items-center px-3 py-2 text-sm text-red-600 transition-colors duration-150 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
				>
					<LogoutIcon class="mr-3 h-4 w-4" />
					<span>Cerrar sesión</span>
				</button>
			</div>
		</div>
	{/if}
</div>
