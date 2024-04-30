export type MouseState = {
	x: number;
	y: number;
	hovered: boolean;
};

export function createMouseWatcher() {
	const mouse: MouseState = $state({ x: 0, y: 0, hovered: false });

	return {
		get mouse() {
			return mouse;
		},
		// We use capture because not using it fired parent events
		// Supposedly because of this https://github.com/sveltejs/svelte/issues/11328
		// TODO Remove when fixed
		onmousemovecapture(e: MouseEvent) {
			const currentTarget = e.currentTarget as HTMLButtonElement | HTMLAnchorElement;
			const rect = currentTarget.getBoundingClientRect();
			mouse.x = e.clientX - rect.left;
			mouse.y = e.clientY - rect.top;
		},
		onmouseentercapture(e: MouseEvent) {
			mouse.hovered = true;
		},
		onmouseleavecapture(e: MouseEvent) {
			mouse.hovered = false;
		}
	};
}
