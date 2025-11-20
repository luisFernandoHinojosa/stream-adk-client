<script lang="ts">
	import '../app.css';

	// import favicon from '$lib/assets/favicon.svg';
	import { setContext } from 'svelte';
	import getI18nStore from '../i18n.js';
	setContext('i18n', getI18nStore());
	let { children } = $props();
</script>

<svelte:head>
	<title>Stream sse app</title>
	<!-- <link rel="icon" href={favicon} /> -->
</svelte:head>

{@render children?.()}
