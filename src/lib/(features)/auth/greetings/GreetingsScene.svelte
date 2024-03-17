<script lang="ts">
	import { untrack } from 'svelte';
	import * as THREE from 'three';
	import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
	import svg from './translations/uk.svg?raw';

	let canvas: HTMLCanvasElement | null = $state(null);
	let canvasRect = $state({ width: 0, height: 0 });
	let initialized = $state(false);

	let camera: THREE.PerspectiveCamera;
	let scene: THREE.Scene;
	let renderer: THREE.WebGLRenderer;

	const init = (canvas: HTMLCanvasElement, width: number, height: number) => {
		// 1. Scene setup
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

		renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(width, height);

		camera.position.set(0, 0, -500);
		camera.lookAt(0, 0, 0);
		// rotate 180 degrees
		camera.rotation.z = 0;

		// 2. Greeting curves setup
		const loader = new SVGLoader();
		const svgData = loader.parse(svg);

		console.log(svgData);

		// Group that will contain all of our paths
		const svgGroup = new THREE.Group();

		const material = new THREE.MeshNormalMaterial();

		function isCubicBezierCurve(
			curve: THREE.Curve<THREE.Vector2>
		): curve is THREE.CubicBezierCurve {
			return curve.type === 'CubicBezierCurve';
		}

		// Loop through all of the parsed paths
		svgData.paths.forEach((path, i) => {
			path.currentPath?.curves.filter(isCubicBezierCurve).forEach((curve) => {
				const keys = ['v0', 'v1', 'v2', 'v3'] as const;
				const vector3Curve = new THREE.CubicBezierCurve3(
					...keys.map((key) => {
						const point = curve[key];
						return new THREE.Vector3(point.x, point.y, 0);
					})
				);
				const geometry = new THREE.TubeGeometry(vector3Curve, 20, 5, 8, false);
				const mesh = new THREE.Mesh(geometry, material);
				svgGroup.add(mesh);
			});

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
		});

		scene.add(svgGroup);
	};

	const render = () => {
		renderer.clear();
		renderer.render(scene, camera);
	};

	const animate = () => {
		requestAnimationFrame(animate);

		// cube.rotation.x += 0.005;
		// cube.rotation.y += 0.005;

		render();
	};

	$effect(() => {
		if (!canvas) return;
		if (!initialized && canvasRect.width > 0 && canvasRect.height > 0) {
			init(
				canvas,
				untrack(() => canvasRect.width),
				untrack(() => canvasRect.height)
			);
			render();
			// animate();
			initialized = true;
		}
	});

	$effect(() => {
		if (canvasRect.width > 0 && canvasRect.height > 0) {
			renderer.setSize(canvasRect.width, canvasRect.height);
		}
	});
</script>

<canvas
	bind:this={canvas}
	bind:clientWidth={canvasRect.width}
	bind:clientHeight={canvasRect.height}
/>

<style>
	canvas {
		width: 100%;
		height: 100%;
	}
</style>
