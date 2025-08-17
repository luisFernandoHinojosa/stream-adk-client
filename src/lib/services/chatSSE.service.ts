import { API_CONFIG, defaultHeaders } from '$lib/config/api.config';
import type { ChatStreamResponse, ChatStreamSend } from '$lib/interface';
import type { BusinessResponse } from '$lib/interface/business.interface';
import { authService } from './auth.service';
import { AppError, errorService, ErrorType } from './error.service';

// Servicio de negocio
class ChatSSEService {
	async createSession(business: BusinessResponse): Promise<BusinessResponse> {
		const controller = new AbortController();
		const id = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
		try {
			const token = await authService.getCurrentUserToken();
			if (!token) {
				throw new Error('No se encontró token de autenticación');
			}
			const headers = {
				...defaultHeaders,
				Authorization: token
			};
			const response = await fetch(`${API_CONFIG.BASE_URL}/business/`, {
				method: 'POST',
				headers,
				body: JSON.stringify(business),
				signal: controller.signal
			});
			clearTimeout(id);
			console.log('response', response);
			if (!response.ok) {
				const errorBody = await response.json().catch(() => ({}));
				const errorType = errorService.mapHttpToErrorType(response.status);

				throw new AppError(
					errorBody.message || 'Error en la solicitud',
					errorType,
					response.status
				);
			}
			const data: BusinessResponse = await response.json();
			//console.log('data response: ', data);
			return data;
		} catch (error) {
			console.log('error', error);
			clearTimeout(id);
			if (error instanceof DOMException && error.name === 'AbortError') {
				throw new AppError('Solicitud cancelada', ErrorType.NETWORK, 408);
			}

			if (error instanceof AppError) {
				throw errorService.getUserFriendlyMessage(error);
			}

			throw new AppError(
				'Error de red',
				ErrorType.NETWORK,
				undefined,
				error instanceof Error ? error : undefined
			);
		}
	}
	async createChatSSE(business: BusinessResponse): Promise<BusinessResponse> {
		const controller = new AbortController();
		const id = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
		try {
			const token = await authService.getCurrentUserToken();
			if (!token) {
				throw new Error('No se encontró token de autenticación');
			}
			const headers = {
				...defaultHeaders,
				Authorization: token
			};
			const response = await fetch(`${API_CONFIG.BASE_URL}/business/`, {
				method: 'POST',
				headers,
				body: JSON.stringify(business),
				signal: controller.signal
			});
			clearTimeout(id);
			console.log('response', response);
			if (!response.ok) {
				const errorBody = await response.json().catch(() => ({}));
				const errorType = errorService.mapHttpToErrorType(response.status);

				throw new AppError(
					errorBody.message || 'Error en la solicitud',
					errorType,
					response.status
				);
			}
			const data: BusinessResponse = await response.json();
			//console.log('data response: ', data);
			return data;
		} catch (error) {
			console.log('error', error);
			clearTimeout(id);
			if (error instanceof DOMException && error.name === 'AbortError') {
				throw new AppError('Solicitud cancelada', ErrorType.NETWORK, 408);
			}

			if (error instanceof AppError) {
				throw errorService.getUserFriendlyMessage(error);
			}

			throw new AppError(
				'Error de red',
				ErrorType.NETWORK,
				undefined,
				error instanceof Error ? error : undefined
			);
		}
	}

	async chatStreamSend(payload: ChatStreamSend): Promise<ChatStreamResponse> {
		const token = await authService.getCurrentUserToken();
		console.log('payload', payload);
		const queryParams = new URLSearchParams({
			message: payload.message,
			timezone: payload.timezone
		});
		const endpoint = `${API_CONFIG.BASE_URL}/chat_sse/chat/stream/${payload.session_id}?${queryParams.toString()}`;

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
					Authorization: token,
					Accept: 'text/event-stream'
				}
			});

			if (!response.ok) {
				throw new Error(`Error en la petición: ${response.statusText}`);
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
					if (event.startsWith('data: ')) {
						const jsonData = event.substring(6); // Quita "data: "

						try {
							const data = JSON.parse(jsonData);

							// Maneja errores del servidor
							if (data.error) {
								console.error('Error del servidor:', data.details);
								throw new Error(data.details);
							}

							// Procesa cada elemento del array
							data.forEach((part: any) => {
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

								// Almacena texto decodificando caracteres Unicode
								if (part.text) {
									// const decodedText = part.text.replace(/\\u([0-9a-fA-F]{4})/g,
									// 	(match: string, grp: string) => String.fromCharCode(parseInt(grp, 16)));
									streamResponse.textMessages.push(part.text);
								}
							});
						} catch (parseError) {
							console.error('Error al parsear JSON:', jsonData, parseError);
							throw new Error(`Error al parsear respuesta: ${parseError}`);
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

export const chatSSEService = new ChatSSEService();
