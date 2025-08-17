import { API_CONFIG, defaultHeaders } from '$lib/config/api.config';
import type { StoreMeta, StoreMetaResponse } from '$lib/interface/business.interface';
import { authService } from './auth.service';
import { AppError, errorService, ErrorType } from './error.service';
const storeMetaDefault: StoreMetaResponse = {
	meta_id: 0,
	show_title: false,
	meta_slug: '',
	business_id: 0,
	template: 'store',
	design_type_card: 0,
	color: {
		one: '#ffffff',
		one_d: '#ffffff',
		two: '#161634',
		two_d: '#161634',
		three: '#c32126',
		three_d: '#c32126',
		header: {
			background: '#e41c30',
			pattern: '#000000',
			icons: '#e41c30',
			background_icons: '#e4c92f',
			background_img_url: null,
			background_pattern: 1
		}
	},
	created_at: '2025-05-14T22:57:52.000Z',
	updated_at: '2025-05-14T22:57:52.000Z'
};

// Servicio de meta
class MetaService {
	async createMeta(meta: StoreMeta): Promise<StoreMetaResponse> {
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
			const response = await fetch(`${API_CONFIG.BASE_URL}/meta/`, {
				method: 'POST',
				headers,
				body: JSON.stringify(meta),
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
			const data: StoreMetaResponse = await response.json();
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

	//por terminar, falta service de traer los negocios de un usuario
	async getMeta(business_id: number): Promise<StoreMetaResponse> {
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
			const response = await fetch(`${API_CONFIG.BASE_URL}/meta/?business_id=${business_id}`, {
				method: 'GET',
				headers,
				signal: controller.signal
			});
			clearTimeout(id);

			if (response.status === 204) {
				return storeMetaDefault;
			}

			if (!response.ok) {
				const errorBody = await response.json().catch(() => ({}));
				const errorType = errorService.mapHttpToErrorType(response.status);

				throw new AppError(
					errorBody.message || 'Error en la solicitud',
					errorType,
					response.status
				);
			}
			const data: StoreMetaResponse = await response.json();
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

	async updateMeta(meta: StoreMeta, meta_id: number): Promise<StoreMetaResponse> {
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
			const response = await fetch(`${API_CONFIG.BASE_URL}/meta/${meta_id}`, {
				method: 'PUT',
				headers,
				body: JSON.stringify(meta),
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
			const data: StoreMetaResponse = await response.json();
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
export const metaService = new MetaService();
