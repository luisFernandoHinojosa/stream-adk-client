<!-- <script lang="ts">
	import { XIcon } from "$lib/icons/outline";
	import { ExclamationCircleIcon } from "$lib/icons/solid";
	import { Button, ImageUploader, Input, Subheading } from "../ui";
</script>

<div
	class="bg-light-one_d relative inline-block transform overflow-hidden rounded-lg text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
>
	<div class="absolute top-0 right-0">
		<Button type="button" variant="ghost" onclick={closeCreateModal}>
			<XIcon class="text-light-two hover:text-light-two_d h-6 w-6" />
		</Button>
	</div>

	<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
		<div class="sm:flex sm:items-start">
			<div class="mt-3 w-full text-center sm:mt-0 sm:text-left">
				<Subheading level="h3">Crear nueva tienda</Subheading>
				<p class="text-light-two_d mt-1 text-sm">
					Completa la información para crear tu tienda. Podrás editar estos datos más adelante.
				</p>

				{#if createStoreError}
					<div class="mt-4 rounded-md bg-red-50 p-4">
						<div class="flex">
							<div class="flex-shrink-0">
								<ExclamationCircleIcon />
							</div>
							<div class="ml-3">
								<p class="text-sm text-red-700">{createStoreError}</p>
							</div>
						</div>
					</div>
				{/if}

				<form class="mt-6 space-y-6">
					<Input
						label="Nombre de la tienda"
						placeholder="Ej: Mi Tienda Online"
						required
						bind:value={newStore.business_name}
					/>
					<Input
						label="Descripción de la tienda"
						placeholder="Ej: Venta de productos artesanales"
						required
						type="textarea"
						bind:value={newStore.business_description}
					/>
					<ImageUploader
						label="Logo de la tienda"
						storageMode="thumbnail"
						thumbnailSize={150}
						quality={0.7}
						returnDataUrl={true}
						callback={(value: any) => (logoPreview = value)}
					/>

					<div class="flex justify-between gap-2">
						<Button type="button" variant="secondary" onclick={closeCreateModal}>Cancelar</Button>
						<Button
							type="button"
							variant="primary"
							loading={isCreatingStore}
							disabled={isCreatingStore}
							onclick={createStore}
						>
							Crear tienda
						</Button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div> -->
