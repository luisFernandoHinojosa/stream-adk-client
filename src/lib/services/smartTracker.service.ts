import { API_CONFIG } from '$lib/config/api.config';
import { apiBotsi } from '$lib/config/apiBotsi.config';
import type {
	ChatStreamResponse,
	ChatStreamSend,
	ChatV2Response,
	ChatV2SendPayload,
	ChatV2StreamCallbacks,
	ChatV2StreamEvent,
	CreateSessionResponse,
	SessionData,
	SessionsHistory
} from '$lib/interface';
import { authStore } from '$lib/stores';
import { getIdToken } from '$lib/utils/getIdToken';
import { get } from 'svelte/store';

class SmartTrackerService {
	async createSession(): Promise<CreateSessionResponse> {
		return await apiBotsi.post<CreateSessionResponse>('/chat_sse/sessions', {});
	}

	async getSession(session_id: string): Promise<SessionData> {
		return await apiBotsi.get<SessionData>(`/chat_sse/session/${session_id}`);
	}

	async getSessionsHistory(): Promise<SessionsHistory[]> {
		return await apiBotsi.get<SessionsHistory[]>('/chat_sse/sessions/');
	}

	async getSessionsHistoryForUser(userId: string): Promise<SessionsHistory[]> {
		return await apiBotsi.get<SessionsHistory[]>(`/chat_sse/users/${userId}/sessions/`);
	}

	async getFullSessionForUser(sessionId: string, userId: string): Promise<SessionsHistory[]> {
		return await apiBotsi.get<SessionsHistory[]>(`/chat_sse/users/${userId}/sessions/${sessionId}`);
	}

	async chatStreamSend(payload: ChatStreamSend): Promise<ChatStreamResponse> {
		const token = get(authStore).access_token;
		if (!token) {
			throw new Error('No se encontro token de autenticacion');
		}

		const queryParams = new URLSearchParams({
			message: payload.message
		});

		const apiURL = `${API_CONFIG.BASE_URL}/api/v1`;
		const endpoint = `${apiURL}/chat_sse/chat/stream/${payload.session_id}?${queryParams.toString()}`;

		// Arrays para acumular los datos
		const streamResponse: ChatStreamResponse = {
			textMessages: [],
			functionCalls: [],
			functionResponses: []
		};

		try {
			const response = await fetch(endpoint, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'text/event-stream', // ✅ CAMBIADO: era 'application/json'
					'Cache-Control': 'no-cache' // ✅ AGREGADO: para SSE
				}
			});

			if (!response.ok) {
				throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
			}

			// ✅ VERIFICAR que el content-type sea correcto
			const contentType = response.headers.get('content-type');
			if (!contentType?.includes('text/event-stream')) {
				console.warn('Content-Type no es text/event-stream:', contentType);
			}

			const reader = response.body!.getReader();
			const decoder = new TextDecoder();
			let buffer = '';

			while (true) {
				const { done, value } = await reader.read();

				if (done) {
					break;
				}

				// Decodifica el chunk y lo añade al buffer
				buffer += decoder.decode(value, { stream: true });

				// Procesa los eventos completos en el buffer (terminan en \n\n)
				const events = buffer.split('\n\n');
				buffer = events.pop() || ''; // Guarda el último trozo, que podría estar incompleto

				for (const event of events) {
					if (event.trim() === '') continue; // Saltar eventos vacíos

					if (event.startsWith('data: ')) {
						const jsonData = event.substring(6); // Quita "data: "

						// ✅ AGREGADO: Manejar eventos especiales
						if (jsonData.trim() === '[DONE]') {
							console.log('Stream terminado');
							return streamResponse;
						}

						try {
							const data = JSON.parse(jsonData);

							// Maneja errores del servidor
							if (data.error) {
								console.error('Error del servidor:', data.details);
								throw new Error(data.details);
							}

							// ✅ MEJORADO: Verificar si data es array o objeto individual
							const dataArray = Array.isArray(data) ? data : [data];

							// Procesa cada elemento del array
							dataArray.forEach((part: unknown) => {
								// Almacena function_call sin procesar
								if (part.function_call) {
									streamResponse.functionCalls.push({ functionCall: part.function_call });
								}

								// Almacena function_response sin procesar
								if (part.function_response) {
									streamResponse.functionResponses.push({
										functionResponse: part.function_response
									});
								}

								// Almacena texto
								if (part.text) {
									streamResponse.textMessages.push(part.text);
								}
							});
						} catch (parseError) {
							console.error('Error al parsear JSON:', jsonData, parseError);
							// ✅ CAMBIADO: No lanzar error, solo loggear y continuar
							console.warn('Continuando con el siguiente evento...');
						}
					}
				}
			}

			return streamResponse;
		} catch (error) {
			console.error('Falló la conexión de streaming:', error);
			throw error;
		}
	}

	//Nuevos enpoints para chatv2 con streaming opcional

	async chatStreamSendV2(
		sessionId: string,
		payload: ChatV2SendPayload,
		callbacks: ChatV2StreamCallbacks
	): Promise<ChatV2Response> {
		const token = get(authStore).access_token;
		if (!token) {
			throw new Error('No se encontró token de autenticación');
		}

		console.log('sessionId:', sessionId);
		console.log('payload:', payload);

		const apiURL = `${API_CONFIG.BASE_URL}/api/v1`;
		const endpoint = `${apiURL}/chat_sse/chat_streaming_sse/${sessionId}`;

		try {
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'text/event-stream',
					'Content-Type': 'application/json',
					'Cache-Control': 'no-cache'
				},
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
			}

			// Verificar content-type
			const contentType = response.headers.get('content-type');
			if (!contentType?.includes('text/event-stream')) {
				console.warn('Content-Type no es text/event-stream:', contentType);
			}

			const reader = response.body!.getReader();
			const decoder = new TextDecoder();
			let buffer = '';
			let finalEvent: ChatV2StreamEvent | undefined;

			while (true) {
				const { done, value } = await reader.read();

				if (done) {
					break;
				}

				// Decodifica el chunk y lo añade al buffer
				buffer += decoder.decode(value, { stream: true });

				// Procesa los eventos completos en el buffer
				const events = buffer.split('\n\n');
				buffer = events.pop() || '';

				for (const event of events) {
					if (event.trim() === '') continue;

					if (event.startsWith('data: ')) {
						const jsonData = event.substring(6);

						// Manejar evento de finalización
						if (jsonData.trim() === '[DONE]') {
							console.log('Stream terminado');
							if (callbacks.onComplete && finalEvent) {
								callbacks.onComplete(finalEvent);
							}
							return { success: true, finalEvent };
						}

						try {
							const eventData: ChatV2StreamEvent = JSON.parse(jsonData);

							// Manejar errores del servidor
							if ('error' in eventData) {
								const error = new Error(
									(eventData as unknown as { details: string }).details || 'Error del servidor'
								);
								if (callbacks.onError) {
									callbacks.onError(error);
								}
								throw error;
							}

							// Procesar cada parte del contenido
							if (eventData.content && eventData.content.parts) {
								for (const part of eventData.content.parts) {
									// Texto
									if (part.text) {
										if (callbacks.onTextChunk) {
											callbacks.onTextChunk(part.text, eventData.partial || false, eventData);
										}
									}

									// Function Call
									if (part.functionCall) {
										if (callbacks.onFunctionCall) {
											callbacks.onFunctionCall(part.functionCall, eventData);
										}
									}

									// Function Response
									if (part.functionResponse) {
										if (callbacks.onFunctionResponse) {
											callbacks.onFunctionResponse(part.functionResponse, eventData);
										}
									}
								}
							}

							// Si no es partial, es el evento final
							if (!eventData.partial) {
								finalEvent = eventData;
							}
						} catch (parseError) {
							console.error('Error al parsear JSON:', jsonData, parseError);
							const error = new Error('Error al procesar respuesta del servidor');
							if (callbacks.onError) {
								callbacks.onError(error);
							}
							throw error;
						}
					}
				}
			}

			// Si llegamos aquí sin finalEvent, crear uno
			if (!finalEvent && callbacks.onComplete) {
				callbacks.onComplete(finalEvent!);
			}

			return { success: true, finalEvent };
		} catch (error) {
			console.error('Falló la conexión de streaming V2:', error);
			if (callbacks.onError) {
				callbacks.onError(error as Error);
			}
			return { success: false, error: (error as Error).message };
		}
	}

	// Método simplificado para uso sin streaming
	async chatSendV2(sessionId: string, payload: ChatV2SendPayload): Promise<ChatV2Response> {
		return new Promise((resolve, reject) => {
			let finalResponse = '';
			let finalEvent: ChatV2StreamEvent | undefined;
			console.log('sessionId:', sessionId);
			console.log('payload:', payload);
			this.chatStreamSendV2(sessionId, payload, {
				onTextChunk: (text, isPartial) => {
					if (!isPartial) {
						finalResponse += text;
					}
				},
				onComplete: (event) => {
					finalEvent = event;
					resolve({ success: true, finalEvent });
				},
				onError: (error) => {
					reject(error);
				}
			});
		});
	}
}

export const smartTrackerService = new SmartTrackerService();
