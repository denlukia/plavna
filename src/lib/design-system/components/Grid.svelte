<script lang="ts">
	type Props = {
		size?: number;
		thickness?: number;
		color?: string;
		opacity?: number;
	};
	let { size = 8, thickness = 0.5, color = '#000', opacity = 0.2 }: Props = $props();

	let visible = $state(false);

	function getModule(size: number, shiftX: number, shiftY: number, opacity = 1) {
		return `<path d="M${shiftX} ${shiftY} H${size - shiftX} V${size - shiftY}"
							    stroke-width="${thickness}" stroke="${color}" stroke-opacity="${opacity}" />`;
	}

	const shifts = [
		[0, 0],
		[size / 2, 0],
		[0, size / 2],
		[size / 2, size / 2]
	];

	let gridModuleSvg = $derived(
		`
			<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
				${getModule(size, 0, 0, opacity)}
				${shifts.map(([shiftX, shiftY]) => getModule(size, shiftX, shiftY, opacity / 4)).join('\n')}
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
{#if visible}
	<div style="--bg-url: {bgURL}; --size: {size}px;" class="grid"></div>
{/if}

<style>
	.grid {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		background: var(--bg-url);
		pointer-events: none;
	}
</style>
