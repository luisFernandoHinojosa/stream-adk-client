<script lang="ts">
	import {
		BrushIcon,
		CoffeeIcon,
		DeviceLaptopIcon,
		FlowerIcon,
		Gamepad2Icon,
		HammerIcon,
		LeafIcon,
		MusicIcon,
		PlaneIcon,
		ScissorsIcon,
		ShoppingCartIcon,
		StopwatchIcon,
		ToolsKitchen3Icon,
		WreckingBallIcon
	} from '$lib/icons/outline';
	import {
		BookIcon,
		BriefcaseIcon,
		CalendarIcon,
		CameraIcon,
		CampFireIcon,
		CarIcon,
		GiftIcon,
		HeadphonesIcon,
		HeartIcon,
		HomeIcon,
		PaletteIcon,
		PizzaIcon,
		ShirtIcon,
		StethoscopeIcon,
		TruckIcon,
		UmbrellaIcon
	} from '$lib/icons/solid';
	import { onMount } from 'svelte';

	interface Props {
		// Posición de origen de los iconos
		position?:
			| 'top'
			| 'bottom'
			| 'left'
			| 'right'
			| 'top-left'
			| 'top-right'
			| 'bottom-left'
			| 'bottom-right';
		// Duración base de la animación en segundos
		duration?: number;
		// Velocidad de la animación (multiplica la duración base)
		speed?: number;
		// Número de iconos a mostrar
		iconCount?: number;
		// Tamaño de los iconos (px)
		iconSize?: number;
		// Rango de variación del tamaño ([min, max])
		iconSizeRange?: [number, number];
		// Clases CSS para los iconos
		iconClass?: string;
		// Clase CSS general del componente
		class?: string;
		// Opacidad de los iconos
		opacity?: number;
		// Habilitar rotación durante la animación
		enableRotation?: boolean;
		// Habilitar deriva lateral (movimiento horizontal)
		enableDrift?: boolean;
		// Intensidad de la deriva (0-1)
		driftIntensity?: number;
	}

	const {
		position = 'top',
		duration = 15,
		speed = 1,
		iconCount = 40,
		iconSize = 32,
		iconSizeRange,
		iconClass = '',
		class: className = '',
		opacity = 0.5,
		enableRotation = true,
		enableDrift = true,
		driftIntensity = 0.3
	}: Props = $props();

	const allMyIconComponents = [
		ShoppingCartIcon,
		CoffeeIcon,
		ToolsKitchen3Icon,
		ShirtIcon,
		BookIcon,
		HammerIcon,
		CameraIcon,
		MusicIcon,
		CarIcon,
		HeartIcon,
		HomeIcon,
		ScissorsIcon,
		DeviceLaptopIcon,
		UmbrellaIcon,
		PaletteIcon,
		StethoscopeIcon,
		CampFireIcon,
		WreckingBallIcon,
		PlaneIcon,
		PizzaIcon,
		LeafIcon,
		Gamepad2Icon,
		BriefcaseIcon,
		GiftIcon,
		HeadphonesIcon,
		StopwatchIcon,
		FlowerIcon,
		CalendarIcon,
		TruckIcon,
		BrushIcon
	];

	type AnimatedIcon = {
		id: number;
		component: any;
		left: number;
		startY: number;
		endY: number;
		driftX: number;
		duration: number;
		delay: number;
		size: number;
		rotation: number;
	};

	let iconsToRender: AnimatedIcon[] = $state([]);

	// Función para obtener posiciones según la dirección
	function getPositionCoordinates(pos: string) {
		const coords = {
			left: 0,
			startY: 0,
			endY: 0,
			driftX: 0
		};

		const randomLeft = Math.random() * 100;
		const driftAmount = enableDrift ? (Math.random() - 0.5) * 40 * driftIntensity : 0;

		switch (pos) {
			case 'top':
				coords.left = randomLeft;
				coords.startY = -10;
				coords.endY = 110;
				coords.driftX = driftAmount;
				break;
			case 'bottom':
				coords.left = randomLeft;
				coords.startY = 110;
				coords.endY = -10;
				coords.driftX = driftAmount;
				break;
			case 'left':
				coords.left = -10;
				coords.startY = Math.random() * 100;
				coords.endY = coords.startY + (Math.random() - 0.5) * 20;
				coords.driftX = 120; // Se mueve hacia la derecha
				break;
			case 'right':
				coords.left = 110;
				coords.startY = Math.random() * 100;
				coords.endY = coords.startY + (Math.random() - 0.5) * 20;
				coords.driftX = -120; // Se mueve hacia la izquierda
				break;
			case 'top-left':
				coords.left = -10 + Math.random() * 20;
				coords.startY = -10;
				coords.endY = 110;
				coords.driftX = Math.random() * 60 + 40;
				break;
			case 'top-right':
				coords.left = 90 + Math.random() * 20;
				coords.startY = -10;
				coords.endY = 110;
				coords.driftX = -(Math.random() * 60 + 40);
				break;
			case 'bottom-left':
				coords.left = -10 + Math.random() * 20;
				coords.startY = 110;
				coords.endY = -10;
				coords.driftX = Math.random() * 60 + 40;
				break;
			case 'bottom-right':
				coords.left = 90 + Math.random() * 20;
				coords.startY = 110;
				coords.endY = -10;
				coords.driftX = -(Math.random() * 60 + 40);
				break;
		}

		return coords;
	}

	onMount(() => {
		const generatedIcons: AnimatedIcon[] = [];
		const actualDuration = duration / speed;

		for (let i = 0; i < iconCount; i++) {
			const coords = getPositionCoordinates(position);
			const finalSize = iconSizeRange
				? Math.random() * (iconSizeRange[1] - iconSizeRange[0]) + iconSizeRange[0]
				: iconSize;

			generatedIcons.push({
				id: i,
				component: allMyIconComponents[i % allMyIconComponents.length],
				left: coords.left,
				startY: coords.startY,
				endY: coords.endY,
				driftX: coords.driftX,
				duration: actualDuration + Math.random() * 5,
				delay: Math.random() * -actualDuration,
				size: finalSize,
				rotation: enableRotation ? 360 : 0
			});
		}

		iconsToRender = generatedIcons;
	});
</script>

<div
	class="pointer-events-none absolute inset-0 z-0 overflow-hidden {className}"
	aria-hidden="true"
>
	<div class="relative h-full w-full">
		{#each iconsToRender as icon (icon.id)}
			<div
				class="icon-wrapper absolute"
				style="
					left: {icon.left}%;
					--start-y: {icon.startY}vh;
					--end-y: {icon.endY}vh;
					--drift-x: {icon.driftX}vw;
					--rotation: {icon.rotation}deg;
					--opacity: {opacity};
					animation-duration: {icon.duration}s;
					animation-delay: {icon.delay}s;
				"
			>
				<icon.component size={icon.size} class={iconClass} />
			</div>
		{/each}
	</div>
</div>

<!-- 
<AnimatedIconBackground position="top" duration={10} iconCount={30} />

Iconos flotando desde la izquierda con tamaño variable 
<AnimatedIconBackground 
	position="left" 
	iconSizeRange={[20, 60]}
	iconClass="text-blue-500"
	speed={2}
/>

Iconos diagonales sin rotación 
<AnimatedIconBackground 
	position="top-left"
	enableRotation={false}
	opacity={0.3}
	containerClass="blur-sm"
/>

 Para fondo de hero section 
<AnimatedIconBackground 
	position="top"
	duration={20}
	iconCount={50}
	iconSizeRange={[16, 48]}
	iconClass="text-purple-400/30"
	class="pointer-events-none"
	enableDrift={true}
	driftIntensity={0.5}
/> -->

<style>
	@keyframes float-animation {
		0% {
			transform: translateY(var(--start-y)) translateX(0) rotate(0deg);
			opacity: 0;
		}
		10% {
			opacity: var(--opacity);
		}
		20% {
			transform: translateY(calc(var(--start-y) + (var(--end-y) - var(--start-y)) * 0.2))
				translateX(calc(var(--drift-x) * 0.3)) rotate(calc(var(--rotation) * 0.2));
		}
		40% {
			transform: translateY(calc(var(--start-y) + (var(--end-y) - var(--start-y)) * 0.4))
				translateX(calc(var(--drift-x) * 0.6)) rotate(calc(var(--rotation) * 0.4));
		}
		60% {
			transform: translateY(calc(var(--start-y) + (var(--end-y) - var(--start-y)) * 0.6))
				translateX(calc(var(--drift-x) * 0.8)) rotate(calc(var(--rotation) * 0.6));
		}
		80% {
			transform: translateY(calc(var(--start-y) + (var(--end-y) - var(--start-y)) * 0.8))
				translateX(calc(var(--drift-x) * 0.9)) rotate(calc(var(--rotation) * 0.8));
		}
		90% {
			opacity: var(--opacity);
		}
		100% {
			transform: translateY(var(--end-y)) translateX(var(--drift-x)) rotate(var(--rotation));
			opacity: 0;
		}
	}

	.icon-wrapper {
		top: 0;
		animation-name: float-animation;
		animation-timing-function: ease-in-out;
		animation-iteration-count: infinite;
		animation-fill-mode: both;
	}
</style>
