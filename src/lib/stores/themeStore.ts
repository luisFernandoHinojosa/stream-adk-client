import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { storage } from '$lib/utils/localStorage';
//import type { Theme } from '$lib/interface/theme.interface';

const THEME_STORAGE_KEY = 'theme';
export type Theme = 'light' | 'dark';
function createThemeStore() {
	const theme = writable<Theme>(
		(browser && (storage.getString(THEME_STORAGE_KEY) as Theme)) || 'light'
	);

	if (browser) {
		theme.subscribe((value) => {
			storage.setString(THEME_STORAGE_KEY, value);
			if (value === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		});
	}

	return {
		...theme,
		toggleTheme: () =>
			theme.update((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light')),
		setTheme: (newTheme: Theme) => theme.set(newTheme)
	};
}

export const themeStore = createThemeStore();
