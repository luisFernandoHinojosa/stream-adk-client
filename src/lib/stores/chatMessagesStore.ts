import { storage } from '$lib/utils/localStorage';
import { getFormattedLocalDateTime } from '$lib/utils/getFormattedLocalDateTime';
import { writable } from 'svelte/store';
import type { ChatMessage } from '$lib/interface/chat.interface';
import { CHAT_MESSAGES_STORAGE_KEY } from '$lib/constants/constants';
import { browser } from '$app/environment';

// Obtener mensajes almacenados en `localStorage`
function getStoredMessages(): ChatMessage[] {
	const stored = browser ? storage.getString(CHAT_MESSAGES_STORAGE_KEY) : null;
	return stored
		? JSON.parse(stored, (key, value) =>
				key === 'timestamp' ? getFormattedLocalDateTime() : value
			)
		: [];
}

// Crear el store con los mensajes almacenados
const chatMessages = writable<ChatMessage[]>(browser ? getStoredMessages() : []);

// Suscribirse al store para actualizar `localStorage` automáticamente
chatMessages.subscribe((messages) => {
	if (browser) {
		storage.setJSON(CHAT_MESSAGES_STORAGE_KEY, messages);
	}
});

// Métodos del store
export const chatMessagesStore = {
	subscribe: chatMessages.subscribe,

	// Agregar un nuevo mensaje
	addMessage: (message: ChatMessage) => {
		chatMessages.update((messages) => [...messages, message]);
	},

	// Reiniciar el chat con un mensaje inicial
	reset: (initialMessage: ChatMessage) => {
		chatMessages.set([initialMessage]);
	}
};
