<script lang="ts">
	import { BrainIcon, PencilIcon } from '$lib/icons/outline';
	import Menu2Icon from '$lib/icons/outline/menu2Icon.svelte';
	import { BotsiIcon } from '$lib/icons/solid';

	import type { SessionsHistory } from '$lib/interface';
	import AppSelector from './appSelector.svelte';
	import SettingsDropdown from './settingsDropdown.svelte';

	interface Props {
		historyCollapsed: boolean;
		startNewChat: () => void;
		sessionsHistories: SessionsHistory[];
		toggleHistorySidebar: () => void;
		currentChatId: string;
		getSessionHistory: (sessionId: string) => void;
	}

	let {
		historyCollapsed,
		startNewChat,
		sessionsHistories,
		toggleHistorySidebar,
		currentChatId,
		getSessionHistory
	}: Props = $props();
</script>

<div
	class="group relative z-30 bg-light-one_d transition-all duration-300 ease-out dark:bg-dark-one_d
			{historyCollapsed ? 'w-0 lg:w-16' : 'w-72 lg:w-72'} 
			{historyCollapsed ? 'hidden lg:block' : 'block'} 
			flex-shrink-0"
>
	{#if !historyCollapsed}
		<div class="flex h-full w-full flex-col bg-light-one_d dark:bg-dark-one_d">
			<!-- Header -->
			<div class="flex w-full items-center justify-between p-4">
				<div class="flex items-center">
					<div class="flex items-center justify-center">
						<BotsiIcon className="w-9 h-9" />
					</div>
				</div>
				<div class="flex items-center gap-2">
					<div class="">
						<AppSelector collapsed={historyCollapsed} />
					</div>
					<button
						onclick={startNewChat}
						class="flex items-center justify-center rounded-lg bg-light-two p-1 text-light-one shadow-md transition-all duration-200 hover:bg-light-two_d hover:shadow-lg dark:bg-dark-two dark:text-dark-one dark:hover:bg-dark-two_d"
						aria-label="Nuevo chat"
					>
						<PencilIcon class="h-7 w-7" />
					</button>
					<button
						onclick={toggleHistorySidebar}
						class="flex items-center rounded-lg bg-light-two p-1 text-sm text-light-one shadow-md transition-all duration-200 hover:shadow-lg dark:bg-dark-two dark:text-dark-one"
					>
						<Menu2Icon class="size-7" />
					</button>
				</div>
			</div>

			<!-- Chat History -->
			<div class="flex-1 space-y-1 overflow-y-auto p-3">
				{#each sessionsHistories as sessionHistory, index}
					<div
						class="group cursor-pointer transition-all duration-200 {currentChatId ===
						sessionHistory.id
							? 'scale-[1.02]'
							: 'hover:scale-[1.01]'}"
						onclick={() => {
							currentChatId !== sessionHistory.id && getSessionHistory(sessionHistory.id);
						}}
						role="button"
						tabindex="0"
						onkeydown={(e) => e.key === 'Enter' && getSessionHistory(sessionHistory.id)}
					>
						<div
							class="rounded-lg p-3 transition-all duration-200 {currentChatId === sessionHistory.id
								? 'bg-light-two text-light-one shadow-md hover:bg-light-two_d dark:bg-dark-two dark:text-dark-one'
								: 'text-light-two hover:bg-light-two_d  hover:text-light-one dark:text-dark-two dark:hover:bg-dark-two_d'}"
						>
							<div class="flex items-start gap-3">
								<div class="min-w-0 flex-1">
									<h3 class="truncate text-sm leading-tight font-medium">
										Chat {sessionHistory.id}
									</h3>
								</div>
							</div>
						</div>
					</div>
				{/each}

				{#if sessionsHistories.length === 0}
					<div class="py-8 text-center">
						<div
							class="mx-auto mb-3 flex items-center justify-center rounded-full text-light-one dark:text-dark-one"
						>
							<BrainIcon class="h-12 w-12 rounded-full bg-light-two p-1 dark:bg-dark-two" />
						</div>
						<p class="text-sm text-light-two dark:text-dark-two">No hay chats aún</p>
					</div>
				{/if}
			</div>

			<!-- Settings Dropdown -->
			<div class="p-4 pt-0">
				<SettingsDropdown collapsed={historyCollapsed} />
			</div>
		</div>
	{:else}
		<div class="flex h-full w-full flex-col items-center justify-between gap-3 p-3">
			<!-- Top section -->
			<div class="flex flex-col items-center gap-3">
				<div class="relative flex h-9 w-9 items-center justify-center">
					<div
						class="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0"
					>
						<BotsiIcon className="w-9 h-9" />
					</div>
					<button
						onclick={toggleHistorySidebar}
						class="absolute inset-0 flex items-center justify-center rounded-lg bg-light-two text-sm text-light-one opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100 hover:shadow-lg dark:bg-dark-two dark:text-light-one"
					>
						<Menu2Icon class="h-7 w-7" />
					</button>
				</div>
				<button
					onclick={startNewChat}
					class="flex items-center justify-center rounded-lg bg-light-two p-1 text-light-one shadow-md transition-all duration-200 hover:bg-light-two_d hover:shadow-lg dark:bg-dark-two dark:text-dark-one dark:hover:bg-dark-two_d"
					aria-label="Nuevo chat"
				>
					<PencilIcon class="h-7 w-7" />
				</button>
				<!-- App Selector -->
				<div>
					<AppSelector collapsed={historyCollapsed} />
				</div>
			</div>

			<!-- Bottom section -->
			<div class="flex flex-col items-center">
				<SettingsDropdown collapsed={true} />
			</div>
		</div>
	{/if}
</div>
