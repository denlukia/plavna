<script lang="ts">
	import { type BasicMdNode } from './basic-md-parser';
	import BasicRenderer from './BasicRenderer.svelte';
	import Em from './renderers/Em.svelte';
	import Strong from './renderers/Strong.svelte';

	type Props = {
		nodes: BasicMdNode[];
	};

	const renderersMap = {
		bold: Strong,
		italic: Em,
		strikethrough: 's'
	};

	let { nodes }: Props = $props();
</script>

{#each nodes as node}
	{@const type = node.type}
	{#if type === 'text'}
		{node.value}
	{:else if type in renderersMap}
		{#if typeof renderersMap[type] === 'string'}
			<svelte:element this={renderersMap[type]}>
				<BasicRenderer nodes={node.children} />
			</svelte:element>
		{:else}
			{@const Component = renderersMap[type]}
			<Component>
				<BasicRenderer nodes={node.children} />
			</Component>
		{/if}
	{/if}
{/each}
