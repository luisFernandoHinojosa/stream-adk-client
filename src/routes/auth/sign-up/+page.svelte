<script lang="ts">
	import Input from '$lib/components/ui/input.svelte';
	import Button from '$lib/components/ui/button.svelte';

	import { preventRedirect } from '$lib/utils/preventRedirect';
	import { redirect } from '$lib/utils/redirect';
	import { userService } from '$lib/services/user.service';
	import Subheading from '$lib/components/ui/subheading.svelte';
	import { SRC_LOGO_APP } from '$lib/constants/assets';
	import { APP_NAME } from '$lib/constants';
	import type { UserRequest } from '$lib/interface';
	import XIcon from '$lib/icons/outline/xIcon.svelte';
	import { AppError, errorService } from '$lib/services/error.service';

	let email: string = $state('');
	let password: string = $state('');
	let user_name: string = $state('');
	let error: string = $state('');
	let loading = $state(false);

	const submitRegistration = async (): Promise<void> => {
		loading = true;
		error = '';
		const dataUser: UserRequest = {
			user_name: user_name,
			user_email: email,
			password: password,
			role_id: 0
		};
		try {
			const userCreated = await userService.createUser(dataUser);
			redirect('/auth/sign-in');
			console.log(userCreated);
		} catch (err) {
			if (err instanceof AppError) {
				error = err.message; // Mensaje específico de la API
				errorService.logError(err);
			} else {
				error = 'Ocurrió un error inesperado al registrar. Por favor, intenta de nuevo.';
				console.error('Error no controlado:', err);
			}
		} finally {
			loading = false;
		}
	};
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
	<div class="md:mx-auto md:w-full md:max-w-sm">
		<img class="mx-auto h-44 w-auto" src={SRC_LOGO_APP} alt={APP_NAME} />
		<Subheading level="h2" class="mt-8 text-center">Sign up to your account</Subheading>
	</div>

	<div class="mt-10 md:mx-auto md:w-full md:max-w-sm">
		<form class="space-y-6" action="#" method="POST" onsubmit={preventRedirect(submitRegistration)}>
			<div class="space-y-4">
				<Input type="text" id="user_name" bind:value={user_name} required label="Name" />
				<Input type="email" id="email" bind:value={email} required label="Email" />
				<Input type="password" id="password" bind:value={password} required label="Password" />
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

			<div class="w-full">
				<Button type="submit" variant="primary" fullWidth {loading}>Register</Button>
			</div>
		</form>

		<p class="mt-10 text-center text-sm/6 text-light-two dark:text-dark-two">
			Not a member?
			<a
				href="/auth/sign-in"
				class="font-semibold text-light-two hover:text-light-two_d dark:text-dark-two_d">Sign in</a
			>
		</p>
	</div>
</div>
