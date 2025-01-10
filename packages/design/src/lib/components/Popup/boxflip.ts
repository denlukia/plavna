import { cubicInOut } from 'svelte/easing';
import type { EasingFunction, TransitionConfig } from 'svelte/transition';

type RotateAndScaleParams = {
	delay?: number;
	duration?: number;
	easing?: EasingFunction;
	opacity?: number;
	scaleX?: number;
	scaleY?: number;
	rotationX?: number;
	rotationY?: number;
};

export function boxflip(
	node: Element,
	{
		delay = 0,
		duration = 400,
		easing = cubicInOut,
		scaleX = 0,
		scaleY = 0,
		rotationX = 0,
		rotationY = 0,
		opacity = 0
	}: RotateAndScaleParams = {}
): TransitionConfig {
	const style = getComputedStyle(node);
	const target_opacity = +style.opacity;
	const transform = style.transform === 'none' ? '' : style.transform;
	const scaleXDelta = 1 - scaleX;
	const scaleYDelta = 1 - scaleY;
	const rotationXDelta = 1 - rotationX;
	const rotationYDelta = 1 - rotationY;
	const od = target_opacity * (1 - opacity);
	return {
		delay,
		duration,
		easing,
		css: (_t, u) => `
			transform: ${transform} 
				scale(${1 - scaleXDelta * u}, ${1 - scaleYDelta * u}) 
				rotateX(${1 - rotationXDelta * u}deg) 
				rotateY(${1 - rotationYDelta * u}deg);
			opacity: ${target_opacity - od * u}
		`
	};
}
