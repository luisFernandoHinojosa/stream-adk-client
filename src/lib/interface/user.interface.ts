export interface User {
	user_name: string;
	user_email: string;
	role_id: number;
	user_id: string;
}

export interface UserRequest {
	user_name: string;
	user_email: string;
	role_id: number;
	password: string;
}

export interface RoleUpdatePayload {
	role: number;
}

export const ROLES = {
	1: 'OWNER',
	2: 'ADMIN',
	3: 'VIEWER',
	4: 'MASTER'
} as const;
