<script lang="ts">
	import { permissionStore } from '$lib/stores/permissionStore';
	import type { Permission } from '$lib/config/permissions';

	export let permission: Permission;
	export let permissions: Permission[] = [];
	export let requireAll = false;
	export let fallback: any = null;

	$: hasAccess = (() => {
		if (permission) {
			return permissionStore.hasPermission(permission);
		}

		if (permissions.length > 0) {
			return requireAll
				? permissionStore.hasAllPermissions(permissions)
				: permissionStore.hasAnyPermission(permissions);
		}

		return true;
	})();
</script>

{#if hasAccess}
	<slot />
{:else if fallback}
	<svelte:component this={fallback} />
{/if}
