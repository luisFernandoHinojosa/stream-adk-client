<script lang="ts">
	// knowledgeCard.svelte
	import type { Knowledge } from '$lib/interface';

	let { knowledge, design, index }: { knowledge: Knowledge; design: number; index?: number } =
		$props();
	const contentTypes = [
		{
			value: 'text',
			label: 'Texto General',
			icon: '📄',
			color: 'text-slate-600 bg-slate-50 border-slate-200'
		},
		{
			value: 'faq',
			label: 'FAQ',
			icon: '❓',
			color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
		},
		{
			value: 'policy',
			label: 'Política',
			icon: '📋',
			color: 'text-amber-600 bg-amber-50 border-amber-200'
		},
		{
			value: 'product',
			label: 'Producto',
			icon: '🛍️',
			color: 'text-purple-600 bg-purple-50 border-purple-200'
		},
		{
			value: 'service',
			label: 'Servicio',
			icon: '🔧',
			color: 'text-blue-600 bg-blue-50 border-blue-200'
		}
	];
	function getContentTypeInfo(type: string) {
		return contentTypes.find((ct) => ct.value === type) || contentTypes[0];
	}

	const typeInfo = getContentTypeInfo(knowledge.content_type);

	const floatDelay = index ? index * 0.5 : 0;
	const floatDuration = 3 + (index ? index % 3 : 0);
</script>

<article
	class="group relative flex bg-gradient-to-br {typeInfo.color} rounded-3xl shadow-xl backdrop-blur-xl {typeInfo.color} overflow-hidden transition-all duration-700 hover:-translate-y-4 hover:shadow-xl"
	style="animation: float {floatDuration}s ease-in-out infinite; animation-delay: {floatDelay}s;"
>
	<!-- Efectos de cristal -->
	<div class="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent"></div>
	<div class="absolute top-0 left-0 h-1 w-full bg-gradient-to-r {typeInfo.color}"></div>
	<div class="relative z-10 flex h-full flex-col p-6">
		<!-- Header con orbe -->
		<div class="pointer-events-none absolute inset-0">
			<!-- <div
				class="absolute top-4 right-8 h-12 w-12 bg-gradient-to-br from-cyan-200 to-blue-300 opacity-60 transition-all duration-1000 group-hover:scale-150 group-hover:opacity-30"
				style="border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; animation: liquid-float 6s ease-in-out infinite;"
			></div> -->
			<div
				class="absolute bottom-8 left-6 h-8 w-8 bg-gradient-to-br from-purple-200 to-pink-300 opacity-40 transition-all duration-1200 group-hover:scale-125"
				style="border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%; animation: liquid-float 4s ease-in-out infinite reverse;"
			></div>
			<div
				class="absolute top-1/2 left-1/3 h-6 w-6 bg-gradient-to-br from-blue-200 to-cyan-300 opacity-50 transition-all duration-800 group-hover:scale-110"
				style="border-radius: 50% 50% 50% 50% / 70% 30% 70% 30%; animation: liquid-float 5s ease-in-out infinite;"
			></div>
		</div>
		<div
			class="absolute bottom-0 left-0 h-16 w-full opacity-10 transition-opacity duration-500 group-hover:opacity-20"
		>
			<svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="h-full w-full">
				<path
					d="M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z"
					fill="currentColor"
					class="text-blue-400"
				>
					<animate
						attributeName="d"
						dur="4s"
						repeatCount="indefinite"
						values="M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z;
			M0,40 C150,80 350,20 600,40 C850,60 1050,100 1200,40 L1200,120 L0,120 Z;
			M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z"
					/>
				</path>
			</svg>
		</div>
		<div class="mb-4 flex items-center gap-4">
			<div class="relative">
				<div
					class="from-light-three/30 to-light-three_d/30 flex h-16 w-16 items-center justify-center bg-gradient-to-br text-white shadow-lg transition-all duration-500 group-hover:scale-110"
					style="border-radius: 50% 50% 50% 50% / 70% 70% 30% 30%;"
				>
					<span class="text-2xl">{typeInfo.icon}</span>
				</div>
				<!-- nuevo -->
				<div
					class="absolute -inset-2 bg-gradient-to-br from-cyan-400 to-blue-500 opacity-0 blur-sm transition-all duration-300 group-hover:opacity-30"
					style="border-radius: 50% 50% 50% 50% / 80% 20% 80% 20%;"
				></div>
				<!-- hasta aqui -->
			</div>
			<div class="flex-1">
				<!-- <span
					class="inline-block rounded-full bg-white/30 px-3 py-1 text-sm font-medium text-gray-700 backdrop-blur-sm"
				>
					{typeInfo.label}
				</span> -->
				<span
					class="inline-block bg-gradient-to-r from-cyan-100 to-blue-100 px-6 py-2 text-sm font-medium text-cyan-700 transition-all duration-300 group-hover:from-blue-100 group-hover:to-purple-100"
					style="border-radius: 25px 5px 25px 5px;"
				>
					{typeInfo.label}
				</span>
			</div>
		</div>

		<!-- Título -->
		<h3
			class="mb-3 line-clamp-2 text-lg leading-tight font-bold text-gray-900 transition-colors group-hover:text-gray-700"
		>
			{knowledge.title}
		</h3>

		<!-- Contenido -->
		<!-- <div class="flex-1 overflow-hidden">
			<p class="line-clamp-4 text-sm leading-relaxed text-gray-600">
				{knowledge.content}
			</p>
		</div> -->
		<div
			class="bg-gradient-to-br from-gray-50 to-cyan-50 p-6 transition-all duration-500 group-hover:from-cyan-50 group-hover:to-blue-50"
			style="border-radius: 20px 5px 20px 5px;"
		>
			<p class="line-clamp-3 leading-relaxed text-gray-700">{knowledge.content}</p>
		</div>

		<!-- Footer con indicadores -->
		<!-- <div class="mt-4 flex items-center justify-between border-t border-white/30 pt-4">
			<div class="flex gap-2">
				{#each Array(3) as _, i}
					<div class="h-2 w-2 bg-gradient-to-r {typeInfo.color} rounded-full opacity-60"></div>
				{/each}
			</div>
			<div class="rounded-full bg-white/20 px-2 py-1 text-xs text-gray-500">
				KB-{index ? index + 1 : 1}
			</div>
		</div> -->
	</div>

	<!-- Efecto de hover glassmorphism -->
	<div
		class="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
	></div>
</article>

<style>
	@keyframes float {
		0%,
		100% {
			transform: translateY(0px) rotate(0deg);
		}
		25% {
			transform: translateY(-10px) rotate(0.5deg);
		}
		50% {
			transform: translateY(-5px) rotate(0deg);
		}
		75% {
			transform: translateY(-15px) rotate(-0.5deg);
		}
	}

	@keyframes liquid-float {
		0%,
		100% {
			transform: translateY(0px) scale(1);
		}
		50% {
			transform: translateY(-8px) scale(1.1);
		}
	}
</style>
