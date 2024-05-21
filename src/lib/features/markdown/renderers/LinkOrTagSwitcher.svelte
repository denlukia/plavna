<script lang="ts">
	import type { Tokens } from 'marked';
	import type { Snippet } from 'svelte';
	import Link from '$lib/design/components/Link.svelte';

	import Tag from './Tag.svelte';

	type Props = Omit<Tokens.Link, 'type'> & {
		children: Snippet;
	};

	let { children, href }: Props = $props();

	let tagId = href.startsWith('tag:') ? Number(href.split('tag:')[1]) : null;
</script>

{#if tagId !== null}
	<Tag {tagId}>
		{@render children()}
	</Tag>
{:else}
	<Link {href}>
		{@render children()}
	</Link>
{/if}
