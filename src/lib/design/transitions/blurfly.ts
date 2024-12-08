import BezierEasing from 'bezier-easing';
import { cubicIn } from 'svelte/easing';
import type { FlyParams } from 'svelte/transition';

import { split_css_unit } from './utils';

export function blurfly(
	node: Element,
	{
		delay = 0,
		duration = 1000,
		blur = 4,
		easing = cubicIn,
		x = 0,
		y = 0,
		opacity = 0
	}: FlyParams & { blur?: number } = {}
) {
	// We ignore initial transform and opacity cauase
	// they are read incorrectly on animation start when prev didn't finish

	const style = getComputedStyle(node);
	const target_opacity = +style.opacity;
	// const transform = style.transform === 'none' ? '' : style.transform;
	// const target_opacity = 1;

	const od = target_opacity * (1 - opacity);
	const [x_value, x_unit] = split_css_unit(x);
	const [y_value, y_unit] = split_css_unit(y);
	return {
		delay,
		duration,
		easing,
		css: (t: number, u: number) => `
			transform: translate(${(1 - t) * Number(x_value)}${x_unit}, ${(1 - t) * Number(y_value)}${y_unit});
			filter: blur(${(1 - t) * blur}px);
			opacity: ${target_opacity - od * u}`
	};
}

export function getBlurFlyConfig(yshift: 'top' | 'bottom'): FlyParams {
	return {
		duration: 400,
		y: 7 * (yshift === 'top' ? -1 : 1),
		opacity: 0,
		easing: BezierEasing(0.2, 0, 0.4, 1)
	};
}
