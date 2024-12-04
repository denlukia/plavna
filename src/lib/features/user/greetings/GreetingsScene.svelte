<script lang="ts">
	import { untrack } from 'svelte';
	import * as THREE from 'three';
	import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

	import { convertPathToCurve } from './paths';
	import svg from './translations/uk.svg?raw';

	let canvas: HTMLCanvasElement | null = $state(null);
	let canvasRect = $state({ width: 0, height: 0 });
	let initialized = $state(false);
	let shown = $state(false);

	let camera: THREE.OrthographicCamera;
	let scene: THREE.Scene;
	let renderer: THREE.WebGLRenderer;

	const init = (canvas: HTMLCanvasElement, width: number, height: number) => {
		// 1. Scene setup
		scene = new THREE.Scene();

		const frustumDivider = 2;
		camera = new THREE.OrthographicCamera(
			-width / frustumDivider,
			width / frustumDivider,
			height / frustumDivider,
			-height / frustumDivider,
			0.1,
			1000
		);

		renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(width, height);

		const centerXY = [265, 70] as const;

		camera.position.set(...centerXY, -10);
		camera.lookAt(...centerXY, 0);
		// rotate 180 degrees
		camera.rotation.z = 0;

		// 2. Greeting curves setup
		const loader = new SVGLoader();
		const svgData = loader.parse(svg);

		// Group that will contain all of our paths
		const svgGroup = new THREE.Group();

		const material = new THREE.MeshPhysicalMaterial({
			color: 0xffffff, // Base white color
			roughness: 0.9, // Smooth but not too reflective
			transmission: 0.95, // High transmission for a translucent look
			thickness: 0.5, // Simulates the thickness of the material
			ior: 1.33, // Index of refraction similar to water/milk
			opacity: 0.9, // Slightly opaque
			specularIntensity: 0.2, // Low specular highlights
			sheen: 0.5, // Subtle sheen for realism
			envMapIntensity: 0.3 // Reflect environment lightly
		});

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

	$effect(() => {
		if (!canvas) return;
		if (!initialized && canvasRect.width > 0 && canvasRect.height > 0) {
			init(
				canvas,
				untrack(() => canvasRect.width),
				untrack(() => canvasRect.height)
			);
			render();

			initialized = true;
			setTimeout(() => (shown = true), 2000);
		}
	});

	$effect(() => {
		if (canvasRect.width > 0 && canvasRect.height > 0) {
			renderer.setSize(canvasRect.width, canvasRect.height);
		}
	});
</script>

<canvas
	class:hidden={!shown}
	bind:this={canvas}
	bind:clientWidth={canvasRect.width}
	bind:clientHeight={canvasRect.height}
>
</canvas>

<style>
	canvas {
		width: 100%;
		height: 100%;
		transition: opacity 500ms;
	}

	.hidden {
		opacity: 0;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
