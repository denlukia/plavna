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
		onmousemove(e: MouseEvent) {
			const currentTarget = e.currentTarget as HTMLButtonElement | HTMLAnchorElement;
			const rect = currentTarget.getBoundingClientRect();
			mouse.x = e.clientX - rect.left;
			mouse.y = e.clientY - rect.top;
		},
		onmouseenter(e: MouseEvent) {
			mouse.hovered = true;
		},
		onmouseleave(e: MouseEvent) {
			mouse.hovered = false;
		}
	};
}
