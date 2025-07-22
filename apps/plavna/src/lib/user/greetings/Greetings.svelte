<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	import GreetingsScene from './GreetingsCanvas.svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();

	let videoState = $state(0);
</script>

<div class="greetings" out:fade>
	<div class="greetings-layer shade" class:hidden={videoState >= 1}></div>
	<video
		bind:readyState={videoState}
		class="greetings-layer video"
		class:visible={videoState >= 1}
		src="/videos/Colorfull Clouds.mp4"
		loop
		autoplay
		muted
	></video>
	<div class="greetings-layer noise"></div>
	<div class="greetings-layer">
		<div class="info">
			<div class="scene">
				<GreetingsScene />
			</div>
			<div class="tips">
				{@render children()}
			</div>
		</div>
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

	.video.visible {
		transition: opacity 1000ms;
	}
	.shade.hidden {
		transition: opacity 1000ms 1000ms;
	}

	.shade {
		background-color: hsl(0, 0%, 0%);
		opacity: 1;
	}
	.shade.hidden {
		opacity: 0;
	}

	.video {
		mix-blend-mode: screen;
		object-fit: cover;
		opacity: 0;
	}
	.video.visible {
		opacity: 1;
	}

	.noise {
		background: url('/images/noise.jpg');
		background-size: 128px;
		opacity: 0.2;
		/* mix-blend-mode: screen; */
	}
	.info {
		height: 100%;
		margin: 0 auto;
		max-width: 600px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.scene {
		width: 100%;
		height: 200px;
	}
	.tips {
		padding-inline: var(--size-l);
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
