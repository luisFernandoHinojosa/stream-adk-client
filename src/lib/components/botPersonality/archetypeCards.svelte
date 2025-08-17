<script lang="ts">
	import { CheckIcon } from '$lib/icons/outline';
	import type { Archetype } from '$lib/interface';
	import { botPersonalityStore } from '$lib/stores';
	import { createEventDispatcher } from 'svelte';
	import { Heading, Text } from '../ui';

	export let selectedArchetype: string = '';

	const dispatch = createEventDispatcher<{ change: string }>();

	const archetypes: Archetype[] = [
		{
			id: 'expert',
			name: 'The Expert',
			icon: '🧑‍🏫',
			description:
				'Responds with authority and accurate data. Ideal for technical support or consulting.'
		},
		{
			id: 'helpful_friend',
			name: 'The Helpful Friend',
			icon: '🤝',
			description: "He's friendly, patient, and uses simple language. Perfect for customer service."
		},
		{
			id: 'practical_guide',
			name: 'The Practical Guide',
			icon: '🧭',
			description:
				'It gets straight to the point and offers next steps. Ideal for processes and tutorials.'
		},
		{
			id: 'creative_mentor',
			name: 'The Creative Mentor',
			icon: '🎨',
			description:
				'Inspire and motivate with innovative ideas. Perfect for brainstorming and creativity.'
		},
		{
			id: 'sales_consultant',
			name: 'The Sales Consultant',
			icon: '💼',
			description: 'Persuasive and results-oriented. Ideal for conversions and sales.'
		},
		{
			id: 'wellness_coach',
			name: 'The Wellness Coach',
			icon: '🌟',
			description:
				'Empathetic and motivating. Perfect for health, fitness, and personal development.'
		}
	];

	function selectArchetype(archetypeId: string) {
		selectedArchetype = archetypeId;
		dispatch('change', archetypeId);
	}

	function getArchetypeName(archetypeId: string): string {
		let name = archetypes.find((a) => a.id === archetypeId)?.name || '';
		console.log(name);
		$botPersonalityStore.archetype = name;
		return name;
	}
</script>

<div class="space-y-4">
	<Text variant="body-sm">
		Choose the base archetype that best represents the personality you want for your bot.
	</Text>

	<div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
		{#each archetypes as archetype}
			<button
				type="button"
				on:click={() => selectArchetype(archetype.id)}
				class="
          group focus:ring-light-four relative rounded-xl p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
          focus:ring-4 focus:outline-none
          {selectedArchetype === archetype.id
					? 'ring-light-four_d from-light-one_d to-light-four_d bg-gradient-to-r shadow-lg ring-2'
					: 'hover:bg-light-four bg-light-one hover:shadow-lg'}
        "
			>
				<div class="flex flex-col items-center space-y-2">
					<div class="flex-shrink-0 text-3xl transition-transform group-hover:scale-110">
						{archetype.icon}
					</div>
					<div class="min-w-0 flex-1">
						<Heading level="h5" class="mb-2">
							{archetype.name}
						</Heading>
						<Text variant="body-sm">
							{archetype.description}
						</Text>
					</div>
				</div>

				{#if selectedArchetype === archetype.id}
					<div
						class="bg-light-two absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full shadow-lg"
					>
						<CheckIcon class="text-light-one size-4" />
					</div>
				{/if}
			</button>
		{/each}
	</div>

	{#if selectedArchetype}
		<div>
			<Text variant="body-sm">
				<span class="font-semibold">Selected Archetype:</span>
				{getArchetypeName(selectedArchetype)}
			</Text>
		</div>
	{:else}
		<div>
			<Text variant="body-sm" color="warning">
				<span class="font-semibold">Selected Archetype</span> to define the base role of your bot.
			</Text>
		</div>
	{/if}
</div>
