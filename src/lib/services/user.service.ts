import { apiBotsi } from '$lib/config/apiBotsi.config';
import type { RoleUpdatePayload, User, UserRequest } from '$lib/interface/user.interface';

class UserService {
	async createUser(userData: UserRequest): Promise<UserRequest> {
		return await apiBotsi.post<UserRequest>(`/users/`, userData);
	}

	async updateUserRole(role: RoleUpdatePayload, userId: string): Promise<User[]> {
		return await apiBotsi.put<User[]>(`/users/${userId}/role`, role);
	}

	async getUsers(): Promise<User[]> {
		return await apiBotsi.get<User[]>(`/users/all-data`);
	}

	async getCurrentUser(): Promise<User> {
		return await apiBotsi.get<User>('/users/me');
	}
}

export const userService = new UserService();
