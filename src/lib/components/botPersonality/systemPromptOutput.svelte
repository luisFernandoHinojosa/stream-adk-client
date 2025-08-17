<script lang="ts">
	import { botPersonalityStore } from '$lib/stores';
	import { fly } from 'svelte/transition';
	import { Button, Heading, Text } from '../ui';
	import { quintOut } from 'svelte/easing';
	import { XIcon } from '$lib/icons/outline';

	interface Props {
		showPreview: boolean;
		isPreviewCollapsed: boolean;
		class: string;
		closePreview: () => void;
	}

	let { showPreview, isPreviewCollapsed, class: className, closePreview }: Props = $props();

	let currentPrompt: string = $state('');
	$effect(() => {
		currentPrompt = botPersonalityStore.generatePrompt($botPersonalityStore);
	});
</script>

<div class={className} transition:fly={{ y: 100, x: 50, duration: 300, easing: quintOut }}>
	<div class="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-2">
				<div class="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
				<Heading level="h6">{$botPersonalityStore.nameBot || 'Mi Bot'}</Heading>
			</div>
			<Button variant="ghost" onclick={closePreview}>
				<XIcon class="h-4 w-4" />
			</Button>
		</div>
	</div>

	<div class="max-h-80 space-y-3 overflow-y-auto p-4">
		<input
			type="text"
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
			placeholder="Nombre del bot"
			bind:value={$botPersonalityStore.nameBot}
		/>

		<div class="rounded-lg bg-blue-50 p-3">
			<Text variant="body-xs" class="text-blue-700">
				"¡Hola! Soy {$botPersonalityStore.nameBot || 'tu asistente'}.
				{$botPersonalityStore.archetype
					? `Como ${$botPersonalityStore.archetype.toLowerCase()}, `
					: ''}
				estoy aquí para ayudarte."
			</Text>
		</div>

		<button
			class="w-full rounded-lg bg-gray-50 p-2 text-left transition-colors hover:bg-gray-100"
			onclick={() => (isPreviewCollapsed = !isPreviewCollapsed)}
		>
			<Text variant="body-xs" class="text-gray-600">
				{isPreviewCollapsed ? '👁️ Mostrar' : '👁️‍🗨️ Ocultar'} prompt ({currentPrompt.length} chars)
			</Text>
		</button>

		{#if !isPreviewCollapsed}
			<div class="max-h-24 overflow-y-auto rounded-lg bg-gray-50 p-2">
				<pre class="font-mono text-xs whitespace-pre-wrap text-gray-700">{currentPrompt}</pre>
			</div>
		{/if}
	</div>
</div>

<!-- <div class="mb-8 rounded-lg p-6 shadow-xl">
	<Heading level="h5" class="mb-4">Tu System Prompt Generado</Heading>
	<div class="mb-4">
		<Text variant="label" weight="medium">Nombre del Bot:</Text>
		<input
			type="text"
			id="nombreBot"
			class="focus:shadow-outline text-light-two w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none"
			placeholder="Ej: TrendBot"
			bind:value={$botPersonalityStore.nameBot}
		/>
	</div>
	<div class="text-light-two overflow-x-auto rounded-md p-4 font-mono text-sm">
		<pre class="whitespace-pre-wrap"><code>{currentPrompt}</code></pre>
	</div>
</div> -->
