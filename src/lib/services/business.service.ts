import { API_CONFIG, defaultHeaders } from '$lib/config/api.config';
import type { BusinessResponse } from '$lib/interface/business.interface';
import { authService } from './auth.service';
import { AppError, errorService, ErrorType } from './error.service';

// Servicio de negocio
class BusinessService {
	async createBusiness(business: BusinessResponse): Promise<BusinessResponse> {
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

	//por terminar, falta service de traer los negocios de un usuario
	async getBusinesses(): Promise<BusinessResponse[]> {
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
			const response = await fetch(`${API_CONFIG.BASE_URL}/business/all-businesses/`, {
				method: 'GET',
				headers,
				signal: controller.signal
			});
			console.log('response', response);
			clearTimeout(id);

			if (response.status === 204) {
				return [];
			}

			if (!response.ok) {
				const errorBody = await response.json().catch(() => ({}));
				const errorType = errorService.mapHttpToErrorType(response.status);
				//console.log('errorBody', errorBody);
				throw new AppError(
					errorBody.message || 'Error en la solicitud',
					errorType,
					response.status
				);
			}
			const data: BusinessResponse[] = await response.json();
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

	async updateBusiness(
		business: Omit<BusinessResponse, 'business_id' | 'created_at' | 'updated_at'>,
		business_id: number
	): Promise<BusinessResponse> {
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
			const response = await fetch(`${API_CONFIG.BASE_URL}/business/${business_id}`, {
				method: 'PUT',
				headers,
				body: JSON.stringify(business),
				signal: controller.signal
			});
			clearTimeout(id);

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
			return data;
		} catch (error) {
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

	async deleteBusiness(business_id: number): Promise<void> {
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
			const response = await fetch(`${API_CONFIG.BASE_URL}/business/${business_id}`, {
				method: 'DELETE',
				headers,
				signal: controller.signal
			});
			clearTimeout(id);

			if (!response.ok) {
				const errorBody = await response.json().catch(() => ({}));
				const errorType = errorService.mapHttpToErrorType(response.status);

				throw new AppError(
					errorBody.message || 'Error en la solicitud',
					errorType,
					response.status
				);
			}
			const data = await response.json();
			return data;
		} catch (error) {
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
}
export const businessService = new BusinessService();
