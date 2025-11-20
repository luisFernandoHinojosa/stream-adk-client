<script lang="ts">
	import Artefact from '$lib/components/chatStream/artefact.svelte';
	import ArtefactDropdown from '$lib/components/chatStream/artefactDropdown.svelte';
	import Chat from '$lib/components/chatStream/chat.svelte';
	import ChatSkeleton from '$lib/components/chatStream/chatSkeleton.svelte';
	import InputArea from '$lib/components/chatStream/inputArea.svelte';
	import ModalChatState from '$lib/components/chatStream/modalChatState.svelte';
	import Loader from '$lib/components/ui/loader.svelte';
	import {
		ArrowLeftIcon,
		BrainIcon,
		ChevronLeftIcon,
		LoaderIcon,
		PencilIcon
	} from '$lib/icons/outline';
	import Menu2Icon from '$lib/icons/outline/menu2Icon.svelte';
	import PhotoIcon from '$lib/icons/outline/photoIcon.svelte';
	import { BotsiIcon } from '$lib/icons/solid';
	import FilePencilIcon from '$lib/icons/solid/filePencilIcon.svelte';
	import type { ChatStreamSend, SessionData, SessionsHistory } from '$lib/interface';
	import { smartTrackerService } from '$lib/services/smartTracker.service';
	//import { smartTrackerStore } from '$lib/stores/smartTrackerStore';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { redirect } from '$lib/utils/redirect';
	import AppSelector2 from '$lib/components/chatStream/appSelector2.svelte';
	import SidebarHistory from '$lib/components/user/sidebarHistory.svelte';
	import { page } from '$app/state';
	//VARIABLES STATES
	let isLoading: boolean = $state(false);
	let chatEndRef: HTMLDivElement;
	let historyCollapsed: boolean = $state(true);
	let artifactOpen: boolean = $state(false);
	let sessionsHistories: SessionsHistory[] = $state([]);
	let stateSessionMinimized: boolean = $state(false);
	let isLoadingGetSession: boolean = $state(false);
	let sendMessageData: ChatStreamSend;
	let chatMessages: SessionData = $state({
		id: '0',
		appName: 'chat-app-botsi',
		userId: 'default-user-botsi',
		state: null,
		events: [],
		lastUpdateTime: Date.now()
	});
	let defaultSessionId: string = $state('b6ed5842-c106-4b71-b72c-b03a638cd073');

	let isLoadingSessionChat: boolean = $state(false);
	let typeArtefact: number = $state(2);
	let dropdownOpen: boolean = $state(false);

	let chatViewContainer: HTMLDivElement | null = $state(null);
	// Este es el área que contiene los mensajes y que hará scroll.
	let chatMessagesAreaRef: HTMLDivElement | null = $state(null);

	let userId: string | undefined = page.params.userId;
	console.log('userId', userId);

	//FUNCTIONS

	const toggleHistorySidebar = () => {
		historyCollapsed = !historyCollapsed;
	};

	//Listar historial de sesiones
	const getSessionsHistories = async () => {
		try {
			const sessionsHistoriesResponse = await smartTrackerService.getSessionsHistoryForUser(userId);
			defaultSessionId = sessionsHistoriesResponse[sessionsHistoriesResponse.length - 1].id;
			//console.log('sessionsHistoriesResponse', sessionsHistoriesResponse);
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
			defaultSessionId = sessionId;
			chatMessages.id = sessionId;
			const sessionResponse = await smartTrackerService.getFullSessionForUser(
				defaultSessionId,
				userId
			);
			chatMessages = sessionResponse;
			console.log('sessionResponse', sessionResponse);
		} catch (error) {
			isLoadingSessionChat = false;
			console.log(error);
		}
		isLoadingSessionChat = false;
	};

	const createNewSession = async (): Promise<void> => {
		try {
			const sessionResponse = await smartTrackerService.createSession();
			redirect(`/stream/${sessionResponse.session_id}`, true);
			//console.log('sessionResponse', sessionResponse);
			chatMessages.id = sessionResponse.session_id;
			//await getSessionsHistories();
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
		if (chatMessages.id !== '0') {
			isLoadingGetSession = true;
			await getSessionHistory(chatMessages.id);
			isLoadingGetSession = false;
		}
		stateSessionMinimized = !stateSessionMinimized;
	}
	function toggleArtifact() {
		artifactOpen = !artifactOpen;
	}

	//let shouldAutoScroll: boolean = $state(true);

	// const scrollToBottom = (smooth: boolean = true) => {
	// 	if (chatEndRef && shouldAutoScroll) {
	// 		chatEndRef.scrollIntoView({
	// 			behavior: smooth ? 'smooth' : 'instant',
	// 			block: 'end'
	// 		});
	// 	}
	// };

	function scrollToBottom(smooth = true) {
		if (chatMessagesAreaRef) {
			// Usamos 'instant' en vez de 'auto' para que sea compatible con más navegadores
			const behavior = smooth ? 'smooth' : 'instant';
			chatMessagesAreaRef.scrollTo({ top: chatMessagesAreaRef.scrollHeight, behavior });
		}
	}

	const handleScroll = (event: Event) => {
		const container = event.target as HTMLElement;
		const { scrollTop, scrollHeight, clientHeight } = container;
		const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

		// Si está a menos de 100px del final, activar auto-scroll
		//shouldAutoScroll = distanceFromBottom < 100;
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

	onMount(() => {
		(async () => {
			isLoadingSessionChat = true;
			await getSessionsHistories();
			await getSessionHistory(defaultSessionId);
			isLoadingSessionChat = false;
		})();
	});

	$effect(() => {
		if (chatMessages.events.length > 0) {
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
		<SidebarHistory
			{historyCollapsed}
			{sessionsHistories}
			{toggleHistorySidebar}
			currentChatId={chatMessages.id}
			{getSessionHistory}
			{userId}
		/>

		<div class="relative flex h-full flex-1 overflow-hidden">
			<div class="fixed mt-2 hidden lg:block">
				<button
					onclick={() => redirect('/settings/users')}
					class="flex cursor-pointer items-center"
				>
					<ChevronLeftIcon /> back</button
				>
			</div>
			<!-- Chat Section -->
			<div bind:this={chatViewContainer} class="relative h-full flex-1 overflow-hidden">
				<div class="flex h-full w-full flex-col">
					<!-- Header chat mobile -->
					<div
						class="flex w-full items-center justify-end bg-light-one_d px-4 py-3 lg:hidden dark:bg-dark-one_d"
					>
						<div class="flex items-center justify-end gap-3">
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

					<div
						bind:this={chatMessagesAreaRef}
						class="mt-6 flex-1 overflow-y-auto p-2 sm:p-3 md:p-6"
						onscroll={handleScroll}
					>
						<div class="mx-auto max-w-4xl space-y-6">
							{#if sessionsHistories.length === 0}
								<div class="flex flex-col items-center py-12 text-center md:py-20">
									<h3 class="mb-3 text-xl font-bold text-light-two md:text-2xl dark:text-dark-two">
										No hay chats disponibles
									</h3>
								</div>
							{/if}

							{#if chatMessages.events.length > 0}
								{#if isLoadingSessionChat}
									<ChatSkeleton messagesCount={4} showAccordion={true} animated={true} />
								{:else}
									<Chat sessionsData={chatMessages} />
								{/if}
							{/if}
							<div bind:this={chatEndRef}></div>
						</div>
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
				{:else if typeArtefact === 5}
					<!-- Artefacto tipo PDF/DIAGRAMA -->
					<Artefact {toggleArtifact} fileType="csv" fileName="archivo.csv" />
				{:else}
					<Artefact
						{toggleArtifact}
						fileType="html"
						fileName="diagrama.html"
						fileUrl="https://vizta.link"
					/>
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
			<ModalChatState sessionsData={chatMessages} {toggleStateSession} />
		{/if}
	</div>
</div>
