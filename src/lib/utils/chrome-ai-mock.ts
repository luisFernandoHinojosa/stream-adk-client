// src/lib/utils/chrome-ai-mock.ts

// Definimos una interfaz para el objeto AI
export interface ChromeAI {
	proofread: (text: string) => Promise<{ text: string }>;
	summarize: (text: string) => Promise<{ text: string }>;
	rewrite: (text: string) => Promise<{ text: string }>;
	// Aquí se podrían añadir las otras APIs como writer(), translate(), etc.
}

// Nuestro objeto simulador
export const mockAI: ChromeAI = {
	proofread: async (text: string) => {
		console.log('MOCK: Corrigiendo texto...');
		await new Promise((resolve) => setTimeout(resolve, 800)); // Simula latencia
		// Simulación simple: corrige errores comunes y capitaliza
		return {
			text:
				text
					.replace(/ a sido /gi, ' ha sido ')
					.replace(/, /g, ', ')
					.trim() + ' (Corregido)'
		};
	},
	summarize: async (text: string) => {
		console.log('MOCK: Resumiendo texto...');
		await new Promise((resolve) => setTimeout(resolve, 1200));
		const sentences = text.split('. ');
		return { text: sentences.slice(0, 1).join('. ') + '. (Resumen)' };
	},
	rewrite: async (text: string) => {
		console.log('MOCK: Reescribiendo texto...');
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return { text: `Una forma alternativa de decir esto sería: "${text}" (Reescrito)` };
	}
};

// Función para inicializar el mock si window.ai no existe
export function initializeAISupport() {
	if ('ai' in window) {
		console.log('✅ API de IA integrada de Chrome detectada.');
	} else {
		console.warn('⚠️ API de IA integrada no encontrada. Usando mock para desarrollo.');
		(window as unknown as { ai: ChromeAI }).ai = mockAI;
	}
}
