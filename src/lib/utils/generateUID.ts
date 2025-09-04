// utils/uid.ts
import { v4 as uuidv4 } from 'uuid';

/**
 * Genera un UID único (UUID v4).
 * @returns string - UID generado
 */
export function generateUid(): string {
	return uuidv4();
}
