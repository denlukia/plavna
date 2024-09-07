<script lang="ts">
	import type { Snippet } from 'svelte';

	import { getPolygon } from './get-polygon';

	type Props = {
		children: Snippet;
		radius: number;
		smoothness?: number;
		style?: string;
	};

	let { children, radius = 0, smoothness = 4, style }: Props = $props();

	let maskId = $derived(
		`mask-r${String(radius).replace('.', 'd')}-s${String(smoothness).replace('.', 'd')}`
	);

	// It's actually used but Svelte doesn't see this
	const polygon = $derived(getPolygon(radius, smoothness));
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
