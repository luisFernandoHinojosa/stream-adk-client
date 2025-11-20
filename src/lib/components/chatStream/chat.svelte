<script lang="ts">
	//chat.svelte
	import Accordion from './accordion.svelte';
	import MarkdownRenderer from './MarkdownRenderer.svelte';
	import type { SessionData } from '$lib/interface';
	import { BotsiIcon } from '$lib/icons/solid';
	import ArrowNarrowRightIcon from '$lib/icons/outline/arrowNarrowRightIcon.svelte';
	import { ArrowLeftIcon } from '$lib/icons/outline';

	interface Props {
		sessionsData: SessionData;
	}

	let { sessionsData }: Props = $props();
	let isLoading: boolean = true;

	function formatCodeContent(content: any): string {
		if (typeof content === 'string') return content;
		return JSON.stringify(content, null, 2);
	}

	function processEventParts(parts: any[]) {
		const textParts = [];
		const functionParts = [];

		for (const part of parts) {
			if ('functionCall' in part || 'functionResponse' in part) {
				functionParts.push(part);
			} else {
				textParts.push(part);
			}
		}

		return { textParts, functionParts };
	}

	function findFunctionCall(events: any[], functionResponseId: string) {
		for (const event of events) {
			const { functionParts } = processEventParts(event?.content?.parts || []);
			for (const part of functionParts) {
				if ('functionCall' in part && part.functionCall.id === functionResponseId) {
					return part;
				}
			}
		}
		return null;
	}

	// Función para determinar si un evento debe mostrar accordion
	function shouldShowAccordion(event: any, events: any[]) {
		const { functionParts } = processEventParts(event?.content?.parts || []);

		// Solo mostrar accordion si tiene functionResponse
		for (const part of functionParts) {
			if ('functionResponse' in part) {
				return true;
			}
		}
		return false;
	}

	// Función para obtener el par functionCall + functionResponse
	function getFunctionPair(event: any, events: any[]) {
		const { functionParts } = processEventParts(event?.content?.parts || []);
		const pair = [];

		for (const part of functionParts) {
			if ('functionResponse' in part) {
				// Buscar el functionCall correspondiente
				const functionCall = findFunctionCall(events, part.functionResponse.id);
				if (functionCall) {
					pair.push(functionCall);
				}
				pair.push(part);
			}
		}

		return pair;
	}
	console.log('sessionsData', sessionsData);
</script>

<div class="flex flex-col gap-6 pt-4 text-light-two">
	{#each sessionsData?.events as event (event.id)}
		{@const { textParts, functionParts } = processEventParts(event?.content?.parts || [])}
		{#each textParts as part}
			{@const isUserPart = event?.content?.role === 'user'}

			<div class="flex items-start gap-1 sm:gap-3 {isUserPart ? 'justify-end' : 'justify-start'}">
				{#if !isUserPart && part.text.trim() !== ''}
					<div class="hidden flex-shrink-0 items-center justify-center sm:flex">
						<BotsiIcon class="h-8 w-8" />
					</div>
				{/if}

				<div class="relative min-w-0">
					<div
						class="relative rounded-xl p-3 md:p-4 {isUserPart
							? 'w-fit rounded-tr-none bg-light-two dark:bg-dark-two'
							: 'rounded-tl-none bg-light-one_d dark:bg-dark-one_d'}"
					>
						<!-- Cola del mensaje del usuario (derecha) -->
						{#if isUserPart}
							<div
								class="absolute top-0 -right-3 h-0 w-0 rounded-tr-md border-b-[15px] border-l-[0px] border-t-transparent border-b-transparent border-l-light-two sm:border-l-[15px] dark:border-l-dark-two"
							></div>
						{:else}
							<!-- Cola del mensaje del bot (izquierda) -->
							<div
								class="absolute top-0 -left-3 h-0 w-0 rounded-tl-md border-r-[0px] border-b-[15px] border-t-transparent border-r-light-one_d border-b-transparent sm:border-r-[15px] dark:border-r-dark-one_d"
							></div>
						{/if}

						<div
							class="leading-relaxed {isUserPart
								? 'text-light-one dark:text-dark-one'
								: 'text-light-two dark:text-dark-two'}"
						>
							{#if isUserPart}
								<div class="text-base md:text-lg">
									{part.text}
								</div>
							{:else if part.text && part.text.trim() !== ''}
								<div>
									<MarkdownRenderer markdownText={part.text} />
								</div>
							{/if}
						</div>
					</div>
				</div>
				{#if isUserPart}
					<div class="hidden flex-shrink-0 items-center justify-center sm:flex">
						<div class="h-8 w-8 overflow-hidden rounded-full">
							<img src="/images/panda.webp" alt="User Avatar" class="h-full w-full object-cover" />
						</div>
					</div>
				{/if}
			</div>
		{/each}
		<!-- {#if shouldShowAccordion(event, sessionsData?.events || [])}
			{@const functionPair = getFunctionPair(event, sessionsData?.events || [])}
			<div class="flex items-start justify-start gap-1 sm:gap-3">
				<div class="hidden flex-shrink-0 items-center justify-center sm:flex">
					<BotsiIcon class="h-8 w-8" />
				</div>
				<div class="relative min-w-0 flex-grow">
					<Accordion title="Procesos" type="function">
						<div class="space-y-4">
							{#each functionPair as part, index}
								{#if 'functionCall' in part}
									{@const nextPart = functionPair[index + 1]}
									{@const isResponseNext = nextPart && 'functionResponse' in nextPart}
									<div
										class="overflow-hidden rounded-lg border border-light-one bg-light-one dark:border-dark-one dark:bg-light-one"
									>
										<div class="border-b border-light-one px-4 py-2 dark:border-dark-one">
											<h4
												class="flex items-center text-lg font-bold text-light-two dark:text-dark-two"
											>
												{part.functionCall.name}
											</h4>
										</div>
										<div class="space-y-4 px-4">
											<div>
												<span
													class="text-xs font-medium tracking-wide text-light-two uppercase dark:text-dark-two"
												>
													<ArrowNarrowRightIcon />
												</span>
												
												<pre
													class="overflow-x-auto rounded bg-light-two p-3 text-xs text-light-one dark:bg-dark-two dark:text-dark-one"><code
														>{formatCodeContent(part)}</code
													></pre>
											</div>
											{#if isResponseNext}
												<div>
													<div class="flex items-center gap-2">
														<span
															class="text-xs font-medium tracking-wide text-light-two uppercase dark:text-dark-two"
														>
															<ArrowLeftIcon />
														</span>
													</div>
													<pre
														class="overflow-x-auto rounded bg-light-two p-3 text-xs text-light-one dark:bg-dark-two dark:text-dark-one"><code
															>{formatCodeContent(nextPart)}</code
														></pre>
												</div>
											{/if}
										</div>
									</div>
								{/if}
							{/each}
						</div>
					</Accordion>
				</div>
			</div>
		{/if} -->
	{/each}
</div>
