export function preventRedirect<T extends (this: unknown, event: Event) => void>(fn: T): T {
	return function (this: unknown, event: Event): void {
		event.preventDefault();
		fn.call(this, event);
	} as T;
}
