<script lang="ts">
	import { dev } from '$app/environment';
	import { PUBLIC_HOST } from '$env/static/public';
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type Props = HTMLAnchorAttributes & {
		children: Snippet;
	};

	let { children, class: classes, href, ...attributes }: Props = $props();

	const baseOrigin = dev ? `http://${PUBLIC_HOST}` : `https://${PUBLIC_HOST}`;

	let isLocal = $derived(checkLocalHref(href, baseOrigin));

	function checkLocalHref(href: string | null | undefined, baseOrigin: string): boolean {
		if (!href) return false;
		try {
			// Ensure the baseOrigin is valid
			const baseUrl = new URL(baseOrigin);

			// Parse the href into a URL object, resolving against the baseOrigin
			const url = new URL(href, baseUrl);

			// Check if the origin matches the base origin
			return url.origin === baseUrl.origin;
		} catch (e) {
			// If the URL is invalid, it cannot be resolved as local
			console.error('Invalid href or baseOrigin:', e);
			return false;
		}
	}
</script>

<a
	{href}
	class="link global-reset-link {classes}"
	target={isLocal ? undefined : '_blank'}
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
	}
	.link:hover {
		box-shadow: var(--shadow-link-hovered);
		transition: var(--transition-link-hovered);
		border-radius: var(--size-link-border-radius-hovered);
	}
</style>
