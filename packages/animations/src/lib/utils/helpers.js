export function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}
export function map(value, x1, y1, x2, y2) {
	return ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;
}
export function closestInArray(val, array) {
	return array.reduce(function (prev, curr) {
		return Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev;
	});
}
export function createSpeedometer() {
	let previousTime, previousValue, previousSpeed;
	return (newValue) => {
		let newTime = new Date().valueOf();
		let newSpeed = 0;

		if (previousTime) {
			let timeDelta = newTime - previousTime;
			let valueDelta = newValue - previousValue;
			newSpeed = (1000 * valueDelta) / (1 + timeDelta);
			newSpeed = newSpeed * 0.8 + previousSpeed * 0.2;
		}

		previousTime = newTime;
		previousValue = newValue;
		previousSpeed = newSpeed;
		return newSpeed;
	};
}

export function calculatePointsDelta(point1, point2, direction) {
	let neededProperty = direction === 'toRight' || direction === 'toLeft' ? 'clientX' : 'clientY';
	let multiplier = direction === 'toRight' || direction === 'toBottom' ? -1 : 1;
	return (point1[neededProperty] - point2[neededProperty]) * multiplier;
}

export function calculateProjectedProgress(progress, speed, snapPoints, releaseMul) {
	let endProgress = progress + speed * releaseMul;
	return snapPoints ? closestInArray(endProgress, snapPoints) : endProgress;
}

export function checkAngle(direction, movementX, movementY) {
	let absX = Math.abs(movementX);
	let absY = Math.abs(movementY);
	if (direction === 'toRight' || direction === 'toLeft') {
		return absX > absY;
	} else {
		return absY > absX;
	}
}

export function calculatePixelsPerAnimation(node, direction, ratio) {
	let boundingBox = node.getBoundingClientRect();
	if (direction === 'toRight' || direction === 'toLeft') {
		return boundingBox.width / ratio;
	} else {
		return boundingBox.height / ratio;
	}
}

export function getScrollForSide(node, side) {
	if (side === 'top') {
		return node.scrollTop;
	} else if (side === 'left') {
		return node.scrollLeft;
	} else if (side === 'right') {
		return node.scrollWidth - node.scrollLeft - node.clientWidth;
	} else if (side === 'bottom') {
		return node.scrollHeight - node.scrollTop - node.clientHeight;
	}
}

export function moveDirectionFromPoints(point1, point2) {
	if (!point1.x) return;
	let deltaX = point2.x - point1.x;
	let deltaY = point2.y - point1.y;

	if (Math.abs(deltaX) > Math.abs(deltaY)) {
		return deltaX > 0 ? 'toRight' : 'toLeft';
	} else if (Math.abs(deltaX) < Math.abs(deltaY)) {
		return deltaY > 0 ? 'toBottom' : 'toTop';
	}
}

export function moveDeltaFromPoints(point1, point2, side) {
	let deltaX = point2.x - point1.x;
	let deltaY = point2.y - point1.y;

	if (side === 'top') {
		return deltaY;
	} else if (side === 'left') {
		return deltaX;
	} else if (side === 'right') {
		return -deltaY;
	} else if (side === 'bottom') {
		return -deltaY;
	} else {
		return Math.max(Math.abs(deltaX), Math.abs(deltaY));
	}
}

export function moveDeltaFromEvent(event, side) {
	if (side === 'top') {
		return -event.deltaY;
	} else if (side === 'bottom') {
		return event.deltaY;
	} else if (side === 'left') {
		return -event.deltaX;
	} else {
		return event.deltaX;
	}
}

export function getScrollParent(node, axis) {
	if (node == null) {
		return null;
	}

	let scrollPropName = axis === 'x' ? 'scrollWidth' : 'scrollHeight';
	let clentPropName = axis === 'x' ? 'clientWidth' : 'clientHeight';

	if (node[scrollPropName] > node[clentPropName]) {
		return node;
	} else {
		return getScrollParent(node.parentNode, axis);
	}
}

export function getScrollContainer(node, axis) {
	if (node == null) {
		return null;
	}
	let scrollPropName = axis === 'x' ? 'scrollWidth' : 'scrollHeight';
	let clentPropName = axis === 'x' ? 'clientWidth' : 'clientHeight';
	if (node[scrollPropName] > node[clentPropName]) {
		return node;
	} else {
		return getScrollContainer(node.parentNode, axis);
	}
}

export function didDeltaDirectionChange(delta, prevDelta) {
	return (delta > 0 && prevDelta <= 0) || (delta < 0 && prevDelta >= 0);
}

export function getPointsInBetween(a, b, n) {
	const step = (b - a) / (n + 1);
	const points = [];
	for (let i = 1; i <= n; i++) {
		points.push(parseFloat((a + i * step).toFixed(3)));
	}
	return points;
}
