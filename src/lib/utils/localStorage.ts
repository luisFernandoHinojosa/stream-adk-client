// src/lib/utils/localStorage.ts
export function saveToLocalStorage<T>(key: string, data: T): void {
	if (typeof window !== 'undefined') {
		// Ensure code runs only in browser
		try {
			const serializedData = JSON.stringify(data);
			localStorage.setItem(key, serializedData);
		} catch (error) {
			console.error(`Error saving ${key} to localStorage:`, error);
		}
	}
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
	if (typeof window !== 'undefined') {
		try {
			const serializedData = localStorage.getItem(key);
			if (serializedData === null) {
				return defaultValue;
			}
			return JSON.parse(serializedData) as T;
		} catch (error) {
			console.error(`Error loading ${key} from localStorage:`, error);
			return defaultValue;
		}
	}
	return defaultValue; // Return default if not in browser (e.g., during SSR)
}

export const storage = {
	// Almacenar datos como JSON
	setJSON: (key: string, value: object) => {
		localStorage.setItem(key, JSON.stringify(value));
	},

	// Obtener datos que están almacenados como JSON
	getJSON: <T>(key: string): T | null => {
		const value = localStorage.getItem(key);
		if (value) {
			return JSON.parse(value);
		}
		return null; // Si no existe, devolvemos null
	},

	setString: (key: string, value: string): void => {
		localStorage.setItem(key, value);
	},

	getString: (key: string): string | null => {
		return localStorage.getItem(key);
	},

	// Eliminar un elemento del localStorage
	remove: (key: string) => {
		localStorage.removeItem(key);
	},

	// Limpiar todo el localStorage
	clear: () => {
		localStorage.clear();
	}
};
