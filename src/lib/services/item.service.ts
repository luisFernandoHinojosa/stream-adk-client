import { API_CONFIG, defaultHeaders } from '$lib/config/api.config';
import type { ItemResponse } from '$lib/interface/item.interface';
import { authService } from './auth.service';
import { AppError, errorService, ErrorType } from './error.service';

// Servicio de usuario
class ItemService {
	async createProduct(
		product: Omit<ItemResponse, 'item_id' | 'created_at' | 'updated_at' | 'item_slug'>
	): Promise<ItemResponse> {
		const controller = new AbortController();
		const id = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
		try {
			//console.log('product create', product);
			const token = await authService.getCurrentUserToken();
			if (!token) {
				throw new Error('No se encontró token de autenticación');
			}
			const headers = {
				...defaultHeaders,
				Authorization: token
			};
			const response = await fetch(`${API_CONFIG.BASE_URL}/item/`, {
				method: 'POST',
				headers,
				body: JSON.stringify(product),
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
			const data: ItemResponse = await response.json();
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

	async getProducts(business_id: number): Promise<ItemResponse[]> {
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
			const response = await fetch(`${API_CONFIG.BASE_URL}/item/?business_id=${business_id}`, {
				method: 'GET',
				headers,
				signal: controller.signal
			});
			clearTimeout(id);

			if (response.status === 204) {
				return [];
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
			const data: ItemResponse[] = await response.json();
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

	async updateProduct(product: ItemResponse): Promise<ItemResponse> {
		const controller = new AbortController();
		const id = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
		try {
			const token = await authService.getCurrentUserToken();
			if (!token) {
				throw new Error('No se encontró token de autenticación');
			}
			const headers = {
				Authorization: token
			};

			console.log('item id', product);

			const formData = new FormData();

			for (const key of Object.keys(product) as Array<keyof typeof product>) {
				const value = product[key];

				if (value !== undefined && value !== null) {
					if (key === 'categories' && Array.isArray(value)) {
						value.forEach((cat) => {
							formData.append('categories', cat.toString());
						});
					} else {
						formData.append(key, value.toString());
					}
				}
			}

			for (const pair of formData.entries()) {
				console.log('pair: ', `${pair[0]}: ${pair[1]}`);
			}
			const response = await fetch(`${API_CONFIG.BASE_URL}/item/${product.item_id}`, {
				method: 'PUT',
				headers,
				body: formData,
				signal: controller.signal
			});
			clearTimeout(id);

			if (!response.ok) {
				const errorBody = await response.json().catch(() => ({}));
				const errorType = errorService.mapHttpToErrorType(response.status);
				console.log('errorBody: ', errorBody);
				throw new AppError(
					errorBody.message || 'Error en la solicitud',
					errorType,
					response.status
				);
			}
			const data: ItemResponse = await response.json();
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

	async deleteProduct(item_id: number): Promise<void> {
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
			const response = await fetch(`${API_CONFIG.BASE_URL}/item/${item_id}`, {
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
export const itemService = new ItemService();
