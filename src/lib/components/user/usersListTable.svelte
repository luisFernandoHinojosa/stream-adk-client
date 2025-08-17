<script lang="ts">
	import { ROLES, type User } from '$lib/interface';
	import RoleSelector from './roleSelector.svelte';

	export let users: User[];
	export let onRoleUpdate: (userId: string, newRole: number) => Promise<void>;

	let updatingUsers = new Set<string>();

	const handleRoleUpdate = async (userId: string, newRole: number) => {
		updatingUsers.add(userId);
		updatingUsers = updatingUsers;

		try {
			await onRoleUpdate(userId, newRole);
		} catch (error) {
			console.error('Error updating role:', error);
		} finally {
			updatingUsers.delete(userId);
			updatingUsers = updatingUsers;
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

	const truncateId = (id: string) => {
		return `${id.slice(0, 8)}...${id.slice(-4)}`;
	};
</script>

<div
	class="overflow-hidden rounded-lg border border-light-one_d bg-light-one shadow-sm dark:border-dark-one_d dark:bg-dark-one"
>
	<div class="overflow-x-auto">
		<table class="min-w-full divide-y divide-light-one_d">
			<thead class="bg-light-one_d dark:bg-dark-one_d">
				<tr>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-light-two uppercase dark:text-dark-two"
					>
						Usuario
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-light-two uppercase dark:text-dark-two"
					>
						Email
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-light-two uppercase dark:text-dark-two"
					>
						Rol
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-light-two uppercase dark:text-dark-two"
					>
						ID
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-light-two uppercase dark:text-dark-two"
					>
						Acciones
					</th>
				</tr>
			</thead>

			<tbody
				class="divide-y divide-light-one_d bg-light-one dark:divide-light-one_d dark:bg-light-one"
			>
				{#each users as user (user.user_id)}
					<tr
						class="transition-colors hover:bg-light-one_d dark:bg-dark-one_d hover:dark:bg-dark-one_d"
					>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="flex items-center">
								<div
									class="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-light-three text-sm font-semibold text-light-one dark:bg-light-three dark:text-dark-one"
								>
									{getInitials(user.user_name)}
								</div>
								<div class="text-sm font-medium text-light-two dark:text-dark-two">
									{user.user_name}
								</div>
							</div>
						</td>

						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-light-two dark:text-dark-two">{user.user_email}</div>
						</td>

						<td class="px-6 py-4 whitespace-nowrap">
							<span
								class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-light-two dark:text-dark-two"
							>
								{ROLES[user.role_id] || 'Sin rol'}
							</span>
						</td>

						<!-- User ID -->
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="font-mono text-xs text-light-two dark:text-dark-two" title={user.user_id}>
								{truncateId(user.user_id)}
							</div>
						</td>

						<!-- Actions -->
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="w-40">
								<RoleSelector
									currentRole={user.role_id}
									isUpdating={updatingUsers.has(user.user_id)}
									targetUser={user}
									handleRoleUpdate={(role) => handleRoleUpdate(user.user_id, role)}
								/>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
