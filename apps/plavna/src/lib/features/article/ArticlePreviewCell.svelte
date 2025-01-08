<script lang="ts">
	import { GridCell } from '@plavna/design/components';
	import { navigating, page } from '$app/stores';
	import { generatePath } from '$lib/features/common/links';

	import PreviewRenderer from '../preview/PreviewRenderer.svelte';
	import type { SectionProp } from '../section/types';
	import { receive, send } from './transition';

	type Props = {
		article: SectionProp['articles'][number];
	};

	let { article }: Props = $props();

	let { meta } = $derived(article);

	let params = $derived($page.params);

	let href = $derived(
		generatePath('/[lang]/[username]/[pageslug]/[articleslug]', params, {
			articleslug: meta.slug
		})
	);

	// TODO: Using this might reuire an instantly shown wrapper with preview component pre-response article data
	// let isNavigatingToArticle = $derived($navigating?.to?.params?.['articleslug'] === meta.slug);

	// TODO: In general turned out to be buggy, I'm in shambles
	// let isOnArticle = $derived($page.params?.['articleslug'] === meta.slug);
	// let conf = $derived({ key: meta.slug });
</script>

<GridCell cols={meta.preview_columns} rows={meta.preview_rows}>
	<!-- <a class="article global-reset-link" {href} in:receive|global={conf} out:send|global={conf}> -->
	<a class="article global-reset-link" {href}>
		<PreviewRenderer {article} />
	</a>
</GridCell>

<style>
	.article {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
