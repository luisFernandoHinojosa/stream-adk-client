<script lang="ts">
	import { ROLES, type User } from '$lib/interface';
	import RoleSelector from './roleSelector.svelte';

	interface Props {
		user: User;
		onRoleUpdate: (userId: string, newRole: number) => Promise<void>;
	}

	const { user, onRoleUpdate }: Props = $props();

	let isUpdating: boolean = $state(false);

	const handleRoleUpdate = async (newRole: number) => {
		isUpdating = true;
		try {
			await onRoleUpdate(user.user_id, newRole);
		} catch (error) {
			console.error('Error updating role:', error);
		} finally {
			isUpdating = false;
		}
	};

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((word) => word.charAt(0))
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};
</script>

<div
	class="rounded-xl border border-light-four bg-light-one_d p-6 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-dark-four dark:bg-dark-one_d"
>
	<!-- Header with avatar and basic info -->
	<div class="mb-4 flex items-start justify-between">
		<div class="flex items-center space-x-3">
			<div
				class="flex h-12 w-12 items-center justify-center rounded-full bg-light-three text-sm font-semibold text-light-one dark:text-dark-one"
			>
				{getInitials(user.user_name)}
			</div>
			<div class="min-w-0 flex-1">
				<h3 class="truncate text-lg font-semibold text-light-two dark:text-dark-two">
					{user.user_name}
				</h3>
				<p class="truncate text-sm text-light-two dark:text-dark-two">
					{user.user_email}
				</p>
			</div>
		</div>

		<!-- Current role badge -->
		<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
			{ROLES[user.role_id] || 'Sin rol'}
		</span>
	</div>

	<!-- User ID -->
	<div class="mb-4">
		<p
			class="rounded bg-light-four px-2 py-1 font-mono text-xs text-light-two dark:bg-dark-four dark:text-dark-two"
		>
			ID: {user.user_id}
		</p>
	</div>

	<!-- Role selector -->
	<div class="border-t pt-4">
		<RoleSelector
			currentRole={user.role_id}
			targetUser={user}
			{isUpdating}
			handleRoleUpdate={(role) => handleRoleUpdate(role)}
		/>
	</div>
</div>
