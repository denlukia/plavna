export function split_css_unit(value: number | string) {
	const split = typeof value === 'string' && value.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
	return split
		? ([parseFloat(split[1] || '0'), split[2] || 'px'] as const)
		: ([/** @type {number} */ value, 'px'] as const);
}
