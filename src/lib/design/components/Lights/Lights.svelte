<script lang="ts">
	let lights = ['hsl(32deg, 100%, 71%)', 'hsl(162deg, 100%, 71%)', 'hsl(338deg, 100%, 71%)'];
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
		height: 250px;
	}
	.light {
		display: flex;
		width: 500px;
		margin-inline: -125px;
		mask-image: linear-gradient(
			hsla(0deg, 0%, 0%, 1) 0%,
			hsla(0deg, 0%, 0%, 0.65) 5%,
			hsla(0deg, 0%, 0%, 0.4) 15%,
			hsla(0deg, 0%, 0%, 0.2) 40%,
			hsla(0deg, 0%, 0%, 0) 100%
		);
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
