import { browser } from '$app/environment';
import type { LanguageCodeType } from '$lib/interface';
import { storage } from '$lib/utils/localStorage';

import { writable } from 'svelte/store';
const LANGUAGE_KEY = 'bs_app:lang';
function createLanguageStore() {
	const language = writable<LanguageCodeType>(
		(browser && (storage.getString(LANGUAGE_KEY) as LanguageCodeType)) || 'en'
	);

	if (browser) {
		language.subscribe((lang) => {
			storage.setString(LANGUAGE_KEY, lang);
		});
	}

	return {
		...language,
		setLanguage: (newLang: LanguageCodeType) => language.set(newLang)
	};
}

export const languageStore = createLanguageStore();
