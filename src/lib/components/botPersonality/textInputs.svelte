<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Text } from '../ui';

	export let targetAudience: string = '';
	export let mainObjective: string = '';

	const dispatch = createEventDispatcher<{
		audienceChange: string;
		objectiveChange: string;
	}>();

	function handleAudienceChange(event: Event) {
		const target = event.target as HTMLInputElement;
		targetAudience = target.value;
		dispatch('audienceChange', targetAudience);
	}

	function handleObjectiveChange(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		mainObjective = target.value;
		dispatch('objectiveChange', mainObjective);
	}

	// Sugerencias para audiencias comunes
	const audienceSuggestions = [
		'Young people aged 18-25',
		'Middle-aged professionals',
		'Entrepreneurs and startups',
		'University students',
		'Parents',
		'Older adults',
		'Final consumers'
	];

	// Sugerencias para objetivos comunes
	const objectiveSuggestions = [
		'Generate leads and convert sales',
		'Provide efficient technical support',
		'Educate about products and services',
		'Resolve frequently asked questions',
		'Guide in purchasing processes',
		'Offer personalized recommendations',
		'Schedule appointments and consultations',
		'Collect customer feedback'
	];

	let showAudienceSuggestions = false;
	let showObjectiveSuggestions = false;

	function selectAudienceSuggestion(suggestion: string) {
		targetAudience = suggestion;
		showAudienceSuggestions = false;
		dispatch('audienceChange', targetAudience);
	}

	function selectObjectiveSuggestion(suggestion: string) {
		mainObjective = suggestion;
		showObjectiveSuggestions = false;
		dispatch('objectiveChange', mainObjective);
	}
</script>

<div class="space-y-6">
	<div class="relative">
		<label for="target-audience" class="text-light-two_d mb-2 block text-sm font-semibold">
			🎯 Target Audience
		</label>
		<input
			id="target-audience"
			type="text"
			bind:value={targetAudience}
			on:input={handleAudienceChange}
			on:focus={() => (showAudienceSuggestions = true)}
			on:blur={() => setTimeout(() => (showAudienceSuggestions = false), 200)}
			placeholder="Eg: Marketing professionals aged 25-40"
			class="
        border-light-four focus:border-light-four_d focus:ring-light-four_d w-full rounded-lg
        border px-4 py-3
        transition-all duration-200 focus:ring-2
      "
		/>

		{#if showAudienceSuggestions && targetAudience.length < 3}
			<div
				class="border-light-four bg-light-one_d absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border shadow-lg"
			>
				<div class="p-2">
					<p class="mb-2 text-xs font-medium text-gray-500">Sugerencias populares:</p>
					{#each audienceSuggestions as suggestion}
						<button
							type="button"
							on:mousedown={() => selectAudienceSuggestion(suggestion)}
							class="hover:bg-light-four_d hover:text-light-two_d w-full rounded px-3 py-2 text-left text-sm transition-colors"
						>
							{suggestion}
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<Text variant="body-xs">
			Define who will be the primary user of your bot to customize the language and approach.
		</Text>
	</div>

	<div class="relative">
		<label for="main-objective" class="mb-2 block text-sm font-semibold text-gray-700">
			🎯 Main Objective
		</label>
		<textarea
			id="main-objective"
			bind:value={mainObjective}
			on:input={handleObjectiveChange}
			on:focus={() => (showObjectiveSuggestions = true)}
			on:blur={() => setTimeout(() => (showObjectiveSuggestions = false), 200)}
			placeholder="E.g. Helping users find the perfect product and guiding them through the purchasing process efficiently"
			rows="3"
			class="
        border-light-four focus:border-light-four_d focus:ring-light-four_d w-full resize-none rounded-lg border
        px-4 py-3 transition-all
        duration-200 focus:ring-2
      "
		></textarea>

		{#if showObjectiveSuggestions && mainObjective.length < 10}
			<div
				class="bg-light-one_d border-light-four absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border shadow-lg"
			>
				<div class="p-2">
					<Text variant="body-xs">Common objectives:</Text>
					{#each objectiveSuggestions as suggestion}
						<button
							type="button"
							on:mousedown={() => selectObjectiveSuggestion(suggestion)}
							class="hover:text-light-two hover:bg-light-four_d w-full rounded px-3 py-2 text-left text-sm transition-colors"
						>
							{suggestion}
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<Text variant="body-xs">
			Describe the ultimate goal your bot should achieve in each interaction.
		</Text>
	</div>
</div>
