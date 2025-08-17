<script lang="ts">
	import type { Knowledge } from '$lib/interface';
	import { KnowledgeCard } from '.';

	interface Props {
		knowledgeItems: Knowledge[];
		design: number;
	}

	let { knowledgeItems, design }: Props = $props();
</script>

<!-- <div class="relative"> -->
<div class="relative z-10">
	<div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
		{#each knowledgeItems as knowledge, index (knowledge.id)}
			<div
				class="transform transition-transform duration-500"
				style="animation-delay: {index * 0.1}s;"
			>
				<KnowledgeCard {knowledge} {design} {index} />
			</div>
		{/each}
	</div>
</div>
<!-- </div> -->
