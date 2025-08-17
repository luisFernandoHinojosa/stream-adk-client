<script lang="ts">
	import type { CommunicationTone } from '$lib/interface';
	import { botPersonalityStore } from '$lib/stores';
	import { createEventDispatcher } from 'svelte';
	import { Text } from '../ui';
	import CheckIcon from '$lib/icons/outline/checkIcon.svelte';

	export let selectedTones: string[] = [];

	const dispatch = createEventDispatcher<{ change: string[] }>();

	const communicationTones: CommunicationTone[] = [
		{
			id: 'empathetic',
			name: 'Empathic',
			emoji: '😊',
			description: 'Show understanding and care'
		},
		{ id: 'humorous', name: 'Humorous', emoji: '😂', description: 'Use appropriate humor' },
		{
			id: 'enthusiastic',
			name: 'Enthusiastic',
			emoji: '🚀',
			description: 'Energetic and motivating'
		},
		{ id: 'analytical', name: 'Analytical', emoji: '🧐', description: 'Based on data and logic' },
		{
			id: 'direct',
			name: 'Straight',
			emoji: '🎯',
			description: 'It goes straight to the point without beating around the bush'
		},
		{ id: 'supportive', name: 'Helpful', emoji: '🤝', description: 'Always willing to help' },
		{ id: 'creative', name: 'Creative', emoji: '🎨', description: 'Contribute innovative ideas' },
		{ id: 'calm', name: 'calm', emoji: '😌', description: 'Calm and balanced' }
	];

	function toggleTone(toneId: string) {
		if (selectedTones.includes(toneId)) {
			selectedTones = selectedTones.filter((t) => t !== toneId);
		} else {
			selectedTones = [...selectedTones, toneId];
		}
		$botPersonalityStore.communicationTones = selectedTones;
		dispatch('change', selectedTones);
	}

	function getToneName(toneId: string): string {
		return communicationTones.find((t) => t.id === toneId)?.id || toneId;
	}
</script>

<div class="space-y-4">
	<Text variant="body-sm">
		Select one or more tones that will define your bot's communication personality.
	</Text>

	<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
		{#each communicationTones as tone}
			<button
				type="button"
				on:click={() => toggleTone(tone.id)}
				class="
          group focus:ring-light-four relative rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-md
          focus:ring-4 focus:outline-none
          {selectedTones.includes(tone.id)
					? 'ring-light-four_d from-light-one_d to-light-four_d bg-gradient-to-r shadow-lg ring-2'
					: 'hover:bg-light-four bg-light-one hover:shadow-lg'}
        "
			>
				<div class="space-y-2 text-center">
					<div class="text-2xl">{tone.emoji}</div>
					<div class="text-sm font-semibold">{tone.name}</div>
					<div class="text-xs opacity-75">{tone.description}</div>
				</div>

				{#if selectedTones.includes(tone.id)}
					<div
						class="bg-light-two absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full shadow-lg"
					>
						<CheckIcon class="text-light-one size-4" />
					</div>
				{/if}
			</button>
		{/each}
	</div>

	{#if selectedTones.length > 0}
		<div>
			<Text variant="body-sm">
				<span class="font-semibold">Selected tones:</span>
				{selectedTones.map(getToneName).join(', ')}
			</Text>
		</div>
	{:else}
		<div>
			<Text variant="body-sm" color="warning">
				<span class="font-semibold"
					>Select at least one tone to define your communication personality.
				</span></Text
			>
		</div>
	{/if}
</div>
