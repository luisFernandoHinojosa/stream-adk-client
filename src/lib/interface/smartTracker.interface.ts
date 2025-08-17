export interface SessionsHistory {
	id: string;
	appName: string;
	userId: string;
	state: unknown;
	events: unknown[];
	lastUpdateTime: number;
}

export interface CreateSessionResponse {
	session_id: string;
}

export interface ChatStreamSend {
	session_id: string;
	message: string;
	//timezone: string;
}

export interface StreamCallbacks {
	onMessage: (data: unknown) => void; // Se llama por cada mensaje que llega
	onError: (error: unknown) => void; // Se llama si hay un error
	onClose: () => void; // Se llama cuando el stream se cierra con [DONE]
}

//////////////////////////////
export interface TextPart {
	text: string;
}

export interface FunctionCallPart {
	functionCall: {
		id: string;
		args: {
			request: string;
		};
		name: string;
	};
}

export interface FunctionResponsePart {
	functionResponse: {
		id: string;
		name: string;
		response: {
			result: string; // JSON string
		};
	};
}

export interface ChatStreamResponse {
	textMessages: string[];
	functionCalls: FunctionCallPart[];
	functionResponses: FunctionResponsePart[];
}

type Part = TextPart | FunctionCallPart | FunctionResponsePart;

interface Content {
	parts: Part[];
	role: 'user' | 'model';
}

interface Actions {
	stateDelta: unknown;
	artifactDelta: unknown;
	requestedAuthConfigs: unknown;
}

export interface Event {
	content: Content;
	invocationId: string;
	author: string;
	actions: Actions;
	longRunningToolIds: unknown[];
	id: string;
	timestamp: number;
	partial?: boolean;
}

export interface SessionData {
	id: string;
	appName: string;
	userId: string;
	state: unknown; //cualquier estrutura
	events: Event[];
	lastUpdateTime: number;
}
