<script lang="ts">
	import type { AgentStep } from './types';

	// Propiedades que el componente recibe desde App.svelte
	export let steps: AgentStep[] = [];
	export let activeStepId: string | null = null;

	// Función para dar estilo de "syntax highlighting" al JSON
	const prettyPrintJson = (json: object) => {
		if (!json) return '';
		const jsonString = JSON.stringify(json, null, 2);
		// Esta expresión regular simple colorea llaves, strings, números y booleanos
		return jsonString.replace(
			/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
			(match) => {
				let cls = 'text-green-400'; // string
				if (/^"/.test(match)) {
					if (/:$/.test(match)) {
						cls = 'text-pink-400'; // key
					}
				} else if (/true|false/.test(match)) {
					cls = 'text-yellow-400'; // boolean
				} else if (/null/.test(match)) {
					cls = 'text-gray-500'; // null
				}
				return `<span class="${cls}">${match}</span>`;
			}
		);
	};

	// Función para obtener los estilos según el tipo de paso
	const getTypeStyles = (type: AgentStep['type']) => {
		switch (type) {
			case 'tool_code':
				return { bg: 'bg-blue-900/50', text: 'text-blue-300', label: 'TOOL CALL' };
			case 'observation':
				return { bg: 'bg-purple-900/50', text: 'text-purple-300', label: 'OBSERVATION' };
			case 'agent_call':
				return { bg: 'bg-teal-900/50', text: 'text-teal-300', label: 'AGENT CALL' };
			case 'final_thought':
				return { bg: 'bg-amber-900/50', text: 'text-amber-300', label: 'FINAL THOUGHT' };
			default:
				return { bg: 'bg-gray-700', text: 'text-gray-300', label: 'UNKNOWN' };
		}
	};
</script>

<div
	class="w-1/3 bg-gray-900/80 backdrop-blur-sm text-white p-4 overflow-y-auto rounded-l-2xl border-r border-gray-700 h-full"
>
	<h2 class="text-lg font-bold text-gray-300 mb-4 font-mono tracking-wider">PROCESO DEL AGENTE</h2>
	<div class="space-y-4">
		{#if steps.length === 0}
			<div class="text-center text-gray-500 pt-10">
				<p>Esperando interacción...</p>
				<p class="text-sm mt-2">Los pasos internos del agente aparecerán aquí.</p>
			</div>
		{:else}
			{#each steps as step (step.id)}
				{@const isActive = step.id === activeStepId}
				{@const typeStyles = getTypeStyles(step.type)}
				<div
					class:border-yellow-400={isActive}
					class:shadow-lg={isActive}
					class:shadow-yellow-500={isActive}
					class="transition-all duration-300 rounded-lg border border-gray-700/50 {typeStyles.bg}"
				>
					<div
						class="px-4 py-2 rounded-t-lg font-mono text-xs font-bold tracking-widest border-b {typeStyles.text}"
						class:border-yellow-400={isActive}
						class:border-gray-700={!isActive}
					>
						{typeStyles.label}
					</div>
					<pre class="p-4 text-xs font-mono overflow-x-auto">
            <code>{@html prettyPrintJson(step.content)}</code>
          </pre>
				</div>
			{/each}
		{/if}
	</div>
</div>
