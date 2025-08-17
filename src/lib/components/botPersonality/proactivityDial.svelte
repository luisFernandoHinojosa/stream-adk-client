<script lang="ts">
	import type { ProactivityLevel } from '$lib/interface';
	import { createEventDispatcher } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { quintOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { Heading, Text } from '../ui';

	export let value: number = 2;

	const dispatch = createEventDispatcher<{ change: number }>();

	const proactivityLevels: ProactivityLevel[] = [
		{
			value: 1,
			label: 'Reagent',
			description: 'Only answer what is asked directly.'
		},
		{ value: 2, label: 'Proactive', description: 'Respond and suggest the next logical step.' },
		{
			value: 3,
			label: 'Hyper-Proactive',
			description: 'Respond, suggest steps, and offer additional relevant information.'
		}
	];

	// --- Lógica del Círculo de Progreso (SVG) ---
	const radius = 40;
	const circumference = 2 * Math.PI * radius;

	// 'tweened' crea una animación suave para el valor del offset
	const strokeOffset = tweened(circumference, {
		duration: 700,
		easing: quintOut
	});

	// Función reactiva que se ejecuta cuando 'value' cambia
	$: {
		let progress = 0;
		if (value === 1) {
			progress = 1 / 3;
		} else if (value === 2) {
			progress = 2 / 3;
		} else if (value === 3) {
			progress = 1;
		}
		// Calculamos el nuevo offset y 'tweened' se encarga de la animación
		strokeOffset.set(circumference * (1 - progress));
	}

	function selectLevel(levelValue: number) {
		value = levelValue;
		dispatch('change', value);
	}

	$: currentLevel = proactivityLevels.find((level) => level.value === value);
</script>

<div class="space-y-6">
	<div class="text-center">
		<Text variant="body-sm">Choose how your assistant will interact.</Text>
	</div>

	<div class="relative mx-auto h-48 w-48">
		<svg class="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
			<circle cx="50" cy="50" r={radius} fill="none" stroke="#E5E7EB" stroke-width="10" />
			<circle
				cx="50"
				cy="50"
				r={radius}
				fill="none"
				stroke="#6366f1"
				stroke-width="10"
				stroke-linecap="round"
				stroke-dasharray={circumference}
				stroke-dashoffset={$strokeOffset}
				class="transition-stroke-dashoffset duration-500"
			/>
		</svg>
		<div class="absolute inset-0 flex flex-col items-center justify-center">
			<span class="text-light-two text-4xl font-bold">{value}</span>
			<span class="text-light-two_d text-xs font-medium tracking-widest uppercase">LEVEL</span>
		</div>
	</div>

	<div class="px-4">
		<div class="bg-light-four flex w-full space-x-1 rounded-xl p-1">
			{#each proactivityLevels as level}
				<button
					type="button"
					on:click={() => selectLevel(level.value)}
					class="focus-visible:ring-light-three w-full rounded-lg px-1 py-2 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
					class:bg-white={value === level.value}
					class:text-light-two={value === level.value}
					class:shadow-md={value === level.value}
					class:text-light-two_d={value !== level.value}
					class:hover:bg-light-four_d={value !== level.value}
				>
					{level.label}
				</button>
			{/each}
		</div>
	</div>

	<div class="flex items-center justify-center">
		{#if currentLevel}
			<div>
				<Text variant="body-sm">
					<span class="font-bold">{currentLevel.label}:</span>
					{currentLevel.description}
				</Text>
			</div>
		{/if}
	</div>
</div>
