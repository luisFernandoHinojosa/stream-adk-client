import { auth } from '$lib/config/firebase.config';
import type { User } from 'firebase/auth';
import { browserLocalPersistence, onAuthStateChanged, setPersistence } from 'firebase/auth';

class AuthService {
	async initialize(): Promise<void> {
		try {
			await setPersistence(auth, browserLocalPersistence);
		} catch (error) {
			console.error('Error al establecer la persistencia de la sesión:', error);
			throw error;
		}
	}

	getCurrentUser(): User | null {
		return auth.currentUser;
	}

	async getCurrentUserToken(): Promise<string | null> {
		try {
			const currentUser = this.getCurrentUser();
			if (!currentUser) {
				return null;
			}
			return await currentUser.getIdToken();
		} catch (error) {
			console.error('Error al obtener el token:', error);
			return null;
		}
	}

	onAuthStateChange(callback: (user: User | null) => void): () => void {
		return onAuthStateChanged(auth, callback);
	}

	async signOut(): Promise<void> {
		try {
			await auth.signOut();
		} catch (error) {
			console.error('Error al cerrar sesión:', error);
			throw error;
		}
	}
}

export const authService = new AuthService();
