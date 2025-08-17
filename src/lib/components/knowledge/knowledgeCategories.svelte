<script lang="ts">
	import { DotsVerticalIcon } from '$lib/icons/outline';
	import { LayoutGridIcon } from '$lib/icons/solid';
	import type { Knowledge } from '$lib/interface';

	interface Props {
		knowledgeItems: Knowledge[];
	}
	let { knowledgeItems }: Props = $props();

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

	let filteredItems = knowledgeItems;
</script>

<!-- fondo patron -->
{#each filteredItems as item (item.id)}
	{@const typeInfo = getContentTypeInfo(item.content_type)}
	<div
		class="group border-light-four hover:border-light-four/30 hover:shadow-light-three/30 relative overflow-hidden rounded-2xl border p-8 shadow-2xl transition-all duration-500"
	>
		<div class="absolute inset-0 opacity-20 transition-opacity duration-700 group-hover:opacity-40">
			<svg class="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
				<defs>
					<pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
						<path
							d="M 0 5 L 5 5 L 5 0 M 5 10 L 5 15 L 10 15 M 15 5 L 20 5 M 10 10 L 15 10"
							stroke="currentColor"
							stroke-width="0.5"
							fill="none"
							class="text-light-three"
						/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill="url(#circuit)" />
			</svg>
		</div>
		<div class="relative z-10 flex items-start gap-6">
			<div class="relative">
				<div
					class="border-light-three/30 from-light-three/20 to-light-three/20 group-hover:shadow-light-three/50 flex h-16 w-16 items-center justify-center rounded-xl border bg-gradient-to-br shadow-lg transition-all duration-500 group-hover:scale-105"
				>
					<span class="text-2xl">{typeInfo.icon}</span>
				</div>
				<div
					class="from-light-three/50 absolute top-1/2 -right-4 h-px w-8 bg-gradient-to-r to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
				></div>
				<div
					class="from-light-three/50 absolute top-1/2 -right-4 mt-2 h-px w-6 bg-gradient-to-r to-transparent opacity-0 transition-opacity delay-100 duration-700 group-hover:opacity-100"
				></div>
			</div>

			<div class="min-w-0 flex-1">
				<div class="mb-4">
					<h3 class="mb-3 text-2xl font-bold tracking-tight text-white">
						{item.title}
					</h3>
					<div class="flex items-center gap-4">
						<span
							class=" group-hover:border-light-three/50 rounded-lgpx-3 text-light-two py-1 font-mono text-sm transition-all duration-300"
						>
							{typeInfo.label}
						</span>
					</div>
				</div>

				<div class="rounded-xl p-5 backdrop-blur-sm transition-all duration-500">
					<p class="text-light-two_d line-clamp-3 leading-relaxed font-light">{item.content}</p>
				</div>
			</div>
		</div>
	</div>
{/each}

<!-- diseno 3d -->
{#each filteredItems as item (item.id)}
	{@const typeInfo = getContentTypeInfo(item.content_type)}
	<div
		class="group relative rounded-3xl p-8 transition-all duration-700 hover:scale-[1.02]"
		style="background: linear-gradient(145deg, #f0f0f3, #cacace); box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;"
	>
		<div class="relative z-10 flex items-start gap-6">
			<div class="relative">
				<div
					class="flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110"
					style="background: linear-gradient(145deg, #f0f0f3, #cacace); box-shadow: 8px 8px 16px #bebebe, -8px -8px 16px #ffffff;"
				>
					<span class="text-2xl">{typeInfo.icon}</span>
				</div>
			</div>

			<div class="min-w-0 flex-1">
				<div class="mb-4">
					<h3 class="mb-3 text-2xl font-bold tracking-tight text-gray-800">
						{item.title}
					</h3>
					<div class="flex items-center gap-3">
						<span
							class="rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300"
							style="background: linear-gradient(145deg, #f0f0f3, #cacace); box-shadow: 5px 5px 10px #bebebe, -5px -5px 10px #ffffff;"
						>
							{typeInfo.label}
						</span>
					</div>
				</div>

				<div
					class="rounded-2xl p-6 transition-all duration-500"
					style="background: linear-gradient(145deg, #cacace, #f0f0f3); box-shadow: inset 10px 10px 20px #bebebe, inset -10px -10px 20px #ffffff;"
				>
					<p class="line-clamp-3 leading-relaxed text-gray-700">{item.content}</p>
				</div>
			</div>
		</div>

		<div
			class="absolute top-8 right-8 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-60"
			style="background: linear-gradient(145deg, #f0f0f3, #cacace); box-shadow: 3px 3px 6px #bebebe, -3px -3px 6px #ffffff;"
		>
			<DotsVerticalIcon />
		</div>
	</div>
{/each}

<!-- diseno editorial -->
{#each filteredItems as item (item.id)}
	{@const typeInfo = getContentTypeInfo(item.content_type)}
	<div
		class="group relative overflow-hidden border border-gray-200 bg-white transition-all duration-500 hover:shadow-2xl"
	>
		<div class="to-light-three relative h-3 bg-gradient-to-r from-red-500 via-blue-500"></div>

		<div class="p-8">
			<div class="grid grid-cols-12 items-start gap-6">
				<div class="col-span-2">
					<div class="sticky top-0">
						<div
							class="bg-light-two flex aspect-square w-full items-center justify-center rounded-full"
						>
							{typeInfo.icon}
						</div>
					</div>
				</div>

				<div class="col-span-10">
					<div class="mb-6">
						<div class="mb-2 text-xs font-bold tracking-[0.3em] text-gray-500 uppercase">
							{typeInfo.label}
						</div>
						<h3 class="mb-4 text-3xl leading-tight font-light tracking-tight text-black">
							{item.title}
						</h3>
						<div class="mb-6 h-px w-16 bg-black"></div>
					</div>

					<div class="space-y-4">
						<p
							class="text-lg leading-relaxed font-light text-gray-800 first-letter:float-left first-letter:mr-1 first-letter:text-4xl first-letter:leading-none first-letter:font-bold"
						>
							{item.content}
						</p>
					</div>
				</div>
			</div>
		</div>
		<div
			class="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100"
		></div>
	</div>
{/each}

<!-- diseno shapes 1 -->
{#each filteredItems as item (item.id)}
	{@const typeInfo = getContentTypeInfo(item.content_type)}
	<div
		class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-500 hover:shadow-2xl"
	>
		<div class="absolute inset-0 overflow-hidden">
			<div
				class="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-red-400 to-pink-500 opacity-10 transition-all duration-700 group-hover:scale-150 group-hover:opacity-30"
				style="clip-path: polygon(100% 0%, 0% 100%, 100% 100%);"
			></div>

			<div
				class="absolute bottom-0 left-0 h-24 w-24 bg-gradient-to-br from-blue-400 to-purple-500 opacity-15 transition-all duration-500 group-hover:rotate-45 group-hover:opacity-40"
				style="clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);"
			></div>

			<div
				class="absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform bg-gradient-to-br from-green-400 to-cyan-500 opacity-10 transition-all duration-300 group-hover:scale-125 group-hover:opacity-25"
				style="clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);"
			></div>
		</div>

		<div class="relative z-10 p-8">
			<div class="flex items-start gap-6">
				<div class="relative">
					<div
						class="flex h-16 w-16 items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-lg transition-all duration-500"
						style="clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);"
					>
						<span class="text-2xl">{typeInfo.icon}</span>
					</div>
				</div>

				<div class="min-w-0 flex-1">
					<h3 class="mb-3 text-2xl font-bold text-gray-900">
						{item.title}
					</h3>

					<div class="mb-4">
						<span
							class=" text-light-two inline-block bg-gradient-to-r px-4 py-2 text-sm font-medium transition-all duration-300"
							style="clip-path: polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%);"
						>
							{typeInfo.label}
						</span>
					</div>

					<div
						class="relative bg-gray-50 p-6 transition-colors duration-300 group-hover:bg-indigo-50"
						style="clip-path: polygon(0% 0%, 95% 0%, 100% 10%, 100% 100%, 5% 100%, 0% 90%);"
					>
						<p class="line-clamp-3 leading-relaxed text-gray-700">{item.content}</p>

						<div
							class="absolute top-2 right-2 h-3 w-3 bg-indigo-400 opacity-50"
							style="clip-path: polygon(0% 0%, 100% 0%, 100% 100%);"
						></div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/each}

<!-- diseno carta -->
{#each filteredItems as item (item.id)}
	{@const typeInfo = getContentTypeInfo(item.content_type)}
	<div class="group perspective-1000 relative">
		<div
			class="hover:rotateY-12 hover:rotateX-6 relative transform-gpu transition-all duration-700"
		>
			<div class="relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 p-8">
				<div class="absolute inset-0">
					<div
						class="absolute top-0 left-0 h-1/3 w-full bg-gradient-to-br from-indigo-200 to-purple-300 opacity-30 transition-all duration-500 group-hover:opacity-50"
						style="clip-path: polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%);"
					></div>

					<div
						class="absolute top-1/3 left-0 h-1/3 w-full bg-gradient-to-br from-purple-200 to-pink-300 opacity-25 transition-all duration-700 group-hover:opacity-45"
						style="clip-path: polygon(20% 0%, 80% 0%, 90% 100%, 10% 100%);"
					></div>

					<div
						class="absolute bottom-0 left-0 h-1/3 w-full bg-gradient-to-br from-pink-200 to-rose-300 opacity-35 transition-all duration-300 group-hover:opacity-55"
						style="clip-path: polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%);"
					></div>
				</div>

				<div class="pointer-events-none absolute inset-0">
					<div
						class="absolute top-0 left-1/4 h-full w-px bg-gradient-to-b from-white via-gray-300 to-white opacity-50"
					></div>
					<div
						class="absolute top-0 right-1/4 h-full w-px bg-gradient-to-b from-white via-gray-300 to-white opacity-50"
					></div>
					<div
						class="absolute top-1/3 left-0 h-px w-full bg-gradient-to-r from-white via-gray-300 to-white opacity-30"
					></div>
					<div
						class="absolute bottom-1/3 left-0 h-px w-full bg-gradient-to-r from-white via-gray-300 to-white opacity-30"
					></div>
				</div>

				<div class="relative z-10 flex items-start gap-6">
					<div class="relative">
						<div
							class="flex h-16 w-16 items-center justify-center shadow-lg transition-all duration-500 group-hover:border-indigo-300 group-hover:shadow-xl"
						>
							<span class="text-2xl text-gray-800">{typeInfo.icon}</span>
						</div>
						<div
							class="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-20 transition-opacity duration-300 group-hover:opacity-40"
							style="clip-path: polygon(50% 0%, 100% 25%, 50% 50%, 0% 25%);"
						></div>
					</div>

					<div class="min-w-0 flex-1">
						<h3 class="mb-3 text-2xl font-bold tracking-tight text-gray-900">
							{item.title}
						</h3>

						<div
							class="mb-4 inline-block border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-300 group-hover:shadow-md"
							style="clip-path: polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%);"
						>
							{typeInfo.label}
						</div>

						<div
							class="border border-white/50 bg-white/60 p-6 backdrop-blur-sm transition-all duration-500 group-hover:bg-white/80"
							style="clip-path: polygon(0% 0%, 95% 0%, 100% 100%, 5% 100%);"
						>
							<p class="line-clamp-3 leading-relaxed text-gray-700">{item.content}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/each}

<!-- disneo simple -->
{#each filteredItems as item (item.id)}
	{@const typeInfo = getContentTypeInfo(item.content_type)}
	<div class="group relative">
		<div
			class="relative border border-gray-200 bg-white shadow-lg transition-all duration-500 group-hover:shadow-2xl"
			style="clip-path: polygon(0% 0%, 90% 0%, 100% 10%, 100% 100%, 0% 100%);"
		>
			<div class="pointer-events-none absolute inset-0">
				<div
					class="absolute top-0 right-0 h-16 w-16 border-b border-l border-dashed border-gray-300 opacity-30 transition-opacity duration-300 group-hover:opacity-60"
					style="clip-path: polygon(0% 100%, 100% 0%, 100% 100%);"
				></div>
			</div>

			<div
				class="absolute top-0 right-0 h-12 w-12 bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner transition-all duration-300 group-hover:scale-110"
				style="clip-path: polygon(0% 100%, 100% 0%, 100% 100%);"
			></div>

			<div class="p-8 pr-16">
				<div class="flex items-start gap-6">
					<div class="relative">
						<div
							class="flex h-16 w-16 items-center justify-center bg-gradient-to-br shadow-lg transition-all duration-500 group-hover:scale-105"
						>
							<span class="text-2xl">{typeInfo.icon}</span>
						</div>
					</div>

					<div class="min-w-0 flex-1">
						<h3 class="mb-3 text-2xl font-bold text-gray-900">
							{item.title}
						</h3>

						<div class="mb-4">
							<span
								class="inline-block border-l-4 border-rose-400 bg-gradient-to-r from-rose-100 to-pink-100 px-4 py-2 text-sm font-medium text-rose-700"
							>
								{typeInfo.label}
							</span>
						</div>

						<div
							class="relative border-l-4 border-gray-200 bg-gray-50 p-6 transition-all duration-300 group-hover:border-rose-300 group-hover:bg-rose-50"
							style="clip-path: polygon(0% 0%, 100% 0%, 95% 100%, 0% 100%);"
						>
							<p class="line-clamp-3 leading-relaxed text-gray-700">{item.content}</p>

							<div class="pointer-events-none absolute inset-0 opacity-20">
								<div class="absolute top-4 right-4 left-4 h-px bg-gray-300"></div>
								<div class="absolute top-8 right-8 left-4 h-px bg-gray-300"></div>
								<div class="absolute top-12 right-6 left-4 h-px bg-gray-300"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/each}

<!-- diseno olas mar -->
{#each filteredItems as item (item.id)}
	{@const typeInfo = getContentTypeInfo(item.content_type)}
	<div
		class="group from-light-three via-light-two to-light-three_d relative overflow-hidden rounded-3xl bg-gradient-to-br p-1 transition-all duration-700 hover:scale-105"
	>
		<div class="relative h-full overflow-hidden rounded-3xl bg-white p-8">
			<div class="pointer-events-none absolute inset-0">
				<div
					class="absolute top-4 right-8 h-12 w-12 bg-gradient-to-br from-cyan-200 to-blue-300 opacity-60 transition-all duration-1000 group-hover:scale-150 group-hover:opacity-30"
					style="border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; animation: liquid-float 6s ease-in-out infinite;"
				></div>
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

			<div class="relative z-10 flex items-start gap-6">
				<div class="relative">
					<div
						class="from-light-three to-light-three_d flex h-16 w-16 items-center justify-center bg-gradient-to-br text-white shadow-lg transition-all duration-500 group-hover:scale-110"
						style="border-radius: 50% 50% 50% 50% / 70% 70% 30% 30%;"
					>
						<span class="text-2xl">{typeInfo.icon}</span>
					</div>

					<div
						class="absolute -inset-2 bg-gradient-to-br from-cyan-400 to-blue-500 opacity-0 blur-sm transition-all duration-300 group-hover:opacity-30"
						style="border-radius: 50% 50% 50% 50% / 80% 20% 80% 20%;"
					></div>
				</div>

				<div class="min-w-0 flex-1">
					<h3 class="mb-3 text-2xl font-bold text-gray-900">
						{item.title}
					</h3>

					<div class="mb-4">
						<span
							class="inline-block bg-gradient-to-r from-cyan-100 to-blue-100 px-6 py-2 text-sm font-medium text-cyan-700 transition-all duration-300 group-hover:from-blue-100 group-hover:to-purple-100"
							style="border-radius: 25px 5px 25px 5px;"
						>
							{typeInfo.label}
						</span>
					</div>

					<div
						class="bg-gradient-to-br from-gray-50 to-cyan-50 p-6 transition-all duration-500 group-hover:from-cyan-50 group-hover:to-blue-50"
						style="border-radius: 20px 5px 20px 5px;"
					>
						<p class="line-clamp-3 leading-relaxed text-gray-700">{item.content}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
{/each}

<style>
	@keyframes blob-morph {
		0%,
		100% {
			border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
		}
		25% {
			border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%;
		}
		50% {
			border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
		}
		75% {
			border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%;
		}
	}

	@keyframes blob-morph-inner {
		0%,
		100% {
			border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%;
		}
		25% {
			border-radius: 42% 58% 25% 75% / 24% 54% 46% 76%;
		}
		50% {
			border-radius: 50% 50% 67% 33% / 45% 73% 27% 55%;
		}
		75% {
			border-radius: 67% 33% 42% 58% / 37% 32% 68% 63%;
		}
	}

	@keyframes float-organic {
		0%,
		100% {
			transform: translateY(0px) rotate(0deg);
		}
		50% {
			transform: translateY(-10px) rotate(180deg);
		}
	}

	@keyframes icon-morph {
		0%,
		100% {
			border-radius: 40% 60% 70% 30%;
		}
		50% {
			border-radius: 70% 30% 40% 60%;
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
