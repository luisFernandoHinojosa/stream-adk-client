export interface BotPersonality {
	nameBot: string;
	formalityLevel: number; // 1-5
	communicationTones: string[];
	archetype: string;
	proactivityLevel: number; // 1-3
	responseLength: number; // 1-3
	emojiUsage: 'none' | 'subtle' | 'frequent';
	targetAudience: string;
	mainObjective: string;
}

export interface Archetype {
	id: string;
	name: string;
	icon: string;
	description: string;
}

export interface CommunicationTone {
	id: string;
	name: string;
	emoji: string;
	description: string;
}

export interface FormalityLevel {
	value: number;
	label: string;
}

export interface ProactivityLevel {
	value: number;
	label: string;
	description: string;
}

export interface ResponseLength {
	value: number;
	label: string;
	description: string;
}

export interface EmojiUsage {
	value: 'none' | 'subtle' | 'frequent';
	label: string;
	example: string;
}
