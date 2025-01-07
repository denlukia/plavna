<script lang="ts">
	import AnimatedPage from '@plavna/design/components/AnimatedPage/AnimatedPage.svelte';
	import Button from '@plavna/design/components/Button/Button.svelte';
	import Column from '@plavna/design/components/Grid/Column.svelte';
	import ColumnsContainer from '@plavna/design/components/Grid/ColumnsContainer.svelte';
	import Label from '@plavna/design/components/Label/Label.svelte';
	import Labeled from '@plavna/design/components/Label/Labeled.svelte';
	import Typography from '@plavna/design/components/Typography/Typography.svelte';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import AutosavedInput from '$lib/features/common/components/AutosavedInput.svelte';
	import { generatePath } from '$lib/features/common/links';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import ImagesCollections from '$lib/features/image/ImagesBlock/ImagesCollections.svelte';
	import PreviewEditorsList from '$lib/features/preview/PreviewsList.svelte';
	import ArticleTagsList from '$lib/features/tag/ArticleTagsList.svelte';

	import type { PageData } from '../../[articleslug]/edit/$types';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	let {
		meta: article,
		translationForms,
		tagInfos,
		tagCreationSuperValidated,
		routeId,
		lang
	} = $derived(data);

	let publishTime = $derived(article.publish_time);

	let viewHref = $derived(
		generatePath('/[lang]/[username]/[pageslug]/[articleslug]', $page.params)
	);
</script>

<AnimatedPage key={routeId + article.id + lang}>
	<Typography size="heading-1">
		<Translation key="article_editor.heading" />
	</Typography>

	<div class="page-editor">
		<ColumnsContainer>
			<Column cols={3}>
				<Column cols={2}>
					<Labeled as="label">
						<Label><Translation key="article_editor.title" /></Label>
						<AutosavedInput
							superValidated={translationForms[article.title_translation_key]}
							action="?/update_translation"
						/>
					</Labeled>
				</Column>
				<Column cols={1}>
					<Labeled as="label">
						<Label><Translation key="article_editor.slug" /></Label>
						<AutosavedInput superValidated={data.slugForm} action="?/update_slug" />
					</Labeled>
				</Column>
				<Labeled as="label">
					<Label><Translation key="article_editor.short_description" /></Label>
					<AutosavedInput
						superValidated={translationForms[article.description_translation_key]}
						action="?/update_translation_allow_empty"
					/>
				</Labeled>
				<Labeled as="label">
					<Label><Translation key="article_editor.content" /></Label>
					<AutosavedInput
						rows={20}
						action="?/update_translation_allow_empty"
						textarea
						superValidated={translationForms[article.content_translation_key]}
					/>
				</Labeled>
			</Column>

			<Column cols={2} customClass="article-editor-shifted-cell article-tags-list-cell">
				<section class="row">
					<ArticleTagsList tags={tagInfos} {tagCreationSuperValidated} />
				</section>
				<section class="row">
					<PreviewEditorsList {data} />
				</section>
				<section class="row">
					<ImagesCollections
						imageProvider={data.imageProvider}
						articleId={article.id}
						collections={{ common: data.commonImages, article: data.articleImages }}
					/>
				</section>
			</Column>
		</ColumnsContainer>
	</div>
</AnimatedPage>

<form class="main-actions" use:enhance method="POST" out:fade|global>
	<Button formaction="?/delete" kind="destructive">
		<Translation key="article_editor.actions.delete" />
	</Button>
	<Button href={viewHref} kind="secondary">
		<Translation key="article_editor.actions.view" />
	</Button>
	<Button
		formaction="?/{publishTime ? 'hide' : 'publish'}"
		kind={publishTime ? 'primary' : 'prominent'}
	>
		<Translation
			key={publishTime ? 'article_editor.actions.hide' : 'article_editor.actions.publish'}
		/>
	</Button>
</form>

<style>
	.main-actions {
		position: fixed;
		z-index: 1;
		bottom: var(--size-article-actions-bottom);
		left: 50%;
		transform: translateX(-50%);
		background: var(--color-article-actions-bg);
		box-shadow: var(--shadow-article-actions);
		padding-inline: var(--size-article-actions-padding-inline);
		padding-block: var(--size-article-actions-padding-block);
		border-radius: var(--size-article-actions-border-radius);
		display: flex;
		justify-content: center;
		gap: var(--size-article-actions-gap);

		animation: fade-in 400ms 350ms cubic-bezier(0.215, 0.61, 0.355, 1) backwards;
	}

	.page-editor {
		margin-top: var(--size-l);
		margin-bottom: var(--size-4xl);
	}

	.row {
		width: 100%;
		margin-bottom: var(--size-2xl);
	}
	.row:first-child {
		margin-top: var(--size-l);
	}

	:global(.article-editor-shifted-cell) {
		padding-inline-start: var(--size-l);
	}

	:global(.article-tags-list-cell) {
		align-self: stretch;
	}

	@keyframes fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
