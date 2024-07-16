<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Button from '$lib/design/components/Button/Button.svelte';
	import GridCell from '$lib/design/components/Grid/GridCell.svelte';
	import GridContainer from '$lib/design/components/Grid/GridContainer.svelte';
	import Label from '$lib/design/components/Label/Label.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import AutosavedInput from '$lib/features/common/components/AutosavedInput.svelte';
	import { generatePath } from '$lib/features/common/links';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import ImagesCollectionsList from '$lib/features/image/ImagesBlock/ImagesBlock.svelte';
	import PreviewEditorsList from '$lib/features/preview/PreviewsList.svelte';
	import ArticleTagsList from '$lib/features/tag/ArticleTagsList.svelte';

	let { data } = $props();

	let { meta: article, translationForms, tagInfos, tagCreationSuperValidated } = $derived(data);

	let publishTime = $derived(article.publish_time);

	let viewHref = $derived(
		generatePath(`/[lang]/[username]/[pageslug]/[articleslug]`, $page.params)
	);
</script>

<Typography size="heading-1">
	<Translation key="article_editor.heading" />
</Typography>

<form class="main-actions" use:enhance method="POST">
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

<section class="row">
	<GridContainer>
		<GridCell colspan={3}>
			<GridCell colspan={2}>
				<div class="global-labeled-input-wrapper">
					<Label><Translation key="article_editor.title" /></Label>
					<AutosavedInput
						superValidated={translationForms[article.title_translation_key]}
						action="?/update_translation"
					/>
				</div>
			</GridCell>

			<GridCell>
				<div class="global-labeled-input-wrapper">
					<Label><Translation key="article_editor.slug" /></Label>
					<AutosavedInput superValidated={data.slugForm} action="?/update_slug" />
				</div>
			</GridCell>

			<GridCell colspan={3}>
				<div class="global-labeled-input-wrapper">
					<Label><Translation key="article_editor.short_description" /></Label>
					<AutosavedInput
						textarea
						superValidated={translationForms[article.description_translation_key]}
						action="?/update_translation"
					/>
				</div>
			</GridCell>
		</GridCell>

		<GridCell colspan={2} customClass="article-editor-shifted-cell article-tags-list-cell">
			<ArticleTagsList tags={tagInfos} {tagCreationSuperValidated} />
		</GridCell>
	</GridContainer>
</section>

<section class="row">
	<GridContainer>
		<GridCell colspan={3}>
			<div class="global-labeled-input-wrapper">
				<Label><Translation key="article_editor.previews.section_label" /></Label>

				<GridCell colspan={3}>
					<PreviewEditorsList {data} />
				</GridCell>
			</div>
		</GridCell>
		<GridCell colspan={2} customClass="article-editor-shifted-cell">
			<div class="global-labeled-input-wrapper">
				<Label><Translation key="article_editor.images.label" /></Label>
				<ImagesCollectionsList
					providerForm={data.imageProviderForm}
					articleId={article.id}
					collections={{ common: data.commonImages, article: data.articleImages }}
				/>
			</div>
		</GridCell>
	</GridContainer>
</section>

<section class="row">
	<GridContainer>
		<GridCell colspan={3}>
			<div class="global-labeled-input-wrapper">
				<Label><Translation key="article_editor.content" /></Label>
				<AutosavedInput
					rows={8}
					action="?/update_translation"
					textarea
					superValidated={translationForms[article.content_translation_key]}
				/>
			</div>
		</GridCell>
	</GridContainer>
</section>

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
	}

	.row {
		margin-top: var(--size-2xl);
	}

	:global(.article-editor-shifted-cell) {
		padding-inline-start: var(--size-l);
	}

	:global(.article-tags-list-cell) {
		align-self: stretch;
	}
</style>
