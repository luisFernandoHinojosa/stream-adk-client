<script lang="ts">
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
</form>
