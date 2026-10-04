<script lang="ts">
	import { getGlobalTypographyClass } from '@plavna/design/components';
	import rehypeRaw from 'rehype-raw';
	import remarkMath from 'remark-math';
	import Markdown from 'svelte-exmarkdown';
	import { gfmPlugin } from 'svelte-exmarkdown/gfm';
	import type { Plugin } from 'svelte-exmarkdown/types';

	import { rehypeKatexFormula, rehypeKatexMathml } from './katex-formula';
	import { setMarkdownContext } from './markdown-context';
	import Blockquote from './renderers/Blockquote.svelte';
	import Em from './renderers/Em.svelte';
	import H1 from './renderers/heading/H1.svelte';
	import H2 from './renderers/heading/H2.svelte';
	import H3 from './renderers/heading/H3.svelte';
	import H4 from './renderers/heading/H4.svelte';
	import H5 from './renderers/heading/H5.svelte';
	import H6 from './renderers/heading/H6.svelte';
	import ImageMarkdown from './renderers/ImageMarkdown.svelte';
	import KatexFormula from './renderers/KatexFormula.svelte';
	import LinkOrTag from './renderers/LinkOrTag.svelte';
	import ListItem from './renderers/ListItem.svelte';
	import OrderedList from './renderers/OrderedList.svelte';
	import Paragraph from './renderers/Paragraph.svelte';
	import Section from './renderers/Section.svelte';
	import Span from './renderers/Span.svelte';
	import Strong from './renderers/Strong.svelte';
	import Sub from './renderers/Sub.svelte';
	import Sup from './renderers/Sup.svelte';
	import Table from './renderers/Table.svelte';
	import Td from './renderers/Td.svelte';
	import Th from './renderers/Th.svelte';
	import UnorderedList from './renderers/UnorderedList.svelte';
	import { rehypeDropEmptyThead } from './table';

	type Props = {
		source: string;
		chooseShort?: boolean;
		allowHtml?: boolean;
	};

	let { source, chooseShort = false, allowHtml = false }: Props = $props();

	// Scope the whole markdown output to the markdown typography theme so
	// top-level blocks (display formulas, loose list text) resolve the same
	// text variables as paragraphs and headings, which scope themselves.
	let markdownScopeClass = getGlobalTypographyClass('markdown');

	const plugins: Plugin[] = [
		gfmPlugin(),
		{ remarkPlugin: remarkMath },
		{ rehypePlugin: rehypeKatexMathml },
		{ rehypePlugin: rehypeKatexFormula },
		{ rehypePlugin: rehypeDropEmptyThead },
		...(allowHtml ? [{ rehypePlugin: rehypeRaw }] : []),
		{
			renderer: {
				image: ImageMarkdown,
				katexformula: KatexFormula,
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
				img: ImageMarkdown,
				section: Section,
				sup: Sup,
				sub: Sub,
				ul: UnorderedList,
				ol: OrderedList,
				li: ListItem,
				span: Span,
				table: Table,
				th: Th,
				td: Td,
				blockquote: Blockquote
			}
		}
	];

	setMarkdownContext({ chooseShort: chooseShort });
</script>

<div class="markdown-scope {markdownScopeClass}">
	<Markdown {plugins} md={source} />
</div>

<style>
	/* Scope only: must not affect layout. */
	.markdown-scope {
		display: contents;
	}
</style>
