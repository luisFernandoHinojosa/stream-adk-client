import { auth } from '$lib/config/firebase.config';

export async function getIdToken(): Promise<string> {
	if (!auth.currentUser) {
		console.log('No user logged in. Redirecting to login...');
		// goto('/login');
		return 'No user logged in. Redirecting to login...';
	}
	try {
		return await auth.currentUser.getIdToken();
	} catch (e) {
		console.error(`Error obteniendo el token del usuario: ${e}`);
		return 'Error obteniendo el token del usuario.';
	}
}
