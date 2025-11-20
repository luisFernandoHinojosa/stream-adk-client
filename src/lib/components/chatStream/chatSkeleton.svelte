<script lang="ts">
	// Props opcionales para personalizar el skeleton
	interface Props {
		messagesCount?: number;
		showAccordion?: boolean;
		animated?: boolean;
	}

	let { messagesCount = 4, showAccordion = true, animated = true }: Props = $props();

	// Generar patrones variados de mensajes
	const messagePatterns = [
		{ isUser: false, lines: 3, hasAccordion: false },
		{ isUser: true, lines: 1, hasAccordion: false },
		{ isUser: false, lines: 2, hasAccordion: false },
		{ isUser: false, lines: 4, hasAccordion: showAccordion },
		{ isUser: true, lines: 2, hasAccordion: false },
		{ isUser: false, lines: 3, hasAccordion: false }
	];

	const selectedPatterns = $derived(messagePatterns.slice(0, messagesCount));
</script>

<div class="flex flex-col gap-6 text-light-two">
	{#each selectedPatterns as pattern, index}
		<!-- Mensaje normal -->
		<div
			class="flex w-full items-start gap-1 sm:gap-3 {pattern.isUser
				? 'justify-end'
				: 'justify-start'}"
		>
			{#if !pattern.isUser}
				<div class="hidden flex-shrink-0 items-center justify-center sm:flex">
					<div
						class="h-8 w-8 rounded-full bg-slate-200 dark:bg-dark-one_d {animated
							? 'animate-pulse'
							: ''}"
					></div>
				</div>
			{/if}

			<div class="relative w-full">
				<div
					class="relative w-full rounded-xl p-3 md:p-4 {pattern.isUser
						? 'w-fit rounded-tr-none bg-slate-200 dark:bg-dark-one_d'
						: 'rounded-tl-none bg-slate-200 dark:bg-dark-one_d'}"
				>
					<!-- Cola del mensaje del usuario (derecha) -->
					{#if pattern.isUser}
						<div
							class="absolute top-0 -right-3 h-0 w-0 rounded-tr-md border-b-[15px] border-l-[0px] border-t-transparent border-b-transparent border-l-slate-200 sm:border-l-[15px] dark:border-l-dark-one_d"
						></div>
					{:else}
						<!-- Cola del mensaje del bot (izquierda) -->
						<div
							class="absolute top-0 -left-3 h-0 w-0 rounded-tl-md border-r-[0px] border-b-[15px] border-t-transparent border-r-slate-200 border-b-transparent sm:border-r-[15px] dark:border-r-dark-one_d"
						></div>
					{/if}

					<!-- Contenido skeleton -->
					<div class="space-y-2">
						{#each Array(pattern.lines) as _, lineIndex}
							{@const widths = ['w-full', 'w-3/4', 'w-1/2', 'w-5/6', 'w-2/3']}
							{@const randomWidth = widths[Math.floor(Math.random() * widths.length)]}

							<div
								class="h-4 rounded bg-slate-200 dark:bg-dark-one_d {randomWidth} {animated
									? 'animate-pulse'
									: ''}"
								style="animation-delay: {index * 0.1 + lineIndex * 0.05}s"
							></div>
						{/each}
					</div>
				</div>
			</div>

			{#if pattern.isUser}
				<div class="hidden flex-shrink-0 items-center justify-center sm:flex">
					<div
						class="h-8 w-8 rounded-full bg-slate-200 dark:bg-dark-one_d {animated
							? 'animate-pulse'
							: ''}"
					></div>
				</div>
			{/if}
		</div>

		<!-- Skeleton del accordion si corresponde -->
		{#if pattern.hasAccordion}
			<div class="flex items-start justify-start gap-1 sm:gap-3">
				<div class="hidden flex-shrink-0 items-center justify-center sm:flex">
					<div
						class="h-8 w-8 rounded-full bg-slate-200 dark:bg-dark-one_d {animated
							? 'animate-pulse'
							: ''}"
					></div>
				</div>
				<div class="relative min-w-0 flex-grow">
					<!-- Skeleton del accordion -->
					<div class="rounded-xl bg-slate-200 dark:bg-dark-one_d">
						<!-- Header del accordion -->
						<div class="mb-4 flex items-center justify-between">
							<div
								class="h-5 w-24 rounded bg-slate-200 dark:bg-dark-one_d {animated
									? 'animate-pulse'
									: ''}"
							></div>
							<div
								class="h-4 w-4 rounded bg-slate-200 dark:bg-dark-one_d {animated
									? 'animate-pulse'
									: ''}"
							></div>
						</div>

						<!-- Contenido del accordion colapsado (opcional) -->
						<div class="space-y-4">
							<!-- Función skeleton -->
							<div
								class="overflow-hidden rounded-lg border border-slate-200 dark:border-dark-one dark:bg-dark-one_d"
							>
								<!-- Título de la función -->
								<div class="border-b border-slate-200 px-4 py-2 dark:border-dark-one">
									<div
										class="h-4 w-32 rounded bg-slate-200 dark:bg-dark-one_d {animated
											? 'animate-pulse'
											: ''}"
									></div>
								</div>

								<!-- Contenido de la función -->
								<div class="space-y-4 p-4">
									<!-- Function Call skeleton -->
									<div>
										<div
											class="mb-2 h-3 w-16 rounded bg-slate-200 dark:bg-dark-one_d {animated
												? 'animate-pulse'
												: ''}"
										></div>
										<div class="space-y-2 rounded bg-slate-200 p-3 dark:bg-dark-one_d">
											<div
												class="h-3 w-full rounded bg-slate-200 dark:bg-dark-one_d {animated
													? 'animate-pulse'
													: ''}"
											></div>
											<div
												class="h-3 w-3/4 rounded bg-slate-200 dark:bg-dark-one_d {animated
													? 'animate-pulse'
													: ''}"
											></div>
											<div
												class="h-3 w-1/2 rounded bg-slate-200 dark:bg-dark-one_d {animated
													? 'animate-pulse'
													: ''}"
											></div>
										</div>
									</div>

									<!-- Function Response skeleton -->
									<div>
										<div
											class="mb-2 h-3 w-20 rounded bg-slate-200 dark:bg-dark-one_d {animated
												? 'animate-pulse'
												: ''}"
										></div>
										<div class="space-y-2 rounded bg-slate-200 p-3 dark:bg-dark-one_d">
											<div
												class="h-3 w-full rounded bg-slate-200 dark:bg-dark-one_d {animated
													? 'animate-pulse'
													: ''}"
											></div>
											<div
												class="h-3 w-5/6 rounded bg-slate-200 dark:bg-dark-one_d {animated
													? 'animate-pulse'
													: ''}"
											></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	{/each}
</div>
