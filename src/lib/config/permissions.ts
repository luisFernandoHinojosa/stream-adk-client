export enum Role {
	OWNER = 1,
	ADMIN = 2,
	VIEWER = 3,
	MASTER = 4
}

export enum Permission {
	// User management
	VIEW_USERS = 'view_users',
	CREATE_USER = 'create_user',
	UPDATE_USER_ROLE = 'update_user_role',
	UPDATE_OWN_ROLE = 'update_own_role',
	UPDATE_ANY_ROLE = 'update_any_role',
	VIEW_SETTINGS = 'view_settings',
	VIEW_STATISTICS = 'view_statistics',
	VIEW_AGENTS = 'view_agents',
	VIEW_API_KEYS = 'view_api_keys',
	VIEW_SYSTEM_PROMPTS = 'view_system_prompts',

	// Stream access
	VIEW_STREAM = 'view_stream'
}

// permisos por rol
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
	[Role.OWNER]: [
		Permission.VIEW_USERS,
		Permission.CREATE_USER,
		Permission.UPDATE_USER_ROLE,
		Permission.UPDATE_ANY_ROLE,
		Permission.VIEW_STREAM,
		Permission.VIEW_SETTINGS,
		Permission.VIEW_STATISTICS,
		Permission.VIEW_AGENTS,
		Permission.VIEW_API_KEYS,
		Permission.VIEW_SYSTEM_PROMPTS
	],
	[Role.ADMIN]: [
		Permission.VIEW_USERS,
		Permission.UPDATE_USER_ROLE, // actualizar ADMIN o VIEWER
		Permission.VIEW_STREAM,
		Permission.VIEW_SETTINGS,
		Permission.VIEW_STATISTICS,
		Permission.VIEW_AGENTS,
		Permission.VIEW_API_KEYS,
		Permission.VIEW_SYSTEM_PROMPTS
	],
	[Role.VIEWER]: [Permission.VIEW_STREAM],
	[Role.MASTER]: [
		Permission.VIEW_USERS,
		Permission.CREATE_USER,
		Permission.UPDATE_USER_ROLE,
		Permission.UPDATE_ANY_ROLE,
		Permission.VIEW_STREAM,
		Permission.VIEW_SETTINGS,
		Permission.VIEW_STATISTICS,
		Permission.VIEW_AGENTS,
		Permission.VIEW_API_KEYS,
		Permission.VIEW_SYSTEM_PROMPTS
	]
};

// Route permisos
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
	'/users': [Permission.VIEW_USERS],
	'/stream': [Permission.VIEW_STREAM],
	'/settings': [Permission.VIEW_SETTINGS],
	'/settings/statistics': [Permission.VIEW_STATISTICS],
	'/settings/agents': [Permission.VIEW_AGENTS],
	'/settings/api-keys': [Permission.VIEW_API_KEYS],
	'/settings/system-prompts': [Permission.VIEW_SYSTEM_PROMPTS],
	'/settings/users': [Permission.VIEW_USERS]
};
