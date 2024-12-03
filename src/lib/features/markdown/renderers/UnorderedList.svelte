<script lang="ts">
	import type { Snippet } from 'svelte';

	import { setListContext } from './list-context';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();

	setListContext();
</script>

<ul>
	{@render children()}
</ul>
