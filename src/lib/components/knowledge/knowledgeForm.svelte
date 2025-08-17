<script lang="ts">
	import { SparklesIcon, XIcon } from '$lib/icons/outline';
	import type { Knowledge } from '$lib/interface';
	import { Button, Heading, Input, Text } from '../ui';

	interface Props {
		handleSubmit: (e: Event) => void;
		closeForm: () => void;
		formData: Knowledge;
		editingItem: Knowledge | null;
	}

	let { handleSubmit, closeForm, formData, editingItem }: Props = $props();
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
	<div class="bg-light-one relative w-full max-w-3xl overflow-hidden rounded-2xl shadow-2xl">
		<div class="absolute top-4 right-4">
			<Button variant="ghost" onclick={closeForm}><XIcon /></Button>
		</div>
		<form onsubmit={handleSubmit} class="flex h-full flex-col">
			<div class="border-light-four border-b p-4">
				<div class="flex items-center gap-4">
					<div class="flex h-12 w-12 items-center justify-center rounded-xl">
						<span class="text-2xl"><SparklesIcon /></span>
					</div>
					<div>
						<Heading level="h2">
							{editingItem ? 'Edit Knowledge' : 'New Knowledge'}
						</Heading>
						<Text variant="body-base">
							{editingItem ? 'Update existing information' : 'Add valuable new information'}
						</Text>
					</div>
				</div>
			</div>
			<div class="flex-1 space-y-8 overflow-y-auto p-8">
				<div>
					<Input
						label="Título"
						bind:value={formData.title}
						placeholder="Ej: Política de devoluciones, Producto estrella, etc."
						required
					/>
				</div>

				<div>
					<Input
						label="Contenido"
						bind:value={formData.content}
						placeholder="Describe detalladamente el contenido que el agente debe conocer. Sé específico y claro para mejores resultados."
						required
						rows={10}
						type="textarea"
					></Input>
					<div class="mt-2 flex items-center justify-between">
						<p class="text-sm text-gray-500">
							Caracteres: {formData.content.length}
						</p>
						{#if formData.content.length > 0}
							<div class="flex items-center gap-2 text-sm">
								{#if formData.content.length < 50}
									<span class="text-amber-600">💡 Agrega más detalles</span>
								{:else if formData.content.length < 200}
									<span class="text-emerald-600">✅ Buen contenido</span>
								{:else}
									<span class="text-blue-600">🚀 Contenido detallado</span>
								{/if}
							</div>
						{/if}
					</div>
				</div>
			</div>
			<div class="border-t border-gray-200 bg-gray-50 p-6">
				<div class="flex justify-end gap-4">
					<Button type="button" onclick={closeForm} variant="secondary">Cancelar</Button>
					<Button type="submit" variant="primary">
						{editingItem ? 'Actualizar' : 'Crear'}
					</Button>
				</div>
			</div>
		</form>
	</div>
</div>
