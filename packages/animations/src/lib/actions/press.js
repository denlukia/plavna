import { get } from 'svelte/store';
import { moveDeltaFromPoints } from '$lib/helpers/actionHelpers';

const pressedState = 1;
const restState = 0;
const maxMoveTolerance = 10;

export function press(
	node,
	{
		progress,
		pressStiffness = 0.1,
		releaseStiffness = 0.1,
		alwaysReachEnd = false,
		resetIfMoved = true
	}
) {
	let upScheduled = false;
	let touchStart = { x: null, y: null };

	async function down(e) {
		if (e.button !== 0) return;
		progress.stiffness = pressStiffness;
		await progress.set(pressedState);
		if (upScheduled) {
			upScheduled = false;
			up();
		}
	}

	function up() {
		if (!alwaysReachEnd || get(progress) === 1) {
			progress.stiffness = releaseStiffness;
			progress.set(restState);
		} else {
			upScheduled = true;
		}
	}

	// For touchscreens, reset to 0 (if wanted) when finger moved
	function touchstart(e) {
		touchStart = { x: e.touches[0].screenX, y: e.touches[0].screenY };
	}

	function touchmove(e) {
		const currPoint = { x: e.touches[0].screenX, y: e.touches[0].screenY };
		const moveDelta = moveDeltaFromPoints(touchStart, currPoint);

		if (moveDelta > maxMoveTolerance) {
			upScheduled = false;
			progress.stiffness = releaseStiffness;
			progress.set(restState);
		}
	}

	function touchend() {
		touchStart = { x: null, y: null };
	}

	node.addEventListener('pointerdown', down);
	node.addEventListener('pointerup', up);
	node.addEventListener('pointerleave', up);

	// TODO: support non touch screens
	if (resetIfMoved) {
		node.addEventListener('touchstart', touchstart);
		node.addEventListener('touchmove', touchmove);
		node.addEventListener('touchend', touchend);
	}
}
