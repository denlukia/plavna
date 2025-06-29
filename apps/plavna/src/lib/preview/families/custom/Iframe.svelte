<script lang="ts">
	import { ARTISTIC_OVERFLOW, serializePreviewParams, type PreviewDataProp } from '@plavna/common';
	import { blur, fade } from 'svelte/transition';

	type Props = {
		data: PreviewDataProp;
		url: string;
		ready: boolean;
		iframe: HTMLIFrameElement | null;
	};

	let { url, data, ready = $bindable(false), iframe = $bindable() }: Props = $props();

	let loaded = $state(false);

	function onload() {
		loaded = true;
		ready = true;
	}

	function onoutrostart() {
		ready = false;
	}

	function onintrostart() {
		ready = loaded;
	}

	function onoutroend() {
		loaded = false;
		ready = false;
	}
</script>

<iframe
	{onoutrostart}
	{onintrostart}
	{onoutroend}
	in:fade={{ duration: 0 }}
	out:fade={{ duration: 750 }}
	bind:this={iframe}
	src={serializePreviewParams(url, data)}
	class="iframe"
	class:ready
	style="--inset: {ARTISTIC_OVERFLOW}px"
	title="preview"
	{onload}
></iframe>

<style>
	.iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;

		opacity: 0;
		/* filter: blur(10px); */

		border: none;
		transition:
			/* filter 750ms 0ms, */ opacity 750ms 375ms;
	}

	.iframe.ready {
		opacity: 1;
		/* filter: blur(0px); */
		transition:
			/* filter 750ms 0ms, */ opacity 750ms 0ms;
	}
</style>
