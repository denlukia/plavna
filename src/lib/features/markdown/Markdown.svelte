<script lang="ts">
	import rehypeKatex from 'rehype-katex';
	import remarkMath from 'remark-math';
	import Markdown from 'svelte-exmarkdown';
	import { gfmPlugin } from 'svelte-exmarkdown/gfm';
	import type { Plugin } from 'svelte-exmarkdown/types';

	import { setMarkdownContext } from './markdown-context';
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
	import Span from './renderers/Span.svelte';
	import Strong from './renderers/Strong.svelte';
	import Sub from './renderers/Sub.svelte';
	import Sup from './renderers/Sup.svelte';
	import UnorderedList from './renderers/UnorderedList.svelte';

	type Props = {
		source: string;
		chooseShort?: boolean;
	};

	let { source, chooseShort = false }: Props = $props();

	const plugins: Plugin[] = [
		gfmPlugin(),
		// { remarkPlugin: remarkMath },
		// { rehypePlugin: rehypeKatex },
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
				sub: Sub,
				ul: UnorderedList,
				ol: OrderedList,
				li: ListItem,
				span: Span
			}
		}
	];

	setMarkdownContext({ chooseShort: chooseShort });
</script>

<Markdown {plugins} md={source} />
