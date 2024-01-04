<script lang="ts">
	type Props = {
		size?: number;
		thickness?: number;
		color?: string;
		opacity?: number;
	};
	let { size = 5, thickness = 0.5, color = 'red', opacity = 0.5 } = $props<Props>();

	let visible = $state(false);

	let gridModuleSvg = $derived(
		`
			<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M${size} ${thickness / 2}H${
					thickness / 2
				}V${size}" stroke-width="${thickness}" stroke="${color}" stroke-opacity="${opacity}" />
			</svg>
		`
	);

	let bgURL = $derived(`url(data:image/svg+xml,${encodeURIComponent(gridModuleSvg)})`);

	function onkeypress(e: KeyboardEvent) {
		if (e.metaKey && e.code === 'KeyG') {
			visible = !visible;
		}
	}
</script>

<svelte:window {onkeypress} />
<div style="--bg-url: {bgURL}; --size: {size}px;" class="grid" class:visible />

<style>
	.grid {
		pointer-events: none;
		z-index: 999;
	}
	.visible {
		background: var(--bg-url);
	}
</style>
