import { type CrossfadeParams, type TransitionConfig, fade } from 'svelte/transition';

function cubic_out(t: number) {
	const f = t - 1.0;
	return f * f * f + 1.0;
}

function assign<T, S>(tar: T, src: S) {
	// @ts-expect-error It was like this in original Svelte code
	for (const k in src) tar[k] = src[k];
	return tar as T & S;
}

type Transition = (node: Element, params: CrossfadeParams & { key: Key }) => () => TransitionConfig;

type Key = string | undefined;

export function crossfade({
	fadeOutDuration = 150,
	...defaults
}: CrossfadeParams & { fadeOutDuration?: number }): [Transition, Transition] {
	const to_receive = new Map();
	const to_send = new Map();

	function crossfade(from_node: Element, node: Element, params: CrossfadeParams): TransitionConfig {
		const {
			delay = 0,
			duration = (d: number) => Math.sqrt(d) * 30,
			easing = cubic_out
		} = assign(assign({}, defaults), params);
		const from = from_node.getBoundingClientRect();
		const to = node.getBoundingClientRect();
		const dx = from.left - to.left;
		const dy = from.top - to.top;
		const dw = from.width / to.width;
		const dh = from.height / to.height;
		const d = Math.sqrt(dx * dx + dy * dy);
		const style = getComputedStyle(node);
		const transform = style.transform === 'none' ? '' : style.transform;

		return {
			delay,
			duration: typeof duration === 'function' ? duration(d) : duration,
			easing,
			css: (t, u) => `
			   transform-origin: top left;
			   transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${t + (1 - t) * dw}, ${
						t + (1 - t) * dh
					});
		   `
		};
	}

	function transition(
		items: Map<Key, Element>,
		counterparts: Map<Key, Element>,
		intro: boolean
	): (node: Element, params: CrossfadeParams & { key: Key }) => () => TransitionConfig {
		// @ts-expect-error TODO improve typings (are the public types wrong?)
		return (node, params) => {
			items.set(params.key, node);
			return () => {
				const other_node = counterparts.get(params.key);
				if (other_node) {
					counterparts.delete(params.key);
					return intro
						? crossfade(other_node, node, params)
						: fade(node, { duration: fadeOutDuration });
				}
			};
		};
	}
	return [transition(to_send, to_receive, false), transition(to_receive, to_send, true)];
}
