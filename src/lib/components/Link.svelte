<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type Props = HTMLAnchorAttributes & {
		children: Snippet;
	};

	let { children, ...other }: Props = $props();
</script>

<a class="link global-reset-link" {...other}>
	{@render children()}
</a>

<style>
	.link {
		color: var(--color-link);
		box-shadow: var(--shadow-link);
		transition: var(--transition-link);
	}
	.link:hover {
		box-shadow: var(--shadow-link-hovered);
		transition: var(--transition-link-hovered);
	}
</style>
