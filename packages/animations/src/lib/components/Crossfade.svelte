<script lang="ts">
	import { onMount } from 'svelte';
	import { spring, type Spring } from 'svelte/motion';
	import { crossfadeStates } from '$lib/stores/crossfade';
	import { generateKeyframes, nullTransition } from '$lib/utils/crossfade';
	import { wapi } from '$lib/actions/wapi';

	export let key: string;
	export let zIndex: number | null = null;
	export let final = false;

	const points = {
		closed: 0.1,
		opened: 0.9
	};

	let progress: Spring<number> | null = null,
		elementRef: HTMLDivElement | null = null,
		previewRef: HTMLDivElement | undefined,
		finalRef: HTMLDivElement | undefined,
		myKeyframes: Keyframe[] | undefined;

	function initializeProgress() {
		const myInitialValue = final ? points.opened : points.closed;
		const mountTime = Date.now();

		crossfadeStates.update((state) => ({
			...state,
			[key]: {
				progress: spring(myInitialValue, {
					stiffness: 0.03,
					damping: 0.25,
					precision: 0.001
				}),
				deviationX: spring(0),
				deviationY: spring(0),
				initializationTime: mountTime
			}
		}));
	}

	onMount(() => {
		if (!(key in $crossfadeStates)) {
			initializeProgress();
		} else {
			// 0. Early return if both types mounted during hydration
			if (Date.now() - $crossfadeStates[key].initializationTime <= 500) {
				console.warn(
					"Plavna Crossfade: both preview and final were mounted during hydration, but only one should've been."
				);
				return;
			}
		}

		if (key in $crossfadeStates) {
			// 1. Fill state with dom reference
			const refType = final ? 'finalRef' : 'previewRef';
			const stateOnKey = $crossfadeStates[key];
			crossfadeStates.update((state) => ({
				...state,
				[key]: { ...stateOnKey, [refType]: elementRef }
			}));

			// 2. Copy state to local
			({ progress, previewRef, finalRef } = $crossfadeStates[key]);

			// 3. Only when 2nd mounted:
			if (previewRef && finalRef) {
				// 3.1 Calculate closed and opened rect
				const previewRect = previewRef.getBoundingClientRect();
				const finalRect = finalRef.getBoundingClientRect();

				// 3.2 Generate keyframes
				const stateOnKey = $crossfadeStates[key];
				crossfadeStates.update((state) => ({
					...state,
					[key]: {
						...stateOnKey,
						previewKeyframes: generateKeyframes(previewRect, finalRect, points, zIndex, false),
						finalKeyframes: generateKeyframes(previewRect, finalRect, points, zIndex, true)
					}
				}));
			}

			// 4. Set progress to that of appeared block
			progress.set(final ? points.opened : points.closed);
		}
	});

	function onOutroEnd() {
		myKeyframes = undefined;
		crossfadeStates.update((state) => {
			let current = state[key];
			return {
				...state,
				[key]: { ...current, previewKeyframes: undefined, finalKeyframes: undefined }
			};
		});
	}

	$: if (typeof window !== 'undefined') {
		myKeyframes = $crossfadeStates?.[key]?.[final ? 'finalKeyframes' : 'previewKeyframes'];
	}
</script>

<div
	class="crossfade-wrapper"
	out:nullTransition
	bind:this={elementRef}
	on:outroend={onOutroEnd}
	use:wapi={{
		progress: progress,
		keyframes: myKeyframes,
		disableOnPoints: [points[final ? 'opened' : 'closed']]
	}}
>
	<slot />
</div>

<style>
	.crossfade-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
</style>
