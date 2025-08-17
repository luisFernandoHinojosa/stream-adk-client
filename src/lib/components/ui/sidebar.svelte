<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { NAVIGATION } from '$lib/constants';
	import { SparklesIcon } from '$lib/icons/outline';
	import { authService } from '$lib/services';

	let sidebarOpen: boolean = $state(false);
	let navigationActive: string = $state(page.url.pathname);
	let dropdownOpen = $state(false);

	function toggleDropdown() {
		dropdownOpen = !dropdownOpen;
	}

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	async function handleLogout(): Promise<void> {
		await authService.signOut();
		goto('/auth/sign-in');
		dropdownOpen = false;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.dropdown-container')) {
			dropdownOpen = false;
		}
	}

	let navigation = $state(NAVIGATION);
</script>

<svelte:window on:click={handleClickOutside} />

{#if sidebarOpen}
	<div class="relative z-50 lg:hidden" role="dialog" aria-modal="true">
		<div
			class="fixed inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
			onclick={toggleSidebar}
			role="presentation"
		></div>

		<div class="fixed inset-0 flex">
			<div
				class="relative mr-16 flex w-full max-w-xs flex-1 translate-x-0 transform transition duration-300 ease-in-out"
			>
				<div class="absolute top-0 left-full flex w-16 justify-center pt-5">
					<button
						type="button"
						class="-m-2.5 rounded-md p-2.5 transition-colors duration-200 hover:bg-white/10"
						onclick={toggleSidebar}
					>
						<span class="sr-only">Close sidebar</span>
						<svg
							class="h-6 w-6 text-white transition-colors duration-200 hover:text-gray-300"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div
					class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-slate-700 bg-gradient-to-b from-slate-900 to-slate-800 px-6 pb-2 shadow-2xl"
				>
					<div class="flex h-16 shrink-0 items-center border-b border-slate-700/50">
						<div class="flex items-center gap-2">
							<div class="bg-light-three flex h-8 w-8 items-center justify-center rounded-lg">
								<span class="text-sm font-bold text-white"><SparklesIcon /></span>
							</div>
							<span class="text-xl font-bold text-white"> Agent ADK </span>
						</div>
					</div>

					<nav class="flex flex-1 flex-col">
						<ul role="list" class="flex flex-1 flex-col gap-y-7">
							<li>
								<ul role="list" class="space-y-2">
									{#each navigation as item}
										<li>
											<a
												href={item.href}
												class="group flex items-center gap-x-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 {navigationActive ===
												item.href
													? 'bg-light-three text-white shadow-lg shadow-blue-500/25'
													: 'text-gray-300 hover:bg-slate-700/50 hover:text-white'}"
												onclick={() => {
													navigationActive = item.href;
													sidebarOpen = false;
												}}
											>
												<span
													class="flex items-center justify-center {navigationActive === item.href
														? 'text-white'
														: 'text-gray-400 group-hover:text-white'}"
												>
													{@html item.icon}
												</span>
												{item.label}
											</a>
										</li>
									{/each}
								</ul>
							</li>

							<li class="mt-auto">
								<div class="dropdown-container relative">
									<button
										type="button"
										class="flex w-full items-center gap-x-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-slate-700/50 hover:text-white"
										onclick={toggleDropdown}
									>
										<div
											class="bg-light-three flex h-6 w-6 items-center justify-center rounded-full"
										>
											<span class="text-xs font-bold text-white">LF</span>
										</div>
										<span class="flex-1 text-left">Luis Fernando</span>
										<svg
											class="h-4 w-4 transition-transform duration-200 {dropdownOpen
												? 'rotate-180'
												: ''}"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="m19 9-7 7-7-7"
											></path>
										</svg>
									</button>

									{#if dropdownOpen}
										<div
											class="absolute right-0 bottom-full left-0 z-50 mb-2 rounded-lg border border-slate-700 bg-slate-800 py-2 shadow-xl"
										>
											<button
												type="button"
												class="flex w-full items-center gap-x-3 px-4 py-2 text-sm text-gray-300 transition-colors duration-200 hover:bg-slate-700/50 hover:text-white"
												onclick={handleLogout}
											>
												<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
													></path>
												</svg>
												Sign Out
											</button>
										</div>
									{/if}
								</div>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</div>
	</div>
{/if}

<div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
	<div
		class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-slate-700 bg-gradient-to-b from-slate-900 to-slate-800 px-6 shadow-2xl"
	>
		<div class="flex h-16 shrink-0 items-center border-b border-slate-700/50">
			<div class="flex items-center gap-3">
				<div class="bg-light-three flex h-10 w-10 items-center justify-center rounded-xl shadow-lg">
					<span class="font-bold text-white">AI</span>
				</div>
				<span class="text-2xl font-bold text-white">Agent ADK</span>
			</div>
		</div>

		<nav class="flex flex-1 flex-col">
			<ul role="list" class="flex flex-1 flex-col gap-y-7">
				<li>
					<ul role="list" class="space-y-2">
						{#each navigation as item}
							<li>
								<a
									href={item.href}
									class="group flex items-center gap-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 {navigationActive ===
									item.href
										? 'bg-light-three scale-[1.02] transform text-white shadow-lg shadow-blue-500/25'
										: 'text-gray-300 hover:scale-[1.01] hover:transform hover:bg-slate-700/50 hover:text-white'}"
									onclick={() => {
										navigationActive = item.href;
									}}
								>
									<span
										class="flex items-center justify-center {navigationActive === item.href
											? 'text-white'
											: 'text-gray-400 group-hover:text-white'} transition-colors duration-200"
									>
										{@html item.icon}
									</span>
									{item.label}
								</a>
							</li>
						{/each}
					</ul>
				</li>

				<li class="mt-auto pb-4">
					<div class="dropdown-container relative">
						<button
							type="button"
							class="flex w-full items-center gap-x-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-all duration-200 hover:scale-[1.01] hover:transform hover:bg-slate-700/50 hover:text-white"
							onclick={toggleDropdown}
						>
							<div
								class="bg-light-three flex h-8 w-8 items-center justify-center rounded-full shadow-md"
							>
								<span class="text-sm font-bold text-white">LF</span>
							</div>
							<div class="flex-1 text-left">
								<p class="text-sm font-medium">Luis Fernando</p>
								<p class="text-xs text-gray-400">luis441ferrivera@gmail.com</p>
							</div>
							<svg
								class="h-4 w-4 transition-transform duration-200 {dropdownOpen ? 'rotate-180' : ''}"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="m19 9-7 7-7-7"
								></path>
							</svg>
						</button>

						{#if dropdownOpen}
							<div
								class="absolute right-0 bottom-full left-0 z-50 mb-2 rounded-xl border border-slate-700 bg-slate-800 py-2 shadow-2xl backdrop-blur-sm"
							>
								<button
									type="button"
									class="flex w-full items-center gap-x-3 px-4 py-2 text-sm text-gray-300 transition-colors duration-200 hover:bg-slate-700/50 hover:text-white"
									onclick={handleLogout}
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
										></path>
									</svg>
									Sign Out
								</button>
							</div>
						{/if}
					</div>
				</li>
			</ul>
		</nav>
	</div>
</div>

<div
	class="sticky top-0 z-40 flex items-center gap-x-6 border-b border-slate-700 bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-4 shadow-lg sm:px-6 lg:hidden"
>
	<button
		type="button"
		class="-m-2.5 rounded-lg p-2.5 text-gray-300 transition-all duration-200 hover:bg-slate-700/50 hover:text-white lg:hidden"
		onclick={toggleSidebar}
	>
		<span class="sr-only">Open sidebar</span>
		<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
			/>
		</svg>
	</button>

	<div class="flex-1">
		<h1 class="text-lg font-semibold text-white">
			{navigation.find((item) => item.href === navigationActive)?.label || 'Dashboard'}
		</h1>
	</div>

	<div class="dropdown-container relative">
		<button
			type="button"
			class="flex items-center gap-2 rounded-lg p-2 text-gray-300 transition-all duration-200 hover:bg-slate-700/50 hover:text-white"
			onclick={toggleDropdown}
		>
			<div class="bg-light-three flex h-8 w-8 items-center justify-center rounded-full">
				<span class="text-sm font-bold text-white">LF</span>
			</div>
		</button>

		{#if dropdownOpen}
			<div
				class="absolute top-full right-0 z-50 mt-2 w-48 rounded-xl border border-slate-700 bg-slate-800 py-2 shadow-2xl"
			>
				<button
					type="button"
					class="flex w-full items-center gap-x-3 px-4 py-2 text-sm text-gray-300 transition-colors duration-200 hover:bg-slate-700/50 hover:text-white"
					onclick={handleLogout}
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
						></path>
					</svg>
					Sign Out
				</button>
			</div>
		{/if}
	</div>
</div>
