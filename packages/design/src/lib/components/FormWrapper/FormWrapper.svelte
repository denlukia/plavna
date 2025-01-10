<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<div class="form-wrapper">
	{@render children()}
</div>

<style>
	.form-wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: var(--size-m);
	}
	.form-wrapper > :global(form) {
		display: contents;
	}
</style>
