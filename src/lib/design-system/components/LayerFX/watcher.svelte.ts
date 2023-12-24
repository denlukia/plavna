export class MouseWatcher {
	mousePos = $state({ x: 0, y: 0 });
	onmousemove = (e: MouseEvent) => {
		const currentTarget = e.currentTarget as HTMLButtonElement | HTMLAnchorElement;
		const rect = currentTarget.getBoundingClientRect();
		this.mousePos.x = e.clientX - rect.left;
		this.mousePos.y = e.clientY - rect.top;
	};
}
