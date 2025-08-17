<script lang="ts">
	import { ChevronDownIcon } from '$lib/icons/outline';
	import ChevronRightIcon from '$lib/icons/outline/chevronRightIcon.svelte';
	import { formatValue } from './formatValue';
	import { getValueType } from './getValueType';

	//TreeRenderer.svelte
	export let value: any;
	export let keyName: string;
	export let expandedKeys: { [key: string]: boolean };
	export let toggleExpansion: (key: string) => void;
	export let depth: number = 0;
	export let parentPath: string = '';

	const isExpandable = (value: any): boolean => {
		return (
			(Array.isArray(value) && value.length > 0) ||
			(typeof value === 'object' && value !== null && Object.keys(value).length > 0)
		);
	};

	const truncateString = (str: string, maxLength: number = 100): string => {
		if (str.length <= maxLength) return str;
		return str.substring(0, maxLength) + '...';
	};

	const truncateStringMobile = (str: string, maxLength: number = 50): string => {
		if (str.length <= maxLength) return str;
		return str.substring(0, maxLength) + '...';
	};

	$: currentPath = parentPath ? `${parentPath}.${keyName}` : keyName;
	$: keyId = `${currentPath}-${depth}`;
	$: isExpanded = expandedKeys[keyId] ?? false; // Por defecto no expandido
</script>

<div class="">
	<div class="">
		<div class="flex items-start rounded p-4">
			{#if isExpandable(value)}
				<button
					on:click={() => toggleExpansion(keyId)}
					class="group mt-0.5 flex-shrink-0 transform rounded p-1 transition-colors duration-200 hover:bg-light-two_d dark:hover:bg-dark-two_d"
				>
					{#if isExpanded}
						<ChevronDownIcon
							className="w-4 h-4 text-light-two dark:text-dark-two group-hover:text-light-one dark:group-hover:text-dark-one "
						/>
					{:else}
						<ChevronRightIcon
							class="h-4 w-4 text-light-two group-hover:text-light-one dark:text-dark-two dark:group-hover:text-dark-one"
						/>
					{/if}
				</button>
			{:else}
				<div class="mt-0.5 w-6"></div>
			{/if}

			<!-- Contenido del nodo -->
			<div class="flex min-w-0 flex-1 flex-col space-y-1">
				<!-- Línea principal con key y tipo -->
				<div class="flex items-start space-x-1 border-b border-light-two pb-1 dark:border-dark-two">
					<span class="flex-shrink-0 text-sm font-bold text-light-three dark:text-dark-three"
						>{keyName}:</span
					>

					{#if Array.isArray(value)}
						<span class="flex-shrink-0 text-sm text-light-three dark:text-dark-three">
							Array[{value.length}]
						</span>
						<!-- Preview de elementos del array cuando está colapsado -->
						{#if !isExpanded && value.length > 0}
							<span class="truncate text-xs text-light-three dark:text-dark-three">
								[{value
									.slice(0, 3)
									.map((item) =>
										typeof item === 'string'
											? `"${truncateString(item, 20)}"`
											: typeof item === 'object' && item !== null
												? Array.isArray(item)
													? `Array[${item.length}]`
													: 'Object'
												: String(item)
									)
									.join(', ')}{value.length > 3 ? ', ...' : ''}]
							</span>
						{/if}
					{:else if typeof value === 'object' && value !== null}
						<span class="flex-shrink-0 text-sm text-light-three dark:text-dark-three">
							Object {Object.keys(value).length > 0 ? `{${Object.keys(value).length}}` : '{}'}
						</span>
						<!-- Preview de propiedades del objeto cuando está colapsado -->
						{#if !isExpanded && Object.keys(value).length > 0}
							<span class="truncate text-xs text-light-three dark:text-dark-three">
								{Object.keys(value)
									.slice(0, 3)
									.map((k) => `"${k}"`)
									.join(', ')}{Object.keys(value).length > 3 ? ', ...' : ''}
							</span>
						{/if}
					{:else}
						<!-- Valores primitivos -->
						<div class="flex min-w-0 flex-1 flex-col items-start space-x-2">
							<div class="">
								<span
									class="flex-shrink-0 rounded-md bg-light-two p-1 text-xs text-light-one dark:bg-dark-two dark:text-dark-one"
									>{getValueType(value)}</span
								>
								<span class="text-sm text-light-two dark:text-dark-two">
									{formatValue(value)}
								</span>
							</div>
						</div>
					{/if}
				</div>

				<!-- aqui border izquierdo -->
				{#if isExpandable(value) && isExpanded}
					<div class="borde border-light-two dark:border-dark-two">
						{#if Array.isArray(value)}
							{#each value as item, index}
								<svelte:self
									value={item}
									keyName={`[${index}]`}
									{expandedKeys}
									{toggleExpansion}
									depth={depth + 1}
									parentPath={currentPath}
								/>
							{/each}
						{:else if typeof value === 'object' && value !== null}
							{#each Object.entries(value) as [key, val]}
								<svelte:self
									value={val}
									keyName={key}
									{expandedKeys}
									{toggleExpansion}
									depth={depth + 1}
									parentPath={currentPath}
								/>
							{/each}
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
