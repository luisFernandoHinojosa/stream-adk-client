<script lang="ts">
	import { Button } from '$lib/components';
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
	<div class="w-full max-w-md space-y-8 text-center">
		<div>
			<h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Acceso Denegado</h2>
			<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
				No tienes permiso para acceder a esta página.
			</p>
		</div>

		<div class="space-y-4">
			<Button variant="outline" onclick={() => history.back()} fullWidth>Regresar</Button>
		</div>
	</div>
</div>
