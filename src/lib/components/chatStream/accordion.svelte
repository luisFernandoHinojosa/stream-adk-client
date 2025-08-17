<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	interface Props {
		children: Snippet;
		title: string;
		type: 'function' | 'default';
		processCount?: number;
	}

	let { title, type, children, processCount = 0 }: Props = $props();

	let isOpen: boolean = $state(false);

	function toggle(): void {
		isOpen = !isOpen;
	}
</script>

<div
	class="rounded-2xl overflow-hidden w-full transition-all duration-300 border border-light-two hover:border-light-two_d dark:border-dark-two dark:hover:border-dark-two_d bg-light-one_d dark:bg-dark-one_d {isOpen
		? 'shadow-xl'
		: 'shadow-sm hover:shadow-md'}"
>
	<button
		onclick={toggle}
		class="w-full flex items-center justify-between p-2 text-left transition-all duration-300 group rounded-2xl {isOpen
			? 'rounded-b-none '
			: ''}"
	>
		<div class="flex items-center gap-4">
			{#if type === 'function'}
				<div class="relative">
					<div
						class="w-12 h-12 rounded-xl bg-light-two dark:bg-dark-two flex items-center justify-center"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-8 h-8 text-light-one dark:text-dark-one"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
				</div>
			{/if}
			<div class="flex flex-col gap-1">
				<span class="font-semibold text-light-two dark:text-dark-two text-lg">{title}</span>
			</div>
		</div>

		<div class="flex items-center gap-4">
			<div
				class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-4 h-4 text-light-two dark:text-dark-two transition-transform duration-300"
					class:rotate-180={isOpen}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
				</svg>
			</div>
		</div>
	</button>

	{#if isOpen}
		<div
			transition:slide={{ duration: 350, easing: cubicOut }}
			class="bg-light-one_d dark:bg-dark-one_d"
		>
			<div class="pt-4">
				{@render children()}
			</div>
		</div>
	{/if}
</div>
