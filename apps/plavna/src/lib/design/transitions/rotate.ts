import { cubicInOut } from 'svelte/easing';
import { type EasingFunction, type TransitionConfig } from 'svelte/transition';
import { mapRange } from '$lib/features/common/utils';

export function spin(
	node: Element,
	{
		duration = 400,
		delay = 0,
		easing = cubicInOut,
		angle = 180,
		opacity = 1
	}: {
		duration?: number;
		delay?: number;
		easing?: EasingFunction;
		angle?: number;
		opacity?: number;
	}
): TransitionConfig {
	return {
		duration,
		delay,
		easing,
		css: (t, u) => {
			return `
        opacity: ${mapRange(t, 0, 1, opacity, 1)};
        transform: rotateY(${u * angle}deg);
      `;
		}
	};
}
