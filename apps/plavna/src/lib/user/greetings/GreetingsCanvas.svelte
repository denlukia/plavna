<script lang="ts">
	import { page } from '$app/state';
	import { onMount, untrack } from 'svelte';
	import { sineInOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';
	import * as THREE from 'three';
	import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
	import { getLang } from '$lib/i18n/utils';

	import { convertPathToCurve, getPointsFromPath } from './paths';

	let canvas: HTMLCanvasElement | null = null;
	let canvasWrapper = $state({ width: 0, height: 0 });
	let initialized = $state(false);
	let progress = new Tween(0, { duration: 3500, easing: sineInOut });
	let lang = $derived(getLang(page.params.lang));

	let camera: THREE.OrthographicCamera;
	let scene: THREE.Scene;
	let renderer: THREE.WebGLRenderer;
	let greetingsGroup: THREE.Group<THREE.Object3DEventMap> | null = $state(null);
	let pointsGroups: THREE.Vector2[][];

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

	function updateDynamicCamera(svgGroup: THREE.Group, width: number, height: number) {
		// Calculate bounding box of all geometry
		const box = new THREE.Box3().setFromObject(svgGroup);
		const center = box.getCenter(new THREE.Vector3());
		const size = box.getSize(new THREE.Vector3());

		// Add padding (10% of the largest dimension)
		const maxDimension = Math.max(size.x, size.y);
		const padding = maxDimension * 0.1;

		// Calculate the required camera frustum to fit the content
		const paddedWidth = size.x + padding * 2;
		const paddedHeight = size.y + padding * 2;

		// Consider canvas aspect ratio
		const canvasAspect = width / height;
		const contentAspect = paddedWidth / paddedHeight;

		let frustumWidth, frustumHeight;

		if (contentAspect > canvasAspect) {
			// Content is wider relative to canvas - fit to width
			frustumWidth = paddedWidth;
			frustumHeight = paddedWidth / canvasAspect;
		} else {
			// Content is taller relative to canvas - fit to height
			frustumHeight = paddedHeight;
			frustumWidth = paddedHeight * canvasAspect;
		}

		// Set up orthographic camera
		const halfWidth = frustumWidth / 2;
		const halfHeight = frustumHeight / 2;

		camera.left = -halfWidth;
		camera.right = halfWidth;
		camera.top = halfHeight;
		camera.bottom = -halfHeight;

		// Position camera to look at the center of the content
		camera.position.set(center.x, center.y, center.z + 100);
		camera.lookAt(center.x, center.y, center.z);

		// Update camera projection matrix
		camera.updateProjectionMatrix();
	}

	export async function init(canvas: HTMLCanvasElement, width: number, height: number) {
		// 1. Scene setup
		scene = new THREE.Scene();

		// Create camera with temporary values (will be updated after geometry is created)
		camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);

		renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(width, height);

		// 2. Greeting curves setup
		const loader = new SVGLoader();
		const { default: svg } = await import(`./translations/${lang}.svg?raw`);
		const svgData = loader.parse(svg);
		const paths = svgData.paths
			.map((path, i) => {
				return path.subPaths.map((subPath, n) => {
					return subPath;
				});
			})
			.flat();
		pointsGroups = getPointsGroups(paths, 100);

		// 3. Put invisible full greetings into the scene to calculate camera parameters
		const sizingGroup = new THREE.Group();
		updatePathsInGroup(sizingGroup, pointsGroups, material);
		scene.add(sizingGroup);
		sizingGroup.visible = false;
		updateDynamicCamera(sizingGroup, width, height);

		// 4. Put actual greetings with progress into the scene
		greetingsGroup = new THREE.Group();
		updatePathsInGroup(greetingsGroup, pointsGroups, material, progress.current);
		scene.add(greetingsGroup);
	}

	function getPointsGroups(paths: THREE.Path[], resolution: number) {
		return paths.map((path) => getPointsFromPath(path, resolution));
	}

	function getGranularProgress(pointsGroups: THREE.Vector2[][], progress: number) {
		const totalPoints = pointsGroups.reduce((acc, group) => acc + group.length, 0);
		let currentPointIndex = Math.ceil(progress * totalPoints);

		let currentGroupIndex = 0;
		let currentGroupProgress = 0;
		for (let i = 0; i < pointsGroups.length; i++) {
			const group = pointsGroups[i];
			const groupLength = group.length;

			if (currentPointIndex <= groupLength) {
				currentGroupIndex = i;
				currentGroupProgress = currentPointIndex / groupLength;
				break;
			}

			currentPointIndex -= groupLength;
		}

		return { currentGroupIndex, currentGroupProgress };
	}

	function updatePathsInGroup(
		group: THREE.Group,
		pointsGroups: THREE.Vector2[][],
		material: THREE.Material,
		progress = 1
	) {
		group.clear();

		const { currentGroupIndex, currentGroupProgress } = getGranularProgress(pointsGroups, progress);

		pointsGroups.forEach((points, i) => {
			if (i > currentGroupIndex || (currentGroupIndex === i && currentGroupProgress === 0)) {
				return;
			}
			const tubeRadius = 5;
			const tubeRadialSegments = 4;

			const curve = convertPathToCurve(points, currentGroupIndex === i ? currentGroupProgress : 1);

			const tubeGeometry = new THREE.TubeGeometry(
				curve,
				points.length,
				tubeRadius,
				tubeRadialSegments
			);
			const tubeMesh = new THREE.Mesh(tubeGeometry, material);
			group.add(tubeMesh);

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

				const hemiSphereMesh = new THREE.Mesh(halfSphereStart, material);
				group.add(hemiSphereMesh);
			});
		});

		// Flip the SVG group to correct coordinate system (SVG Y-down vs Three.js Y-up)
		group.scale.y = -1;
	}

	function render() {
		renderer.clear();
		renderer.render(scene, camera);
	}

	function updateCameraOnResize() {
		if (!initialized || !scene) return;

		// Find the SVG group in the scene
		const svgGroup = scene.children.find((child) => child instanceof THREE.Group) as THREE.Group;
		if (svgGroup) {
			updateDynamicCamera(svgGroup, canvasWrapper.width, canvasWrapper.height);
			render();
		}
	}

	onMount(() => {
		if (!canvas) return;
		if (!initialized && canvasWrapper.width > 0 && canvasWrapper.height > 0) {
			init(
				canvas,
				untrack(() => canvasWrapper.width),
				untrack(() => canvasWrapper.height)
			);
			render();

			initialized = true;
			progress.set(1);
		}
	});

	$effect(() => {
		if (canvasWrapper.width > 0 && canvasWrapper.height > 0 && initialized) {
			renderer.setSize(canvasWrapper.width, canvasWrapper.height);
			updateCameraOnResize();
		}
	});

	$effect(() => {
		if (initialized && greetingsGroup) {
			updatePathsInGroup(greetingsGroup, pointsGroups, material, progress.current);
			render();
		}
	});
</script>

<div
	class="wrapper"
	bind:clientWidth={canvasWrapper.width}
	bind:clientHeight={canvasWrapper.height}
>
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.wrapper {
		width: 100%;
		height: 100%;
	}
	canvas {
		width: 100%;
		height: 100%;
		transition: opacity 500ms;
	}
</style>
