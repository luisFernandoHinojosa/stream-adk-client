<!-- dropdownMenu.svelte -->
<script lang="ts">
	import { clickOutside } from '$lib/utils/clickOutside';
	import { scale } from 'svelte/transition';
	import type { DropdownOption } from '$lib/interface/dropdownOption.interface';

	interface Props {
		options: DropdownOption[];
		width: string;
		class: string;
		isOpen: boolean;
	}

	let { options, width, class: className, isOpen }: Props = $props();

	function handleSelect(option: DropdownOption) {
		if (option.disabled) return;
		if (option.action) {
			option.action();
		}
		close();
	}

	function close(): void {
		isOpen = false;
	}
</script>

{#if isOpen}
	<div
		use:clickOutside={() => close()}
		class="w-[{width}] bg-light-one ring-light-four z-20 rounded-md shadow-lg ring-1 focus:outline-none {className}"
		role="menu"
		aria-orientation="vertical"
		tabindex="-1"
		transition:scale={{ duration: 120, start: 0.95, opacity: 0 }}
	>
		{#each options as option, i}
			{#if option.divider && i > 0}
				<div class="border-t border-gray-100"></div>
			{/if}
			<div class="py-1" role="none">
				<button
					class={`group flex w-full items-center px-4 py-2 text-sm ${option.disabled ? 'text-light-two cursor-not-allowed' : 'text-light-two hover:bg-light-one_d hover:text-light-two_d'}`}
					role="menuitem"
					tabindex="-1"
					onclick={() => handleSelect(option)}
					disabled={option.disabled}
				>
					{#if option.icon}
						<span class="text-light-two group-hover:text-light-two_d mr-3 size-5">
							{@html option.icon}
						</span>
					{/if}
					{option.label}
				</button>
			</div>
		{/each}
	</div>
{/if}
