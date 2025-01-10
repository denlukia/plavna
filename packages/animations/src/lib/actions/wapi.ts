import type { Spring } from 'svelte/motion';

const imaginaryDuration = 1000;

type Config = {
	progress: Spring<number> | null;
	keyframes?: Keyframe[];
	disableOnPoints?: number[];
	options?: KeyframeEffectOptions;
};

export function wapi(
	node: HTMLElement,
	{
		progress,
		keyframes,
		disableOnPoints = [],
		options = {
			duration: imaginaryDuration,
			fill: 'both',
			composite: 'replace'
		}
	}: Config
) {
	let animation: Animation | null, boundingBox: DOMRect | null;
	let unsubscribe = () => {};

	function onProgressChange(progress: number) {
		requestAnimationFrame(() => {
			if (disableOnPoints.includes(progress)) {
				animation && animation.cancel();
				animation = boundingBox = null;
			} else {
				!boundingBox && (boundingBox = node.getBoundingClientRect());

				!animation && (animation = createAnimation());
				setAnimationProgress(progress);
			}
		});
	}

	function createAnimation() {
		const animKeyframes =
			keyframes instanceof Function ? keyframes({ boundingBox, window, node }) : keyframes;
		let animation = node.animate(animKeyframes, options);
		animation.pause();
		return animation;
	}

	function setAnimationProgress(progress: number) {
		if (typeof progress !== 'number' || isNaN(progress)) {
			console.warn(`Tried to set non-number animation ${progress} progress for`, node);
		}
		animation && (animation.currentTime = imaginaryDuration * progress);
	}

	if (progress) unsubscribe = progress.subscribe(onProgressChange);
	return {
		destroy() {
			unsubscribe();
		},
		update({ progress, keyframes: newKeyframes, disableOnPoints: disableOnPointsNew }: Config) {
			unsubscribe();
			if (progress) unsubscribe = progress.subscribe(onProgressChange);
			keyframes = newKeyframes;
			disableOnPoints = disableOnPointsNew;
		}
	};
}
