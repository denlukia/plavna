<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';

	import Image from './renderers/Image.svelte';
	import Paragraph from './renderers/Paragraph.svelte';

	type Props = {
		source: string;
	};

	let { source }: Props = $props();
</script>

<SvelteMarkdown {source} renderers={{ image: Image, paragraph: Paragraph }} />
