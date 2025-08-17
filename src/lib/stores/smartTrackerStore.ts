import type { Event, FunctionCallPart, FunctionResponsePart, SessionData } from '$lib/interface';
import { writable } from 'svelte/store';

const STORAGE_KEY = 'session-chat-data';

// Datos por defecto para crear una nueva sesión
const createDefaultSessionData = (): SessionData => ({
	id: '0',
	appName: 'chat-app-botsi',
	userId: 'default-user-botsi',
	state: null,
	events: [],
	lastUpdateTime: Date.now()
});

// Datos por defecto para eventos
const createDefaultEventData = () => ({
	invocationId: `e-${crypto.randomUUID()}`,
	author: 'user',
	actions: {
		stateDelta: {},
		artifactDelta: {},
		requestedAuthConfigs: {}
	},
	longRunningToolIds: [],
	id: crypto.randomUUID(),
	timestamp: Date.now() / 1000 // Timestamp en segundos como en tu ejemplo
});

// Función para cargar datos desde localStorage
const loadFromStorage = (): SessionData => {
	if (typeof window === 'undefined') {
		return createDefaultSessionData();
	}

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			// Validar que tiene la estructura correcta
			if (parsed && typeof parsed === 'object' && 'id' in parsed && 'events' in parsed) {
				return parsed as SessionData;
			}
		}
	} catch (error) {
		console.warn('Error loading session data from localStorage:', error);
	}

	return createDefaultSessionData();
};

// Función para guardar en localStorage
const saveToStorage = (data: SessionData): void => {
	if (typeof window === 'undefined') return;

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	} catch (error) {
		console.error('Error saving session data to localStorage:', error);
	}
};

// Crear el store
const createSmartTrackerStore = () => {
	const initialData = loadFromStorage();
	const { subscribe, set, update } = writable<SessionData>(initialData);

	return {
		subscribe,

		// Establecer toda la data de la sesion
		set: (data: SessionData) => {
			const updatedData = {
				...data,
				lastUpdateTime: Date.now()
			};
			set(updatedData);
			saveToStorage(updatedData);
		},

		// Reset completo del store
		reset: () => {
			const newData = createDefaultSessionData();
			set(newData);
			saveToStorage(newData);
		},

		// Agregar evento de usuario
		addUserEvent: (text: string) => {
			update((currentData) => {
				const newEvent: Event = {
					content: {
						parts: [{ text }],
						role: 'user'
					},
					...createDefaultEventData()
				};

				const updatedData = {
					...currentData,
					events: [...currentData.events, newEvent],
					lastUpdateTime: Date.now()
				};

				saveToStorage(updatedData);
				return updatedData;
			});
		},

		// Agregar evento de modelo/asistente
		addModelEvent: (text: string) => {
			update((currentData) => {
				const newEvent: Event = {
					content: {
						parts: [{ text }],
						role: 'model'
					},
					...createDefaultEventData(),
					author: 'model'
				};

				const updatedData = {
					...currentData,
					events: [...currentData.events, newEvent],
					lastUpdateTime: Date.now()
				};

				saveToStorage(updatedData);
				return updatedData;
			});
		},

		// Agregar evento personalizado
		addEvent: (event: Event) => {
			update((currentData) => {
				const updatedData = {
					...currentData,
					events: [...currentData.events, event],
					lastUpdateTime: Date.now()
				};

				saveToStorage(updatedData);
				return updatedData;
			});
		},

		// Agregar evento con function call
		addFunctionCallEvent: (functionCall: FunctionCallPart[]) => {
			update((currentData) => {
				const newEvent: Event = {
					content: {
						parts: functionCall,
						role: 'model'
					},
					...createDefaultEventData(),
					author: 'Orchestrator'
				};

				const updatedData = {
					...currentData,
					events: [...currentData.events, newEvent],
					lastUpdateTime: Date.now()
				};

				saveToStorage(updatedData);
				return updatedData;
			});
		},

		// Agregar evento con function response
		addFunctionResponseEvent: (functionResponse: FunctionResponsePart[]) => {
			update((currentData) => {
				const newEvent: Event = {
					content: {
						parts: functionResponse,
						role: 'user'
					},
					...createDefaultEventData(),
					author: 'Orchestrator'
				};

				const updatedData = {
					...currentData,
					events: [...currentData.events, newEvent],
					lastUpdateTime: Date.now()
				};

				saveToStorage(updatedData);
				return updatedData;
			});
		},

		// Actualizar el ultimo evento
		updateLastEvent: (updater: (event: Event) => Event) => {
			update((currentData) => {
				if (currentData.events.length === 0) return currentData;

				const events = [...currentData.events];
				const lastIndex = events.length - 1;
				events[lastIndex] = updater(events[lastIndex]);

				const updatedData = {
					...currentData,
					events,
					lastUpdateTime: Date.now()
				};

				saveToStorage(updatedData);
				return updatedData;
			});
		},

		// Eliminar el ultimo evento
		removeLastEvent: () => {
			update((currentData) => {
				if (currentData.events.length === 0) return currentData;

				const updatedData = {
					...currentData,
					events: currentData.events.slice(0, -1),
					lastUpdateTime: Date.now()
				};

				saveToStorage(updatedData);
				return updatedData;
			});
		},

		// Actualizar informacion de la sesion
		updateSessionInfo: (updates: Partial<Omit<SessionData, 'events'>>) => {
			update((currentData) => {
				const updatedData = {
					...currentData,
					...updates,
					lastUpdateTime: Date.now()
				};

				saveToStorage(updatedData);
				return updatedData;
			});
		},

		// Limpiar solo los eventos
		clearEvents: () => {
			update((currentData) => {
				const updatedData = {
					...currentData,
					events: [],
					lastUpdateTime: Date.now()
				};

				saveToStorage(updatedData);
				return updatedData;
			});
		},

		// Obtener el ultimo evento
		getLastEvent: () => {
			let lastEvent: Event | null = null;
			const unsubscribe = subscribe((data) => {
				lastEvent = data.events.length > 0 ? data.events[data.events.length - 1] : null;
			});
			unsubscribe();
			return lastEvent;
		}
	};
};

export const smartTrackerStore = createSmartTrackerStore();
