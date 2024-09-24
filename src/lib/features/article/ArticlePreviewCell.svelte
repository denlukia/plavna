<script lang="ts">
	import { page } from '$app/stores';
	import GridCell from '$lib/design/components/Grid/GridCell.svelte';
	import { generatePath } from '$lib/features/common/links';

	import PreviewRenderer from '../preview/PreviewRenderer.svelte';
	import type { SectionProp } from '../section/types';

	type Props = {
		article: SectionProp['articles'][number];
	};

	let { article }: Props = $props();

	let { meta, tags } = $derived(article);

	let params = $derived($page.params);
</script>

<GridCell cols={meta.preview_columns} rows={meta.preview_rows}>
	<a
		class="article global-reset-link"
		href={generatePath('/[lang]/[username]/[pageslug]/[articleslug]', params, {
			articleslug: meta.slug
		})}
	>
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
