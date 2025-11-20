<script>
	import { redirect } from '$lib/utils/redirect';
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<button
	onclick={() => {
		redirect('/auth/sign-in');
	}}>Click me</button
>

<div>
	<iframe src="https://vizta.link/" frameborder="0" class="h-[500px] w-[500px]" title=""></iframe>
</div>
