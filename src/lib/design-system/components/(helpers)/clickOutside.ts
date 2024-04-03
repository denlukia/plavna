export function clickoutside(node: HTMLElement, callback: () => void) {
	window.addEventListener('click', handleClick);

	function handleClick(e: MouseEvent) {
		const target = e.target;
		if (!(target instanceof HTMLElement)) return;
		if (!node.contains(target)) {
			callback();
		}
	}

	return {
		destroy() {
			window.removeEventListener('click', handleClick);
		}
	};
}
