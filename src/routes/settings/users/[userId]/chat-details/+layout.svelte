<script lang="ts">
	import ProtectedRoute from '$lib/components/auth/protectedRoute.svelte';
	import { Permission } from '$lib/config/permissions';
</script>

<ProtectedRoute requiredPermissions={[Permission.VIEW_CHAT_DETAILS]}>
	<slot />
</ProtectedRoute>
