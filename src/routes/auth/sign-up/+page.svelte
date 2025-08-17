<script lang="ts">
	import Input from '$lib/components/ui/input.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { auth } from '$lib/config/firebase.config';

	import { preventRedirect } from '$lib/utils/preventRedirect';
	import { redirect } from '$lib/utils/redirect';
	import { createUserWithEmailAndPassword, type User } from 'firebase/auth';
	import type { CreateUserRequest } from '$lib/interface/user.interface';
	import { userService } from '$lib/services/user.service';
	import Subheading from '$lib/components/ui/subheading.svelte';
	import { SRC_LOGO_APP } from '$lib/constants/assets';
	import { APP_NAME } from '$lib/constants';
	import { defaultBusinesses } from '$lib/defaults';
	import { businessService } from '$lib/services';
	import type { LogoBusiness } from '$lib/interface';
	import { logoBusinessStore } from '$lib/stores';

	let email: string = $state('');
	let password: string = $state('');
	let user_name: string = $state('');
	let error: string = $state('');
	let loading = $state(false);
	let user: User | null = $state(null);

	const submitRegistration = async (): Promise<void> => {
		loading = true;
		error = '';
		const dataMessage = {
			user_name: user_name,
			user_email: email,
			password: password
		};
		const endpoint = `http://localhost:8000/users/`;
		try {
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(dataMessage)
			});

			const data = await response.json();
			redirect('/auth/sign-in');
			console.log(data);
		} catch {
			throw new Error('Unexpected error');
		} finally {
			loading = false;
		}
	};

	const createDefaultBusinesses = async () => {
		try {
			const createdBusinesses = await Promise.all(
				defaultBusinesses.map(async (store) => {
					const newBusiness = await businessService.createBusiness(store);

					// Si tienes un logo personalizado, reemplaza `store.logo_path`
					const logoBusiness: LogoBusiness = {
						business_id: newBusiness.business_id,
						logo_path: store.logo_path
					};
					console.log('new business:', newBusiness);
					logoBusinessStore.addLogoBusiness(logoBusiness);

					//return newBusiness;
				})
			);

			console.log('All businesses created:', createdBusinesses);
		} catch (error) {
			console.error('Error creating default businesses:', error);
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
