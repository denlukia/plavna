import {
	clamp,
	getScrollForSide,
	moveDeltaFromPoints,
	moveDirectionFromPoints,
	moveDeltaFromEvent,
	didDeltaDirectionChange
} from '$lib/helpers/actionHelpers';
import { get } from 'svelte/store';

const activMoves = { top: 'toTop', bottom: 'toBottom', left: 'toLeft', right: 'toRight' };
const deactMoves = { top: 'toBottom', bottom: 'toTop', left: 'toRight', right: 'toLeft' };
const moveStifness = 0.9;
const moveDamping = 1;
const maxAllowedPullStart = 5;
const msBeforeRest = 50;

export function pull(
	node,
	{
		side = 'top',
		progress,
		pixelsPerAnimation = 150,
		resetStifness = 0.1,
		resetDamping = 1,
		onReachingEnd = () => {}
	}
) {
	let prevTouch = { x: null, y: null };
	let wheelTimeout = null;
	let inResetting = false;
	let scrollStartPos = null;
	let prevDelta = 0;

	async function wheel(e) {
		if (inResetting) return;

		let scrollPos = getScrollForSide(node, side);
		let delta = moveDeltaFromEvent(e, side);
		if (prevDelta === null) prevDelta = delta;

		if (scrollStartPos === null || didDeltaDirectionChange(delta, prevDelta))
			scrollStartPos = scrollPos;
		prevDelta = delta;

		if (scrollPos <= 0 && scrollStartPos <= 0) {
			if (delta > 0) node.style.overflow = 'hidden';
			let newProgress = clamp(get(progress) + delta / pixelsPerAnimation, 0, 1);
			setProgress(newProgress, 'move');
		}

		let currProgress = get(progress);
		if (currProgress === 0) {
			node.style.overflow = '';
		} else if (currProgress === 1) {
			reset();
		}

		clearTimeout(wheelTimeout);
		wheelTimeout = setTimeout(wheelEventsStopped, msBeforeRest);
	}

	function touchmove(e) {
		if (inResetting) return;

		let newTouch = { x: e.touches[0].screenX, y: e.touches[0].screenY };
		let moveDirection = moveDirectionFromPoints(prevTouch, newTouch);

		if (node.style.overflow === 'hidden') {
			if (moveDirection === activMoves[side]) node.style.overflow = '';
		} else if (moveDirection === deactMoves[side] && getScrollForSide(node, side) <= 0) {
			node.style.overflow = 'hidden';
		}
		if (getScrollForSide(node, side) <= 1) {
			let delta = moveDeltaFromPoints(prevTouch, newTouch, side);
			let newProgress = clamp(get(progress) + delta / pixelsPerAnimation, 0, 1);
			setProgress(newProgress);
		}
		if (get(progress) === 1) reset();
		prevTouch = newTouch;
	}

	function touchstart(e) {
		if (inResetting) return;
		prevTouch = { x: e.touches[0].screenX, y: e.touches[0].screenY };
		setProgress(null, 'move');
	}

	function touchend() {
		node.style.overflow = '';
		setProgress(0, 'reset');
	}

	async function reset() {
		node.style.overflow = '';
		inResetting = true;
		await onReachingEnd();
		setProgress(0, 'reset');
		setTimeout(() => {
			inResetting = false;
		}, 1000);
	}

	function setProgress(newProgress, mode) {
		if (mode) {
			progress.stiffness = mode === 'reset' ? resetStifness : moveStifness;
			progress.damping = mode === 'reset' ? resetDamping : moveDamping;
		}
		if (newProgress !== null) progress.set(newProgress);
	}

	function wheelEventsStopped() {
		setProgress(0, 'reset');
		scrollStartPos = null;
		node.style.overflow = '';
	}

	node.addEventListener('wheel', wheel, { passive: true });
	node.addEventListener('touchstart', touchstart);
	node.addEventListener('touchmove', touchmove);
	node.addEventListener('touchend', touchend);
}
