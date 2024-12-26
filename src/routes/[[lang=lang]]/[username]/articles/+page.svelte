<script lang="ts">
	import { page } from '$app/stores';
	import AnimatedPage from '$lib/design/components/AnimatedPage/AnimatedPage.svelte';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import ArticleItem from '$lib/features/article/ArticleItem.svelte';
	import ColumnedCards from '$lib/features/common/components/ColumnedCards.svelte';
	import { generatePath } from '$lib/features/common/links.js';
	import Translation from '$lib/features/i18n/Translation.svelte';

	let { data } = $props();

	let { routeId, lang } = $derived(data);
</script>

<AnimatedPage key={routeId + lang}>
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
