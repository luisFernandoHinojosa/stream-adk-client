import { writable } from 'svelte/store';
import { loadFromLocalStorage, saveToLocalStorage } from '$lib/utils/localStorage';
import type { LogoBusiness } from '$lib/interface';

function createLogoBusinessStore() {
	const initialData = loadFromLocalStorage<LogoBusiness[]>('agent_adk_logos_business', []);
	const { subscribe, set, update } = writable<LogoBusiness[]>(initialData);

	subscribe((value) => saveToLocalStorage('agent_adk_logos_business', value));

	return {
		subscribe,
		set,
		update,

		addLogoBusiness: (newItem: LogoBusiness) => {
			update((items) => {
				const index = items.findIndex((item) => item.business_id === newItem.business_id);
				if (index !== -1) {
					items[index] = newItem;
				} else {
					items.push(newItem);
				}
				return items;
			});
		},

		getLogoByBusinessId: (business_id: number): string | undefined | null => {
			const items = loadFromLocalStorage<LogoBusiness[]>('agent_adk_logos_business', []);
			return items.find((item) => item.business_id === business_id)?.logo_path;
		}
	};
}

export const logoBusinessStore = createLogoBusinessStore();
