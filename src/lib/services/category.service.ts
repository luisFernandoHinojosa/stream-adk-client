import { API_CONFIG, defaultHeaders } from '$lib/config/api.config';
import type { Category, CategoryResponse } from '$lib/interface/category.interface';
import { authService } from './auth.service';
import { AppError, errorService, ErrorType } from './error.service';

class CategoryService {
	async createCategory(category: Category): Promise<CategoryResponse> {
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
			const response = await fetch(`${API_CONFIG.BASE_URL}/category/`, {
				method: 'POST',
				headers,
				signal: controller.signal,
				body: JSON.stringify(category)
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
			const data: CategoryResponse = await response.json();
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

	async updateCategory(category: CategoryResponse): Promise<CategoryResponse> {
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
			const response = await fetch(`${API_CONFIG.BASE_URL}/category/${category.category_id}`, {
				method: 'PUT',
				headers,
				signal: controller.signal,
				body: JSON.stringify(category)
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
			const data: CategoryResponse = await response.json();
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

	async getCategories(business_id: number): Promise<CategoryResponse[]> {
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
			const response = await fetch(`${API_CONFIG.BASE_URL}/category/?business_id=${business_id}`, {
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
			const data: CategoryResponse[] = await response.json();
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

export const categoryService = new CategoryService();
