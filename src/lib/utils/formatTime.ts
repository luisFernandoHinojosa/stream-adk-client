export function formatTime(dateString: string): string {
	console.log('dateString: ', dateString);
	const date = new Date(dateString.replace(/z$/i, ''));
	return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

// EJEMPLO:
// console.log('formatTime', formatTime('2025-01-18T00:24:00'));
// return: 00:24
