import { browser } from '$app/environment';
import type { BotPersonality } from '$lib/interface';
import { writable } from 'svelte/store';

const LOCAL_STORAGE_KEY = 'botPersonalityConfig';

const initialConfig: BotPersonality = {
	nameBot: 'Asistente Virtual',
	formalityLevel: 3,
	communicationTones: ['Empático'],
	archetype: 'El Experto',
	proactivityLevel: 2,
	responseLength: 2,
	emojiUsage: 'none',
	targetAudience: '',
	mainObjective: ''
};

function createBotPersonalityStore() {
	const storedValue = browser ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
	const parsedValue: BotPersonality = storedValue ? JSON.parse(storedValue) : initialConfig;

	const { subscribe, set, update } = writable<BotPersonality>(parsedValue);

	subscribe((value) => {
		if (browser) {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
		}
	});

	return {
		subscribe,
		set,
		update,
		reset: () => set(initialConfig),

		updateName: (name: string) =>
			update((cfg) => ({
				...cfg,
				nameBot: name
			})),

		generatePrompt: (config: BotPersonality): string => {
			const formalidadMap: { [key: number]: string } = {
				1: 'muy informal y cercano, como un colega',
				2: 'amistoso y casual',
				3: 'neutral y profesional',
				4: 'formal y respetuoso',
				5: 'muy formal y corporativo'
			};

			const proactividadMap: { [key: number]: string } = {
				1: 'solo responde a lo que se le pregunta (reactivo)',
				2: 'responde y sugiere el siguiente paso lógico (proactivo)',
				3: 'responde, sugiere pasos y ofrece información adicional no solicitada pero relevante (hiper-proactivo)'
			};

			const extensionMap: { [key: number]: string } = {
				1: 'muy concisas y directas, como un telegrama',
				2: 'estándar, ni muy cortas ni muy largas',
				3: 'detalladas y completas, ofreciendo toda la información posible'
			};

			const emojisMap: { [key: string]: string } = {
				'Sin Emojis': 'sin usar ningún emoji',
				'Uso Sutil': 'haciendo un uso sutil de emojis para añadir un toque amigable',
				'Uso Frecuente':
					'haciendo un uso frecuente de emojis para conectar con la audiencia de forma vibrante',
				none: 'sin usar ningún emoji'
			};

			const tonosTexto =
				config.communicationTones.length > 0 ? config.communicationTones.join(' , ') : 'neutro';

			return `Eres ${config.nameBot}, un asistente virtual. Tu rol principal es el de un **${config.archetype}**. 
			Debes comunicarte con un nivel de formalidad **${formalidadMap[config.formalityLevel]}**. Mantén un tono que sea **${tonosTexto}**.
			Tu público objetivo es ${config.targetAudience || 'cualquier persona interesada en los productos o servicios de la empresa'}.
			En cuanto a la longitud de tus respuestas, deben ser **${extensionMap[config.responseLength]}**.
			Sé **${proactividadMap[config.proactivityLevel]}** en tus interacciones.
			Sobre el uso de emojis, sigue la regla de **${emojisMap[config.emojiUsage]}**.
			Tu objetivo final es ${config.mainObjective || 'asistir a los usuarios y proveer información relevante de manera eficiente'}. No te desvíes de este propósito.`;
		}
	};
}

export const botPersonalityStore = createBotPersonalityStore();
