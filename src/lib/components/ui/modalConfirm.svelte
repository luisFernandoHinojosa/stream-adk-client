<script lang="ts">
	import XIcon from '$lib/icons/outline/xIcon.svelte';
	import AlertTriangleIcon from '$lib/icons/solid/alertTriangleIcon.svelte';
	import BlurOverlay from './blurOverlay.svelte';
	import Button from './button.svelte';
	import Subheading from './subheading.svelte';

	interface Props {
		isOpen: boolean;
		message: string;
		onConfirm: () => void;
		onCancel: () => void;
		loading?: boolean;
	}

	let { isOpen, message, onConfirm, onCancel, loading = false }: Props = $props();
</script>

{#if isOpen}
	<div
		class="relative z-50"
		onclick={(event) => {
			console.log('entre a cancel');
			event.stopPropagation();
			onCancel();
		}}
	>
		<BlurOverlay class="overflow-y-auto rounded-md">
			<div
				class="bg-light-one grelative mt-auto transform overflow-hidden rounded-lg px-4 pt-5 text-left shadow-xl transition-all sm:w-full sm:max-w-lg sm:p-6"
			>
				<div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
					<Button type="button" variant="ghost" onclick={() => onCancel()}>
						<XIcon />
					</Button>
				</div>
				<div class="sm:flex sm:items-start">
					<div
						class="bg-light-one dark:bg-dark-one text-light-three dark:text-dark-three mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10"
					>
						<AlertTriangleIcon />
					</div>
					<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
						<Subheading level="h2">Confirmar acción</Subheading>
						<div class="mt-2">
							<p class="mt-4 text-center">{message}</p>
						</div>
					</div>
				</div>
				<div class="mt-5 flex flex-col justify-end gap-4 sm:mt-4 sm:flex-row">
					<Button type="button" onclick={() => onConfirm()} {loading} variant="primary"
						>Confirmar</Button
					>
					<Button type="button" onclick={() => onCancel()} variant="secondary">Cancelar</Button>
				</div>
			</div>
		</BlurOverlay>
	</div>
{/if}
