<script lang="ts">
	import type { FormalityLevel } from '$lib/interface';
	import { botPersonalityStore } from '$lib/stores';
	import { createEventDispatcher } from 'svelte';
	import { Text } from '../ui';

	export let value: number = 3;

	const dispatch = createEventDispatcher<{ change: number }>();

	const formalityLevels: FormalityLevel[] = [
		{ value: 1, label: 'Colleague' },
		{ value: 2, label: 'Friendly' },
		{ value: 3, label: 'Neutral' },
		{ value: 4, label: 'Professional' },
		{ value: 5, label: 'Corporate' }
	];

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		value = parseInt(target.value);
		// console.log('value', value);
		// dispatch('change', value);
		$botPersonalityStore.formalityLevel = value;
	}

	$: currentLevel = formalityLevels.find((level) => level.value === value)?.label || 'Neutral';
</script>

<div class="space-y-4">
	<div class="text-light-two_d mb-2 flex items-center justify-between text-sm">
		<span class="text-light-two font-medium">VERY INFORMAL</span>
		<span class="text-light-two font-medium">VERY FORMAL</span>
	</div>

	<div class="relative">
		<input
			type="range"
			min="1"
			max="5"
			bind:value
			on:input={handleInput}
			class="slider bg-light-four h-2 w-full cursor-pointer appearance-none rounded-lg"
			style="background: linear-gradient(to right, #6366f1 0%, #6366f1 {((value - 1) / 4) *
				100}%, #e5e7eb {((value - 1) / 4) * 100}%, #e5e7eb 100%);"
		/>
		<div class="text-light-two mt-2 flex justify-between text-xs">
			{#each formalityLevels as level}
				<span
					class="transition-all duration-200 {level.value === value
						? 'text-light-two font-semibold'
						: ''}"
				>
					{level.label}
				</span>
			{/each}
		</div>
	</div>

	<div>
		<Text variant="body-sm" class="text-light-two text-sm">
			<span class="font-semibold">Nivel actual:</span>
			{currentLevel}
		</Text>
	</div>
</div>

<style>
	.slider::-webkit-slider-thumb {
		appearance: none;
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: #6366f1;
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		transition: all 0.2s ease;
	}

	.slider::-webkit-slider-thumb:hover {
		transform: scale(1.1);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	}

	.slider::-moz-range-thumb {
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: #6366f1;
		cursor: pointer;
		border: none;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}
</style>
