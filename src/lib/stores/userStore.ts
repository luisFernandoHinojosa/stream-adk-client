import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { User } from '$lib/interface';
import { storage } from '$lib/utils/localStorage';

// Carga el usuario desde localStorage o usa un objeto por defecto
const defaultUser: User = {
	role_id: 1,
	user_name: '',
	user_email: '',
	user_id: ''
};

const USER_KEY = 'user_state';

function createUserStore() {
	const user = writable<User>((browser && storage.getJSON(USER_KEY)) || defaultUser);
	return {
		...user,

		reset() {
			user.set(defaultUser);
		},

		setUser(newUser: User) {
			user.set(newUser);
			storage.setJSON(USER_KEY, newUser);
		},

		updateUser(updates: Partial<User>) {
			user.update((currentUser) => {
				const updatedUser = { ...currentUser, ...updates };
				storage.setJSON(USER_KEY, updatedUser);
				return updatedUser;
			});
		}
	};
}

export const userStore = createUserStore();
