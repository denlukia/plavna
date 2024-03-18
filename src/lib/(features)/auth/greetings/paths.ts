import * as THREE from 'three';

export function convertPathToCurve(path: THREE.Path): THREE.Curve<THREE.Vector3> {
	const pathLength = path.getLength();
	const curve = new THREE.CatmullRomCurve3(
		path.getPoints(pathLength / 5).map((point) => new THREE.Vector3(point.x, point.y, 0)),
		false,
		'centripetal',
		0.5
	);
	curve.arcLengthDivisions = pathLength / 5;
	return curve;
}

// path.currentPath?.curves.forEach((curve) => {
// 	let vector3Curve: THREE.Curve<THREE.Vector3> | null = null;
// 	if (isCubicBezierCurve(curve)) {
// 		const keys = ['v0', 'v1', 'v2', 'v3'] as const;
// 		vector3Curve = new THREE.CubicBezierCurve3(
// 			...keys.map((key) => {
// 				const point = curve[key];
// 				return new THREE.Vector3(point.x, point.y, 0);
// 			})
// 		);
// 	} else if (isLineCurve(curve)) {
// 		const keys = ['v1', 'v2'] as const;
// 		vector3Curve = new THREE.LineCurve3(
// 			...keys.map((key) => {
// 				const point = curve[key];
// 				return new THREE.Vector3(point.x, point.y, 0);
// 			})
// 		);
// 	}
// 	if (!vector3Curve) return;

// 	const geometry = new THREE.TubeGeometry(vector3Curve, 128, 10, 8);
// 	const mesh = new THREE.Mesh(geometry, material);
// 	svgGroup.add(mesh);
// });

// const shapes = path.toShapes(true);
// // Each path has array of shapes
// shapes.forEach((shape, j) => {
// 	const points = shape.getPoints();
// 	const vector3Points = points.map((point) => new THREE.Vector3(point.x, point.y, 0));
// 	// Create a CatmullRomCurve3 from the points
// 	const curve = new THREE.CatmullRomCurve3(vector3Points, false, 'centripetal');
// 	const geometry = new THREE.TubeGeometry(curve, 20, 2, 8, false);
// 	const mesh = new THREE.Mesh(geometry, material);
// 	svgGroup.add(mesh);
// });

export function isCubicBezierCurve(
	curve: THREE.Curve<THREE.Vector2>
): curve is THREE.CubicBezierCurve {
	return curve.type === 'CubicBezierCurve';
}

export function isLineCurve(curve: THREE.Curve<THREE.Vector2>): curve is THREE.LineCurve {
	return curve.type === 'LineCurve';
}
