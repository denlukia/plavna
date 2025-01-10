import { cubicIn, sineIn, sineOut } from 'svelte/easing';
import { clamp, getPointsInBetween, map } from '$lib/utils/helpers';

export function nullTransition(node: HTMLElement) {
	return {};
}

export function generateKeyframes(
	previewRect: DOMRect,
	finalRect: DOMRect,
	points: { closed: number; opened: number },
	zIndex: number | null,
	forFinal: boolean
): Keyframe[] {
	const middlePointsArr = getPointsInBetween(points.closed, points.opened, 7);

	const closedCenter = {
		x: previewRect.left + previewRect.width / 2,
		y: previewRect.top + previewRect.height / 2
	};
	const openedCenter = {
		x: finalRect.left + finalRect.width / 2,
		y: finalRect.top + finalRect.height / 2
	};
	const preClosedCenter = {
		x: closedCenter.x - map(sineOut(points.closed), 0, 1, 0, openedCenter.x - closedCenter.x),
		y: closedCenter.y - map(sineIn(points.closed), 0, 1, 0, openedCenter.y - closedCenter.y)
	};
	const postOpenedCenter = {
		x: openedCenter.x + map(1 - sineOut(points.opened), 0, 1, 0, openedCenter.x - closedCenter.x),
		y: openedCenter.y + map(1 - sineIn(points.opened), 0, 1, 0, openedCenter.y - closedCenter.y)
	};
	const closedSize = {
		x: previewRect.width,
		y: previewRect.height
	};
	const openedSize = {
		x: finalRect.width,
		y: finalRect.height
	};
	const preClosedSize = {
		x: closedSize.x - map(sineIn(points.closed - 0), 0, 1, 0, openedSize.x - closedSize.x),
		y: closedSize.y - map(sineIn(points.closed - 0), 0, 1, 0, openedSize.y - closedSize.y)
	};
	const postOpenedSize = {
		x: openedSize.x + map(1 - sineIn(points.opened), 0, 1, 0, openedSize.x - closedSize.x),
		y: openedSize.y + map(1 - sineIn(points.opened), 0, 1, 0, openedSize.y - closedSize.y)
	};

	function relTrans(coord: number, axis: 'x' | 'y') {
		return parseFloat(
			(forFinal ? coord - openedCenter[axis] : coord - closedCenter[axis]).toFixed(5)
		);
	}
	function relScale(size: number, axis: 'x' | 'y') {
		return parseFloat((forFinal ? size / openedSize[axis] : size / closedSize[axis]).toFixed(5));
	}

	function remapToZeroToOne(point: number) {
		return map(point, points.closed, points.opened, 0, 1);
	}

	function getMiddlePoints() {
		return middlePointsArr.map((point) => [
			{
				x: map(sineOut(remapToZeroToOne(point)), 0, 1, closedCenter.x, openedCenter.x),
				y: map(sineIn(remapToZeroToOne(point)), 0, 1, closedCenter.y, openedCenter.y)
			},
			{
				x: map(sineIn(remapToZeroToOne(point)), 0, 1, closedSize.x, openedSize.x),
				y: map(sineIn(remapToZeroToOne(point)), 0, 1, closedSize.y, openedSize.y)
			},
			point
		]);
	}

	const template = [
		[preClosedCenter, preClosedSize, 0],
		[closedCenter, closedSize, points.closed],
		...getMiddlePoints(),
		[openedCenter, openedSize, points.opened],
		[postOpenedCenter, postOpenedSize, 1]
	];

	return template.map(([center, size, offset]) => ({
		position: 'fixed',
		zIndex: zIndex === null ? 'unset' : zIndex,
		top: (forFinal ? finalRect.top : previewRect.top) + 'px',
		left: (forFinal ? finalRect.left : previewRect.left) + 'px',
		width: (forFinal ? finalRect.width : previewRect.width) + 'px',
		height: (forFinal ? finalRect.height : previewRect.height) + 'px',
		transform: `translate(${relTrans(center.x, 'x')}px,${relTrans(
			center.y,
			'y'
		)}px) scale(${relScale(size.x, 'x')},${relScale(size.y, 'y')})`,
		opacity: parseFloat(
			clamp(map(forFinal ? offset : 1 - offset, points.closed, points.opened, 0, 2), 0, 1).toFixed(
				3
			)
		),
		offset
	}));
}
