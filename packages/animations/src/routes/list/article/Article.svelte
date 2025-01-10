<script>
	import Crossfade from '$lib/components/Crossfade.svelte';
	import { fade } from 'svelte/transition';
</script>

<Crossfade final key="bg">
	<div class="layer bg" />
</Crossfade>
<div class="layer centering-block" transition:fade={{ duration: 150 }}>
	<div class="hero-wrapper">
		<Crossfade final key="hero" zIndex={1}>
			<div class="hero" />
		</Crossfade>
	</div>
	<a href="/list">List</a>
</div>

<style>
	.layer {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
	.bg {
		background-color: lightblue;
	}
	.centering-block {
		padding-top: 30px;
		overflow: scroll;
		margin-inline: auto;
		width: 100%;
		max-width: 500px;
	}

	.hero-wrapper {
		position: relative;
		aspect-ratio: 1/1;
		width: 100%;
	}
	.hero {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: red;
	}
</style>
