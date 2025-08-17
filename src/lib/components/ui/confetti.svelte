<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';

	// Tipos para las propiedades del componente
	type ConfettiShape = 'circle' | 'square' | 'rectangle' | 'triangle';

	// Props configurables con tipos
	export let particleCount: number = 5;
	export let duration: number = 3000; // duración de la animación en ms
	export let explosionForce: number = 0; // fuerza de la explosión (multiplicador)

	export let colors: string[] = [
		'#ff0a54',
		'#ff477e',
		'#ff7096',
		'#ff85a1',
		'#fbb1bd',
		'#f9bec7',
		'#fcd5ce',
		'#cdb4db',
		'#a2d2ff',
		'#bde0fe'
	];
	export let shapes: ConfettiShape[] = ['circle', 'square', 'rectangle', 'triangle'];
	export let gravity: number = 0.1;
	export let friction: number = 0.89;
	export let autoStart: boolean = false;
	export let maxParticleSize: number = 20;
	export let minParticleSize: number = 3;
	// Nuevas propiedades para la variación
	export let gravityVariation: number = 0.05; // variación de gravedad entre partículas
	export let frictionVariation: number = 0.05; // variación de fricción entre partículas
	export let swayFactor: number = 0.2; // factor de oscilación horizontal

	// NUEVA PROP: Para configurar si la explosión es fullscreen
	export let fullscreen: boolean = false;

	// NUEVAS PROPS: Para configurar la posición de origen de la explosión
	export let originX: number | null = null; // Posición X de origen (0-100 para %, o pixel value)
	export let originY: number | null = null; // Posición Y de origen (0-100 para %, o pixel value)
	export let usePixelCoordinates: boolean = false; // Si true, originX/Y son en píxeles, si false son porcentajes

	// Para acceder al div contenedor
	let confettiContainer: HTMLDivElement;

	// Dispatcher para eventos
	const dispatch = createEventDispatcher();

	// Interfaz para las partículas
	interface Particle {
		element: HTMLDivElement;
		x: number;
		y: number;
		velocityX: number;
		velocityY: number;
		rotation: number;
		rotationVelocity: number;
		size: number;
		lifespan: number;
		shape: ConfettiShape;
		color: string;
		opacity: number;
		individualGravity: number; // Gravedad única para cada partícula
		individualFriction: number; // Fricción única para cada partícula
		swayPhase: number; // Fase para oscilación horizontal
		swayFrequency: number; // Frecuencia de oscilación horizontal
	}

	// Estado
	let particles: Particle[] = [];
	let animationFrameId: number;
	let running: boolean = false;
	let elapsedTime: number = 0;
	let lastFrameTime: number = 0;

	// Función para crear una partícula
	const createParticle = (): Particle => {
		const particle = document.createElement('div');

		// Tamaño aleatorio entre min y max
		const size = Math.random() * (maxParticleSize - minParticleSize) + minParticleSize;

		// Color aleatorio de la paleta proporcionada
		const color = colors[Math.floor(Math.random() * colors.length)];

		// Forma aleatoria
		const shape = shapes[Math.floor(Math.random() * shapes.length)];

		// Posición inicial - MODIFICADA para origen personalizado y fullscreen
		let startX: number;
		let startY: number;

		// Determinar posición de origen
		if (originX !== null && originY !== null) {
			// Usar posición de origen personalizada
			if (fullscreen && usePixelCoordinates) {
				// Convertir píxeles a viewport units para fullscreen
				startX = (originX / window.innerWidth) * 100;
				startY = (originY / window.innerHeight) * 100;
			} else if (!fullscreen && usePixelCoordinates) {
				// Convertir píxeles a porcentajes relativos al contenedor
				const containerRect = confettiContainer.getBoundingClientRect();
				startX = (originX / containerRect.width) * 100;
				startY = (originY / containerRect.height) * 100;
			} else {
				// Usar directamente los valores de porcentaje
				startX = originX;
				startY = originY;
			}
		} else if (fullscreen) {
			// En modo fullscreen sin origen específico, posición aleatoria en la parte superior
			startX = Math.random() * 100;
			startY = Math.random() * 30;
		} else {
			// Modo normal sin origen específico: centro del contenedor
			startX = 50;
			startY = 50;
		}

		// Ángulo aleatorio para la explosión (en radianes)
		const angle = Math.random() * Math.PI * 2;

		// Fuerza aleatoria para la explosión, variando por cada partícula
		// En fullscreen, aplicamos más fuerza para cubrir más área
		const baseForce = fullscreen ? explosionForce * 8 : explosionForce * 5;
		const force = Math.random() * baseForce + baseForce;

		// Velocidad inicial basada en el ángulo y la fuerza
		const velocityX = Math.cos(angle) * force;
		const velocityY = Math.sin(angle) * force;

		// Velocidad de rotación aleatoria, más variada
		const rotationVelocity = (Math.random() - 0.5) * 15;

		// Valores individuales de física para cada partícula
		const individualGravity = gravity * (1 + (Math.random() * 2 - 1) * gravityVariation);
		const individualFriction = friction * (1 + (Math.random() * 2 - 1) * frictionVariation);

		// Parámetros de oscilación horizontal (efecto de balanceo)
		const swayPhase = Math.random() * Math.PI * 2; // Fase inicial aleatoria
		const swayFrequency = 0.5 + Math.random() * 1.5; // Frecuencia aleatoria

		// Configurar estilos básicos comunes
		particle.style.position = fullscreen ? 'fixed' : 'absolute'; // Fixed para fullscreen
		particle.style.backgroundColor = color;
		particle.style.left = fullscreen ? `${startX}vw` : `${startX}%`; // vw para fullscreen
		particle.style.top = fullscreen ? `${startY}vh` : `${startY}%`; // vh para fullscreen
		particle.style.zIndex = '9999'; // Z-index alto para estar encima de todo

		// Aplicar estilos específicos según la forma
		if (shape === 'circle') {
			// Círculo: border-radius: 50%
			particle.style.width = `${size}px`;
			particle.style.height = `${size}px`;
			particle.style.borderRadius = '50%';
		} else if (shape === 'square') {
			// Cuadrado: rotado 45 grados para parecer un diamante
			particle.style.width = `${size}px`;
			particle.style.height = `${size}px`;
			particle.style.transform = 'rotate(45deg)';
		} else if (shape === 'rectangle') {
			// Rectángulo: más ancho que alto
			particle.style.width = `${size}px`;
			particle.style.height = `${size * 0.5}px`;
			particle.style.borderRadius = '2px'; // bordes ligeramente redondeados
		} else if (shape === 'triangle') {
			// Triángulo: usando clip-path
			particle.style.width = `${size}px`;
			particle.style.height = `${size}px`;
			particle.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
		}

		// Creamos el objeto partícula con todas sus propiedades
		const newParticle: Particle = {
			element: particle,
			x: startX,
			y: startY,
			velocityX,
			velocityY,
			rotation: 0,
			rotationVelocity,
			size,
			lifespan: Math.random() * (duration * 0.4) + duration * 0.6, // Tiempo de vida variable
			shape,
			color,
			opacity: 1,
			individualGravity,
			individualFriction,
			swayPhase,
			swayFrequency
		};

		// Añadimos al DOM - MODIFICADO para fullscreen
		if (fullscreen) {
			document.body.appendChild(particle); // Agregar al body para fullscreen
		} else {
			confettiContainer.appendChild(particle); // Agregar al contenedor normal
		}

		return newParticle;
	};

	// Función para animar las partículas
	const animateParticles = (timestamp: number) => {
		if (!running) return;

		// Calcular el tiempo transcurrido
		if (!lastFrameTime) lastFrameTime = timestamp;
		const deltaTime = timestamp - lastFrameTime;
		lastFrameTime = timestamp;
		elapsedTime += deltaTime;

		// Actualizamos cada partícula
		for (let i = particles.length - 1; i >= 0; i--) {
			const particle = particles[i];

			// Aplicar efecto de oscilación horizontal (sway)
			const swayAmount =
				Math.sin(elapsedTime * 0.001 * particle.swayFrequency + particle.swayPhase) * swayFactor;
			particle.velocityX += swayAmount * (particle.size > 10 ? 0.05 : 0.1); // Partículas más pequeñas oscilan más

			// Actualizar posición
			particle.x += particle.velocityX;
			particle.y += particle.velocityY;

			// Aplicar gravedad individualizada
			particle.velocityY += particle.individualGravity;

			// Aplicar fricción individualizada
			particle.velocityX *= particle.individualFriction;
			particle.velocityY *= particle.individualFriction;

			// Actualizar rotación con velocidad variable
			particle.rotation += particle.rotationVelocity;
			particle.rotationVelocity *= particle.individualFriction; // La rotación también se desacelera

			// Reducir tiempo de vida
			particle.lifespan -= deltaTime;

			// Calcular opacidad basada en tiempo de vida restante
			if (particle.lifespan < 500) {
				particle.opacity = particle.lifespan / 500;
			}

			// Aplica una ligera resistencia adicional para partículas grandes
			if (particle.size > 12) {
				particle.velocityY *= 0.995; // Cae más lento para partículas grandes
			} else if (particle.size < 8) {
				particle.velocityY *= 1.002; // Cae más rápido para partículas pequeñas
			}

			// Actualizar el DOM con las nuevas propiedades - MODIFICADO para fullscreen
			const element = particle.element;
			if (fullscreen) {
				element.style.left = `${particle.x}vw`;
				element.style.top = `${particle.y}vh`;
			} else {
				element.style.left = `${particle.x}%`;
				element.style.top = `${particle.y}%`;
			}

			// Aplicar la rotación, respetando la forma original
			if (particle.shape === 'square') {
				element.style.transform = `rotate(${45 + particle.rotation}deg)`;
			} else if (particle.shape === 'triangle') {
				element.style.transform = `rotate(${particle.rotation}deg)`;
			} else if (particle.shape === 'rectangle') {
				element.style.transform = `rotate(${particle.rotation}deg)`; // También rotamos los rectángulos
			} else {
				element.style.transform = `rotate(${particle.rotation}deg)`;
			}

			element.style.opacity = particle.opacity.toString();

			// Eliminar partículas que terminaron su vida o salieron de la pantalla
			// MODIFICADO: límites diferentes para fullscreen
			const outOfBounds = fullscreen
				? particle.lifespan <= 0 || particle.y > 120 || particle.x < -10 || particle.x > 110
				: particle.lifespan <= 0 || particle.y > 150 || particle.x < -20 || particle.x > 120;

			if (outOfBounds) {
				element.remove();
				particles.splice(i, 1);
			}
		}

		// Continuar la animación o terminar
		if (particles.length > 0) {
			animationFrameId = requestAnimationFrame(animateParticles);
		} else {
			running = false;
			dispatch('complete');
		}
	};

	// Función pública para iniciar la explosión
	export function explode(): void {
		// Cancelamos cualquier animación anterior
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
		}

		// Limpiamos partículas anteriores
		particles.forEach((p) => p.element.remove());
		particles = [];

		// Creamos nuevas partículas
		for (let i = 0; i < particleCount; i++) {
			particles.push(createParticle());
		}

		// Reiniciamos el tiempo
		elapsedTime = 0;
		lastFrameTime = 0;

		// Iniciamos la animación
		running = true;
		animationFrameId = requestAnimationFrame(animateParticles);

		// Disparamos el evento
		dispatch('start');
	}

	// Función pública para detener la animación
	export function stop(): void {
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
		}
		running = false;

		// Fade out suave de las partículas existentes
		const fadeOutParticles = () => {
			let allRemoved = true;

			particles.forEach((particle, index) => {
				particle.opacity -= 0.1;

				if (particle.opacity <= 0) {
					particle.element.remove();
					particles.splice(index, 1);
				} else {
					particle.element.style.opacity = particle.opacity.toString();
					allRemoved = false;
				}
			});

			if (!allRemoved) {
				requestAnimationFrame(fadeOutParticles);
			} else {
				particles = [];
				dispatch('stop');
			}
		};

		fadeOutParticles();
	}

	onMount(() => {
		if (autoStart) {
			explode();
		}
	});

	onDestroy(() => {
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
		}
		// Limpiamos las partículas
		particles.forEach((p) => {
			if (p.element.parentNode) {
				p.element.remove();
			}
		});
	});
</script>

<!-- El contenedor ahora es condicional basado en fullscreen -->
{#if !fullscreen}
	<div class="pointer-events-none relative z-50 h-full w-full" bind:this={confettiContainer}></div>
{:else}
	<!-- En modo fullscreen no necesitamos un contenedor visible -->
	<div style="display: none;" bind:this={confettiContainer}></div>
{/if}

<style>
	.explosion-confetti-container {
		z-index: 9999;
	}
</style>
