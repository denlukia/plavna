<script lang="ts">
	import Animated from '$lib/design/components/Animated/Animated.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import ArticleItem from '$lib/features/article/ArticleItem.svelte';
	import ColumnedContent from '$lib/features/common/components/ColumnedContent.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';

	let { data } = $props();

	let { routeId, lang } = $derived(data);
</script>

<Animated key={routeId + lang}>
	<Typography size="heading-1"><Translation key="articles_list.title" /></Typography>

	<ColumnedContent>
		{#each data.articles as article (article.id)}
			<ArticleItem {article} />
		{/each}
	</ColumnedContent>
</Animated>
