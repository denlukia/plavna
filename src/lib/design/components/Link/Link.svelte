<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type Props = HTMLAnchorAttributes & {
		children: Snippet;
	};

	let { children, class: classes, ...attributes }: Props = $props();
</script>

<a class="link global-reset-link {classes}" {...attributes}>
	{@render children()}
</a>

<style>
	.link {
		color: var(--color-link);
		box-shadow: var(--shadow-link);
		transition: var(--transition-link);
		border-radius: var(--size-link-border-radius);
	}
	.link:hover {
		box-shadow: var(--shadow-link-hovered);
		transition: var(--transition-link-hovered);
		border-radius: var(--size-link-border-radius-hovered);
	}
</style>
