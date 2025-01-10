<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type Props = HTMLAnchorAttributes & {
		children: Snippet;
	};

	let { children, class: classes, href, ...attributes }: Props = $props();

	let isAbsolute = $derived(isHttpAbsoluteLink(href));

	function isHttpAbsoluteLink(url: string | null | undefined): boolean {
		if (!url) return false;
		// A URL is considered an absolute HTTP/HTTPS link if it starts with "http://" or "https://"
		const httpPattern = /^https?:\/\//i;
		return httpPattern.test(url);
	}
</script>

<a
	{href}
	class="link global-reset-link {classes}"
	target={isAbsolute ? '_blank' : undefined}
	{...attributes}
>
	{@render children()}
</a>

<style>
	.link {
		color: var(--color-link);
		box-shadow: var(--shadow-link);
		transition: var(--transition-link);
		border-radius: var(--size-link-border-radius);
		word-break: break-word;
		hyphens: none;
	}
	.link:hover {
		box-shadow: var(--shadow-link-hovered);
		transition: var(--transition-link-hovered);
		border-radius: var(--size-link-border-radius-hovered);
	}
</style>
