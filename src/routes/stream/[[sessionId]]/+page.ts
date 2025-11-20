import type { PageLoad } from './$types';
import { smartTrackerService } from '$lib/services/smartTracker.service';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
	const { sessionId } = params;

	// Si sessionId es undefined o vacío, es un chat nuevo
	if (!sessionId || sessionId === '') {
		return {
			isNewChat: true,
			session: null
		};
	}

	try {
		const session = await smartTrackerService.getSession(sessionId);
		return {
			isNewChat: false,
			session: session
		};
	} catch (err) {
		console.error(`Failed to load session ${sessionId}:`, err);
		throw error(404, 'Chat not found');
	}
};
// import type { PageLoad } from './$types';
// import { smartTrackerService } from '$lib/services/smartTracker.service';
// import { error } from '@sveltejs/kit';

// export const load: PageLoad = async ({ params }) => {
// 	const { sessionId } = params;

// 	// Si no hay chatId en la URL, es un chat nuevo. No necesitamos cargar nada.
// 	if (!sessionId) {
// 		return {
// 			isNewChat: true,
// 			session: null
// 		};
// 	}

// 	try {
// 		// Si hay un chatId, obtenemos los datos de la sesión.
// 		const session = await smartTrackerService.getSession(sessionId);
// 		console.log('session', session);
// 		return {
// 			isNewChat: false,
// 			session: session
// 		};
// 	} catch (err) {
// 		// Si la sesión no se encuentra o hay un error, redirigimos a una página de error 404.
// 		console.error(`Failed to load session ${sessionId}:`, err);
// 		throw error(404, 'Chat not found');
// 	}
// };
