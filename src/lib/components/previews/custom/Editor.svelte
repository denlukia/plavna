<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type {
		ArticlePreviewUpdateZod,
		ArticleSelect,
		PreviewTemplateSelect
	} from '$lib/server/collections/types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import TranslationEditor from '$lib/components/editors/TranslationEditor.svelte';
	import ArticlePreviewImageInput from '$lib/components/inputs/image/ArticlePreviewImageInput.svelte';

	export let formObj: SuperValidated<ArticlePreviewUpdateZod>;
	export let templateId: PreviewTemplateSelect['id'];
	export let article: ArticleSelect;

	$: ({ form, enhance, errors } = superForm(formObj));
</script>

<h2>CUSTOM PREVIEW</h2>
<TranslationEditor key={article.preview_translation_1_key} />
<TranslationEditor key={article.preview_translation_2_key} />
<form use:enhance method="POST" action="?/update_preview">
	<input name="preview_template_id" type="hidden" bind:value={templateId} />
	<input name="preview_prop_1" type="text" bind:value={$form.preview_prop_1} />
	<input name="preview_prop_2" type="text" bind:value={$form.preview_prop_2} />
	<ArticlePreviewImageInput name="preview_image_1" {errors} />
	<ArticlePreviewImageInput name="preview_image_2" {errors} />
	<input
		name="preview_create_localized_screenshots"
		type="checkbox"
		bind:checked={$form.preview_create_localized_screenshots}
	/>
	Create Localizaed Screenshots
	<button>Update preview</button>
</form>
