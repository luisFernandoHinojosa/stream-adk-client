<script lang="ts">
	import { Button } from '$lib/components';
	import PermissionGuard from '$lib/components/auth/permissionGuard.svelte';
	import LoadingState from '$lib/components/user/loadingState.svelte';
	import UsersList from '$lib/components/user/usersList.svelte';
	import { Permission } from '$lib/config/permissions';
	import PlusIcon from '$lib/icons/outline/plusIcon.svelte';
	import type { RoleUpdatePayload, User, UserRequest } from '$lib/interface';
	import { userService } from '$lib/services';
	import { userStore } from '$lib/stores/userStore';
	import { RoleValidator } from '$lib/utils/roleUtils';
	import { onMount } from 'svelte';

	// Interfaces para el formulario
	interface CreateUserPayload {
		user_name: string;
		user_email: string;
		role_id: number;
		password: string;
	}

	interface FormData {
		user_name: string;
		user_email: string;
		role_id: number;
		password: string;
		confirmPassword: string;
	}

	let users: User[];
	let isLoading = false;
	let error: string | null = null;

	// Estados del modal
	let showModal = false;
	let isCreatingUser = false;
	let createError: string | null = null;

	// Datos del formulario
	let formData: FormData = {
		user_name: '',
		user_email: '',
		role_id: 1,
		password: '',
		confirmPassword: ''
	};

	// Validaciones
	let formErrors: Partial<FormData> = {};

	onMount(async () => {
		await getAllUsers();
	});

	const getAllUsers = async () => {
		try {
			isLoading = true;
			const usersResponse = await userService.getUsers();
			users = usersResponse;
			console.log(users);
		} catch (error) {
			error = error instanceof Error ? error.message : 'Error desconocido';
			throw error;
		} finally {
			isLoading = false;
		}
	};

	const updateUserRole = async (userId: string, newRole: number): Promise<void> => {
		try {
			const currentUser = $userStore;
			const targetUser = users?.find((u) => u.user_id === userId);

			if (!targetUser) {
				throw new Error('Usuario no encontrado');
			}

			if (!RoleValidator.canUpdateUserRole(currentUser, targetUser, newRole)) {
				throw new Error('No tienes permisos para cambiar este rol');
			}
			const payload: RoleUpdatePayload = { role: newRole };
			await userService.updateUserRole(payload, userId);
			users = users?.map((user) =>
				user.user_id === userId ? { ...user, role_id: newRole } : user
			);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error desconocido';
			throw err;
		}
	};

	const createUser = async () => {
		try {
			isCreatingUser = true;
			createError = null;

			const payload: UserRequest = {
				user_name: formData.user_name.trim(),
				user_email: formData.user_email.trim(),
				role_id: formData.role_id,
				password: formData.password
			};

			await userService.createUser(payload);

			// Refrescar la lista de usuarios
			await getAllUsers();

			// Cerrar modal y resetear formulario
			closeModal();
		} catch (err) {
			createError = err instanceof Error ? err.message : 'Error desconocido';
		} finally {
			isCreatingUser = false;
		}
	};

	const openModal = () => {
		showModal = true;
		createError = null;
		formErrors = {};
	};

	const closeModal = () => {
		showModal = false;
		formData = {
			user_name: '',
			user_email: '',
			role_id: 1,
			password: '',
			confirmPassword: ''
		};
		formErrors = {};
		createError = null;
	};

	// Cerrar modal con escape
	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && showModal) {
			closeModal();
		}
	};
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="min-h-screen">
	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold tracking-tight text-light-two dark:text-dark-two">
					Usuarios
				</h1>
			</div>
			<PermissionGuard permission={Permission.CREATE_USER}>
				<Button type="button" variant="primary" onclick={openModal}>
					<PlusIcon />
					Agregar Usuario
				</Button>
			</PermissionGuard>
		</div>

		<!-- Error general -->
		{#if error}
			<div class="mb-6 rounded-md border border-red-200 px-4 py-3 text-red-700">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-light-two dark:text-dark-two">Error</h3>
						<div class="mt-1 text-sm text-light-two dark:text-dark-two">{error}</div>
					</div>
					<div class="ml-auto pl-3">
						<Button type="button" variant="ghost" fullWidth onclick={() => (error = null)}>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</Button>
					</div>
				</div>
			</div>
		{/if}

		<!-- Lista de usuarios -->
		{#if isLoading}
			<LoadingState />
		{:else}
			<UsersList {users} onRoleUpdate={updateUserRole} />
		{/if}
	</main>
</div>

<!-- Modal para crear usuario -->
{#if showModal}
	<div
		class="fixed inset-0 z-50 overflow-y-auto"
		aria-labelledby="modal-title"
		role="dialog"
		aria-modal="true"
	>
		<!-- Overlay -->
		<div
			class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
		>
			<!-- Modal -->
			<div
				class="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
			>
				<!-- Header -->
				<div class="mb-6 flex items-center justify-between">
					<div>
						<h3 class="text-lg font-semibold text-gray-900" id="modal-title">
							Crear Nuevo Usuario
						</h3>
					</div>
					<button
						type="button"
						class="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						on:click={closeModal}
					>
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				{#if createError}
					<div class="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2">
						<div class="flex">
							<svg
								class="h-5 w-5 flex-shrink-0 text-red-400"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clip-rule="evenodd"
								/>
							</svg>
							<div class="ml-2">
								<p class="text-sm text-red-700">{createError}</p>
							</div>
						</div>
					</div>
				{/if}

				<!-- Formulario -->
				<form on:submit|preventDefault={createUser} class="space-y-4">
					<!-- Nombre de usuario -->
					<div>
						<label for="user_name" class="mb-1 block text-sm font-medium text-gray-700">
							Nombre de Usuario <span class="text-red-500">*</span>
						</label>
						<input
							id="user_name"
							type="text"
							bind:value={formData.user_name}
							placeholder="Ingresa el nombre de usuario"
							class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
							class:border-red-300={formErrors.user_name}
							class:focus:border-red-500={formErrors.user_name}
							class:focus:ring-red-500={formErrors.user_name}
						/>
						{#if formErrors.user_name}
							<p class="mt-1 text-xs text-red-600">{formErrors.user_name}</p>
						{/if}
					</div>

					<!-- Email -->
					<div>
						<label for="user_email" class="mb-1 block text-sm font-medium text-gray-700">
							Correo Electrónico <span class="text-red-500">*</span>
						</label>
						<input
							id="user_email"
							type="email"
							bind:value={formData.user_email}
							placeholder="usuario@ejemplo.com"
							class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
							class:border-red-300={formErrors.user_email}
							class:focus:border-red-500={formErrors.user_email}
							class:focus:ring-red-500={formErrors.user_email}
						/>
						{#if formErrors.user_email}
							<p class="mt-1 text-xs text-red-600">{formErrors.user_email}</p>
						{/if}
					</div>

					<!-- Rol -->
					<div>
						<label for="role_id" class="mb-1 block text-sm font-medium text-gray-700">
							Rol <span class="text-red-500">*</span>
						</label>
						<select
							id="role_id"
							bind:value={formData.role_id}
							class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						>
							<option value={1}>OWNER</option>
							<option value={2}>ADMIN</option>
							<option value={3}>VIEWER</option>
							<option value={4}>MASTER</option>
						</select>
					</div>

					<!-- Contraseña -->
					<div>
						<label for="password" class="mb-1 block text-sm font-medium text-gray-700">
							Contraseña <span class="text-red-500">*</span>
						</label>
						<input
							id="password"
							type="password"
							bind:value={formData.password}
							placeholder="Mínimo 8 caracteres"
							class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
							class:border-red-300={formErrors.password}
							class:focus:border-red-500={formErrors.password}
							class:focus:ring-red-500={formErrors.password}
						/>
						{#if formErrors.password}
							<p class="mt-1 text-xs text-red-600">{formErrors.password}</p>
						{/if}
					</div>

					<!-- Botones -->
					<div class="flex gap-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onclick={closeModal}
							fullWidth
							className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-md transition-colors duration-200"
						>
							Cancelar
						</Button>
						<Button
							type="submit"
							variant="primary"
							disabled={isCreatingUser}
							fullWidth
							loading={isCreatingUser}
							className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md transition-colors duration-200 inline-flex items-center justify-center gap-2"
						>
							Crear Usuario
						</Button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
<!-- <script lang="ts">
	import { Button } from '$lib/components';
	import LoadingState from '$lib/components/user/loadingState.svelte';
	import UsersList from '$lib/components/user/usersList.svelte';
	import type { RoleUpdatePayload, User } from '$lib/interface';
	import { userService } from '$lib/services';
	import { onMount } from 'svelte';
	let users: User[];

	let isLoading = false;
	let error: string | null = null;

	onMount(async () => {
		await getAllUsers();
	});
	const getAllUsers = async () => {
		try {
			isLoading = true;
			const usersResponse = await userService.getUsers();
			users = usersResponse;
		} catch (error) {
			error = error instanceof Error ? error.message : 'Error desconocido';
			throw error;
		} finally {
			isLoading = false;
		}
	};

	const updateUserRole = async (userId: string, newRole: number): Promise<void> => {
		try {
			const payload: RoleUpdatePayload = { role: newRole };
			await userService.updateUserRole(payload, userId);
			users = users?.map((user) =>
				user.user_id === userId ? { ...user, role_id: newRole } : user
			);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error desconocido';
			throw err;
		}
	};
</script>

<div class="min-h-screen bg-gray-50">
	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		{#if error}
			<div class="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium">Error</h3>
						<div class="mt-1 text-sm">{error}</div>
					</div>
					<div class="ml-auto pl-3">
						<Button type="button" variant="ghost" fullWidth onclick={() => (error = null)}>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</Button>
					</div>
				</div>
			</div>
		{/if}

		{#if isLoading}
			<LoadingState />
		{:else}
			<UsersList {users} onRoleUpdate={updateUserRole} />
		{/if}
	</main>
</div> -->
