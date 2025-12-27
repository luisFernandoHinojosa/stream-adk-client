<script lang="ts">
	//auth/sign-in/page.svelte
	import { Input, Subheading } from '$lib/components';
	import { APP_NAME, SRC_LOGO_APP } from '$lib/constants';
	import { AppError, errorService } from '$lib/services/error.service';
	import XIcon from '$lib/icons/outline/xIcon.svelte';
	import { userService } from '$lib/services';
	import { authService } from '$lib/services/authService';
	import { userStore } from '$lib/stores/userStore';
	import { preventRedirect } from '$lib/utils/preventRedirect';
	import { redirect } from '$lib/utils/redirect';

	let username: string = $state('');
	let password: string = $state('');
	let isLoading: boolean = $state(false);
	let error: string = $state('');

	const submitLogin = async (): Promise<void> => {
		try {
			isLoading = true;
			error = '';
			const tokenResponse = await authService.login(username, password);
			authService.saveToken(tokenResponse);
			const user = await userService.getCurrentUser();
			userStore.setUser(user);
			console.log('Login exitoso:', tokenResponse);
			redirect('/stream');
		} catch (err) {
			if (err instanceof AppError) {
				error = err.message; // Mensaje específico de la API, ej: "Credenciales inválidas"
				errorService.logError(err); // Loguea el error de forma estructurada
			} else {
				error = 'Ocurrió un error inesperado. Por favor, intenta de nuevo.';
				console.error('Error no controlado:', err);
			}
		} finally {
			isLoading = false;
		}
	};
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
	<div class="sm: w-full max-w-sm sm:mx-auto md:max-w-md">
		<img class="mx-auto h-44 w-auto" src={SRC_LOGO_APP} alt={APP_NAME} />
		<Subheading level="h2" class="mt-8 text-center">Sign in to your account</Subheading>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<form class="space-y-6" onsubmit={preventRedirect(submitLogin)}>
			<div class="space-y-4">
				<Input
					type="text"
					id="username"
					bind:value={username}
					required
					label="Username"
					disabled={isLoading}
				/>
				<div class="relative">
					<div class="absolute top-0 right-0 text-sm">
						<a href="/auth/reset-password" class="text-light-two hover:text-light-two"
							>Forgot your password?</a
						>
					</div>
					<Input
						type="password"
						id="password"
						bind:value={password}
						required
						label="Password"
						disabled={isLoading}
					/>
				</div>
				{#if error}
					<div class="rounded-md border border-light-three p-3">
						<div class="flex">
							<div class="flex-shrink-0">
								<XIcon class="size-5 text-light-three" />
							</div>
							<div class="ml-3">
								<p class="text-sm text-light-three">{error}</p>
							</div>
						</div>
					</div>
				{/if}
			</div>
			<div>
				<!-- <Button type="submit" variant="primary" fullWidth disabled={isLoading} loading={isLoading}
					>Sign in</Button
				> -->
				<button
					type="submit"
					disabled={isLoading}
					class="w-full rounded-lg bg-light-two p-2 text-light-one transition-all duration-200 hover:bg-light-two_d dark:bg-dark-two dark:text-dark-one dark:hover:bg-dark-two_d"
					>Sign in</button
				>
			</div>
		</form>

		<p class="mt-10 text-center text-sm/6 text-light-two">
			Not a member?
			<a href="/auth/sign-up" class="font-semibold text-light-two hover:text-light-two_d"
				>Register</a
			>
		</p>
	</div>
</div>
