<script lang="ts">
	import { untrack } from 'svelte';
	import * as THREE from 'three';

	let canvas: HTMLCanvasElement | null = $state(null);
	let canvasRect = $state({ width: 0, height: 0 });
	let initialized = $state(false);

	let camera: THREE.PerspectiveCamera;
	let scene: THREE.Scene;
	let renderer: THREE.WebGLRenderer;
	let cube: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;

	const init = (canvas: HTMLCanvasElement, width: number, height: number) => {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

		renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(width, height);

		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
		cube = new THREE.Mesh(geometry, material);
		scene.add(cube);

		camera.position.z = 5;
	};

	const render = () => {
		renderer.clear();
		renderer.render(scene, camera);
	};

	const animate = () => {
		requestAnimationFrame(animate);

		cube.rotation.x += 0.005;
		cube.rotation.y += 0.005;

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
			animate();
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
