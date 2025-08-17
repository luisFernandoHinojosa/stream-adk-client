// src/lib/server/roles.ts

/**
 * Define los roles de usuario. Usar un enum es más claro que números.
 */
export enum UserRole {
	OWNER = 1,
	ADMIN = 2,
	VIEWER = 3
}

// Un mapa inverso para convertir el ID del rol a su nombre de string
export const RoleName: { [key: number]: string } = {
	1: 'OWNER',
	2: 'ADMIN',
	3: 'VIEWER'
};

/**
 * Tipo para el objeto de usuario, consistente en toda la app.
 */
export type User = {
	user_id: string;
	user_name: string;
	user_email: string;
	role_id: UserRole;
};

/**
 * Función para verificar si un usuario tiene un rol mínimo requerido.
 * @param userRole El rol del usuario actual.
 * @param requiredRole El rol mínimo requerido.
 * @returns true si el usuario tiene permiso.
 */
export function hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean {
	// En este caso, un número menor es un rol más alto (1:OWNER, 2:ADMIN)
	return userRole <= requiredRole;
}

/**
 * Lógica centralizada para determinar si un usuario (actor) puede actualizar a otro (target).
 * @param actor El usuario que realiza la acción.
 * @param target El usuario que será modificado.
 * @returns true si la actualización es permitida.
 */
export function canUpdateUser(actor: User, target: User): boolean {
	// Nadie puede modificarse a sí mismo.
	if (actor.user_id === target.user_id) {
		return false;
	}

	// El OWNER puede modificar a cualquiera, excepto a sí mismo.
	if (actor.role_id === UserRole.OWNER) {
		return true;
	}

	// El ADMIN puede modificar a otros ADMINs y a VIEWERS, pero no a los OWNERs.
	if (actor.role_id === UserRole.ADMIN) {
		return target.role_id !== UserRole.OWNER;
	}

	// Los VIEWERS no pueden modificar a nadie.
	return false;
}

/**
 * Determina qué roles puede asignar un usuario (actor).
 * @param actor El usuario que realiza la acción.
 * @returns Un array de roles que el actor puede asignar.
 */
export function getAssignableRoles(actor: User): UserRole[] {
	if (actor.role_id === UserRole.OWNER) {
		return [UserRole.OWNER, UserRole.ADMIN, UserRole.VIEWER];
	}
	if (actor.role_id === UserRole.ADMIN) {
		// Un admin no puede crear o asignar el rol de OWNER.
		return [UserRole.ADMIN, UserRole.VIEWER];
	}
	return [];
}
