import { writable } from 'svelte/store';
import { loadFromLocalStorage, saveToLocalStorage } from '$lib/utils/localStorage';
import type { ImageItem } from '$lib/interface';
import { SRC_IMG_DEFAULT } from '$lib/constants';

function createImageItemStore() {
	const initialData = loadFromLocalStorage<ImageItem[]>('agent_adk_image_items', []);
	const { subscribe, set, update } = writable<ImageItem[]>(initialData);

	subscribe((value) => saveToLocalStorage('agent_adk_image_items', value));

	return {
		subscribe,
		set,
		update,
		addImageItem: (newItem: ImageItem) => {
			update((items) => {
				const index = items.findIndex(
					(item) => item.business_id === newItem.business_id && item.item_id === newItem.item_id
				);
				if (index !== -1) {
					items[index] = newItem;
				} else {
					items.push(newItem);
				}
				return items;
			});
		},

		getImageByBusinessAndItemId: (business_id: number, item_id: number): string => {
			const items = loadFromLocalStorage<ImageItem[]>('agent_adk_image_items', []);
			const found = items.find(
				(item) => item.business_id === business_id && item.item_id === item_id
			);
			return found?.image || SRC_IMG_DEFAULT;
		}
	};
}

export const imageItemStore = createImageItemStore();
