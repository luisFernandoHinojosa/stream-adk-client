<script lang="ts">
	import { BrainIcon } from '$lib/icons/outline';
	import XmarkIcon from '$lib/icons/outline/xmarkIcon.svelte';
	import { fade } from 'svelte/transition';
	import JsonViewer from './jsonViewer.svelte';

	interface Props {
		sessionsData: any;
		toggleStateSession: () => void;
	}

	let { sessionsData, toggleStateSession }: Props = $props();
</script>

<div
	class="fixed inset-0 z-50 flex flex-col bg-light-one dark:bg-dark-one"
	transition:fade={{ duration: 200 }}
>
	<div
		class="flex flex-shrink-0 items-center justify-between bg-light-one_d px-4 py-3 dark:bg-dark-one_d"
	>
		<div class="flex items-center space-x-3">
			<div class="rounded-lg bg-light-two p-2 dark:bg-dark-two">
				<BrainIcon class="size-5 text-light-one dark:text-dark-one" />
			</div>

			<div>
				<h2 class="text-lg font-semibold text-light-two dark:text-dark-two">Session State</h2>
			</div>
		</div>

		<button
			class="group rounded-lg bg-light-two p-2 transition-colors duration-200 hover:bg-light-two_d dark:bg-dark-two dark:hover:bg-dark-two_d"
			onclick={toggleStateSession}
			aria-label="Cerrar modal"
		>
			<XmarkIcon
				className="text-light-one dark:text-dark-one size-5 group-hover:rotate-90 transition-transform duration-200"
			/>
		</button>
	</div>

	<!-- Contenido del Modal -->
	<div class="min-h-0 flex-1 bg-light-one dark:bg-dark-one">
		{#if sessionsData?.state !== undefined && sessionsData?.state !== null}
			<div class="h-full">
				<JsonViewer data={sessionsData.state} />
			</div>
		{:else}
			<!-- Estado vacío -->
			<div class="flex h-full flex-col items-center justify-center p-6">
				<BrainIcon class="size-10 text-light-three dark:text-dark-three" />
				<h3 class="mb-2 text-xl font-semibold text-light-two dark:text-dark-two">State vacío</h3>
			</div>
		{/if}
	</div>
</div>
