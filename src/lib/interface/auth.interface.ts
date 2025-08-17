export interface LoginRequest {
	username: string;
	password: string;
}

export interface AuthResponse {
	access_token: string;
	refresh_token: string;
	token_type: string;
}

export interface AuthState {
	access_token: string | null;
	refresh_token: string | null;
	token_type: string | null;
	isAuthenticated: boolean;
}
