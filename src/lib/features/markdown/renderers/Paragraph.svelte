<script lang="ts">
	import type { Snippet } from 'svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<p class="paragraph">
	<Typography>
		{@render children()}
	</Typography>
</p>

<style>
	p {
		margin-bottom: 1em;
	}
</style>
