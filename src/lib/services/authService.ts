import { API_CONFIG } from '$lib/config/api.config';
import type { AuthResponse } from '$lib/interface/auth.interface';
import { authStore } from '$lib/stores';
import { AppError, errorService } from './error.service';

export interface TokenRequest {
	grant_type: string;
	username: string;
	password: string;
}

export interface RefreshTokenRequest {
	grant_type: 'refresh_token' | null;
	refresh_token: string | null;
}

export interface ApiError {
	error: string;
	error_description?: string;
	error_uri?: string;
}

class AuthService {
	/**
	 * Obtiene un token de acceso usando username y password
	 */
	async login(username: string, password: string): Promise<AuthResponse> {
		const tokenRequest: TokenRequest = {
			grant_type: 'password',
			username,
			password
		};

		return this.requestToken(tokenRequest);
	}

	/**
	 * Método privado para realizar la petición al endpoint /token
	 */
	private async requestToken(tokenRequest: TokenRequest): Promise<AuthResponse> {
		try {
			// Convertir el objeto a form data
			const formData = new URLSearchParams();
			formData.append('grant_type', tokenRequest.grant_type);
			formData.append('username', tokenRequest.username);
			formData.append('password', tokenRequest.password);

			const response = await fetch(`${API_CONFIG.BASE_URL}/token`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Accept: 'application/json'
				},
				body: formData
			});
			console.log('response', response);
			const data = await response.json();

			if (!response.ok) {
				const errorType = errorService.mapHttpToErrorType(response.status);
				const message = data.detail || 'Error de autenticación';
				throw new AppError(message, errorType, response.status, data);
			}
			console.log('data login', data);
			return data as AuthResponse;
		} catch (error) {
			// Simplemente relanzamos el error, ya sea un AppError de nuestra lógica
			// o un error de red del fetch.
			throw error;
		}
	}

	async requestRefreshToken(tokenRequest: RefreshTokenRequest): Promise<AuthResponse> {
		try {
			// Convertir el objeto a form data
			const formData = new URLSearchParams();
			formData.append('grant_type', tokenRequest.grant_type!);
			formData.append('refresh_token', tokenRequest.refresh_token!);

			const response = await fetch(`${API_CONFIG.BASE_URL}/token`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Accept: 'application/json'
				},
				body: formData
			});

			const data = await response.json();

			if (!response.ok) {
				const error: ApiError = data;
				throw new Error(
					`Error ${response.status}: ${error.error} - ${error.error_description || 'Authentication failed'}`
				);
			}

			return data as AuthResponse;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('Error de red o conexión');
		}
	}

	saveToken(tokenResponse: AuthResponse): void {
		authStore.login(tokenResponse);
	}

	/**
	 * Recupera el token guardado desde localStorage
	 */
	getSavedToken(): AuthResponse | null {
		if (typeof window !== 'undefined' && window.localStorage) {
			const accessToken = localStorage.getItem('access_token');
			const tokenType = localStorage.getItem('token_type');

			if (accessToken && tokenType) {
				return {
					access_token: accessToken,
					refresh_token: '',
					token_type: tokenType
				};
			}
		}
		return null;
	}

	/**
	 * Limpia los tokens guardados
	 */
	clearSavedToken(): void {
		if (typeof window !== 'undefined' && window.localStorage) {
			localStorage.removeItem('access_token');
			localStorage.removeItem('token_type');
		}
	}

	/**
	 * Obtiene el header de autorización para usar en otras peticiones
	 */
	getAuthorizationHeader(token?: string): string {
		const accessToken = token || this.getSavedToken()?.access_token;
		if (!accessToken) {
			throw new Error('No hay token de acceso disponible');
		}
		return `Bearer ${accessToken}`;
	}
}

export const authService = new AuthService();
