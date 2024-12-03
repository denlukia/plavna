<script lang="ts">
	import type { Tokens } from 'marked';
	import type { Snippet } from 'svelte';
	import Link from '$lib/design/components/Link/Link.svelte';

	import TagSwitch from './TagSwitch.svelte';

	type Props = Omit<Tokens.Link, 'type'> & {
		children: Snippet;
	};

	let { children, href, ...other }: Props = $props();

	let tagId = href.startsWith('tag:') ? Number(href.split('tag:')[1]) : null;
</script>

{#if tagId !== null}
	<TagSwitch {tagId} {...other}>
		{@render children()}
	</TagSwitch>
{:else}
	<Link {href} {...other}>
		{@render children()}
	</Link>
{/if}
