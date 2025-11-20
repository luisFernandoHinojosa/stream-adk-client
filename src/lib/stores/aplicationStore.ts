import { writable } from 'svelte/store';
import { storage } from '$lib/utils/localStorage';
import type { Aplication } from '$lib/interface';
import { browser } from '$app/environment';

function createAplicationStore() {
	const initialData = browser
		? storage.getJSON<Aplication>('agent_adk_aplication')
		: {
				aplication_id: 1,
				aplication_name: 'Adk'
			};
	const { subscribe, set, update } = writable<Aplication>(
		initialData || {
			aplication_id: 1,
			aplication_name: 'Adk'
		}
	);

	subscribe((value) => browser && storage.setJSON('agent_adk_aplication', value));

	return {
		subscribe,
		set,
		update
	};
}

export const aplicationStore = createAplicationStore();
