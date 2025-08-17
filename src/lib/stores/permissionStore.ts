import { derived, get } from 'svelte/store';
import type { User } from '$lib/interface';
import {
	Permission,
	ROLE_PERMISSIONS,
	ROUTE_PERMISSIONS,
	type Role
} from '$lib/config/permissions';
import { userStore } from './userStore';

function createPermissionStore() {
	const permissions = derived(userStore, ($user: User) => {
		if (!$user?.role_id) return [];
		return ROLE_PERMISSIONS[$user.role_id as Role] || [];
	});

	return {
		subscribe: permissions.subscribe,

		// Check if user has specific permission
		hasPermission: (permission: Permission): boolean => {
			const currentPermissions = get(permissions);
			return currentPermissions.includes(permission);
		},

		// Check if user has any of the specified permissions
		hasAnyPermission: (requiredPermissions: Permission[]): boolean => {
			const currentPermissions = get(permissions);
			return requiredPermissions.some((permission) => currentPermissions.includes(permission));
		},

		// Check if user has all specified permissions
		hasAllPermissions: (requiredPermissions: Permission[]): boolean => {
			const currentPermissions = get(permissions);
			return requiredPermissions.every((permission) => currentPermissions.includes(permission));
		},

		// Check if user can access a route
		canAccessRoute: (route: string): boolean => {
			const routePermissions = ROUTE_PERMISSIONS[route];
			if (!routePermissions || routePermissions.length === 0) return true;

			const currentPermissions = get(permissions);
			return routePermissions.some((permission) => currentPermissions.includes(permission));
		}
	};
}

export const permissionStore = createPermissionStore();
