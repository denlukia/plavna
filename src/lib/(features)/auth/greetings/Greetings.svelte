<script>
	import GreetingsScene from './GreetingsScene.svelte';
</script>

<div class="greetings-layer shade" />
<video class="greetings-layer video" src="/videos/Colorfull Clouds.mp4" loop autoplay muted />
<div class="greetings-layer noise" />
<div class="greetings-layer scene">
	<GreetingsScene />
</div>

<style>
	.greetings-layer {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}

	.shade {
		background-color: hsla(0, 0%, 0%, 0.8);
	}
	.video {
		mix-blend-mode: screen;
		object-fit: cover;
	}
	.noise {
		background: url('/images/noise.jpg');
		background-size: 128px;
		opacity: 0.15;
		mix-blend-mode: screen;
	}
	.scene {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 400px;
		height: 200px;
	}
</style>
