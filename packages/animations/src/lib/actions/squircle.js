export function squircle(node, radius = 5) {
	const pathId = 'clip-path-' + String(Math.floor(Math.random() * 1000));
	let width, height, finalRadius;

	function recalculateDimentions() {
		width = node.offsetWidth;
		height = node.offsetHeight;
		finalRadius = Math.min(width / 1.5, height / 1.5, 4.5 * radius);
	}
	function getPath() {
		return `<path
        d="M 0 ${height - finalRadius} C 0 ${height} 0 ${height}
        ${finalRadius}
        ${height} H ${width - finalRadius} C ${width}
        ${height}
        ${width}
        ${height}
        ${width}
        ${height - finalRadius} V ${finalRadius} C ${width} 0 ${width} 0 ${width - finalRadius}
        0 H ${finalRadius} C 0 0 0 0 0 ${finalRadius} V ${height - finalRadius}" />`;
	}
	function getSvgCode() {
		return `<svg width="0" height="0" style="position: absolute">
      <defs>
        <clipPath id="${pathId}">
          ${getPath()}
        </clipPath>
      </defs>
    </svg>`;
	}

	const ro = new ResizeObserver(() => {
		recalculateDimentions();
		document.getElementById(pathId).innerHTML = getPath();
	});
	ro.observe(node);

	recalculateDimentions();
	node.insertAdjacentHTML('beforeend', getSvgCode());
	node.style.clipPath = `url(#${pathId})`;

	return {
		update(newRadius) {
			requestAnimationFrame(() => {
				radius = newRadius;
				recalculateDimentions();
				const toChangePath = document.getElementById(pathId);
				toChangePath && (toChangePath.innerHTML = getPath());
				if (navigator.vendor.match(/apple/i)) {
					node.style.clipPath = null;
					node.style.clipPath += `url(#${pathId})`;
				}
			});
		},
		destroy() {
			ro.unobserve(node);
		}
	};
}
