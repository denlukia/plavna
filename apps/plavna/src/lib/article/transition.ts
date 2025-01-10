import { quintOut } from 'svelte/easing';
import { crossfade } from 'svelte/transition';

export const [send, receive] = crossfade({
	// duration: (d) => Math.sqrt(d * 200),
	duration: 600,

	fallback(node, params) {
		// const style = getComputedStyle(node);
		// const transform = style.transform === 'none' ? '' : style.transform;

		return {
			duration: 600,
			easing: quintOut,
			css: (t) => `opacity: ${t}`
		};
	}
});
