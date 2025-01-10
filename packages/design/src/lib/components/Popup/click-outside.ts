export function clickOutside(node: HTMLElement, callback: () => void) {
	window.addEventListener('pointerdown', handleClick);

	function handleClick(e: MouseEvent) {
		const target = e.target;
		if (!(target instanceof HTMLElement)) return;
		if (!node.contains(target)) {
			callback();
		}
	}

	return {
		destroy() {
			window.removeEventListener('pointerdown', handleClick);
		}
	};
}
