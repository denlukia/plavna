<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<table class="table">
	{@render children()}
</table>

<style>
	.table {
		width: 100%;
	}
</style>
