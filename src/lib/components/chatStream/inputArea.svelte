<script lang="ts">
	//inputArea.svelte
	import { LoaderIcon } from '$lib/icons/outline';
	import type { Aplication } from '$lib/interface';
	import { aplicationStore } from '$lib/stores/aplicationStore';
	import AppSelector2 from './appSelector2.svelte';

	interface Props {
		handleSendMessage: (userMessage: string, streamingEnabled: boolean) => void;
		isLoading: boolean;
		autoResizeTextarea: (e: Event) => void;
		class: string;
		isInitialState?: boolean;
		onStreamingToggle: (enabled: boolean) => void;
		streamingEnabled?: boolean;
	}

	let {
		handleSendMessage,
		isLoading,
		autoResizeTextarea,
		class: className,
		isInitialState = false,
		onStreamingToggle,
		streamingEnabled = false
	}: Props = $props();

	let userInput: string = $state('');
	let textareaRef: HTMLTextAreaElement;

	const onSubmit = (e?: Event) => {
		if (e) e.preventDefault();
		if (!userInput.trim()) return;

		handleSendMessage(userInput, streamingEnabled);
		userInput = '';

		// Reset textarea height
		if (textareaRef) {
			textareaRef.style.height = 'auto';
		}
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			onSubmit();
		}
	};

	function handleAppChange(aplication: Aplication) {
		aplicationStore.set(aplication);
	}
	const handleStreamingToggle = () => {
		onStreamingToggle(!streamingEnabled);
	};
</script>

<form
	onsubmit={onSubmit}
	class="rounded-2xl border border-light-two/40 shadow-lg dark:border-dark-two/40 {className}"
>
	<div
		class="flex items-end gap-3 rounded-t-2xl border-0 bg-light-one_d py-3 pl-1 transition-all duration-200 md:pl-3 dark:bg-dark-one_d {isInitialState
			? 'border border-light-two/80 shadow-xl dark:border-dark-two/80'
			: ''}"
	>
		<div class="min-w-0 flex-1">
			<textarea
				bind:this={textareaRef}
				bind:value={userInput}
				placeholder={isInitialState ? '¿En qué puedo ayudarte hoy?' : 'Escribe tu mensaje aquí...'}
				class="block max-h-32 min-h-[2.5rem] w-full resize-none overflow-y-auto border-0 bg-transparent p-2 text-base text-light-two placeholder:text-light-two_d/50 focus:ring-0 focus:outline-none md:text-lg dark:text-dark-two dark:placeholder:text-dark-two_d/50 {isInitialState
					? 'text-center md:text-left'
					: ''}"
				rows="1"
				oninput={autoResizeTextarea}
				onkeydown={handleKeydown}
				disabled={isLoading}
			/>
		</div>
	</div>
	<div
		class="flex justify-between border-t border-light-two/50 bg-light-one_d px-1.5 py-1 md:rounded-b-2xl dark:border-dark-two/50 dark:bg-dark-one_d"
	>
		<div class="relative flex flex-1 items-center gap-3 pl-3">
			<AppSelector2 value={$aplicationStore.aplication_id} onAppChange={handleAppChange} />
			<div class="flex items-center">
				<div class="gap-2">
					<span class="text-base font-medium text-light-two_d dark:text-dark-two_d">
						Streaming
					</span>
					<button
						type="button"
						onclick={handleStreamingToggle}
						class="relative inline-flex h-3 w-6 items-center rounded-full transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-light-two/50 focus:ring-offset-2 focus:ring-offset-light-one focus:outline-none dark:focus:ring-dark-two/50 dark:focus:ring-offset-dark-one {streamingEnabled
							? 'bg-light-three dark:bg-dark-three'
							: 'bg-light-two_d dark:bg-dark-two_d'}"
						role="switch"
						aria-checked={streamingEnabled}
						aria-label="Toggle streaming"
					>
						<span
							class="inline-block h-2.5 w-2.5 transform rounded-full bg-light-one shadow-lg transition-transform duration-200 ease-in-out {streamingEnabled
								? 'translate-x-3'
								: 'translate-x-1'}"
						></span>
					</button>
				</div>
			</div>
		</div>
		<button
			type="submit"
			disabled={isLoading || !userInput.trim()}
			class="flex h-10 w-10 transform items-center justify-center rounded-xl bg-light-two text-light-one shadow-md transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 dark:bg-dark-two dark:text-dark-one dark:disabled:opacity-30 {isInitialState
				? 'shadow-lg'
				: ''}"
			aria-label="Enviar mensaje"
		>
			{#if isLoading}
				<LoaderIcon className="w-5 h-5 animate-spin" />
			{:else}
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
					/>
				</svg>
			{/if}
		</button>
	</div>
</form>

<!-- <script lang="ts">
	//inputArea.svelte
	import { LoaderIcon } from '$lib/icons/outline';

	interface Props {
		handleSendMessage: (userMessage: string) => void;
		isLoading: boolean;
		autoResizeTextarea: (e: Event) => void;
		class: string;
	}

	let { handleSendMessage, isLoading, autoResizeTextarea, class: className }: Props = $props();

	let userInput: string = $state('');
	const onSubmit = () => {
		//e.preventDefault();
		handleSendMessage(userInput);
		userInput = '';
		//console.log(userInput);
	};
</script>

<form onsubmit={onSubmit} class={className}>
	<div
		class="flex items-end gap-3 rounded-2xl border-0 bg-light-one_d p-3 shadow-lg transition-all duration-200 dark:bg-dark-one_d"
	>
		<div class="min-w-0 flex-1">
			<textarea
				bind:value={userInput}
				placeholder="Escribe tu mensaje aquí..."
				class="block max-h-32 min-h-[2.5rem] w-full resize-none overflow-y-auto border-0 bg-transparent p-2 text-base text-light-two placeholder:text-light-two_d/20 focus:ring-0 focus:outline-none dark:text-dark-two dark:placeholder:text-dark-two_d/20"
				rows="1"
				oninput={autoResizeTextarea}
				onkeydown={(e) => {
					if (e.key === 'Enter' && !e.shiftKey) {
						e.preventDefault();
						handleSendMessage(userInput);
						userInput = '';
					}
				}}
				disabled={isLoading}
			/>
		</div>
		<button
			type="submit"
			disabled={isLoading || !userInput.trim()}
			class="flex h-10 w-10 transform items-center justify-center rounded-xl bg-light-two text-light-one shadow-md transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 dark:bg-dark-two dark:text-dark-one dark:disabled:opacity-30"
			aria-label="Enviar mensaje"
		>
			{#if isLoading}
				<LoaderIcon className="w-5 h-5 animate-spin" />
			{:else}
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
					/>
				</svg>
			{/if}
		</button>
	</div>
</form> -->

<style>
	/* Evitar zoom en iOS cuando se enfoca el textarea */
	@media screen and (max-width: 768px) {
		textarea {
			font-size: 16px;
			transform-origin: top left;
		}
	}

	/* Asegurar que el placeholder sea visible en el estado inicial */
	textarea::placeholder {
		transition: color 0.2s ease;
	}

	textarea:focus::placeholder {
		color: transparent;
	}
</style>
