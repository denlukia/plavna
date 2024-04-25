import { cubicOut } from 'svelte/easing';
import type { FlyParams } from 'svelte/transition';

export function fly(
	node: Element,
	{ delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }: FlyParams = {}
) {
	// We ignore initial transform and opacity cauase
	// they are read incorrectly on animation start when prev didn't finish

	// const style = getComputedStyle(node);
	// const target_opacity = +style.opacity;
	// const transform = style.transform === 'none' ? '' : style.transform;
	const target_opacity = 1;

	const od = target_opacity * (1 - opacity);
	const [x_value, x_unit] = split_css_unit(x);
	const [y_value, y_unit] = split_css_unit(y);
	return {
		delay,
		duration,
		easing,
		css: (t: number, u: number) => `
			transform: translate(${(1 - t) * Number(x_value)}${x_unit}, ${(1 - t) * Number(y_value)}${y_unit});
			opacity: ${target_opacity - od * u}`
	};
}

function split_css_unit(value: number | string) {
	const split = typeof value === 'string' && value.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
	return split
		? ([parseFloat(split[1]), split[2] || 'px'] as const)
		: ([/** @type {number} */ value, 'px'] as const);
}
