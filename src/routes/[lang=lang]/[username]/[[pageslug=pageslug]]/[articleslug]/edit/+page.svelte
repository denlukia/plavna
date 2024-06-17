<script lang="ts">
	import { enhance } from '$app/forms';
	import GridCell from '$lib/design/components/Grid/GridCell.svelte';
	import GridContainer from '$lib/design/components/Grid/GridContainer.svelte';
	import Label from '$lib/design/components/Label/Label.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import PreviewEditorsList from '$lib/features/article/editor/PreviewEditorsList.svelte';
	import AutosavedInput from '$lib/features/common/components/AutosavedInput.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import TranslationEditor from '$lib/features/i18n/TranslationEditor.svelte';
	import ImagesCollectionsList from '$lib/features/image/ImagesCollections/ImagesCollectionsList.svelte';
	import ArticleTagsList from '$lib/features/tag/ArticleTagsList.svelte';

	let { data } = $props();

	let { meta: article, translationForms, tagInfos, tagCreationSuperValidated } = $derived(data);
</script>

<Typography size="heading-1">
	<Translation key="article_editor.heading" />
</Typography>

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
					element="textarea"
					superValidated={translationForms[article.description_translation_key]}
					action="?/update_translation"
				/>
			</div>
		</GridCell>
	</GridCell>

	<GridCell colspan={2}>
		<ArticleTagsList tags={tagInfos} {tagCreationSuperValidated} />
	</GridCell>
</GridContainer>

<form use:enhance method="POST">
	<button formaction="?/publish">Publish</button>
	<button formaction="?/hide">Hide</button>
	<button formaction="?/delete">Delete</button>
</form>
Прев'ю редактори:
<PreviewEditorsList {data} />

Додавання фото:
<ImagesCollectionsList
	providerForm={data.imageProviderForm}
	articleId={article.id}
	collections={{ common: data.commonImages, article: data.articleImages }}
/>
Контент статті:
<TranslationEditor formObj={translationForms[article.content_translation_key]} />
