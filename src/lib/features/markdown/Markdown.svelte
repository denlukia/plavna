<script lang="ts">
	import Markdown from 'svelte-exmarkdown';
	import { gfmPlugin } from 'svelte-exmarkdown/gfm';
	import type { Plugin } from 'svelte-exmarkdown/types';

	import Em from './renderers/Em.svelte';
	import H1 from './renderers/heading/H1.svelte';
	import H2 from './renderers/heading/H2.svelte';
	import H3 from './renderers/heading/H3.svelte';
	import H4 from './renderers/heading/H4.svelte';
	import H5 from './renderers/heading/H5.svelte';
	import H6 from './renderers/heading/H6.svelte';
	import LinkOrTag from './renderers/LinkOrTag.svelte';
	import ListItem from './renderers/ListItem.svelte';
	import MarkdownImage from './renderers/MarkdownImage.svelte';
	import OrderedList from './renderers/OrderedList.svelte';
	import Paragraph from './renderers/Paragraph.svelte';
	import Section from './renderers/Section.svelte';
	import Strong from './renderers/Strong.svelte';
	import Sup from './renderers/Sup.svelte';
	import UnorderedList from './renderers/UnorderedList.svelte';

	type Props = {
		source: string;
	};

	let { source }: Props = $props();

	const plugins: Plugin[] = [
		gfmPlugin(),
		{
			renderer: {
				image: MarkdownImage,
				p: Paragraph,
				em: Em,
				strong: Strong,
				h1: H1,
				h2: H2,
				h3: H3,
				h4: H4,
				h5: H5,
				h6: H6,
				a: LinkOrTag,
				img: MarkdownImage,
				section: Section,
				sup: Sup,
				ul: UnorderedList,
				ol: OrderedList,
				li: ListItem
			}
		}
	];
</script>

<Markdown {plugins} md={source} />
