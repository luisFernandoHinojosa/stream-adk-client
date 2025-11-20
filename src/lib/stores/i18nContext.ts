// stores/languageStore.ts
import { getContext } from 'svelte';
import type { Readable } from 'svelte/store';
import type i18next from 'i18next';

export function getI18nContext(): Readable<typeof i18next> {
	return getContext('i18n');
}
