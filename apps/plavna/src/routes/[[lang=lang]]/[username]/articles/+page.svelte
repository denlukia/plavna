<script lang="ts">
	import { AnimatedPage, Button, Typography } from '@plavna/design/components';
	import { page } from '$app/stores';
	import ArticleItem from '$lib/article/ArticleItem.svelte';
	import ColumnedCards from '$lib/common/components/ColumnedCards.svelte';
	import { PAGE_INRO_DELAY_MS } from '$lib/common/config.js';
	import { generatePath } from '$lib/common/links.js';
	import Translation from '$lib/i18n/Translation.svelte';

	let { data } = $props();

	let { routeId, lang } = $derived(data);
</script>

<AnimatedPage key={routeId + lang} introDelay={PAGE_INRO_DELAY_MS}>
	<Typography size="heading-1"><Translation key="articles_list.title" /></Typography>

	<ColumnedCards>
		{#each data.articles as article (article.id)}
			<ArticleItem {article} />
		{/each}
		<Button
			href={generatePath('/[lang]/[username]/new', $page.params, {
				username: $page.data.actor?.username
			})}
			dataSvelteKitPreloadData="off"
		>
			<Translation key="layout.new_article" />
		</Button>
	</ColumnedCards>
</AnimatedPage>
