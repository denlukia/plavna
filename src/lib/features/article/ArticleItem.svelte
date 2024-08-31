<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { PUBLIC_HOST } from '$env/static/public';
	import Button from '$lib/design/components/Button/Button.svelte';

	import Card from '../common/components/Card.svelte';
	import { generatePath } from '../common/links';
	import Translation from '../i18n/Translation.svelte';
	import type { ArticleService } from './service';

	type Props = {
		article: Awaited<ReturnType<ArticleService['getMyAsForms']>>['articles'][number];
	};

	let { article }: Props = $props();
	let { publish_time } = $derived(article);

	let link = $derived(
		generatePath(`/[lang]/[username]/[articleslug]`, $page.params, {
			articleslug: article.slug
		})
	);
</script>

<Card {link} linkText="{PUBLIC_HOST}{link}">
	{#snippet title()}
		<Translation recordKey={article.title_translation_key} />
	{/snippet}
	{#snippet actions()}
		<Button kind="secondary" href="{link}/edit">
			<Translation key="articles_list.edit" />
		</Button>
		<form use:enhance method="POST">
			<input type="hidden" name="articleslug" value={article.slug} />

			<Button
				formaction="?/{publish_time ? 'hide' : 'publish'}"
				kind={publish_time ? 'primary' : 'prominent'}
			>
				<Translation key={publish_time ? 'articles_list.hide' : 'articles_list.publish'} />
			</Button>
		</form>
	{/snippet}
</Card>
