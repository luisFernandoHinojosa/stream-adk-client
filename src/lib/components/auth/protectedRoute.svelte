<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { permissionStore } from '$lib/stores/permissionStore';
	import type { Permission } from '$lib/config/permissions';

	export let requiredPermissions: Permission[] = [];
	export let redirectTo = '/auth/sign-in';
	export let fallbackComponent: any = null;

	let canAccess = false;
	let isLoading = true;

	$: currentRoute = $page.route.id || '';

	onMount(() => {
		const unsubscribe = permissionStore.subscribe(() => {
			checkAccess();
		});

		return unsubscribe;
	});

	function checkAccess() {
		try {
			// Check if user is authenticated first (when you implement auth validation)
			// const isAuthenticated = $authStore.isAuthenticated;
			// if (!isAuthenticated) {
			//   goto(redirectTo);
			//   return;
			// }

			if (requiredPermissions.length === 0) {
				// If no specific permissions required, check route permissions
				canAccess = permissionStore.canAccessRoute(currentRoute);
			} else {
				// Check specific permissions
				canAccess = permissionStore.hasAnyPermission(requiredPermissions);
			}

			if (!canAccess && fallbackComponent === null) {
				goto('/stream');
			}
		} finally {
			isLoading = false;
		}
	}
</script>

{#if isLoading}
	<div class="flex min-h-screen items-center justify-center">
		<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
	</div>
{:else if canAccess}
	<slot />
{:else if fallbackComponent}
	<svelte:component this={fallbackComponent} />
{:else}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<h2 class="mb-2 text-2xl font-bold text-gray-900">Access Denied</h2>
			<p class="text-gray-600">You don't have permission to access this page.</p>
		</div>
	</div>
{/if}
