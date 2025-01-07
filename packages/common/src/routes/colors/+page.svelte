<script lang="ts">
	import { ClientImageHandler } from '$lib/images/handlers/client';
	import type { HSLwithArea } from '$lib/images/colors';

	let buffer: ArrayBuffer;
	let objectUrl: string;
	let img: HTMLImageElement;

	let colorsExtractor2: HSLwithArea[];
	let optimalColor: HSLwithArea;

	function handleImageInputChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;
		if (files) {
			const file = files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const target = e.target as FileReader;
					buffer = target.result as ArrayBuffer;
					const blob = new Blob([buffer], { type: file.type });
					objectUrl = URL.createObjectURL(blob);
				};
				reader.readAsArrayBuffer(file);
			}
		}
	}

	async function onObjectURLChanged(url: string) {
		if (url) {
			optimalColor = await new ClientImageHandler().extractOptimalColor(url);
		}
	}

	$: onObjectURLChanged(objectUrl);
</script>

<h1>Color Extractors Test</h1>

<input type="file" accept="image/*" on:change={handleImageInputChange} />
<img src={objectUrl} alt="test" bind:this={img} />

<!-- <h2>Colors from Node Vibrant</h2>
<div class="colors">
	{#if colorsExtractor1}
		{#each Object.entries(colorsExtractor1) as [key, value]}
			{#if value}
				<div
					class="color rgb"
					style="--r: {value.rgb[0]}; --g: {value.rgb[1]}; --b: {value.rgb[2]}"
				/>
			{/if}
		{/each}
	{/if}
</div> -->

<h2>Colors from Color Thief</h2>
<div class="colors">
	{#if colorsExtractor2}
		{#each colorsExtractor2 as { h, s, l, area }}
			<div class="color hsl" style="--h: {h}; --s: {s}; --l: {l}; --area: {area}" />
		{/each}
	{/if}

	Optimal:
	{#if optimalColor}
		<div
			class="color hsl"
			style="--h: {optimalColor.h}; --s: {optimalColor.s}; --l: {optimalColor.l}"
		/>
	{/if}
</div>

<style>
	:global(body) {
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
			Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	}
	img {
		max-width: 400px;
		display: block;
	}
	.colors {
		display: flex;
	}

	.hsl {
		background-color: hsl(calc(var(--h) * 1deg), calc(var(--s) * 1%), calc(var(--l) * 1%));
		/* transform: scale(calc(var(--area) * 5)); */
	}
	.color {
		width: 50px;
		height: 50px;
		border-radius: 25px;
		margin: 5px;
	}
</style>
