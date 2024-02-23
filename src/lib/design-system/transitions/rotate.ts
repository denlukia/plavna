import { cubicInOut } from 'svelte/easing';
import { type EasingFunction, type TransitionConfig } from 'svelte/transition';

export function spin(
	node: Element,
	{
		duration = 400,
		delay = 0,
		easing = cubicInOut
	}: { duration?: number; delay?: number; easing?: EasingFunction }
): TransitionConfig {
	return {
		duration,
		delay,
		easing,
		css: (t, u) => {
			return `
        opacity: ${t};
        transform: rotateY(${u * 90}deg);
      `;
		}
	};
}
