import { browser } from '$app/environment';
import type { AuthResponse } from '$lib/interface/auth.interface';
import { storage } from '$lib/utils/localStorage';
import { writable } from 'svelte/store';

const STORAGE_KEY = 'auth_state';

// Estado inicial
const initialState: AuthResponse = {
	access_token: null,
	refresh_token: null,
	token_type: null
};
const saveToStorage = (state: AuthResponse) => {
	if (browser) {
		storage.setJSON(STORAGE_KEY, state);
	}
};
// Crear el store
function createAuthStore() {
	const { subscribe, set, update } = writable<AuthResponse>(
		(browser && storage.getJSON(STORAGE_KEY)) || initialState
	);
	return {
		subscribe,
		// Método para hacer login
		login: (authData: AuthResponse) => {
			const newState: AuthResponse = {
				access_token: authData.access_token,
				refresh_token: authData.refresh_token,
				token_type: authData.token_type
			};
			set(newState);
			saveToStorage(newState);
		},
		// Método para hacer logout
		logout: () => {
			set(initialState);
			//saveToStorage(initialState);
		},
		// Método para actualizar solo el access_token (útil para refresh)
		updateAccessToken: (access_token: string) => {
			update((state) => {
				const newState = { ...state, access_token };
				//saveToStorage(newState);
				return newState;
			});
		},
		updateRefreshToken: (refresh_token: string) => {
			update((state) => {
				const newState = { ...state, refresh_token };
				//saveToStorage(newState);
				return newState;
			});
		},
		// Método para limpiar el store
		clear: () => {
			set(initialState);
			if (typeof window !== 'undefined') {
				localStorage.removeItem(STORAGE_KEY);
			}
		}
	};
}

export const authStore = createAuthStore();
