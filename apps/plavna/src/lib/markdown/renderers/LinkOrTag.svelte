<script lang="ts">
	import { Link } from '@plavna/design/components';
	import type { Tokens } from 'marked';
	import type { Snippet } from 'svelte';
	import { getAstNode, type HastNode } from 'svelte-exmarkdown';

	import TagSwitch from './SwitchMarkdown.svelte';

	type Props = Omit<Tokens.Link, 'type'> & {
		children: Snippet;
	};

	let { children, href, ...other }: Props = $props();

	const ast = getAstNode();

	let hasNonEmptyText = $derived.by(() => getHasNonEmptyText($ast));

	function getHasNonEmptyText(ast: HastNode) {
		if (!ast) return false;
		if (!('children' in ast) || !Array.isArray(ast.children)) return false;

		const found = ast.children.find((child) => {
			return child.type === 'text' && child.value.trim() !== '';
		});

		return found !== undefined;
	}

	let tagId = href.startsWith('tag:') ? Number(href.split('tag:')[1]) : null;
</script>

{#if hasNonEmptyText}
	{#if tagId !== null}
		<TagSwitch {tagId} {...other}>
			{@render children()}
		</TagSwitch>
	{:else}
		<Link {href} {...other}>
			{@render children()}
		</Link>
	{/if}
{/if}
