<script lang="ts">
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import PageAnimator from '$lib/features/animations/PageAnimator.svelte';
	import ArticleItem from '$lib/features/article/ArticleItem.svelte';
	import CardsList from '$lib/features/common/components/CardsList.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';

	let { data } = $props();

	let { routeId } = $derived(data);
</script>

<PageAnimator {routeId}>
	<Typography size="heading-1"><Translation key="articles_list.title" /></Typography>

	<CardsList>
		{#each data.articles as article (article.id)}
			<ArticleItem {article} />
		{/each}
	</CardsList>
</PageAnimator>
