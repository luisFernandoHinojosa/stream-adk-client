<script lang="ts">
	import type { EmojiUsage } from '$lib/interface';
	import { createEventDispatcher } from 'svelte';
	import { Text } from '../ui';
	import { CheckIcon } from '$lib/icons/outline';

	export let value: 'none' | 'subtle' | 'frequent' = 'subtle';

	const dispatch = createEventDispatcher<{ change: 'none' | 'subtle' | 'frequent' }>();

	const emojiOptions: EmojiUsage[] = [
		{ value: 'none', label: 'No Emojis', example: 'Hello, how can I help you?' },
		{ value: 'subtle', label: 'Subtle Use', example: 'Hi, how can I help you? 😊' },
		{ value: 'frequent', label: 'Frequent Use', example: 'Hello! 👋 How can I help you? 😊✨' }
	];

	function selectOption(optionValue: 'none' | 'subtle' | 'frequent') {
		value = optionValue;
		dispatch('change', value);
	}

	$: currentOption = emojiOptions.find((option) => option.value === value);
</script>

<div class="space-y-4">
	<Text variant="body-sm">
		Define how expressive your bot will be with emojis and visual elements.
	</Text>

	<div class="space-y-3">
		{#each emojiOptions as option}
			<button
				type="button"
				on:click={() => selectOption(option.value)}
				class="
          focus:ring-light-four w-full rounded-lg p-4 text-left transition-all duration-200 hover:scale-[1.01] hover:shadow-md
          focus:ring-4 focus:outline-none
          {value === option.value
					? 'ring-light-four_d from-light-one_d to-light-four_d bg-gradient-to-r shadow-lg ring-2'
					: 'hover:bg-light-four bg-light-one hover:shadow-lg'}
        "
			>
				<div class="flex items-center justify-between">
					<div class="flex-1 space-y-2">
						<div class="flex items-center space-x-3">
							<!-- Visual Representation -->
							<div
								class="
                flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg
                {value === option.value
									? 'border-light-three bg-light-four'
									: 'border-light-four_d'}
              "
							>
								{#if option.value === 'none'}
									ABC
								{:else if option.value === 'subtle'}
									😊
								{:else}
									🎉
								{/if}
							</div>

							<div>
								<h4 class="font-semibold">{option.label}</h4>
								<p class="text-sm opacity-75">
									{#if option.value === 'none'}
										Purely textual communication
									{:else if option.value === 'subtle'}
										Occasional emojis to humanize
									{:else}
										Expressive and visual in every message
									{/if}
								</p>
							</div>
						</div>

						<!-- Example -->
						<div class="border-light-four_d ml-15 border-l-2 pl-3">
							<p class="text-light-two_d mb-1 text-xs">Example:</p>
							<p class="text-sm font-medium">{option.example}</p>
						</div>
					</div>

					{#if value === option.value}
						<div
							class="bg-light-two text-light-one ml-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full p-1"
						>
							<CheckIcon />
						</div>
					{/if}
				</div>
			</button>
		{/each}
	</div>

	{#if currentOption}
		<div>
			<Text variant="body-sm">
				<span class="font-semibold">Selected style:</span>
				{currentOption.label}
			</Text>
			<Text variant="body-xs">
				The bot {currentOption.value === 'none'
					? 'will not use emojis'
					: currentOption.value === 'subtle'
						? 'will use emojis sparingly'
						: 'will be very expressive with emojis'} in their responses.
			</Text>
		</div>
	{/if}
</div>
