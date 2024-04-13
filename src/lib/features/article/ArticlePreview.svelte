<script lang="ts">
	import type { Page } from '@sveltejs/kit';
	import { page } from '$app/stores';
	import { generatePath } from '$lib/features/common/links';

	import Translation from '../i18n/Translation.svelte';
	import type { TagSelect } from '../tag/parsers';
	import type { ArticleSelect } from './parsers';

	export let article: ArticleSelect;
	export let tags: TagSelect[];

	function getRouteId(params: Page['params']) {
		if ('pagename' in params) {
			return '/[[lang=lang]]/[username]/page-[pagename]/[slug]';
		} else {
			return '/[[lang=lang]]/[username]/[slug]';
		}
	}
</script>

<a
	class="article"
	href={generatePath(getRouteId($page.params), {
		'[[lang=lang]]': $page.params.lang,
		'[username]': $page.params.username,
		'[pagename]': $page.params.pagename,
		'[slug]': article.slug
	})}
>
	<Translation recordKey={article.title_translation_key} />
	{#each tags as tag (tag.id)}
		<p>
			<Translation recordKey={tag.name_translation_key} />
		</p>
	{/each}
</a>

<style>
	.article {
		display: block;
		background-color: #eee;
		width: 200px;
		padding: 20px;
		margin: var(--size-m);
		border-radius: var(--size-m);
	}
</style>
