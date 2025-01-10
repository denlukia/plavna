<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	import GreetingsScene from './GreetingsScene.svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<div class="greetings" out:fade>
	<div class="greetings-layer shade"></div>
	<video class="greetings-layer video" src="/videos/Colorfull Clouds.mp4" loop autoplay muted
	></video>
	<div class="greetings-layer noise"></div>
	<div class="greetings-layer scene">
		<GreetingsScene />
		{@render children()}
	</div>
</div>

<style>
	.greetings {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}
	.greetings-layer {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	.shade {
		background-color: hsla(0, 0%, 0%, 0.8);
	}
	.video {
		/* mix-blend-mode: screen; */
		object-fit: cover;
	}
	.noise {
		background: url('/images/noise.jpg');
		background-size: 128px;
		opacity: 0.15;
		/* mix-blend-mode: screen; */
	}
	.scene {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		max-width: 600px;
		max-height: 300px;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
