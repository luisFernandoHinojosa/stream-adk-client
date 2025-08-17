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
		Permission.VIEW_STREAM
	],
	[Role.ADMIN]: [
		Permission.VIEW_USERS,
		Permission.UPDATE_USER_ROLE, // actualizar ADMIN o VIEWER
		Permission.VIEW_STREAM
	],
	[Role.VIEWER]: [Permission.VIEW_STREAM],
	[Role.MASTER]: [
		Permission.VIEW_USERS,
		Permission.CREATE_USER,
		Permission.UPDATE_USER_ROLE,
		Permission.UPDATE_ANY_ROLE,
		Permission.VIEW_STREAM
	]
};

// Route permisos
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
	'/users': [Permission.VIEW_USERS],
	'/stream': [Permission.VIEW_STREAM]
};
