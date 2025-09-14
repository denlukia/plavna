// Gives upper right corner, plotted in quarter I of the coord system, drawn counter clockwise
function getCorner(a: number, b: number, n: number, resolution: number) {
	const limit = Math.PI / 2;
	const points = [];
	for (let i = 0; i < resolution; i++) {
		const t = (i / (resolution - 1)) * limit;
		const exp = 2 / n;
		const cosT = Math.cos(t);
		const sinT = Math.sin(t);
		const x = Math.sign(cosT) * a * Math.abs(cosT) ** exp;
		const y = Math.sign(sinT) * b * Math.abs(sinT) ** exp;
		points.push([x, y]);
	}
	return points;
}

const polygonCache = new Map();

export function getPolygon(radii: [number, number, number, number], n: number) {
	const [r0, r1, r2, r3] = radii;

	const key = `${r0}-${r1}-${r2}-${r3}-${n}`;
	if (polygonCache.has(key)) {
		return polygonCache.get(key);
	}

	const cornerRelativePoints = [
		[0, 0],
		[100, 0],
		[100, 100],
		[0, 100]
	];

	type Modifier = (x: number, y: number, radius: number) => [number, number];
	const cornerGraphModifiers: [boolean, Modifier][] = [
		[false, (x, y, radius) => [-x + radius, y - radius]],
		[true, (x, y, radius) => [x - radius, y - radius]],
		[false, (x, y, radius) => [x - radius, -y + radius]],
		[true, (x, y, radius) => [-x + radius, -y + radius]]
	];

	const corners = cornerRelativePoints.map(([relX, relY], cornerIndex) => {
		const cornerRadius = radii[cornerIndex] || 0;

		// Skip corner generation if radius is 0
		if (cornerRadius === 0) {
			return `calc(${relX}%) calc(${relY}%)`;
		}

		const resolution = 2 * Math.log(cornerRadius) + 5;
		const cornerGraph = getCorner(cornerRadius, cornerRadius, n, resolution);

		const [feedReverse, modify] = cornerGraphModifiers[cornerIndex];
		const finalCornerGraph = feedReverse ? cornerGraph.toReversed() : cornerGraph;

		const vertices = finalCornerGraph.map(([x, y]) => {
			const [modifiedX, modifiedY] = modify(x, y, cornerRadius);
			const opX = Math.sign(modifiedX) === -1 ? '-' : '+';
			const opY = Math.sign(modifiedY) === -1 ? '+' : '-';
			const [absX, absY] = [modifiedX, modifiedY].map((v) => Math.abs(v));
			const [roundedX, roundedY] = [absX, absY].map((v) => +v.toFixed(1));
			return `calc(${relX}% ${opX} ${roundedX}px) calc(${relY}% ${opY} ${roundedY}px)`;
		});

		return vertices.join(', ');
	});

	const polygon = `polygon(${corners.join(', ')})`;
	polygonCache.set(key, polygon);
	return polygon;
}
