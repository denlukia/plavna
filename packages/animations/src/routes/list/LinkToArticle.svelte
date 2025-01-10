<script>
	import Crossfade from '$lib/components/Crossfade.svelte';
</script>

<a class="link-to-article" href="/list/article">
	<Crossfade key="bg">
		<span class="layer pseudo-bg" />
	</Crossfade>
	<Crossfade key="hero" zIndex={1}>
		<span class="layer hero" />
	</Crossfade>
</a>

<style>
	.link-to-article {
		all: unset;
		text-decoration: none;
		display: block;
		position: relative;
		margin: 50px;
		width: 400px;
		height: 200px;
		overflow: hidden;
	}
	.layer {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;

		border-radius: 30px;
	}
	.pseudo-bg {
		background-color: lightblue;
	}
	.hero {
		background-color: orange;
	}
</style>
