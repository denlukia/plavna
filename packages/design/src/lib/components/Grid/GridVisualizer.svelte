<script lang="ts">
	import { ColumnsContainer } from '.';
	import Column from './Column.svelte';

	type Props = {
		size?: number;
		thickness?: number;
		color?: string;
		opacity?: number;
	};
	let { size = 8, thickness = 0.5, color = '#000', opacity = 0.2 }: Props = $props();

	let microgridVisible = $state(false);
	let modulegridVisible = $state(false);

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
		if (e.altKey && e.code === 'KeyN') {
			microgridVisible = !microgridVisible;
		}
		if (e.altKey && e.code === 'KeyM') {
			modulegridVisible = !modulegridVisible;
		}
	}
</script>

<svelte:window {onkeypress} />
{#if microgridVisible}
	<div style="--bg-url: {bgURL}; --size: {size}px;" class="layer grid"></div>
{/if}
{#if modulegridVisible}
	<div class="layer cols-wrapper">
		<ColumnsContainer style="height: 100%;">
			{#each Array(5) as _}
				<Column style="height: 100%;" stretch><div class="col"></div></Column>
			{/each}
		</ColumnsContainer>
	</div>
{/if}

<style>
	.layer {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		pointer-events: none;
	}
	.grid {
		background: var(--bg-url);
	}
	.cols-wrapper {
		padding-inline: var(--size-main-grid-padding-inline);
	}
	.col {
		outline: calc(var(--size-cell-gap) / 2) solid hsla(0, 0%, 0%, 0.03);
		width: 100%;
		height: 100%;
	}
</style>
