<script lang="ts">
	import { AnimatedPage, Button, IconWrapper, Typography } from '@plavna/design/components';
	import { Plus } from '@plavna/design/icons';
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
	<div class="heading">
		<Typography size="heading-1"><Translation key="articles_list.title" /></Typography>

		<div class="new-page-wrapper">
			<Button
				href={generatePath('/[lang]/[username]/new', $page.params, {
					username: $page.data.actor?.username
				})}
				dataSvelteKitPreloadData="off"
				contentCustomClass="with-icon"
			>
				<IconWrapper size="body"><Plus /></IconWrapper>
				<Translation key="layout.new_article" />
			</Button>
		</div>
	</div>

	<ColumnedCards>
		{#each data.articles as article (article.id)}
			<ArticleItem {article} />
		{/each}
	</ColumnedCards>
</AnimatedPage>

<style>
	.heading {
		display: flex;
		align-items: center;
		gap: var(--size-l);
	}
	.new-page-wrapper {
		margin-left: var(--size-m);
		margin-top: var(--size-m);
		display: flex;
		align-items: center;
	}
	.new-page-wrapper :global(.with-icon > *) {
		display: inline-flex;
		gap: var(--size-m);
		align-items: center;
	}
</style>
