<script>
	//+page.svelte
	import Chat from './chat.svelte';
</script>

<div class="h-full w-full">
	<Chat />
</div>

<style>
	:global(body, html) {
		margin: 0;
		padding: 0;
		height: 100%;
		width: 100%;
		/* Ocultamos el overflow aquí para que el único scroll sea el del chat */
		overflow: hidden;
	}
</style>
