<script lang="ts">
	import { enhance } from '$app/forms';
	import GridCell from '$lib/design/components/Grid/GridCell.svelte';
	import GridContainer from '$lib/design/components/Grid/GridContainer.svelte';
	import Label from '$lib/design/components/Label/Label.svelte';
	import LabeledInput from '$lib/design/components/Label/LabeledInput.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import PreviewEditorsList from '$lib/features/article/editor/PreviewEditorsList.svelte';
	import AutosavedInput from '$lib/features/common/components/AutosavedInput.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import TranslationEditor from '$lib/features/i18n/TranslationEditor.svelte';
	import ImagesCollectionsList from '$lib/features/image/ImagesCollections/ImagesCollectionsList.svelte';
	import TagCreator from '$lib/features/tag/TagCreator.svelte';
	import TagEditor from '$lib/features/tag/TagEditor.svelte';

	let { data } = $props();

	let { meta: article, translationForms } = data;
</script>

<Typography size="heading-1">
	<Translation key="article_editor.heading" />
</Typography>

<GridContainer>
	<GridCell colspan={3}>
		<GridCell colspan={2}>
			<LabeledInput>
				<Label><Translation key="article_editor.title" /></Label>
				<AutosavedInput
					superformData={translationForms[article.title_translation_key]}
					action="?/update_translation"
				/>
			</LabeledInput>
		</GridCell>

		<GridCell>
			<LabeledInput>
				<Label><Translation key="article_editor.slug" /></Label>
				<AutosavedInput superformData={data.slugForm} action="?/update_slug" />
			</LabeledInput>
		</GridCell>
	</GridCell>

	<GridCell colspan={3}>
		<LabeledInput>
			<Label><Translation key="article_editor.short_description" /></Label>
			<AutosavedInput
				element="textarea"
				superformData={translationForms[article.description_translation_key]}
				action="?/update_translation"
			/>
		</LabeledInput>
	</GridCell>
</GridContainer>

<form use:enhance method="POST">
	<button formaction="?/publish">Publish</button>
	<button formaction="?/hide">Hide</button>
	<button formaction="?/delete">Delete</button>
</form>
Прев'ю редактори:
<PreviewEditorsList {data} />
Теги:
<fieldset>
	{#each data.tagInfos as { checkedForm, name_translation_key }}
		<TagEditor {checkedForm} translationForm={data.translationForms[name_translation_key]} />
	{/each}
	<TagCreator superFormObj={data.tagCreationForm} />
</fieldset>
Додавання фото:
<ImagesCollectionsList
	providerForm={data.imageProviderForm}
	articleId={article.id}
	collections={{ common: data.commonImages, article: data.articleImages }}
/>
Контент статті:
<TranslationEditor formObj={translationForms[article.content_translation_key]} />
