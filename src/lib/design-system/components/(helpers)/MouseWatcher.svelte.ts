export class MouseWatcher {
	mouse = $state({ x: 0, y: 0, hovered: false });

	onmousemove = (e: MouseEvent) => {
		const currentTarget = e.currentTarget as HTMLButtonElement | HTMLAnchorElement;
		const rect = currentTarget.getBoundingClientRect();
		this.mouse.x = e.clientX - rect.left;
		this.mouse.y = e.clientY - rect.top;
	};
	onmouseenter = () => {
		this.mouse.hovered = true;
	};
	onmouseleave = () => {
		this.mouse.hovered = false;
	};
}

export type MouseState = MouseWatcher['mouse'];
