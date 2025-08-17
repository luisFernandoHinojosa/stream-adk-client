<script lang="ts">
	export let searchQuery: string = '';
</script>

<div class="relative">
	<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
		<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
			/>
		</svg>
	</div>
	<input
		type="text"
		bind:value={searchQuery}
		placeholder="Buscar usuarios por nombre o email..."
		class="block w-full rounded-lg border border-gray-300 bg-white py-3 pr-3 pl-10 text-sm leading-5 placeholder-gray-500 focus:border-indigo-500 focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
	/>
	{#if searchQuery}
		<button
			type="button"
			class="absolute inset-y-0 right-0 flex items-center pr-3"
			on:click={() => (searchQuery = '')}
		>
			<svg
				class="h-5 w-5 text-gray-400 hover:text-gray-600"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
	{/if}
</div>
