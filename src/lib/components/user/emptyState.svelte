<script lang="ts">
	export let searchQuery: string = '';
</script>

<div class="py-12 text-center">
	<div class="mx-auto mb-4 h-24 w-24 text-gray-300">
		{#if searchQuery}
			<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="h-full w-full">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.5"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
		{:else}
			<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="h-full w-full">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.5"
					d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
				/>
			</svg>
		{/if}
	</div>

	<h3 class="mb-2 text-lg font-medium text-gray-900">
		{#if searchQuery}
			No se encontraron usuarios
		{:else}
			No hay usuarios disponibles
		{/if}
	</h3>

	<p class="mx-auto max-w-md text-gray-500">
		{#if searchQuery}
			No encontramos usuarios que coincidan con tu búsqueda. Intenta con otros términos.
		{:else}
			Parece que aún no hay usuarios registrados en el sistema.
		{/if}
	</p>

	{#if searchQuery}
		<button
			type="button"
			class="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
			on:click={() => (searchQuery = '')}
		>
			Limpiar búsqueda
		</button>
	{/if}
</div>
