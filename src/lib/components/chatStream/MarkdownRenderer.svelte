<script lang="ts">
	import { onMount } from 'svelte';
	import { marked } from 'marked';

	let htmlContent = '';

	export let markdownText = '';

	onMount(() => {
		marked.setOptions({
			breaks: true,
			gfm: true
		});

		htmlContent = marked(markdownText);

		// htmlContent = htmlContent
		// 	.replace(/<p><\/p>/g, '')
		// 	.replace(/<p>(\s*)<\/p>/g, '')
		// 	.replace(/(<\/ul>)\s*(<p>)/g, '$1$2')
		// 	.replace(/(<\/p>)\s*(<ul>)/g, '$1$2')
		// 	.replace(/(<\/h[1-6]>)\s*(<p>)/g, '$1$2')
		// 	.replace(/(<\/p>)\s*(<h[1-6]>)/g, '$1$2');

		setTimeout(() => {
			const container = document.querySelector('.markdown-content');
			if (container) {
				const listItems = container.querySelectorAll('li');
				listItems.forEach((li) => {
					const text = li.textContent || '';
					const dollarSign = '$';
					const totalAmount = '$253';

					if (text.includes(dollarSign)) {
						if (text.includes(totalAmount)) {
							li.classList.add('total-price');
						} else {
							li.classList.add('price-item');
						}
					}
				});
			}
		}, 0);
	});
</script>

<div>
	<div class="markdown-content prose prose-base max-w-none sm:prose-lg">
		{@html htmlContent}
	</div>
</div>

<style>
	:global(.markdown-content) {
		color: var(--color-light-two);
		line-height: 1.3;
	}

	:global(.markdown-content h1) {
		/* From: @apply mt-0 mb-0 text-2xl font-bold; */
		margin-top: 0;
		margin-bottom: 0;
		font-size: 1.5rem; /* 24px */
		line-height: 2rem; /* 32px */
		font-weight: 700;
	}

	:global(.markdown-content h2) {
		/* From: @apply mt-2 mb-1 text-xl font-semibold; */
		margin-top: 0.5rem; /* 8px */
		margin-bottom: 0.25rem; /* 4px */
		font-size: 1.25rem; /* 20px */
		line-height: 1.75rem; /* 28px */
		font-weight: 600;
	}

	:global(.markdown-content h3) {
		/* From: @apply mt-auto mb-auto text-lg font-semibold text-light-two; */
		margin-top: auto;
		margin-bottom: auto;
		font-size: 1.125rem; /* 18px */
		line-height: 1.75rem; /* 28px */
		font-weight: 600;
		color: var(--color-light-two);
	}

	:global(.markdown-content p) {
		/* From: @apply mt-auto mb-auto; */
		margin-top: auto;
		margin-bottom: auto;
	}

	:global(.markdown-content ul) {
		/* From: @apply mt-0 mb-1 list-inside list-disc; */
		margin-top: 0;
		margin-bottom: 0.25rem; /* 4px */
		list-style-position: inside;
		list-style-type: disc;
	}

	:global(.markdown-content ol) {
		/* From: @apply mt-0 mb-1 list-inside list-decimal; */
		margin-top: 0;
		margin-bottom: 0.25rem; /* 4px */
		list-style-position: inside;
		list-style-type: decimal;
	}

	:global(.markdown-content li) {
		/* From: @apply mb-0 leading-tight; */
		margin-bottom: 0;
		line-height: 1.25;
	}

	:global(.markdown-content strong) {
		/* From: @apply font-semibold text-light-two; */
		font-weight: 600;
		color: var(--color-light-two);
	}

	:global(.markdown-content ul ul) {
		/* From: @apply mt-0 mb-0 ml-0; */
		margin-top: 0;
		margin-bottom: 0;
		margin-left: 0;
	}

	:global(.markdown-content li ul li) {
		/* From: @apply text-sm leading-tight; */
		font-size: 0.875rem; /* 14px */
		line-height: 1.25;
	}

	:global(.markdown-content li.price-item) {
		/* From: @apply mt-auto mb-auto rounded border-l-4 border-blue-400 bg-blue-50 p-1; */
		margin-top: auto;
		margin-bottom: auto;
		padding: 0.25rem; /* 4px */
		background-color: #eff6ff; /* bg-blue-50 */
		border-left-width: 4px;
		border-left-color: #60a5fa; /* border-blue-400 */
		border-radius: 0.25rem; /* 4px */
	}

	:global(.markdown-content li.total-price) {
		/* From: @apply mt-auto mb-auto rounded border-l-4 border-green-500 bg-green-100 p-1.5 font-semibold; */
		margin-top: auto;
		margin-bottom: auto;
		padding: 0.375rem; /* 6px */
		font-weight: 600;
		background-color: #dcfce7; /* bg-green-100 */
		border-left-width: 4px;
		border-left-color: #22c55e; /* border-green-500 */
		border-radius: 0.25rem; /* 4px */
	}

	/* Estas reglas ya estaban en CSS nativo y son correctas */
	:global(.markdown-content * + *) {
		margin-top: 0;
	}

	:global(.markdown-content h1:first-child) {
		margin-top: 0;
	}
</style>
