<script lang="ts">
	let lights = ['hsl(32deg, 100%, 61%)', 'hsl(162deg, 100%, 61%)', 'hsl(338deg, 100%, 61%)'];
</script>

<div class="lights">
	{#each lights as light}
		<div class="light" style="--color: {light};">
			<div class="left"></div>
			<div class="right"></div>
		</div>
	{/each}
</div>

<style>
	.lights {
		display: flex;
		flex-shrink: 1;
		height: 150px;
		opacity: 0.8;
	}
	.light {
		display: flex;
		width: 500px;
		margin-inline: -125px;
		/* mask-image: radial-gradient(
			farthest-side at 50% 0%,
			black 25%,
			hsla(0deg, 0%, 0%, 0.1) 80%,
			transparent
		); */
		mask-image: linear-gradient(black, hsla(0deg, 0%, 0%, 0.1) 80%, transparent);
	}
	.left,
	.right {
		flex-grow: 1;
	}
	.left {
		background: conic-gradient(from 90deg at 50% 0%, var(--color) 0%, transparent 50%);
		mask-image: linear-gradient(to left, black 50%, transparent);
	}
	.right {
		background: conic-gradient(from 90deg at 50% 0%, transparent 0%, var(--color) 50%);
		mask-image: linear-gradient(to right, black 50%, transparent);
	}
</style>
