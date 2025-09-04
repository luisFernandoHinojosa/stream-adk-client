<script lang="ts">
	// CAMBIO: No necesitamos onDestroy aquí, Svelte 5 lo maneja automáticamente en onMount
	import { onMount } from 'svelte';
	import TypingLoader from './tipyngLoader.svelte';
	let messages: Message[] = $state([
		{ id: 1, text: '¡Hola! ¿Cómo estás?', sender: 'other', type: 'text' },
		{ id: 2, text: '¡Hey! Todo bien por aquí, ¿y tú?', sender: 'me', type: 'text' },
		{
			id: 3,
			text: 'Genial, trabajando en un chat con Svelte y Tailwind.',
			sender: 'other',
			type: 'text'
		},
		{
			id: 4,
			text: '¡Suena increíble! Tailwind es lo máximo para esto.',
			sender: 'me',
			type: 'text'
		},
		{
			id: 5,
			text: 'Totalmente. Mira qué fácil es hacer que el layout funcione en móviles.',
			sender: 'me',
			type: 'text'
		},
		{
			id: 6,
			text: 'Wow, es verdad. El header no se mueve cuando abro el teclado.',
			sender: 'other',
			type: 'text'
		},
		{
			id: 7,
			text: 'Exacto. Flexbox y la unidad `h-screen` hacen toda la magia.',
			sender: 'me',
			type: 'text'
		},
		{ id: 8, text: 'Otro mensaje para rellenar...', sender: 'other', type: 'text' },
		{ id: 9, text: 'Y otro más para que se active el scroll.', sender: 'me', type: 'text' },
		{ id: 10, text: '¡Funciona perfecto!', sender: 'other', type: 'text' }
	]);
	type Message = {
		id: number;
		text?: string;
		sender: 'me' | 'other';
		type: 'text' | 'loader';
	};

	let newMessage: string = $state('');
	let isLoading: boolean = $state(false);

	let chatContainer: HTMLDivElement | null = $state(null);
	let chatMessagesArea: HTMLElement | null = $state(null);

	// --- LÓGICA DEL CHAT ---

	// CAMBIO: He creado una función reutilizable para el scroll
	function scrollToBottom(behavior: 'smooth' | 'auto' = 'smooth') {
		// Usamos un pequeño timeout para asegurar que el DOM se haya renderizado antes de scrollear
		setTimeout(() => {
			if (chatMessagesArea) {
				chatMessagesArea.scrollTo({ top: chatMessagesArea.scrollHeight, behavior });
			}
		}, 0);
	}

	async function handleSendMessage() {
		if (newMessage.trim() === '' || isLoading) return;
		const userMessage: Message = { id: Date.now(), text: newMessage, sender: 'me', type: 'text' };
		messages = [...messages, userMessage];
		newMessage = '';
		showAgentResponse();
	}

	async function showAgentResponse() {
		isLoading = true;
		const loaderId = Date.now() + 1;
		// Corregí esto para que el loader sí se muestre
		messages = [...messages, { id: loaderId, sender: 'other', type: 'loader' }];

		await new Promise((resolve) => setTimeout(resolve, 2000));
		const agentResponses = [
			'Entendido...',
			'Gracias, un momento por favor.',
			'Claro, puedo ayudarte.',
			'Perfecto, déjame verificarlo.'
		];
		const agentMessage: Message = {
			id: Date.now() + 2,
			text: agentResponses[Math.floor(Math.random() * agentResponses.length)],
			sender: 'other',
			type: 'text'
		};
		messages = [...messages.filter((m) => m.id !== loaderId), agentMessage];
		isLoading = false;
	}

	// --- CICLO DE VIDA Y MANEJO DEL LAYOUT ---
	onMount(() => {
		if (window.visualViewport) {
			const handleResize = () => {
				if (chatContainer) {
					chatContainer.style.height = `${window.visualViewport.height}px`;
					// CAMBIO: Forzamos el scroll al final CADA VEZ que el teclado aparece/desaparece.
					// Usamos 'auto' para que el scroll sea instantáneo y no se note una animación rara.
					scrollToBottom('auto');
				}
			};
			handleResize();
			window.visualViewport.addEventListener('resize', handleResize);

			// Svelte 5 limpia el listener automáticamente al usarlo dentro de onMount
			return () => window.visualViewport.removeEventListener('resize', handleResize);
		}

		setTimeout(() => {
			messages = [
				{ id: 1, text: 'Hola, bienvenido. ¿En qué puedo ayudarte?', sender: 'other', type: 'text' }
			];
		}, 1500);
	});

	// El effect ahora solo necesita preocuparse de los nuevos mensajes
	$effect(() => {
		// Nos aseguramos que la variable messages sea leída por el effect
		if (messages.length > 0) {
			scrollToBottom('smooth');
		}
	});
</script>

<div bind:this={chatContainer} class="fixed inset-0 flex flex-col overflow-hidden bg-gray-200">
	<header class="z-10 flex flex-shrink-0 items-center bg-teal-700 p-4 text-white shadow-md">
		<div class="flex flex-col">
			<h1 class="text-lg font-semibold">Soporte Técnico</h1>
			<p class="text-sm text-teal-100">Agente en línea</p>
		</div>
	</header>

	{#if messages.length === 0}
		<main class="flex flex-grow flex-col items-center justify-center p-4">
			<div class="text-center text-gray-500">
				<p>Aún no hay mensajes.</p>
				<p>Envía un mensaje para comenzar.</p>
			</div>
		</main>
		<footer class="flex flex-shrink-0 items-center border-t border-gray-300 bg-gray-100 p-2">
			<input
				type="text"
				placeholder="Cargando chat..."
				class="w-full flex-grow rounded-full border bg-white px-4 py-2"
			/>
			<button class="ml-2 flex-shrink-0 rounded-full bg-teal-600 p-3 text-white">...</button>
		</footer>
	{:else}
		<main bind:this={chatMessagesArea} class="flex-grow space-y-4 overflow-y-auto p-4">
			{#each messages as message (message.id)}
				<div class="flex {message.sender === 'me' ? 'justify-end' : 'justify-start'}">
					{#if message.type === 'loader'}
						<TypingLoader />
					{:else}
						<div
							class="max-w-xs rounded-2xl px-4 py-2 lg:max-w-md {message.sender === 'me'
								? 'rounded-br-none bg-teal-600 text-white'
								: 'rounded-bl-none bg-white text-gray-800'}"
						>
							<p>{message.text}</p>
						</div>
					{/if}
				</div>
			{/each}
		</main>
		<footer class="flex flex-shrink-0 items-center border-t border-gray-300 bg-gray-100 p-2">
			<input
				type="text"
				bind:value={newMessage}
				onkeydown={(e) => {
					if (e.key === 'Enter') handleSendMessage();
				}}
				disabled={isLoading}
				placeholder={isLoading ? 'El agente está escribiendo...' : 'Escribe un mensaje...'}
				class="w-full flex-grow rounded-full border border-gray-300 bg-white px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none disabled:bg-gray-200"
			/>
			<button
				onclick={handleSendMessage}
				disabled={isLoading}
				class="ml-2 flex-shrink-0 rounded-full bg-teal-600 p-3 text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:outline-none disabled:opacity-50"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
					/></svg
				>
			</button>
		</footer>
	{/if}
</div>

<!-- //////////////////////////////////////////////////////// -->
<!-- <script>
	import { onDestroy, onMount } from 'svelte';

	// Datos de ejemplo para los mensajes del chat
	const messages = [
		{ id: 1, text: '¡Hola! ¿Cómo estás?', sender: 'other' },
		{ id: 2, text: '¡Hey! Todo bien por aquí, ¿y tú?', sender: 'me' },
		{ id: 3, text: 'Genial, trabajando en un chat con Svelte y Tailwind.', sender: 'other' },
		{ id: 4, text: '¡Suena increíble! Tailwind es lo máximo para esto.', sender: 'me' },
		{
			id: 5,
			text: 'Totalmente. Mira qué fácil es hacer que el layout funcione en móviles.',
			sender: 'me'
		},
		{
			id: 6,
			text: 'Wow, es verdad. El header no se mueve cuando abro el teclado.',
			sender: 'other'
		},
		{ id: 7, text: 'Exacto. Flexbox y la unidad `h-screen` hacen toda la magia.', sender: 'me' },
		{ id: 8, text: 'Otro mensaje para rellenar...', sender: 'other' },
		{ id: 9, text: 'Y otro más para que se active el scroll.', sender: 'me' },
		{ id: 10, text: '¡Funciona perfecto!', sender: 'other' }
	];

	let chatContainer;
	let newMessage = '';

	function handleSendMessage() {
		if (newMessage.trim() === '') return;
		// Aquí iría la lógica para enviar el mensaje
		console.log('Mensaje enviado:', newMessage);
		newMessage = '';
	}

	onMount(() => {
		// Verificamos que el navegador soporte visualViewport
		if (window.visualViewport) {
			const handleResize = () => {
				// Ajustamos la altura del contenedor a la altura del viewport visible
				chatContainer.style.height = `${window.visualViewport.height}px`;
			};

			// Llamamos a la función al inicio
			handleResize();

			// Y añadimos un listener que se active cada vez que el viewport cambie (al abrir/cerrar teclado)
			window.visualViewport.addEventListener('resize', handleResize);

			// Importante: Limpiamos el listener cuando el componente se destruye para evitar fugas de memoria
			onDestroy(() => {
				window.visualViewport.removeEventListener('resize', handleResize);
			});
		}
	});
</script>

<div bind:this={chatContainer} class="flex h-screen-dynamic flex-col bg-gray-200">
	<header class="z-10 flex flex-shrink-0 items-center bg-teal-700 p-4 text-white shadow-md">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="mr-3 h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 19l-7-7m0 0l7-7m-7 7h18"
			/></svg
		>
		<div class="flex flex-col">
			<h1 class="text-lg font-semibold">Grupo de Svelte</h1>
			<p class="text-sm text-teal-100">Juan, María, Pedro</p>
		</div>
	</header>

	<main class="flex-grow space-y-4 overflow-y-auto p-4">
		{#each messages as message (message.id)}
			<div class="flex {message.sender === 'me' ? 'justify-end' : 'justify-start'}">
				<div
					class="max-w-xs rounded-2xl px-4 py-2 lg:max-w-md {message.sender === 'me'
						? 'rounded-br-none bg-teal-600 text-white'
						: 'rounded-bl-none bg-white text-gray-800'}"
				>
					<p>{message.text}</p>
				</div>
			</div>
		{/each}
	</main>

	<footer class="flex flex-shrink-0 items-center border-t border-gray-300 bg-gray-100 p-2">
		<input
			type="text"
			bind:value={newMessage}
			on:keydown={(e) => e.key === 'Enter' && handleSendMessage()}
			placeholder="Escribe un mensaje..."
			class="w-full flex-grow rounded-full border border-gray-300 bg-white px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
		/>
		<button
			on:click={handleSendMessage}
			class="ml-2 flex-shrink-0 rounded-full bg-teal-600 p-3 text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:outline-none"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
				/></svg
			>
		</button>
	</footer>
</div>

<style>
	:global(.overflow-y-auto) {
		scrollbar-width: thin;
		scrollbar-color: #a0aec0 #edf2f7;
	}
	/* Opcional: Para mejorar el scroll en navegadores que lo soporten */
	.overflow-y-auto {
		scrollbar-width: thin;
		scrollbar-color: #a0aec0 #edf2f7;
	}
	.overflow-y-auto::-webkit-scrollbar {
		width: 8px;
	}
	.overflow-y-auto::-webkit-scrollbar-track {
		background: #edf2f7;
	}
	.overflow-y-auto::-webkit-scrollbar-thumb {
		background-color: #a0aec0;
		border-radius: 20px;
		border: 3px solid #edf2f7;
	}
</style> -->

<style>
	/* Opcional: Para mejorar el scroll en navegadores que lo soporten */
	.overflow-y-auto {
		scrollbar-width: thin;
		scrollbar-color: #a0aec0 #edf2f7;
	}
	.overflow-y-auto::-webkit-scrollbar {
		width: 8px;
	}
	.overflow-y-auto::-webkit-scrollbar-track {
		background: #edf2f7;
	}
	.overflow-y-auto::-webkit-scrollbar-thumb {
		background-color: #a0aec0;
		border-radius: 20px;
		border: 3px solid #edf2f7;
	}
</style>
