<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		// Configuración general
		class?: string;
		// Esquema de colores
		colorScheme?: 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'custom';
		customColors?: {
			primary: string;
			secondary: string;
			accent: string;
		};
		// Intensidad de opacidad (0-1)
		opacityGradient?: number;
		opacityShape?: number;
		// Número de elementos
		shapeCount?: number;
		particleCount?: number;
		// Habilitar/deshabilitar elementos
		enableShapes?: boolean;
		enableWaves?: boolean;
		enableParticles?: boolean;
		// Velocidad de animación
		animationSpeed?: 'slow' | 'normal' | 'fast';
		// Tamaño de elementos
		shapeSize?: 'small' | 'medium' | 'large';
		// Densidad (qué tan juntos están los elementos)
		density?: 'sparse' | 'normal' | 'dense';
	}

	const {
		class: className = '',
		colorScheme = 'blue',
		customColors,
		opacityGradient = 0.3,
		opacityShape = 0.3,
		shapeCount = 5,
		particleCount = 3,
		enableShapes = true,
		enableWaves = true,
		enableParticles = true,
		animationSpeed = 'normal',
		shapeSize = 'medium',
		density = 'normal'
	}: Props = $props();

	type FloatingShape = {
		id: number;
		type: 'circle' | 'square' | 'oval';
		size: string;
		position: {
			top?: string;
			bottom?: string;
			left?: string;
			right?: string;
		};
		gradient: string;
		animation: string;
		duration: string;
		delay?: string;
		rotation?: string;
	};

	type FloatingParticle = {
		id: number;
		size: string;
		position: {
			top?: string;
			bottom?: string;
			left?: string;
			right?: string;
		};
		color: string;
		delay: string;
	};

	let shapes: FloatingShape[] = $state([]);
	let particles: FloatingParticle[] = $state([]);
	let gradientId = $state('');

	// Configuración de colores por esquema
	const colorSchemes = {
		blue: {
			primary: 'from-blue-400 to-indigo-500',
			secondary: 'from-cyan-400 to-blue-600',
			accent: 'from-indigo-400 to-purple-500',
			wave: '#3b82f6',
			waveEnd: '#8b5cf6',
			particles: ['bg-blue-400', 'bg-indigo-500', 'bg-cyan-500']
		},
		purple: {
			primary: 'from-purple-400 to-pink-500',
			secondary: 'from-indigo-400 to-purple-600',
			accent: 'from-violet-400 to-purple-500',
			wave: '#8b5cf6',
			waveEnd: '#ec4899',
			particles: ['bg-purple-400', 'bg-pink-500', 'bg-violet-500']
		},
		green: {
			primary: 'from-emerald-400 to-teal-500',
			secondary: 'from-green-400 to-emerald-600',
			accent: 'from-teal-400 to-cyan-500',
			wave: '#10b981',
			waveEnd: '#14b8a6',
			particles: ['bg-emerald-400', 'bg-teal-500', 'bg-green-500']
		},
		orange: {
			primary: 'from-orange-400 to-red-500',
			secondary: 'from-yellow-400 to-orange-600',
			accent: 'from-amber-400 to-orange-500',
			wave: '#f97316',
			waveEnd: '#ef4444',
			particles: ['bg-orange-400', 'bg-red-500', 'bg-amber-500']
		},
		pink: {
			primary: 'from-pink-400 to-rose-500',
			secondary: 'from-purple-400 to-pink-600',
			accent: 'from-rose-400 to-pink-500',
			wave: '#f472b6',
			waveEnd: '#ec4899',
			particles: ['bg-pink-400', 'bg-rose-500', 'bg-purple-400']
		},
		custom: customColors
			? {
					primary: customColors.primary,
					secondary: customColors.secondary,
					accent: customColors.accent,
					wave: customColors.primary.split(' ')[0],
					waveEnd: customColors.secondary.split(' ')[0],
					particles: [customColors.primary, customColors.secondary, customColors.accent]
				}
			: {
					primary: 'from-gray-400 to-gray-500',
					secondary: 'from-slate-400 to-gray-600',
					accent: 'from-zinc-400 to-gray-500',
					wave: '#6b7280',
					waveEnd: '#4b5563',
					particles: ['bg-gray-400', 'bg-slate-500', 'bg-zinc-500']
				}
	};

	// Configuración de tamaños
	const sizeConfig = {
		small: { base: [8, 12, 16], particles: [1, 2] },
		medium: { base: [16, 20, 24, 32], particles: [2, 3] },
		large: { base: [24, 32, 40, 48], particles: [3, 4, 5] }
	};

	// Configuración de velocidad
	const speedConfig = {
		slow: { base: [4, 6, 8], wave: 8 },
		normal: { base: [3, 5, 8], wave: 5 },
		fast: { base: [1, 2, 3], wave: 3 }
	};

	// Configuración de densidad (posiciones)
	const densityConfig = {
		sparse: {
			positions: [
				{ top: '10%', right: '10%' },
				{ bottom: '20%', left: '15%' },
				{ top: '60%', right: '20%' }
			]
		},
		normal: {
			positions: [
				{ top: '15%', right: '15%' },
				{ top: '25%', left: '10%' },
				{ bottom: '30%', right: '20%' },
				{ top: '50%', right: '25%' },
				{ bottom: '25%', left: '30%' }
			]
		},
		dense: {
			positions: [
				{ top: '10%', right: '10%' },
				{ top: '20%', left: '5%' },
				{ bottom: '25%', right: '15%' },
				{ top: '45%', right: '20%' },
				{ bottom: '20%', left: '25%' },
				{ top: '70%', left: '10%' },
				{ bottom: '50%', right: '30%' }
			]
		}
	};

	// function generateShapes() {
	// 	const colors = colorSchemes[colorScheme];
	// 	const sizes = sizeConfig[shapeSize];
	// 	const speeds = speedConfig[animationSpeed];
	// 	const positions = densityConfig[density].positions;

	// 	const shapeTypes: ('circle' | 'square' | 'oval')[] = ['circle', 'square', 'oval'];
	// 	const animations = ['animate-pulse', 'animate-bounce', 'animate-spin'];
	// 	const gradients = [colors.primary, colors.secondary, colors.accent];

	// 	const generatedShapes: FloatingShape[] = [];

	// 	for (let i = 0; i < Math.min(shapeCount, positions.length); i++) {
	// 		const position = positions[i];
	// 		const shapeType = shapeTypes[i % shapeTypes.length];
	// 		const size = sizes.base[Math.floor(Math.random() * sizes.base.length)];

	// 		generatedShapes.push({
	// 			id: i,
	// 			type: shapeType,
	// 			size: `h-${size} w-${size}`,
	// 			position,
	// 			gradient: `bg-gradient-to-br ${gradients[i % gradients.length]}/${Math.floor(opacity * 100)}`,
	// 			animation: animations[i % animations.length],
	// 			duration: `${speeds.base[i % speeds.base.length]}s`,
	// 			delay: i > 0 ? `${i * 0.5}s` : undefined,
	// 			rotation: shapeType === 'square' && i % 2 === 0 ? 'rotate-45' : undefined
	// 		});
	// 	}

	// 	shapes = generatedShapes;
	// }

	function generateShapes() {
		const colors = colorSchemes[colorScheme];
		const sizes = sizeConfig[shapeSize];
		const speeds = speedConfig[animationSpeed];
		const positions = densityConfig[density].positions;

		const shapeTypes: ('circle' | 'square' | 'oval')[] = ['circle', 'square', 'oval'];
		const animations = ['animate-pulse', 'animate-bounce', 'animate-spin'];
		const gradients = [colors.primary, colors.secondary, colors.accent];

		const generatedShapes: FloatingShape[] = [];

		for (let i = 0; i < Math.min(shapeCount, positions.length); i++) {
			const position = positions[i];
			const shapeType = shapeTypes[i % shapeTypes.length];

			// Tamaño dinámico en vw (entre 4vw y 8vw aprox.)
			const randomSizeVW = (Math.random() * 4 + 4).toFixed(2); // 4vw - 8vw
			const size = `width: ${randomSizeVW}vw; height: ${randomSizeVW}vw;`;

			generatedShapes.push({
				id: i,
				type: shapeType,
				size,
				position,
				gradient: `bg-gradient-to-br ${gradients[i % gradients.length]}/${Math.floor(opacityGradient * 100)}`,
				animation: animations[i % animations.length],
				duration: `${speeds.base[i % speeds.base.length]}s`,
				delay: i > 0 ? `${i * 0.5}s` : undefined,
				rotation: shapeType === 'square' && i % 2 === 0 ? 'rotate-45' : undefined
			});
		}

		shapes = generatedShapes;
	}

	// function generateParticles() {
	// 	const colors = colorSchemes[colorScheme];
	// 	const sizes = sizeConfig[shapeSize];

	// 	const generatedParticles: FloatingParticle[] = [];
	// 	const particlePositions = [
	// 		{ top: '20%', right: '20%' },
	// 		{ top: '65%', left: '25%' },
	// 		{ bottom: '20%', right: '35%' },
	// 		{ top: '40%', left: '15%' },
	// 		{ bottom: '50%', right: '10%' }
	// 	];

	// 	for (let i = 0; i < Math.min(particleCount, particlePositions.length); i++) {
	// 		const size = sizes.particles[Math.floor(Math.random() * sizes.particles.length)];

	// 		generatedParticles.push({
	// 			id: i,
	// 			size: `h-${size} w-${size}`,
	// 			position: particlePositions[i],
	// 			color: `${colors.particles[i % colors.particles.length]}/${Math.floor(opacity * 100)}`,
	// 			delay: `${i}s`
	// 		});
	// 	}

	// 	particles = generatedParticles;
	// }
	function generateParticles() {
		const colors = colorSchemes[colorScheme];

		const generatedParticles: FloatingParticle[] = [];

		// Posiciones adaptables para densidades altas o bajas
		const particlePositions = [
			{ top: '20%', right: '20%' },
			{ top: '65%', left: '25%' },
			{ bottom: '20%', right: '35%' },
			{ top: '40%', left: '15%' },
			{ bottom: '50%', right: '10%' }
		];

		for (let i = 0; i < Math.min(particleCount, particlePositions.length); i++) {
			// Tamaño responsivo entre 0.8vw y 2vw
			const randomSizeVW = (Math.random() * 1.2 + 0.8).toFixed(2); // 0.8vw - 2vw
			const size = `width: ${randomSizeVW}vw; height: ${randomSizeVW}vw;`;

			generatedParticles.push({
				id: i,
				size,
				position: particlePositions[i],
				color: `${colors.particles[i % colors.particles.length]}/${Math.floor(opacityGradient * 100)}`,
				delay: `${i * 0.5}s`
			});
		}

		particles = generatedParticles;
	}

	onMount(() => {
		gradientId = `gradient-${Math.random().toString(36).substring(2, 9)}`;

		if (enableShapes) generateShapes();
		if (enableParticles) generateParticles();
	});

	const colors = colorSchemes[colorScheme];
	const waveSpeed = speedConfig[animationSpeed].wave;
</script>

<div class="absolute inset-0 z-0 overflow-hidden {className}" aria-hidden="true">
	<!-- Formas flotantes -->
	{#if enableShapes}
		{#each shapes as shape (shape.id)}
			<div
				class="absolute {shape.animation} {shape.gradient} {shape.rotation} origin-center transition-transform duration-700"
				class:rounded-full={shape.type === 'circle' || shape.type === 'oval'}
				class:rounded-lg={shape.type === 'square'}
				style="
	{shape.size}
	{shape.position.top ? `top: ${shape.position.top};` : ''}
	{shape.position.bottom ? `bottom: ${shape.position.bottom};` : ''}
	{shape.position.left ? `left: ${shape.position.left};` : ''}
	{shape.position.right ? `right: ${shape.position.right};` : ''}
	animation-duration: {shape.duration};
	{shape.delay ? `animation-delay: ${shape.delay};` : ''}
	{shape.type === 'oval' ? `border-radius: 50% 30% 50% 30%;` : ''}
	opacity: {opacityShape}
"
			></div>
		{/each}
	{/if}

	<!-- Ondas animadas -->
	{#if enableWaves}
		<svg
			class="absolute top-1/3 left-0 h-32 w-full"
			style="opacity: {opacityGradient}"
			viewBox="0 0 400 100"
			preserveAspectRatio="none"
		>
			<path
				d="M0,50 Q100,20 200,50 T400,50"
				stroke="url(#{gradientId})"
				stroke-width="2"
				fill="none"
			>
				<animate
					attributeName="d"
					dur="{waveSpeed}s"
					repeatCount="indefinite"
					values="M0,50 Q100,20 200,50 T400,50;M0,50 Q100,80 200,50 T400,50;M0,50 Q100,20 200,50 T400,50"
				/>
			</path>
			<defs>
				<linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
					<stop offset="0%" style="stop-color:{colors.wave};stop-opacity:{opacityGradient}" />
					<stop
						offset="100%"
						style="stop-color:{colors.waveEnd};stop-opacity:{opacityGradient * 0.3}"
					/>
				</linearGradient>
			</defs>
		</svg>
	{/if}

	<!-- Partículas flotantes -->
	{#if enableParticles}
		{#each particles as particle (particle.id)}
			<div
				class="absolute animate-[wiggle_1s_ease-in-out_infinite] {particle.color} transition-opacity duration-500"
				style="
			{particle.size}
			{particle.position.top ? `top: ${particle.position.top};` : ''}
			{particle.position.bottom ? `bottom: ${particle.position.bottom};` : ''}
			{particle.position.left ? `left: ${particle.position.left};` : ''}
			{particle.position.right ? `right: ${particle.position.right};` : ''}
			animation-delay: {particle.delay};
		"
			></div>
		{/each}
	{/if}
</div>

<!-- Configuración básica azul
<FloatingShapes />

Esquema de colores púrpura con más elementos
<FloatingShapes 
	colorScheme="purple" 
	shapeCount={7} 
	particleCount={5}
	density="dense"
/>

Colores personalizados 
<FloatingShapes 
	colorScheme="custom"
	customColors={{
		primary: "from-emerald-400 to-teal-500",
		secondary: "from-green-400 to-emerald-600", 
		accent: "from-teal-400 to-cyan-500"
	}}
/>

Solo partículas, sin formas ni ondas
<FloatingShapes 
	enableShapes={false}
	enableWaves={false}
	particleCount={8}
	animationSpeed="fast"
/>

Para un hero section
<FloatingShapes 
	colorScheme="blue"
	opacity={0.2}
	shapeSize="large"
	animationSpeed="slow"
	class="pointer-events-none"
/>
-->
