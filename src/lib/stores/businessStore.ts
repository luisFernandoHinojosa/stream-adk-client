import { writable } from 'svelte/store';
import { loadFromLocalStorage, saveToLocalStorage } from '$lib/utils/localStorage';
import { defaultBusiness } from '$lib/defaults/businessDefault';
import type { BusinessResponse } from '$lib/interface';

function createBusinessStore() {
	const initialData = loadFromLocalStorage<BusinessResponse>('agent_adk_business', defaultBusiness);
	const { subscribe, set, update } = writable<BusinessResponse>(initialData);

	subscribe((value) => saveToLocalStorage('agent_adk_business', value));

	return {
		subscribe,
		set,
		update
	};
}

export const businessStore = createBusinessStore();
