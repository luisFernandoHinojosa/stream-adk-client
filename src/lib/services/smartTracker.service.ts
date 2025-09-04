import { apiBotsi } from '$lib/config/apiBotsi.config';
import type {
	ChatStreamResponse,
	ChatStreamSend,
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

	async chatStreamSend(payload: ChatStreamSend): Promise<ChatStreamResponse> {
		const token = get(authStore).access_token;
		if (!token) {
			throw new Error('No se encontro token de autenticacion');
		}

		const queryParams = new URLSearchParams({
			message: payload.message
		});

		const apiURL = 'http://192.168.1.3:8080/api/v1';
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
							dataArray.forEach((part: any) => {
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
}

export const smartTrackerService = new SmartTrackerService();
