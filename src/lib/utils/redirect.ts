import { goto } from '$app/navigation';

export const redirect = (url: string, replaceState: boolean = false): void => {
	goto(url, { replaceState });
};
