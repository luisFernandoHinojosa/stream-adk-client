<script lang="ts">
	import { BrainIcon, ChevronLeftIcon } from '$lib/icons/outline';
	import Menu2Icon from '$lib/icons/outline/menu2Icon.svelte';
	import XmarkIcon from '$lib/icons/outline/xmarkIcon.svelte';

	import { getValueType } from './getValueType';
	import TreeRenderer from './treeRenderer.svelte';

	export let data: any;

	interface ExpandedState {
		[key: string]: boolean;
	}

	interface NavigationStep {
		key: string;
		value: any;
		displayName: string;
	}

	let selectedParentKey: string | null = null;
	let expandedKeys: ExpandedState = {};
	let sidebarOpen = false;

	// Mobile navigation state
	let mobileNavigationStack: NavigationStep[] = [];
	let currentMobileView: any = null;
	let currentMobileKey: string = '';

	// Get top-level keys for sidebar
	const getTopLevelKeys = (data: any): string[] => {
		if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
			return Object.keys(data);
		}
		return [];
	};

	const getSelectedContent = () => {
		if (!selectedParentKey) return null;

		if (selectedParentKey === 'root' && Array.isArray(data)) {
			return data;
		}

		if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
			return data[selectedParentKey];
		}

		return null;
	};

	const toggleExpansion = (key: string) => {
		expandedKeys[key] = !expandedKeys[key];
		expandedKeys = { ...expandedKeys };
	};

	const selectKey = (key: string) => {
		selectedParentKey = key;
		sidebarOpen = false;

		// Reset mobile navigation when selecting a new parent key
		mobileNavigationStack = [];
		if (key === 'root' && Array.isArray(data)) {
			currentMobileView = data;
			currentMobileKey = 'Root Array';
		} else if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
			currentMobileView = data[key];
			currentMobileKey = key;
		}
	};

	// Mobile navigation functions
	const navigateToChild = (childKey: string, childValue: any, displayName: string) => {
		// Add current state to navigation stack
		mobileNavigationStack = [
			...mobileNavigationStack,
			{
				key: currentMobileKey,
				value: currentMobileView,
				displayName: currentMobileKey
			}
		];

		// Navigate to child
		currentMobileView = childValue;
		currentMobileKey = displayName;
	};

	const navigateBack = () => {
		if (mobileNavigationStack.length > 0) {
			const previousStep = mobileNavigationStack[mobileNavigationStack.length - 1];
			mobileNavigationStack = mobileNavigationStack.slice(0, -1);

			currentMobileView = previousStep.value;
			currentMobileKey = previousStep.displayName;
		}
	};

	const isNavigable = (value: any): boolean => {
		return (
			(Array.isArray(value) && value.length > 0) ||
			(typeof value === 'object' && value !== null && Object.keys(value).length > 0)
		);
	};

	const formatPreview = (value: any): string => {
		if (typeof value === 'string') {
			return `"${value}"`;
		}
		if (typeof value === 'number' || typeof value === 'boolean') {
			return String(value);
		}
		if (value === null) return 'null';
		if (value === undefined) return 'undefined';
		return getValueType(value);
	};

	// Select first key by default and initialize mobile view
	$: if (data && !selectedParentKey) {
		const topKeys = getTopLevelKeys(data);
		if (topKeys.length > 0) {
			selectKey(topKeys[0]);
		} else if (Array.isArray(data)) {
			selectKey('root');
		}
	}
</script>

<div class="flex h-full bg-light-one dark:bg-dark-one">
	<div class="absolute top-3 left-4 z-10 lg:hidden">
		<button
			on:click={() => (sidebarOpen = !sidebarOpen)}
			class="rounded-lg bg-light-two p-2 shadow-lg transition-all duration-200 hover:shadow-xl dark:bg-dark-two"
		>
			{#if sidebarOpen}
				<XmarkIcon className="w-5 h-5 text-light-one dark:text-dark-one" />
			{:else}
				<Menu2Icon class="h-5 w-5 text-light-one dark:text-dark-one" />
			{/if}
		</button>
	</div>

	{#if sidebarOpen}
		<div
			class="bg-opacity-50 fixed inset-0 z-20 bg-black lg:hidden"
			on:click={() => (sidebarOpen = false)}
			role="button"
			tabindex="0"
		></div>
	{/if}

	<!-- Sidebar -->
	<div
		class="
		{sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
		fixed
		z-30 flex
		h-full w-72
		flex-col bg-light-one_d
		transition-transform
		duration-300 ease-in-out
		sm:w-80 lg:relative lg:z-0
		lg:translate-x-0 dark:bg-dark-one_d
	"
	>
		<div class="flex-1 space-y-1 overflow-y-auto p-2 sm:p-3">
			{#if typeof data === 'object' && data !== null}
				{#if Array.isArray(data)}
					<!-- Root array -->
					<button
						on:click={() => selectKey('root')}
						class="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left transition-colors sm:px-3 {selectedParentKey ===
						'root'
							? 'bg-light-two text-light-one hover:bg-light-two_d dark:bg-dark-two dark:text-dark-one dark:hover:bg-dark-two_d'
							: 'text-light-two hover:bg-light-two_d dark:text-dark-two dark:hover:bg-dark-two_d'}"
					>
						<span class="truncate text-sm font-medium">Root Array</span>
						<span
							class="ml-1 flex-shrink-0 rounded bg-gray-200 px-1.5 py-1 text-xs text-gray-600 sm:px-2 dark:bg-gray-600 dark:text-gray-300"
						>
							{data.length}
						</span>
					</button>
				{:else}
					<!-- Object keys -->
					{#each Object.entries(data) as [key, value]}
						<button
							on:click={() => selectKey(key)}
							class="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left transition-colors sm:px-3 {selectedParentKey ===
							key
								? 'bg-light-two text-light-one hover:bg-light-two_d dark:bg-dark-two dark:text-dark-one dark:hover:bg-dark-two_d'
								: 'group text-light-two hover:bg-light-two_d dark:text-dark-two dark:hover:bg-dark-two_d'}"
						>
							<span
								class="min-w-0 truncate text-sm font-medium group-hover:text-light-one dark:group-hover:text-dark-one"
								title={key}>"{key}"</span
							>
							<div class="ml-1 flex flex-shrink-0 items-center space-x-1">
								<span
									class="rounded bg-light-one px-1.5 py-1 text-xs text-light-two sm:px-2 dark:bg-dark-one dark:text-dark-two"
								>
									{getValueType(value)}
								</span>
								{#if Array.isArray(value)}
									<span
										class="hidden text-xs text-light-two group-hover:text-light-one sm:inline dark:text-dark-two dark:group-hover:text-dark-one"
										>{value.length}</span
									>
								{:else if typeof value === 'object' && value !== null}
									<span
										class="hidden text-xs text-light-two group-hover:text-light-one sm:inline dark:text-dark-two dark:group-hover:text-dark-one"
										>{Object.keys(value).length}</span
									>
								{/if}
							</div>
						</button>
					{/each}
				{/if}
			{:else}
				<div class="p-3 text-center text-sm text-gray-500 dark:text-gray-400">Primitive value</div>
			{/if}
		</div>
	</div>

	<!-- Main Content -->
	<div class="flex min-w-0 flex-1 flex-col">
		<div class="flex-1 overflow-y-auto">
			{#if selectedParentKey && getSelectedContent() !== null}
				<div class="sm:hidden">
					{#if currentMobileView !== null}
						<div class="p-4">
							<!-- Navigation -->
							<div
								class="mb-4 flex items-center space-x-3 border-b border-light-two pb-3 dark:border-dark-two"
							>
								{#if mobileNavigationStack.length > 0}
									<button
										on:click={navigateBack}
										class="flex items-center space-x-2 rounded-lg bg-light-two px-3 py-1.5 transition-colors hover:bg-light-two_d dark:bg-dark-two dark:hover:bg-dark-two_d"
									>
										<ChevronLeftIcon class="h-4 w-4 text-light-one dark:text-dark-one" />
										<span class="text-sm font-medium text-light-one dark:text-dark-one">Atras</span>
									</button>
								{/if}
								<div class="flex-1">
									<h3 class="text-lg font-semibold text-light-three dark:text-dark-three">
										{currentMobileKey}
									</h3>
									<p class="text-sm text-light-two dark:text-dark-two">
										{Array.isArray(currentMobileView)
											? `Array con ${currentMobileView.length} items`
											: typeof currentMobileView === 'object' && currentMobileView !== null
												? `Object con ${Object.keys(currentMobileView).length} propieades`
												: getValueType(currentMobileView)}
									</p>
								</div>
							</div>

							<!-- Content -->
							<div class="space-y-2">
								{#if Array.isArray(currentMobileView)}
									{#each currentMobileView as item, index}
										<div class="rounded-lg bg-light-one_d p-4 dark:bg-dark-one_d">
											{#if isNavigable(item)}
												<button
													on:click={() => navigateToChild(`[${index}]`, item, `[${index}]`)}
													class="group flex w-full items-center justify-between rounded p-2 text-left transition-colors hover:bg-light-two_d dark:hover:bg-dark-two_d"
												>
													<div class="flex min-w-0 flex-1 flex-col">
														<span
															class="text-sm font-medium text-light-three group-hover:text-light-one dark:text-dark-three dark:group-hover:text-dark-one"
														>
															[{index}]
														</span>
														<span
															class="text-xs text-light-two group-hover:text-light-one dark:text-dark-two dark:group-hover:text-dark-one"
														>
															{Array.isArray(item)
																? `Array[${item.length}]`
																: `Object{${Object.keys(item).length}}`}
														</span>
													</div>
													<ChevronLeftIcon
														class="h-4 w-4 rotate-180 transform text-light-two group-hover:text-light-one dark:text-dark-three dark:group-hover:text-dark-one"
													/>
												</button>
											{:else}
												<div class="p-2">
													<div class="mb-1 flex items-center space-x-2">
														<span class="text-sm font-medium text-light-three dark:text-dark-three">
															[{index}]:
														</span>
														<span
															class="rounded bg-light-two px-2 py-1 text-xs text-light-one dark:bg-dark-two dark:text-dark-one"
														>
															{getValueType(item)}
														</span>
													</div>
													<div
														class="rounded bg-light-one p-2 text-sm break-all text-light-two dark:bg-dark-one dark:text-dark-two"
													>
														{formatPreview(item)}
													</div>
												</div>
											{/if}
										</div>
									{/each}
								{:else if typeof currentMobileView === 'object' && currentMobileView !== null}
									{#each Object.entries(currentMobileView) as [key, value]}
										<div class="rounded-lg bg-light-one_d p-3 dark:bg-dark-one_d">
											{#if isNavigable(value)}
												<button
													on:click={() => navigateToChild(key, value, key)}
													class="group flex w-full items-center justify-between rounded p-2 text-left transition-colors hover:bg-light-two_d dark:hover:bg-dark-two_d"
												>
													<div class="flex min-w-0 flex-1 flex-col">
														<span
															class="text-sm font-medium break-all text-light-three group-hover:text-light-one dark:text-dark-three dark:group-hover:text-dark-one"
														>
															"{key}"
														</span>
														<span
															class="text-xs text-light-two group-hover:text-light-one dark:text-dark-two dark:group-hover:text-dark-one"
														>
															{Array.isArray(value)
																? `Array[${value.length}]`
																: `Object{${Object.keys(value).length}}`}
														</span>
													</div>
													<ChevronLeftIcon
														class="h-4 w-4 rotate-180 transform text-light-three group-hover:text-light-one dark:text-dark-three dark:group-hover:text-dark-one"
													/>
												</button>
											{:else}
												<div class="p-2">
													<div class="mb-1 flex items-center space-x-2">
														<span
															class="text-sm font-medium break-all text-light-three dark:text-dark-three"
														>
															"{key}":
														</span>
														<span
															class="rounded bg-light-two px-2 py-1 text-xs text-light-one dark:bg-dark-two dark:text-dark-one"
														>
															{getValueType(value)}
														</span>
													</div>
													<div
														class="rounded bg-light-one p-2 font-mono text-sm text-light-two dark:bg-dark-one dark:text-dark-two"
													>
														{formatPreview(value)}
													</div>
												</div>
											{/if}
										</div>
									{/each}
								{:else}
									<!-- Primitive value -->
									<div class="rounded-lg bg-light-one_d p-4 dark:bg-dark-one_d">
										<div class="mb-2 flex items-center space-x-2">
											<span
												class="rounded bg-light-two px-2 py-1 text-sm text-light-one dark:bg-dark-two dark:text-dark-one"
											>
												{getValueType(currentMobileView)}
											</span>
										</div>
										<div
											class="rounded bg-light-one p-3 text-sm text-light-two dark:bg-dark-one dark:text-dark-two"
										>
											{formatPreview(currentMobileView)}
										</div>
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>

				<div class="hidden sm:block">
					{#if getSelectedContent() !== null}
						<div class="p-2 sm:p-4">
							<TreeRenderer
								value={getSelectedContent()}
								keyName={selectedParentKey}
								{expandedKeys}
								{toggleExpansion}
								depth={0}
								parentPath={selectedParentKey}
							/>
						</div>
					{/if}
				</div>
			{:else}
				<!-- Empty state -->
				<div class="flex h-full flex-col items-center justify-center p-4 text-center">
					<BrainIcon class="mb-4 size-12 text-light-three sm:size-16 dark:text-dark-three" />
					<h3 class="mb-2 text-base font-medium text-light-two sm:text-lg dark:text-dark-two">
						Select a Key
					</h3>
					<p class="text-sm text-light-two sm:text-base dark:text-dark-two">
						Choose a key from the sidebar to view its content
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>
