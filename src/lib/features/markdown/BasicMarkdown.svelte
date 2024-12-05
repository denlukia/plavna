<script lang="ts">
	import { parseBasicMarkdown } from './basic-md-parser';
	import BasicRenderer from './BasicRenderer.svelte';

	type Props = {
		source: string;
	};

	let { source }: Props = $props();

	let nodes = $derived(parseBasicMarkdown(source));
</script>

<BasicRenderer {nodes} />
