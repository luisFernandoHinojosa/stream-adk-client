<script lang="ts">
	import Artefact from '$lib/components/chatStream/artefact.svelte';
	import ArtefactDropdown from '$lib/components/chatStream/artefactDropdown.svelte';
	import Chat from '$lib/components/chatStream/chat.svelte';
	import ChatSkeleton from '$lib/components/chatStream/chatSkeleton.svelte';
	import InputArea from '$lib/components/chatStream/inputArea.svelte';
	import ModalChatState from '$lib/components/chatStream/modalChatState.svelte';
	import SidebarHistory from '$lib/components/chatStream/sidebarHistory.svelte';
	import Loader from '$lib/components/ui/loader.svelte';
	import { BrainIcon, LoaderIcon, PencilIcon } from '$lib/icons/outline';
	import Menu2Icon from '$lib/icons/outline/menu2Icon.svelte';
	import PhotoIcon from '$lib/icons/outline/photoIcon.svelte';
	import { BotsiIcon } from '$lib/icons/solid';
	import FilePencilIcon from '$lib/icons/solid/filePencilIcon.svelte';
	import type { ChatStreamSend, SessionsHistory } from '$lib/interface';
	import { smartTrackerService } from '$lib/services/smartTracker.service';
	import { smartTrackerStore } from '$lib/stores/smartTrackerStore';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	//VARIABLES STATES
	let isLoading: boolean = $state(false);
	let chatEndRef: HTMLDivElement;
	let historyCollapsed: boolean = $state(true);
	let artifactOpen: boolean = $state(false);
	let sessionsHistories: SessionsHistory[] = $state([]);
	let stateSessionMinimized: boolean = $state(false);
	let isLoadingGetSession: boolean = $state(false);
	let sendMessageData: ChatStreamSend;

	let isLoadingSessionChat: boolean = $state(false);
	let typeArtefact: number = $state(2);
	let dropdownOpen: boolean = $state(false);

	//FUNCTIONS

	const handleSendMessage = async (userMessage: string): Promise<void> => {
		try {
			smartTrackerStore.addUserEvent(userMessage);
			isLoading = true;
			setTimeout(() => scrollToBottom(true), 100);
			//solo si el id es 0 creamos una sesion
			if ($smartTrackerStore.id === '0') {
				console.log('creando sesion');
				await createNewSession();
			}

			sendMessageData = {
				session_id: $smartTrackerStore.id,
				message: userMessage
				//timezone: 'America/La_Paz'
			};

			const sendMessageResponse = await smartTrackerService.chatStreamSend(sendMessageData);

			//agregamos los functionCalls
			smartTrackerStore.addFunctionCallEvent(sendMessageResponse.functionCalls);
			//agregamos los functionResponses
			smartTrackerStore.addFunctionResponseEvent(sendMessageResponse.functionResponses);

			//agregamos los mensajes del modelo que devuelve el enpoint
			sendMessageResponse.textMessages.forEach((message) => {
				smartTrackerStore.addModelEvent(message);
			});
			setTimeout(() => scrollToBottom(true), 100);
		} catch (error) {
			isLoading = false;
			smartTrackerStore.removeLastEvent();
			console.log(error);
		}
		isLoading = false;
		setTimeout(() => scrollToBottom(true), 100);
	};

	const toggleHistorySidebar = () => {
		historyCollapsed = !historyCollapsed;
	};

	//Listar historial de sesiones
	const getSessionsHistories = async () => {
		try {
			const sessionsHistoriesResponse = await smartTrackerService.getSessionsHistory();
			sessionsHistories = sessionsHistoriesResponse;
		} catch (error) {
			console.log(error);
		}
	};

	//Obtener datos de la sesion
	const getSessionHistory = async (sessionId: string): Promise<void> => {
		try {
			isLoadingSessionChat = true;
			//console.log('sessionId', sessionId);
			const sessionResponse = await smartTrackerService.getSession(sessionId);
			smartTrackerStore.set(sessionResponse);
			//console.log('sessionResponse', sessionResponse);
		} catch (error) {
			isLoadingSessionChat = false;
			console.log(error);
		}
		isLoadingSessionChat = false;
	};

	const createNewSession = async (): Promise<void> => {
		try {
			const sessionResponse = await smartTrackerService.createSession();
			//console.log('sessionResponse', sessionResponse);
			$smartTrackerStore.id = sessionResponse.session_id;
			await getSessionsHistories();
		} catch (error) {
			console.log(error);
		}
	};

	function autoResizeTextarea(event: Event): void {
		const textarea = event.target as HTMLTextAreaElement;
		textarea.style.height = 'auto';
		textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
	}

	async function toggleStateSession() {
		if ($smartTrackerStore.id !== '0') {
			isLoadingGetSession = true;
			await getSessionHistory($smartTrackerStore.id);
			isLoadingGetSession = false;
		}
		stateSessionMinimized = !stateSessionMinimized;
	}
	function toggleArtifact() {
		artifactOpen = !artifactOpen;
	}

	const startNewChat = () => {
		smartTrackerStore.reset();
		shouldAutoScroll = true;
	};

	let shouldAutoScroll: boolean = $state(true);
	const scrollToBottom = (smooth: boolean = true) => {
		if (chatEndRef && shouldAutoScroll) {
			chatEndRef.scrollIntoView({
				behavior: smooth ? 'smooth' : 'instant',
				block: 'end'
			});
		}
	};

	const handleScroll = (event: Event) => {
		const container = event.target as HTMLElement;
		const { scrollTop, scrollHeight, clientHeight } = container;
		const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

		// Si está a menos de 100px del final, activar auto-scroll
		shouldAutoScroll = distanceFromBottom < 100;
	};

	function handleArtifactSelect(selectedType: any) {
		typeArtefact = selectedType.id;
		console.log('Tipo seleccionado:', selectedType.name);

		// Abrir automáticamente el artefacto
		artifactOpen = true;
		dropdownOpen = false;
	}

	function handleDropdownToggle(isOpen: boolean) {
		dropdownOpen = isOpen;
	}
	//HOOKS

	onMount(async () => {
		await getSessionsHistories();
	});

	$effect(() => {
		if ($smartTrackerStore.events.length > 0) {
			setTimeout(() => scrollToBottom(true), 100);
		}
	});

	// Efecto reactivo para hacer scroll cuando cambia el estado de carga
	$effect(() => {
		if (isLoading) {
			setTimeout(() => scrollToBottom(true), 100);
		}
	});
</script>

<div class="font-claude-message h-screen w-full overflow-hidden bg-light-one dark:bg-dark-one">
	<div class="relative flex h-full w-full">
		<!-- Overlay sidebar -->
		{#if !historyCollapsed}
			<div
				class="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm lg:hidden"
				onclick={toggleHistorySidebar}
				transition:fade={{ duration: 200 }}
			></div>
		{/if}

		<!-- History Sidebar -->
		<SidebarHistory
			{historyCollapsed}
			{startNewChat}
			{sessionsHistories}
			{toggleHistorySidebar}
			currentChatId={$smartTrackerStore.id}
			{getSessionHistory}
		/>

		<div class="relative flex h-full flex-1 overflow-hidden">
			<!-- Chat Section -->
			<div class="relative h-full flex-1 overflow-hidden">
				<div class="flex h-full w-full flex-col">
					<!-- Header chat mobile -->
					<div
						class="flex w-full items-center justify-between bg-light-one_d px-4 py-3 lg:hidden dark:bg-dark-one_d"
					>
						<button
							onclick={startNewChat}
							class="flex items-center justify-center rounded-lg bg-light-two p-1 text-light-one transition-all duration-200 hover:bg-light-two_d dark:bg-dark-two dark:text-dark-one dark:hover:bg-dark-two_d"
							aria-label="Nuevo chat"
						>
							<PencilIcon class="h-6 w-6" />
						</button>
						<div class="flex gap-3">
							<!-- Artifact Button Mobile -->
							<!-- <button
								class="group flex items-center justify-center rounded-full p-1 text-light-two transition-colors duration-300 hover:bg-light-two_d dark:bg-dark-two dark:text-dark-one dark:hover:bg-dark-two_d"
								onclick={toggleArtifact}
								aria-label="Abrir artefacto"
							>
								<FilePencilIcon className="w-6 h-6" />
							</button> -->
							<ArtefactDropdown
								bind:isOpen={dropdownOpen}
								bind:currentArtifactType={typeArtefact}
								onSelect={handleArtifactSelect}
								onToggle={handleDropdownToggle}
								id="mbl-artefact"
							/>
							<button
								class="group flex items-center justify-center rounded-full p-1 text-light-two transition-colors duration-300 hover:bg-light-two_d dark:bg-dark-two dark:text-dark-one dark:hover:bg-dark-two_d"
								onclick={toggleStateSession}
								aria-label="Opciones adicionales"
							>
								<BrainIcon
									class="h-6 w-6 group-hover:text-light-one dark:group-hover:text-dark-one"
								/>
							</button>
							<button
								onclick={toggleHistorySidebar}
								class="group rounded-lg p-1 transition-colors hover:bg-light-two_d dark:bg-dark-two dark:hover:bg-dark-two_d"
							>
								<Menu2Icon
									class="h-6 w-6 text-light-two group-hover:text-light-one dark:text-dark-one dark:group-hover:text-dark-one"
								/>
							</button>
						</div>
					</div>

					<div class="flex-1 overflow-y-auto p-2 sm:p-3 md:p-6" onscroll={handleScroll}>
						<div class="mx-auto max-w-4xl space-y-6">
							{#if $smartTrackerStore.events.length === 0}
								<div class="flex flex-col items-center py-12 text-center md:py-20">
									<h3 class="mb-3 text-xl font-bold text-light-two md:text-2xl dark:text-dark-two">
										¡Hola! ¿En qué puedo ayudarte?
									</h3>
									<p class="max-w-md text-base text-light-two md:text-lg dark:text-dark-two">
										Escribe tu mensaje para comenzar una conversación
									</p>
								</div>
							{/if}

							{#if $smartTrackerStore.events.length > 0}
								{#if isLoadingSessionChat}
									<ChatSkeleton messagesCount={4} showAccordion={true} animated={true} />
								{:else}
									<Chat sessionsData={$smartTrackerStore} />
								{/if}
							{/if}

							{#if isLoading}
								<div class="flex items-start justify-start gap-1 sm:gap-3">
									<div class="flex flex-shrink-0 items-center justify-center">
										<BotsiIcon className="w-8 h-8" />
									</div>

									<div class="relative min-w-0">
										<div
											class="relative rounded-xl rounded-tl-none bg-light-one_d p-3 md:p-4 dark:bg-dark-one_d"
										>
											<div
												class="absolute top-0 -left-3 h-0 w-0 rounded-tl-md border-r-[15px] border-b-[15px] border-t-transparent border-r-light-one_d border-b-transparent dark:border-r-dark-one_d"
											></div>
											<Loader />
										</div>
									</div>
								</div>
							{/if}

							<div bind:this={chatEndRef}></div>
						</div>
					</div>

					<!-- Input Area -->
					<div class="mb-12 w-full px-1 pb-2 md:px-6 lg:mb-0">
						<InputArea
							{handleSendMessage}
							{isLoading}
							{autoResizeTextarea}
							class="mx-auto max-w-4xl"
						/>
					</div>
				</div>
			</div>

			<!-- Artifact Section -->
			{#if artifactOpen}
				{#if typeArtefact === 1}
					<!-- Artefacto tipo DOCUMENTO/TEXTO -->
					<Artefact
						{toggleArtifact}
						fileType="txt"
						fileName="documento.txt"
						fileContent="Este es un archivo de texto plano.
Línea 1: Contenido principal
Línea 2: Información adicional  
Línea 3: Más detalles
Línea 4: Notas importantes
Línea 5: Conclusión"
					/>
				{:else if typeArtefact === 2}
					<!-- Artefacto tipo IMAGEN -->
					<Artefact
						{toggleArtifact}
						fileType="png"
						fileName="imagen.png"
						fileUrl="/images/logo.png"
					/>
				{:else if typeArtefact === 3}
					<!-- Artefacto tipo MARKDOWN -->
					<Artefact {toggleArtifact} />
				{:else if typeArtefact === 4}
					<!-- Artefacto tipo PDF/DIAGRAMA -->
					<Artefact
						{toggleArtifact}
						fileType="pdf"
						fileName="diagrama.pdf"
						fileUrl="https://educatic.unam.mx/eventos/seminnova/2024/s3-ponente-ux-design.pdf"
					/>
				{:else}
					<!-- Fallback - tipo por defecto -->
					<Artefact {toggleArtifact} fileType="csv" fileName="archivo.csv" />
				{/if}
			{/if}
		</div>

		<div class="fixed top-6 right-8 z-40 hidden lg:block">
			<div class="flex flex-col gap-3">
				{#if !artifactOpen}
					<ArtefactDropdown
						bind:isOpen={dropdownOpen}
						bind:currentArtifactType={typeArtefact}
						onSelect={handleArtifactSelect}
						onToggle={handleDropdownToggle}
						id="dtp-artefact"
					/>
					<!-- <button
						class="flex h-10 w-10 transform items-center justify-center rounded-full bg-light-two text-light-one shadow-xl transition-all duration-300 hover:scale-110 hover:bg-light-two_d hover:shadow-2xl dark:bg-dark-two dark:text-dark-one dark:hover:bg-dark-two_d"
						onclick={toggleArtifact}
						aria-label="Abrir artefacto"
					>
						{#if typeArtefact === 1}
							<FilePencilIcon />
						{:else if typeArtefact === 2}
							<PhotoIcon />
						{:else}
							<span class="text-light-one dark:text-dark-one">MD</span>
						{/if}
					</button> -->
				{/if}
				<button
					class="flex h-14 w-14 transform items-center justify-center rounded-full bg-light-two text-light-one shadow-xl transition-all duration-300 hover:scale-110 hover:bg-light-two_d hover:shadow-2xl dark:bg-dark-two dark:text-dark-one dark:hover:bg-dark-two_d"
					onclick={toggleStateSession}
					aria-label="Opciones adicionales"
				>
					{#if isLoadingGetSession}
						<LoaderIcon />
					{:else}
						<BrainIcon class="h-10 w-10" />
					{/if}
				</button>
			</div>
		</div>

		<!-- Modal Fullscreen -->
		{#if stateSessionMinimized}
			<ModalChatState sessionsData={$smartTrackerStore} {toggleStateSession} />
		{/if}
	</div>
</div>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.3s ease-out;
	}

	/* Smooth scrollbar */
	::-webkit-scrollbar {
		width: 6px;
	}

	::-webkit-scrollbar-track {
		background: transparent;
	}

	::-webkit-scrollbar-thumb {
		background: rgba(148, 163, 184, 0.3);
		border-radius: 3px;
	}

	::-webkit-scrollbar-thumb:hover {
		background: rgba(148, 163, 184, 0.5);
	}
</style>
