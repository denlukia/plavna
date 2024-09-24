<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/design/components/Button/Button.svelte';
	import { generatePath } from '$lib/features/common/links';
	import Translation from '$lib/features/i18n/Translation.svelte';

	import type { PageData } from '../[articleslug]/$types';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	let editHref = $derived(
		generatePath('/[lang]/[username]/[pageslug]/[articleslug]/edit', $page.params)
	);
</script>

<h1>
	<Translation recordKey={data.article.title_translation_key} />
</h1>
<Translation recordKey={data.article.content_translation_key} markdown />
<!-- {#if data.previewComponent}
	<svelte:component this={data.previewComponent} />
{:else}
	No preview
{/if} -->

<div class="main-actions">
	<Button href={editHref} kind="secondary">
		<Translation key="article.edit" />
	</Button>
</div>

<style>
	.main-actions {
		position: fixed;
		z-index: 1;
		bottom: var(--size-article-actions-bottom);
		left: 50%;
		transform: translateX(-50%);
		/* background: var(--color-article-actions-bg);
		box-shadow: var(--shadow-article-actions);
		padding-inline: var(--size-article-actions-padding-inline);
		padding-block: var(--size-article-actions-padding-block);
		border-radius: var(--size-article-actions-border-radius);
		display: flex;
		justify-content: center;
		gap: var(--size-article-actions-gap); */
	}
</style>
