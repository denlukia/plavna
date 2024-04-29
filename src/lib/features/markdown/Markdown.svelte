<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';

	import Em from './renderers/Em.svelte';
	import Heading from './renderers/Heading.svelte';
	import Image from './renderers/Image.svelte';
	import LinkOrTagSwitcher from './renderers/LinkOrTagSwitcher.svelte';
	import Paragraph from './renderers/Paragraph.svelte';
	import Strong from './renderers/Strong.svelte';

	type Props = {
		source: string;
	};

	let { source }: Props = $props();
</script>

<SvelteMarkdown
	{source}
	renderers={{
		paragraph: Paragraph,
		image: Image,
		heading: Heading,
		strong: Strong,
		em: Em,
		link: LinkOrTagSwitcher
	}}
/>
