<script lang="ts">
	import { page } from '$app/stores';
	import Translation from './Translation.svelte';

	import { generatePath } from '$lib/isomorphic/url';

	import type { ArticleSelect, TagSelect } from '$lib/server/collections/types';
	import type { Page } from '@sveltejs/kit';

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
	<Translation key={article.title_translation_id} />
	{#each tags as tag (tag.id)}
		<p>
			<Translation key={tag.name_translation_id} />
		</p>
	{/each}
</a>

<style>
	.article {
		display: block;
		background-color: #eee;
		width: 200px;
		padding: 20px;
		margin: 10px;
		border-radius: 10px;
	}
</style>
