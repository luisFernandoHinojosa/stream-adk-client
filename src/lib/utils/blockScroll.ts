export function blockScroll(status: boolean): void {
	if (status) {
		document.body.style.overflow = 'hidden';
	} else {
		document.body.style.overflow = 'auto';
	}
}
