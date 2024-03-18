<script lang="ts">
	import { untrack } from 'svelte';
	import * as THREE from 'three';
	import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
	import svg from './translations/test.svg?raw';
	import { convertPathToCurve } from './paths';

	let canvas: HTMLCanvasElement | null = $state(null);
	let canvasRect = $state({ width: 0, height: 0 });
	let initialized = $state(false);

	let camera: THREE.OrthographicCamera;
	let scene: THREE.Scene;
	let renderer: THREE.WebGLRenderer;

	const init = (canvas: HTMLCanvasElement, width: number, height: number) => {
		// 1. Scene setup
		scene = new THREE.Scene();
		// camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
		camera = new THREE.OrthographicCamera(
			-width / 2,
			width / 2,
			height / 2,
			-height / 2,
			0.1,
			1000
		);

		renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(width, height);

		camera.position.set(100, 50, -200);
		camera.lookAt(100, 50, 0);
		// rotate 180 degrees
		camera.rotation.z = 0;

		// 2. Greeting curves setup
		const loader = new SVGLoader();
		const svgData = loader.parse(svg);

		// Group that will contain all of our paths
		const svgGroup = new THREE.Group();

		const material = new THREE.MeshNormalMaterial();

		// Loop through all of the parsed paths
		svgData.paths.forEach((path, i) => {
			path.subPaths.forEach((subPath) => {
				const tubeRadius = 5;
				const tubeRadialSegments = 8;

				// 1. Create Tube
				const curve = convertPathToCurve(subPath);
				const tubeGeometry = new THREE.TubeGeometry(
					curve,
					subPath.arcLengthDivisions * 5,
					tubeRadius,
					tubeRadialSegments
				);
				const tubeMesh = new THREE.Mesh(tubeGeometry, material);
				svgGroup.add(tubeMesh);

				const caps = [
					{ pointOnPath: 0, rotateY: -Math.PI / 2 },
					{ pointOnPath: 1, rotateY: Math.PI / 2 }
				];

				caps.forEach(({ pointOnPath, rotateY }) => {
					const tangentStart = curve.getTangent(pointOnPath);
					const pointStart = curve.getPoint(pointOnPath);
					const halfSphereStart = new THREE.SphereGeometry(
						tubeRadius,
						tubeRadialSegments,
						tubeRadialSegments,
						0,
						Math.PI
					)
						.rotateY(rotateY)
						.rotateZ(Math.atan2(tangentStart.y, tangentStart.x))
						.translate(pointStart.x, pointStart.y, pointStart.z);

					const sphereStartMesh = new THREE.Mesh(halfSphereStart, material);
					svgGroup.add(sphereStartMesh);
				});
			});
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
