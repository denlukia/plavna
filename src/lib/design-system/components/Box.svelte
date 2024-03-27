<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children } = $props<Props>();
</script>

<span class="box">
	{@render children()}
</span>

<style>
	.box {
		display: flex;
		flex-direction: column;
		background: var(--color-box-bg);
		border-radius: var(--size-box-border-radius);
		box-shadow: var(--shadow-box);
		padding-top: var(--size-box-padding-top);
		padding-bottom: var(--size-box-padding-bottom);
		padding-inline: var(--size-box-padding-inline);
	}
</style>
