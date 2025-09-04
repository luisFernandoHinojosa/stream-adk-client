<script lang="ts">
	import { onMount, tick } from 'svelte';

	// Interfaces TypeScript
	interface Message {
		id: string;
		text: string;
		sender: 'user' | 'bot';
		timestamp: Date;
	}

	// Datos random para el chat
	const botResponses: string[] = [
		'¡Hola! ¿En qué puedo ayudarte hoy?',
		'Esa es una pregunta muy interesante. Déjame pensarlo detenidamente y darte una respuesta completa que realmente te ayude a entender el tema en profundidad...',
		'Me parece que tienes razón en ese punto. Sin embargo, hay varios aspectos adicionales que deberíamos considerar para tener una visión más completa del tema.',
		'¿Has considerado esta otra perspectiva? A menudo, cuando analizamos un problema desde diferentes ángulos, podemos encontrar soluciones más creativas e innovadoras.',
		'Excelente pregunta. La respuesta no es tan simple como podría parecer inicialmente. Hay múltiples factores que intervienen en esta situación, y cada uno de ellos puede influir significativamente en el resultado final.',
		'Creo que podríamos explorar eso más a fondo. Este tipo de temas requieren un análisis detallado para poder ofrecer insights realmente valiosos y actionables.',
		'¡Qué buena observación! Es exactamente este tipo de pensamiento crítico lo que necesitamos para avanzar en la comprensión de temas complejos como este.',
		'Permíteme compartir mi punto de vista sobre eso. Basándome en la información disponible y considerando las diferentes variables involucradas, creo que la mejor aproximación sería...',
		'Eso me recuerda a algo que leí recientemente en un estudio muy interesante. Los investigadores encontraron patrones similares en situaciones comparables, lo cual nos da una perspectiva adicional para analizar tu caso específico.',
		'¡Perfecto! Sigamos con esa línea de pensamiento. Creo que estás en el camino correcto, y con algunos ajustes adicionales podremos llegar a una solución realmente efectiva.'
	];

	const userMessages: string[] = [
		'Hola, ¿cómo estás?',
		'¿Puedes ayudarme con algo?',
		'¿Qué piensas sobre la tecnología actual y cómo está transformando la manera en que trabajamos?',
		'Estoy trabajando en un proyecto interesante',
		'¿Tienes algún consejo para programadores que están empezando?',
		'Me gusta mucho este chat',
		'¿Cuál es tu opinión sobre el diseño UX y cómo podemos mejorar la experiencia del usuario?',
		'Gracias por la ayuda',
		'¿Podrías explicarme algo sobre inteligencia artificial?',
		'Esto es muy útil para mi trabajo diario'
	];

	// Estado reactivo
	let messages: Message[] = [];
	let inputValue: string = '';
	let isTyping: boolean = false;
	let messagesContainer: HTMLDivElement;

	// Función para scroll automático inteligente
	const scrollToBottom = async (behavior: 'smooth' | 'auto' = 'smooth') => {
		await tick();
		if (messagesContainer) {
			messagesContainer.scrollTo({
				top: messagesContainer.scrollHeight,
				behavior: behavior
			});
		}
	};

	// Función para scroll a un mensaje específico (solo mostrar el inicio)
	const scrollToMessage = async (messageElement: HTMLElement) => {
		await tick();
		if (messagesContainer && messageElement) {
			const containerTop = messagesContainer.scrollTop;
			const containerHeight = messagesContainer.clientHeight;
			const messageTop = messageElement.offsetTop;
			const messageHeight = messageElement.clientHeight;

			// Si el mensaje es más alto que el container, mostrar solo el inicio
			if (messageHeight > containerHeight) {
				messagesContainer.scrollTo({
					top: messageTop,
					behavior: 'smooth'
				});
			} else {
				// Si el mensaje cabe, hacer scroll normal al final
				scrollToBottom('smooth');
			}
		}
	};

	// Función para crear un nuevo mensaje
	const createMessage = (text: string, sender: 'user' | 'bot'): Message => ({
		id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
		text,
		sender,
		timestamp: new Date()
	});

	// Función para formatear timestamp
	const formatTime = (date: Date): string =>
		date.toLocaleTimeString('es-ES', {
			hour: '2-digit',
			minute: '2-digit'
		});

	// Función para agregar mensaje con scroll inteligente
	const addMessage = async (message: Message) => {
		messages = [...messages, message];

		await tick();

		// Si es mensaje del usuario, scroll automático al tope del mensaje
		if (message.sender === 'user') {
			// Scroll inmediato para mostrar el mensaje del usuario
			await scrollToBottom('auto');
		} else {
			// Si es del bot, permitir que el usuario vea desde el inicio si es largo
			const lastMessageElement = messagesContainer?.lastElementChild as HTMLElement;
			if (lastMessageElement) {
				await scrollToMessage(lastMessageElement);
			}
		}
	};

	// Función para simular respuesta del bot
	const botReply = async () => {
		isTyping = true;
		await scrollToBottom('smooth');

		// Simular tiempo de respuesta random (1-3 segundos)
		const delay = Math.random() * 2000 + 1000;

		setTimeout(async () => {
			isTyping = false;
			const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
			const botMessage = createMessage(randomResponse, 'bot');
			await addMessage(botMessage);
		}, delay);
	};

	// Función para enviar mensaje
	const sendMessage = async () => {
		const text = inputValue.trim();
		if (!text) return;

		// Agregar mensaje del usuario
		const userMessage = createMessage(text, 'user');
		await addMessage(userMessage);

		// Limpiar input
		inputValue = '';

		// Simular respuesta del bot
		await botReply();
	};

	// Función para agregar mensaje random del usuario
	const addRandomUserMessage = async () => {
		const randomMessage = userMessages[Math.floor(Math.random() * userMessages.length)];
		const userMessage = createMessage(randomMessage, 'user');
		await addMessage(userMessage);
		await botReply();
	};

	// Manejar tecla Enter
	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	};

	// Configurar mensaje de bienvenida
	onMount(async () => {
		setTimeout(async () => {
			const welcomeMessage = createMessage(
				'¡Hola! Bienvenido al chat. ¿En qué puedo ayudarte hoy?',
				'bot'
			);
			await addMessage(welcomeMessage);
		}, 500);
	});
</script>

<!-- Container principal con altura fija del viewport -->
<div
	class="fixed inset-0 mx-auto flex w-full max-w-4xl flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 md:relative md:h-screen"
>
	<!-- Header fijo -->
	<header class="shrink-0 border-b border-white/20 bg-white/10 p-4 backdrop-blur-md">
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-3">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
				>
					<span class="text-lg font-bold text-white">💬</span>
				</div>
				<div>
					<h1 class="text-lg font-semibold text-white">Chat Moderno</h1>
					<p class="text-sm text-gray-300">Bot inteligente disponible</p>
				</div>
			</div>
			<button
				on:click={addRandomUserMessage}
				class="transform rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-2 text-xs font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-pink-600 hover:shadow-xl sm:text-sm"
			>
				Random
			</button>
		</div>
	</header>

	<!-- Messages Container - Área scrolleable -->
	<div class="flex-1 overflow-hidden">
		<div
			bind:this={messagesContainer}
			class="h-full overflow-y-auto overscroll-contain scroll-smooth px-4 py-2"
		>
			<!-- Mensajes -->
			{#each messages as message, index (message.id)}
				<div
					class="message-item animate-fade-in mb-6 flex {message.sender === 'user'
						? 'justify-end'
						: 'justify-start'}"
					style="animation: fadeIn 0.3s ease-in-out;"
				>
					<div
						class="flex max-w-[85%] items-start space-x-3 sm:max-w-md lg:max-w-lg {message.sender ===
						'user'
							? 'flex-row-reverse space-x-reverse'
							: ''}"
					>
						<!-- Avatar -->
						<div class="mt-1 flex-shrink-0">
							<div
								class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold {message.sender ===
								'user'
									? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
									: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'}"
							>
								{message.sender === 'user' ? 'U' : 'B'}
							</div>
						</div>

						<!-- Mensaje -->
						<div class="flex flex-col space-y-2">
							<div
								class="rounded-2xl px-4 py-3 break-words shadow-lg backdrop-blur-sm {message.sender ===
								'user'
									? 'rounded-br-md bg-gradient-to-r from-blue-500 to-purple-500 text-white'
									: 'rounded-bl-md border border-white/20 bg-white/10 text-white'}"
							>
								<p class="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
							</div>
							<span
								class="px-2 text-xs text-gray-400 {message.sender === 'user'
									? 'text-right'
									: 'text-left'}"
							>
								{formatTime(message.timestamp)}
							</span>
						</div>
					</div>
				</div>
			{/each}

			<!-- Indicador de typing -->
			{#if isTyping}
				<div
					class="message-item animate-fade-in mb-6 flex justify-start"
					style="animation: fadeIn 0.3s ease-in-out;"
				>
					<div class="flex items-start space-x-3">
						<div class="mt-1 flex-shrink-0">
							<div
								class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-sm font-semibold text-white"
							>
								B
							</div>
						</div>
						<div
							class="rounded-2xl rounded-bl-md border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm"
						>
							<div class="flex space-x-1">
								<div class="h-2 w-2 animate-pulse rounded-full bg-gray-400"></div>
								<div
									class="h-2 w-2 animate-pulse rounded-full bg-gray-400"
									style="animation-delay: 0.3s"
								></div>
								<div
									class="h-2 w-2 animate-pulse rounded-full bg-gray-400"
									style="animation-delay: 0.6s"
								></div>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Espacio extra para evitar que el último mensaje quede oculto -->
			<div class="h-4"></div>
		</div>
	</div>

	<!-- Input Container fijo en la parte inferior -->
	<div class="shrink-0 border-t border-white/20 bg-white/10 p-3 backdrop-blur-md sm:p-4">
		<div class="flex space-x-2 sm:space-x-3">
			<input
				bind:value={inputValue}
				on:keypress={handleKeyPress}
				type="text"
				placeholder="Escribe tu mensaje..."
				class="flex-1 resize-none rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-base text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none sm:px-4 sm:py-3"
				maxlength="1000"
			/>
			<button
				on:click={sendMessage}
				disabled={!inputValue.trim()}
				class="shrink-0 transform rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-purple-600 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-3"
			>
				<svg class="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
					></path>
				</svg>
			</button>
		</div>
	</div>
</div>

<style>
	@keyframes fadeIn {
		0% {
			opacity: 0;
			transform: translateY(10px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fadeIn 0.3s ease-in-out;
	}

	/* Estilos para el scroll personalizado */
	:global(.scroll-smooth::-webkit-scrollbar) {
		width: 4px;
	}

	:global(.scroll-smooth::-webkit-scrollbar-track) {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 2px;
	}

	:global(.scroll-smooth::-webkit-scrollbar-thumb) {
		background: rgba(255, 255, 255, 0.2);
		border-radius: 2px;
	}

	:global(.scroll-smooth::-webkit-scrollbar-thumb:hover) {
		background: rgba(255, 255, 255, 0.4);
	}

	/* Animación de pulse personalizada para typing indicator */
	@keyframes customPulse {
		0%,
		60% {
			opacity: 0.4;
		}
		30% {
			opacity: 1;
		}
	}

	:global(.animate-pulse) {
		animation: customPulse 1.5s infinite;
	}

	/* Fuerza el contenedor a mantenerse en pantalla completa */
	:global(html, body) {
		margin: 0;
		padding: 0;
		height: 100%;
		overflow: hidden;
		position: fixed;
		width: 100%;
	}

	/* En desktop, permitir scroll normal */
	@media (min-width: 768px) {
		:global(html, body) {
			position: static;
			overflow: auto;
		}
	}

	/* Prevenir zoom en inputs en iOS */
	input[type='text'] {
		font-size: 16px;
	}

	/* Mejorar el comportamiento del scroll en móviles */
	.overscroll-contain {
		overscroll-behavior: contain;
		-webkit-overflow-scrolling: touch;
	}
</style>
