import { storage } from '$lib/utils/localStorage';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createStreamingStore() {
	const initialData = browser ? storage.getString('agent_adk_streaming') : 'false';
	const { subscribe, set, update } = writable<boolean>(initialData === 'true');

	subscribe(
		(value) => browser && storage.setString('agent_adk_streaming', value ? 'true' : 'false')
	);

	return {
		subscribe,
		set,
		update,
		toggleStreaming: () => update((value) => !value)
	};
}

export const streamingStore = createStreamingStore();
