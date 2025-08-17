import type { User } from '$lib/interface';
import { Role } from '$lib/config/permissions';

interface RolePermissions {
	canManage: Role[];
	canAssign: Role[];
	restrictions: string[];
}

const ROLE_PERMISSIONS: Record<Role, RolePermissions> = {
	[Role.MASTER]: {
		canManage: [Role.OWNER, Role.ADMIN, Role.VIEWER],
		canAssign: [Role.OWNER, Role.ADMIN, Role.VIEWER],
		restrictions: ['cannot_change_own_role', 'cannot_assign_master_role']
	},
	[Role.OWNER]: {
		canManage: [Role.ADMIN, Role.VIEWER],
		canAssign: [Role.OWNER, Role.ADMIN, Role.VIEWER],
		restrictions: ['cannot_change_own_role', 'cannot_manage_master', 'cannot_assign_master_role']
	},
	[Role.ADMIN]: {
		canManage: [Role.VIEWER],
		canAssign: [Role.ADMIN, Role.VIEWER],
		restrictions: [
			'cannot_change_own_role',
			'cannot_manage_owner_or_master',
			'cannot_assign_owner_or_master_role'
		]
	},
	[Role.VIEWER]: {
		canManage: [],
		canAssign: [],
		restrictions: ['cannot_manage_any_user', 'cannot_assign_any_role']
	}
};

export class RoleValidator {
	static canManageUser(currentUser: User, targetUser: User): boolean {
		if (!this.validateUsers(currentUser, targetUser)) {
			return false;
		}

		// Un usuario no puede modificarse a sí mismo
		if (currentUser.user_id === targetUser.user_id) {
			return false;
		}

		const permissions = ROLE_PERMISSIONS[currentUser.role_id as Role];
		if (!permissions) {
			return false;
		}

		// Verificar si el rol actual puede gestionar el rol del usuario objetivo
		return permissions.canManage.includes(targetUser.role_id as Role);
	}

	//Verifica si un usuario puede actualizar el rol de otro usuario a un rol específico

	static canUpdateUserRole(currentUser: User, targetUser: User, newRole: Role): boolean {
		// Verificar si puede gestionar al usuario
		if (!this.canManageUser(currentUser, targetUser)) {
			return false;
		}

		const permissions = ROLE_PERMISSIONS[currentUser.role_id as Role];
		if (!permissions) {
			return false;
		}

		// Verificar si puede asignar el nuevo rol
		return permissions.canAssign.includes(newRole);
	}

	//Obtiene los roles que un usuario puede asignar a otros
	static getAssignableRoles(currentUser: User): Role[] {
		if (!currentUser || !currentUser.role_id) {
			return [];
		}

		const permissions = ROLE_PERMISSIONS[currentUser.role_id as Role];
		return permissions ? permissions.canAssign : [];
	}

	// Obtiene los roles que un usuario puede gestionar
	static getManageableRoles(currentUser: User): Role[] {
		if (!currentUser || !currentUser.role_id) {
			return [];
		}

		const permissions = ROLE_PERMISSIONS[currentUser.role_id as Role];
		return permissions ? permissions.canManage : [];
	}

	// Obtiene las restricciones de un rol
	static getRoleRestrictions(role: Role): string[] {
		const permissions = ROLE_PERMISSIONS[role];
		return permissions ? permissions.restrictions : [];
	}

	// Verifica si un rol tiene una restriccion
	static hasRestriction(role: Role, restriction: string): boolean {
		const restrictions = this.getRoleRestrictions(role);
		return restrictions.includes(restriction);
	}

	// Obtiene información completa de permisos para un rol
	static getRolePermissions(role: Role): RolePermissions | null {
		return ROLE_PERMISSIONS[role] || null;
	}

	// Verifica si los usuarios son validos para las operaciones
	private static validateUsers(currentUser: User, targetUser: User): boolean {
		return !!(
			currentUser &&
			targetUser &&
			currentUser.user_id &&
			targetUser.user_id &&
			currentUser.role_id !== undefined &&
			targetUser.role_id !== undefined
		);
	}

	// Obtiene todos los roles disponibles en el sistema
	static getAllRoles(): Role[] {
		return Object.values(Role).filter((value) => typeof value === 'number') as Role[];
	}

	// Verifica si un usuario puede realizar una accion
	static canPerformAction(currentUser: User, action: string): boolean {
		if (!currentUser || !currentUser.role_id) {
			return false;
		}

		const restrictions = this.getRoleRestrictions(currentUser.role_id as Role);

		// Si la accion esta en las restricciones, no puede realizarla
		return !restrictions.includes(action);
	}
}
