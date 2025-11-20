<script lang="ts">
	import { ROLES, type User } from '$lib/interface';
	import { redirect } from '$lib/utils/redirect';
	import { Button } from '../ui';
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

<div class="space-y-3">
	{#each users as user (user.user_id)}
		<div
			class="overflow-hidden rounded-lg border border-light-one_d bg-light-one shadow-sm transition-colors hover:bg-light-one_d dark:border-dark-one_d dark:bg-dark-one hover:dark:bg-dark-one_d"
		>
			<!-- Header with user info -->
			<div class="px-4 py-4">
				<div class="flex items-center space-x-3">
					<div
						class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-light-three text-sm font-semibold text-light-one dark:bg-light-three dark:text-dark-one"
					>
						{getInitials(user.user_name)}
					</div>
					<div class="min-w-0 flex-1">
						<div class="text-sm font-medium text-light-two dark:text-dark-two">
							{user.user_name}
						</div>
						<div class="truncate text-sm text-light-two dark:text-dark-two">
							{user.user_email}
						</div>
					</div>
				</div>
			</div>

			<!-- Details section -->
			<div class="border-t border-light-one_d px-4 py-3 dark:border-dark-one_d">
				<div class="space-y-3">
					<!-- Role selector -->
					<div>
						<div
							class="mb-2 text-xs font-medium tracking-wider text-light-two uppercase dark:text-dark-two"
						>
							Rol
						</div>
						<div class="w-full">
							<RoleSelector
								currentRole={user.role_id}
								isUpdating={updatingUsers.has(user.user_id)}
								targetUser={user}
								handleRoleUpdate={(role) => handleRoleUpdate(user.user_id, role)}
							/>
						</div>
					</div>

					<!-- User ID -->
					<div>
						<div
							class="mb-2 text-xs font-medium tracking-wider text-light-two uppercase dark:text-dark-two"
						>
							ID
						</div>
						<div class="font-mono text-xs text-light-two dark:text-dark-two" title={user.user_id}>
							{truncateId(user.user_id)}
						</div>
					</div>

					<!-- Actions -->
					<div class="pt-2">
						<Button
							variant="outline"
							fullWidth
							onclick={() => redirect(`/settings/users/${user.user_id}/chat-details`)}
						>
							Ver chats
						</Button>
					</div>
				</div>
			</div>
		</div>
	{/each}

	{#if users.length === 0}
		<div class="py-8 text-center">
			<div
				class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-light-two dark:bg-dark-two"
			>
				<svg
					class="h-6 w-6 text-light-one dark:text-dark-one"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
					/>
				</svg>
			</div>
			<p class="text-sm text-light-two dark:text-dark-two">No hay usuarios aún</p>
		</div>
	{/if}
</div>

<!-- <script lang="ts">
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

		<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
			{ROLES[user.role_id] || 'Sin rol'}
		</span>
	</div>


	<div class="mb-4">
		<p
			class="rounded bg-light-four px-2 py-1 font-mono text-xs text-light-two dark:bg-dark-four dark:text-dark-two"
		>
			ID: {user.user_id}
		</p>
	</div>

	<div class="border-t pt-4">
		<RoleSelector
			currentRole={user.role_id}
			targetUser={user}
			{isUpdating}
			handleRoleUpdate={(role) => handleRoleUpdate(role)}
		/>
	</div>
</div> -->
