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

// export interface FunctionCallPart {
// 	functionCall: {
// 		id: string;
// 		args: {
// 			request: string;
// 		};
// 		name: string;
// 	};
// 	text?: string;
// }

// export interface FunctionResponsePart {
// 	functionResponse: {
// 		id: string;
// 		name: string;
// 		response: {
// 			result: string; // JSON string
// 		};
// 	};
// 	text?: string;
// }

// export interface Event {
//   id: string;
//   content: {
//     parts: Array<{
//       text?: string;
//       functionCall?: any;
//       functionResponse?: any;
//     }>;
//     role: 'user' | 'model';
//   };
//   author?: string;
//   timestamp?: number;
//   isStreaming?: boolean; // 🆕 Nueva propiedad para identificar eventos en streaming
//   // ... otras propiedades existentes
// }

// Agregar estas nuevas interfaces si no existen:
export interface FunctionCallPart {
	functionCall: unknown;
}

export interface FunctionResponsePart {
	functionResponse: unknown;
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
	id: string;
	content: {
		parts: Array<{
			text?: string;
			functionCall?: unknown;
			functionResponse?: unknown;
		}>;
		role: 'user' | 'model';
	};
	author?: string;
	timestamp?: number;
	isStreaming?: boolean;

	//content: Content;
	invocationId: string;
	//author: string;
	actions: Actions;
	longRunningToolIds: unknown[];
	//id: string;
	//timestamp: number;
	partial?: boolean;
	//isStreaming?: boolean;
}

export interface SessionData {
	id: string;
	appName: string;
	userId: string;
	state: unknown; //cualquier estrutura
	events: Event[];
	lastUpdateTime: number;
}

//chat version 2 con streaming o no
// interfaces.ts - Nuevas interfaces para Chat V2

export interface ChatV2SendPayload {
	message: string;
	streaming: boolean;
	state_delta?: {
		[key: string]: unknown;
	};
}

export interface ChatV2StreamEvent {
	content: {
		parts: Array<{
			text?: string;
			functionCall?: unknown;
			functionResponse?: unknown;
		}>;
		role: 'model' | 'user';
	};
	partial?: boolean;
	usageMetadata?: {
		promptTokenCount?: number;
		candidatesTokenCount?: number;
		totalTokenCount?: number;
		promptTokensDetails?: Array<{
			modality: string;
			tokenCount: number;
		}>;
		candidatesTokensDetails?: Array<{
			modality: string;
			tokenCount: number;
		}>;
	};
	invocationId: string;
	author: string;
	actions?: {
		stateDelta?: unknown;
		artifactDelta?: unknown;
		requestedAuthConfigs?: unknown;
	};
	id: string;
	timestamp: number;
}

export interface ChatV2StreamCallbacks {
	onTextChunk?: (text: string, isPartial: boolean, eventData: ChatV2StreamEvent) => void;
	onFunctionCall?: (functionCall: unknown, eventData: ChatV2StreamEvent) => void;
	onFunctionResponse?: (functionResponse: unknown, eventData: ChatV2StreamEvent) => void;
	onComplete?: (finalEvent: ChatV2StreamEvent) => void;
	onError?: (error: Error) => void;
}

export interface ChatV2Response {
	success: boolean;
	finalEvent?: ChatV2StreamEvent;
	error?: string;
}
