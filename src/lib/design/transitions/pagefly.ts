import { cubicOut } from 'svelte/easing';
import type { FlyParams } from 'svelte/transition';
import { PAGE_OUTROING_ATTRIBUTE_NAME } from '$lib/collections/config';

import { split_css_unit } from './utils';

export function pagefly(
	node: Element,
	{
		delay = 0,
		duration = 1000,
		easing = cubicOut,
		x = 0,
		y = 0,
		opacity = 0
	}: FlyParams & { blur?: number } = {}
) {
	const style = getComputedStyle(node);
	const target_opacity = +style.opacity;
	const transform = style.transform === 'none' ? '' : style.transform;

	const od = target_opacity * (1 - opacity);
	const [x_value, x_unit] = split_css_unit(x);
	const [y_value, y_unit] = split_css_unit(y);

	markBodyOutroingStart();
	setTimeout(markBodyOutroingEnd, duration);

	return {
		delay,
		duration,
		easing,
		css: (t: number, u: number) => `
			transform: ${transform} translate(${(1 - t) * Number(x_value)}${x_unit}, ${(1 - t) * Number(y_value)}${y_unit});
			opacity: ${target_opacity - od * u}`
	};
}

function markBodyOutroingStart() {
	document.body.setAttribute(PAGE_OUTROING_ATTRIBUTE_NAME, 'true');
}

function markBodyOutroingEnd() {
	document.body.removeAttribute(PAGE_OUTROING_ATTRIBUTE_NAME);
}
