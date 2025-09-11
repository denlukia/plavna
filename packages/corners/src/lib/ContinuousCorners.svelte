<script lang="ts">
	import type { Snippet } from 'svelte';

	import { getPolygon } from './get-polygon.js';
	import { getRadii } from './utils.js';

	type Props = {
		children: Snippet;
		radius: number | [number, number, number, number];
		smoothness?: number;
		style?: string;
	};

	let { children, radius = 0, smoothness = 4, style }: Props = $props();
	let radii = $derived(getRadii(radius));

	let maskId = $derived(
		`mask-r${radii.join('-').replaceAll('.', 'd')}-s${String(smoothness).replace('.', 'd')}`
	);

	// It's actually used but Svelte doesn't see this
	const polygon = $derived(getPolygon(radii, smoothness));
</script>

{@html `
  <style>
    .${maskId} {
      clip-path: ${polygon};
    }
  </style>
`}
<div class="mask {maskId}" {style}>
	{@render children()}
</div>
