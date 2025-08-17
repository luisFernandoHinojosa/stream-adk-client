<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { BotPersonality } from '$lib/interface';
	import {
		ArchetypeCards,
		EmojiSelector,
		FormalitySlider,
		ProactivityDial,
		ResponseLengthSlider,
		TextInputs,
		ToneSelector
	} from '.';
	import { Heading } from '../ui';

	export let personality: BotPersonality;

	const dispatch = createEventDispatcher<{
		personalityChange: BotPersonality;
	}>();

	$: {
		dispatch('personalityChange', personality);
	}

	function updatePersonality(field: keyof BotPersonality, value: any) {
		personality = { ...personality, [field]: value };
	}
</script>

<div class="space-y-8">
	<div
		class="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg transition-all duration-300 hover:shadow-xl"
	>
		<div
			class="bg-opacity-10 absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-blue-500"
		></div>
		<div class="relative p-8">
			<div class="mb-6 flex items-center">
				<div
					class="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg"
				>
					<span class="text-2xl">📝</span>
				</div>
				<div>
					<Heading level="h4" class="font-bold text-blue-900">Formality Level</Heading>
					<p class="text-sm text-blue-700">Define how formal your bot will be</p>
				</div>
			</div>
			<FormalitySlider
				bind:value={personality.formalityLevel}
				on:change={(e) => updatePersonality('formalityLevel', e.detail)}
			/>
		</div>
	</div>

	<div
		class="relative overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg transition-all duration-300 hover:shadow-xl"
	>
		<div
			class="bg-opacity-10 absolute top-0 left-0 -mt-12 -ml-12 h-24 w-24 rounded-full bg-purple-500"
		></div>
		<div
			class="bg-opacity-10 absolute right-0 bottom-0 -mr-8 -mb-8 h-16 w-16 rounded-full bg-pink-500"
		></div>
		<div class="relative p-8">
			<div class="mb-6 flex items-center">
				<div
					class="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
				>
					<span class="text-2xl">🎭</span>
				</div>
				<div>
					<Heading level="h4" class="font-bold text-purple-900">Communication Tone</Heading>
					<p class="text-sm text-purple-700">Select the tones that best describe your bot</p>
				</div>
			</div>
			<ToneSelector
				bind:selectedTones={personality.communicationTones}
				on:change={(e) => updatePersonality('communicationTones', e.detail)}
			/>
		</div>
	</div>

	<div
		class="relative overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-cyan-50 shadow-lg transition-all duration-300 hover:shadow-xl"
	>
		<div
			class="bg-opacity-5 absolute top-0 right-0 -mt-20 -mr-20 h-40 w-40 rounded-full bg-indigo-500"
		></div>
		<div class="relative p-8">
			<div class="mb-6 flex items-center">
				<div
					class="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-lg"
				>
					<span class="text-2xl">👑</span>
				</div>
				<div>
					<Heading level="h4" class="font-bold text-indigo-900">Archetype or Role</Heading>
					<p class="text-sm text-indigo-700">Define your bot's base personality</p>
				</div>
			</div>
			<ArchetypeCards
				bind:selectedArchetype={personality.archetype}
				on:change={(e) => updatePersonality('archetype', e.detail)}
			/>
		</div>
	</div>

	<div
		class="relative overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg transition-all duration-300 hover:shadow-xl"
	>
		<div
			class="bg-opacity-10 absolute bottom-0 left-0 -mb-14 -ml-14 h-28 w-28 rounded-full bg-green-500"
		></div>
		<div class="relative p-8">
			<div class="mb-6 flex items-center">
				<div
					class="mr-4 flex h-12 w-12 animate-pulse items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg"
				>
					<span class="text-2xl">⚡</span>
				</div>
				<div>
					<Heading level="h4" class="font-bold text-green-900">Proactivity Level</Heading>
					<p class="text-sm text-green-700">How active your bot will be in conversations</p>
				</div>
			</div>
			<ProactivityDial
				bind:value={personality.proactivityLevel}
				on:change={(e) => updatePersonality('proactivityLevel', e.detail)}
			/>
		</div>
	</div>
	<div
		class="relative overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 shadow-lg transition-all duration-300 hover:shadow-xl"
	>
		<div
			class="bg-opacity-10 absolute top-0 left-0 -mt-10 -ml-10 h-20 w-20 rounded-full bg-orange-500"
		></div>
		<div
			class="bg-opacity-5 absolute right-0 bottom-0 -mr-16 -mb-16 h-32 w-32 rounded-full bg-amber-500"
		></div>
		<div class="relative p-8">
			<div class="mb-6 flex items-center">
				<div
					class="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg"
				>
					<span class="text-2xl">📏</span>
				</div>
				<div>
					<Heading level="h4" class="font-bold text-orange-900">Extension of Responses</Heading>
					<p class="text-sm text-orange-700">Control how long the responses will be</p>
				</div>
			</div>
			<ResponseLengthSlider
				bind:value={personality.responseLength}
				on:change={(e) => updatePersonality('responseLength', e.detail)}
			/>
		</div>
	</div>
	<div
		class="relative overflow-hidden rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 shadow-lg transition-all duration-300 hover:shadow-xl"
	>
		<div
			class="bg-opacity-5 absolute top-0 right-0 -mt-18 -mr-18 h-36 w-36 rounded-full bg-rose-500"
		></div>
		<div class="relative p-8">
			<div class="mb-6 flex items-center">
				<div
					class="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg"
				>
					<span class="text-2xl">😊</span>
				</div>
				<div>
					<Heading level="h4" class="font-bold text-rose-900">Use of Expressive Elements</Heading>
					<p class="text-sm text-rose-700">
						Define how you will use emojis and expressive elements
					</p>
				</div>
			</div>
			<EmojiSelector
				bind:value={personality.emojiUsage}
				on:change={(e) => updatePersonality('emojiUsage', e.detail)}
			/>
		</div>
	</div>
	<div
		class="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50 shadow-lg transition-all duration-300 hover:shadow-xl"
	>
		<div
			class="bg-opacity-5 absolute bottom-0 left-0 -mb-22 -ml-22 h-44 w-44 rounded-full bg-slate-500"
		></div>
		<div class="relative p-8">
			<div class="mb-6 flex items-center">
				<div
					class="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-slate-600 to-gray-600 shadow-lg"
				>
					<span class="text-2xl text-white">🎯</span>
				</div>
				<div>
					<Heading level="h4">Additional information</Heading>
					<p class="text-sm text-slate-700">Specific details about audience and objectives</p>
				</div>
			</div>
			<TextInputs
				bind:targetAudience={personality.targetAudience}
				bind:mainObjective={personality.mainObjective}
				on:audienceChange={(e) => updatePersonality('targetAudience', e.detail)}
				on:objectiveChange={(e) => updatePersonality('mainObjective', e.detail)}
			/>
		</div>
	</div>
</div>

<style>
	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}
	.animate-float {
		animation: float 3s ease-in-out infinite;
	}
</style>
