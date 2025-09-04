<script lang="ts">
	import { page } from '$app/stores';

	import ProtectedRoute from '$lib/components/auth/protectedRoute.svelte';
	import SettingsHeader from '$lib/components/settings/settingsHeader.svelte';
	import { Permission } from '$lib/config/permissions';
	let showHeader: boolean = $state(true);
	$effect(() => {
		showHeader = $page.url.pathname !== '/settings';
	});
</script>

{#if showHeader}
	<SettingsHeader />
{/if}
<ProtectedRoute requiredPermissions={[Permission.VIEW_SETTINGS]}>
	<slot />
</ProtectedRoute>
