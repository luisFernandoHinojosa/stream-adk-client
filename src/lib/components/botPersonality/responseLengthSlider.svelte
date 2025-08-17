<script lang="ts">
	import type { ResponseLength } from '$lib/interface';
	import { createEventDispatcher } from 'svelte';
	import { Heading, Text } from '../ui';

	export let value: number = 2;

	const dispatch = createEventDispatcher<{ change: number }>();

	const responseLengths: ResponseLength[] = [
		{ value: 1, label: 'Concise', description: 'Short and direct answers, like a telegram' },
		{
			value: 2,
			label: 'Standard',
			description: 'Balanced answers with the necessary information'
		},
		{
			value: 3,
			label: 'Detailed',
			description: 'Complete explanations with examples and additional context'
		}
	];

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		value = parseInt(target.value);
		dispatch('change', value);
	}

	$: currentLength = responseLengths.find((length) => length.value === value);
</script>

<div class="space-y-4">
	<div class="text-light-two mb-2 flex items-center justify-between text-sm">
		<span class="font-medium">CONCISE</span>
		<span class="font-medium">DETAILED</span>
	</div>

	<div class="relative">
		<input
			type="range"
			min="1"
			max="3"
			bind:value
			on:input={handleInput}
			class="slider bg-light-four h-2 w-full cursor-pointer appearance-none rounded-lg"
			style="background: linear-gradient(to right, #6366f1 0%, #6366f1 {((value - 1) / 2) *
				100}%, #e5e7eb {((value - 1) / 2) * 100}%, #e5e7eb 100%);"
		/>
		<div class="text-light-two_d mt-2 flex justify-between text-xs">
			{#each responseLengths as length}
				<span
					class="transition-all duration-200 {length.value === value
						? 'text-light-two font-semibold'
						: ''}"
				>
					{length.label}
				</span>
			{/each}
		</div>
	</div>
	<div class="space-y-3">
		{#each responseLengths as length}
			<div
				class="
        rounded-lg border-2 p-4 transition-all duration-200
        {length.value === value ? 'border-light-three shadow-sm' : 'border-none'}
      "
			>
				<div class="mb-2 flex items-center space-x-3">
					<div
						class="
            flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold
            {length.value === value
							? 'bg-light-three text-light-one'
							: 'bg-light-four text-light-two'}
          "
					>
						{length.value}
					</div>
					<Heading level="h5">{length.label}</Heading>
				</div>
				<Text variant="body-sm" class="mb-3">{length.description}</Text>

				<div class="p-3">
					<Text variant="body-xs" class="mb-1">Example response:</Text>
					{#if length.value === 1}
						<Text variant="body-sm"
							>Yes, I can help you with that. What specifically do you need?</Text
						>
					{:else if length.value === 2}
						<Text variant="body-sm">
							Of course, I can help you with that. To give you the best answer, I'd like to know a
							little more about your specific situation. Could you tell me more details?
						</Text>
					{:else}
						<Text variant="body-sm">
							Absolutely, I'd be happy to help you with that. To provide you with the most accurate
							and helpful assistance, I'd like to better understand your current situation. I
							suggest we share some additional details about your context, goals, and any
							restrictions you may have. This way, we can work together toward the best possible
							solution.
						</Text>
					{/if}
				</div>
			</div>
		{/each}
	</div>

	{#if currentLength}
		<div class="">
			<Text variant="body-sm">
				<span class="font-semibold">Selected length:</span>
				{currentLength.label} - {currentLength.description}
			</Text>
		</div>
	{/if}
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
