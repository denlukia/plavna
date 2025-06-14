<script lang="ts">
	import { AnimatedPage, Button, ColumnsContainer, Typography } from '@plavna/design/components';
	import { page } from '$app/stores';
	import ArticleItem from '$lib/article/ArticleItem.svelte';
	import ColumnedCards from '$lib/common/components/ColumnedCards.svelte';
	import { PAGE_INRO_DELAY_MS } from '$lib/common/config.js';
	import { generatePath } from '$lib/common/links.js';
	import Translation from '$lib/i18n/Translation.svelte';

	import Column from '../../../../../../../packages/design/src/lib/components/Grid/Column.svelte';

	let { data } = $props();

	let { routeId, lang } = $derived(data);
</script>

<AnimatedPage key={routeId + lang} introDelay={PAGE_INRO_DELAY_MS}>
	<ColumnsContainer style="align-items: center;">
		<Column cols={2}>
			<Typography size="heading-1"><Translation key="articles_list.title" /></Typography>
		</Column>
		<Column>
			<Button
				href={generatePath('/[lang]/[username]/new', $page.params, {
					username: $page.data.actor?.username
				})}
				dataSvelteKitPreloadData="off"
			>
				<Translation key="layout.new_article" />
			</Button>
		</Column>
	</ColumnsContainer>

	<ColumnedCards>
		{#each data.articles as article (article.id)}
			<ArticleItem {article} />
		{/each}
	</ColumnedCards>
</AnimatedPage>
