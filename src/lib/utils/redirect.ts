import { goto } from '$app/navigation';

export const redirect = (url: string): void => {
	goto(url);
};
