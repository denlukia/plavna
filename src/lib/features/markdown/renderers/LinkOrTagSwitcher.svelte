<script lang="ts">
	import type { Tokens } from 'marked';
	import type { Snippet } from 'svelte';
	import Labeled from '$lib/design-system/components/Labeled.svelte';
	import Link from '$lib/design-system/components/Link.svelte';
	import Switch from '$lib/design-system/components/Switch/Switch.svelte';

	type Props = Omit<Tokens.Link, 'type'> & {
		children: Snippet;
	};

	let { children, href }: Props = $props();

	let isTag = $derived(href.startsWith('tag:'));
</script>

{#if isTag}
	<Labeled type="switch-with-bg">
		<Switch />
		{@render children()}
	</Labeled>
{:else}
	<Link {href}>
		{@render children()}
	</Link>
{/if}
