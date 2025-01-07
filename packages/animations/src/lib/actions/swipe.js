import { get } from 'svelte/store';
import {
	createSpeedometer,
	clamp,
	calculatePointsDelta,
	calculateProjectedProgress,
	calculatePixelsPerAnimation,
	checkAngle
} from '$lib/helpers/actionHelpers';
import { applyPointerCapturePolyfill } from '$lib/helpers/pointerCapturePolyfill';

const dragStiffness = 1;
const dragDumping = 1;

export function swipe(
	node,
	{
		progress,
		direction = 'toRight',
		movementRatio = 0.5,
		releaseDistanceMultiplier = 0.5,
		releaseSpeedMultiplier = 0.01,
		releaseSpeedMin = 0.02,
		releaseSpeedMax = 0.03,
		releaseDumping = 0.3,
		snapPoints = []
	}
) {
	let pressPoint,
		pressProgress,
		pixelsPerAnimation,
		isActive,
		speedometer = null;
	let speed = 0;
	let angleChecked = false;

	function down(e) {
		if (!e.isPrimary || e.button !== 0) return;
		pressPoint = e;
		pixelsPerAnimation = calculatePixelsPerAnimation(node, direction, movementRatio);
	}

	function move(e) {
		if (!e.isPrimary || !pressPoint) return;
		if (!angleChecked) {
			let movementX = e.screenX - pressPoint.screenX;
			let movementY = e.screenY - pressPoint.screenY;
			if (movementX === 0 && movementY === 0) return;
			let isAngleAllowed = checkAngle(direction, movementX, movementY);
			angleChecked = true;

			if (isAngleAllowed) {
				isActive = true;
				pressProgress = get(progress);
				speedometer = createSpeedometer();

				progress.stiffness = dragStiffness;
				progress.damping = dragDumping;
				progress.set(clamp(pressProgress, 0, 1));

				node.setPointerCapture(e.pointerId);
			}
		}
		if (angleChecked && !isActive) up();
		if (isActive) {
			let pointsDelta = calculatePointsDelta(pressPoint, e, direction);
			let progressDelta = pointsDelta / pixelsPerAnimation;
			let newProgress = clamp(pressProgress + progressDelta, 0, 1);

			speed = speedometer(newProgress);
			progress.set(newProgress);
		}
	}

	function up() {
		let releaseProgress = get(progress);
		let projectedProgress = calculateProjectedProgress(
			releaseProgress,
			speed,
			snapPoints,
			releaseDistanceMultiplier
		);

		progress.stiffness = clamp(
			Math.abs(speed * releaseSpeedMultiplier),
			releaseSpeedMin,
			releaseSpeedMax
		);
		progress.damping = releaseDumping;
		progress.set(clamp(projectedProgress, 0, 1));

		clearVars();
	}

	function clearVars() {
		pressPoint = isActive = speedometer = pressProgress = pixelsPerAnimation = null;
		speed = 0;
		angleChecked = false;
	}

	node.addEventListener('pointerdown', down);
	node.addEventListener('pointermove', move);
	node.addEventListener('pointerup', up);
	node.addEventListener('pointercancel', up);
	applyPointerCapturePolyfill();
}
