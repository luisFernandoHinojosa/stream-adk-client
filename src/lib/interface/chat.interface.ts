export interface ChatMessage {
	id: string;
	content: string;
	sender: 'user' | 'botsi';
	timestamp: string;
	component?: boolean;
}
