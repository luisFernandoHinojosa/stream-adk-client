<script lang="ts">
	import { ROLES, type User } from '$lib/interface';
	import { userStore } from '$lib/stores/userStore';
	import { RoleValidator } from '$lib/utils/roleUtils';

	interface Props {
		currentRole: number;
		targetUser: User;
		isUpdating: boolean;
		handleRoleUpdate: (role: number) => void;
	}

	const { currentRole, targetUser, isUpdating, handleRoleUpdate }: Props = $props();

	// ✅ acceso al store en Svelte 5
	const currentUser = $userStore;

	// roles que puede asignar el usuario actual
	const assignableRoles = currentUser ? RoleValidator.getAssignableRoles(currentUser) : [];

	// puede gestionar al targetUser
	const canManage =
		currentUser && targetUser && targetUser.user_id
			? RoleValidator.canManageUser(currentUser, targetUser)
			: false;

	// roles disponibles para asignar al targetUser
	const availableRolesForTarget = $derived(
		assignableRoles.filter((role) =>
			currentUser ? RoleValidator.canUpdateUserRole(currentUser, targetUser, role) : false
		)
	);

	const handleRoleChange = (event: Event) => {
		const target = event.target as HTMLSelectElement;
		const newRole = parseInt(target.value);
		if (newRole !== currentRole) {
			handleRoleUpdate(newRole);
		}
	};

	const isRoleAssignable = (roleId: number): boolean => availableRolesForTarget.includes(roleId);
</script>

<div class="space-y-2">
	<label class="block text-sm font-medium text-light-two dark:text-dark-two"> Cambiar rol </label>

	<div class="relative">
		<select
			class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
			value={currentRole}
			disabled={isUpdating || !canManage}
			onchange={handleRoleChange}
		>
			{#each Object.entries(ROLES) as [roleId, roleName]}
				{@const roleIdNum = parseInt(roleId)}
				<option
					value={roleIdNum}
					disabled={!isRoleAssignable(roleIdNum)}
					class:text-gray-400={!isRoleAssignable(roleIdNum)}
				>
					{roleName}
				</option>
			{/each}
		</select>

		{#if isUpdating}
			<div class="absolute top-1/2 right-3 -translate-y-1/2 transform">
				<div
					class="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"
				></div>
			</div>
		{/if}
	</div>
</div>
