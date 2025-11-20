<script lang="ts">
	import type { User } from '$lib/interface';
	import EmptyState from './emptyState.svelte';
	import UserCard from './userCard.svelte';
	import UsersListTable from './usersListTable.svelte';
	interface Props {
		users: User[];
		onRoleUpdate: (userId: string, newRole: number) => Promise<void>;
	}

	const { users, onRoleUpdate }: Props = $props();

	let searchQuery = '';
</script>

<div class="space-y-6">
	{#if users?.length > 0}
		<div class="hidden sm:block">
			<UsersListTable {users} {onRoleUpdate} />
		</div>

		<div class="block sm:hidden">
			<!-- <div class="space-y-4"> -->
			{#each users as user (user.user_id)}
				<UserCard {users} {onRoleUpdate} />
			{/each}
			<!-- </div> -->
		</div>
	{:else}
		<EmptyState {searchQuery} />
	{/if}
</div>
