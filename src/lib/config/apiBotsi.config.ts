import { AppError, errorService, ErrorType } from '$lib/services/error.service';
import { authStore } from '$lib/stores';
import { get } from 'svelte/store';
import { API_CONFIG, defaultHeaders } from './api.config';
import { redirect } from '$lib/utils/redirect';
import { authService, type RefreshTokenRequest } from '$lib/services/authService';

class ApiBotsi {
	private isRefreshing = false;
	private failedQueue: Array<{
		resolve: (value: any) => void;
		reject: (reason: any) => void;
	}> = [];

	// Metodo para procesar la cola de peticiones fallidas
	private processQueue(error: any = null, token: string | null = null) {
		this.failedQueue.forEach(({ resolve, reject }) => {
			if (error) {
				reject(error);
			} else {
				resolve(token);
			}
		});

		this.failedQueue = [];
	}

	// Metodo para refrescar el token
	private async refreshToken(): Promise<string> {
		if (this.isRefreshing) {
			// Si ya se esta refrescando, agregar a la cola
			return new Promise((resolve, reject) => {
				this.failedQueue.push({ resolve, reject });
			});
		}

		this.isRefreshing = true;

		try {
			const refresh_token = get(authStore).refresh_token;
			if (!refresh_token) {
				throw new Error('No refresh token available');
			}

			const requestRefreshToken: RefreshTokenRequest = {
				grant_type: 'refresh_token',
				refresh_token
			};

			const responseRefreshToken = await authService.requestRefreshToken(requestRefreshToken);
			console.log('responseRefreshToken: ', responseRefreshToken);

			authStore.updateAccessToken(responseRefreshToken.access_token);
			authStore.updateRefreshToken(responseRefreshToken.refresh_token);
			console.log('token actualizado: ', get(authStore).access_token);
			// Procesar cola con el nuevo token
			this.processQueue(null, responseRefreshToken.access_token);

			return responseRefreshToken.access_token;
		} catch (error) {
			// Procesar cola con error
			this.processQueue(error, null);
			// Redirigir a login si falla el refresh
			redirect('/auth/sign-in');
			throw error;
		} finally {
			this.isRefreshing = false;
		}
	}

	// Metodo generico para solicitudes con retry automatico
	private async request<T>(
		endpoint: string,
		method: string,
		data?: any,
		isRetry = false
	): Promise<T> {
		const controller = new AbortController();
		const id = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

		try {
			const token = get(authStore).access_token;
			if (!token) {
				redirect('/auth/sign-in');
				throw new Error('No se encontro token de autenticacion');
			}

			const headers = {
				...defaultHeaders,
				...(token && { Authorization: `Bearer ${token}` })
			};

			const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
				method,
				headers,
				body: data ? JSON.stringify(data) : undefined,
				signal: controller.signal
			});

			clearTimeout(id);

			// Si es 401 y no es un retry, intentar refrescar token
			if (response.status === 401 && !isRetry) {
				try {
					await this.refreshToken();
					// Reintentar la petición original con el nuevo token
					return this.request<T>(endpoint, method, data, true);
				} catch {
					// Si falla el refresh, lanzar error original
					throw new AppError('Sesion expirada', ErrorType.AUTHENTICATION, 401);
				}
			}

			// Si es 204 (No Content), retornar objeto vacío
			if (response.status === 204) {
				return {} as T;
			}

			// Si la respuesta no es exitosa
			if (!response.ok) {
				const errorBody = await response.json().catch(() => ({}));
				const errorType = errorService.mapHttpToErrorType(response.status);

				throw new AppError(
					errorBody.message || 'Error en la solicitud',
					errorType,
					response.status
				);
			}

			return response.json();
		} catch (error) {
			clearTimeout(id);

			// Error de timeout/cancelacion
			if (error instanceof DOMException && error.name === 'AbortError') {
				throw new AppError('Solicitud cancelada', ErrorType.NETWORK, 408);
			}

			// Si es AppError, relanzar
			if (error instanceof AppError) {
				throw error;
			}

			// Error de red genérico
			throw new AppError(
				'Error de red',
				ErrorType.NETWORK,
				undefined,
				error instanceof Error ? error : undefined
			);
		}
	}

	// Metodos para diferentes tipos de solicitudes
	async get<T>(endpoint: string): Promise<T> {
		return this.request<T>(endpoint, 'GET');
	}

	async post<T>(endpoint: string, data: any): Promise<T> {
		return this.request<T>(endpoint, 'POST', data);
	}

	async put<T>(endpoint: string, data: any): Promise<T> {
		console.log('data apiconfig: ', data);
		return this.request<T>(endpoint, 'PUT', data);
	}

	async patch<T>(endpoint: string, data: any): Promise<T> {
		return this.request<T>(endpoint, 'PATCH', data);
	}

	async delete<T>(endpoint: string, data?: any): Promise<T> {
		return this.request<T>(endpoint, 'DELETE', data);
	}
}

export const apiBotsi = new ApiBotsi();
