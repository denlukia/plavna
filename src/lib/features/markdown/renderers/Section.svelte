<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<section class="section global-text-aesthetic-small">
	{@render children()}
</section>

<style>
	.section {
		margin-top: var(--size-2xl);
		padding-top: var(--size-l);
		border-top: 0.25px solid currentColor;
	}
</style>
