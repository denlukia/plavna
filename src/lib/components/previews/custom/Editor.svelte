<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type {
		ArticlePreviewUpdateZod,
		ImageSelect,
		PreviewTemplateSelect,
		TranslationUpdateZod
	} from '$lib/server/collections/types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import TranslationEditor from '$lib/components/editors/TranslationEditor.svelte';
	import ImageInput from '$lib/components/inputs/image/ImageInput.svelte';

	export let updateForm: SuperValidated<ArticlePreviewUpdateZod>;
	export let images: { preview_image_1: ImageSelect; preview_image_2: ImageSelect };
	export let translationForms: {
		preview_translation_1: SuperValidated<TranslationUpdateZod>;
		preview_translation_2: SuperValidated<TranslationUpdateZod>;
	};
	export let templateId: PreviewTemplateSelect['id'];
	// export let article: ArticleSelect;

	$: ({ form, enhance, errors } = superForm(updateForm));
</script>

<h2>CUSTOM PREVIEW</h2>
<TranslationEditor formObj={translationForms.preview_translation_1} />
<TranslationEditor formObj={translationForms.preview_translation_1} />
<form use:enhance method="POST" action="?/update_preview">
	<input name="preview_template_id" type="hidden" bind:value={templateId} />
	<input name="preview_prop_1" type="text" bind:value={$form.preview_prop_1} />
	<input name="preview_prop_2" type="text" bind:value={$form.preview_prop_2} />
	<ImageInput
		name="preview_image_1"
		image={images.preview_image_1}
		errors={$errors['preview_image_1_id']}
		withLanguages
	/>
	<ImageInput
		name="preview_image_2"
		image={images.preview_image_2}
		errors={$errors['preview_image_2_id']}
		withLanguages
	/>
	<input
		name="preview_create_localized_screenshots"
		type="checkbox"
		bind:checked={$form.preview_create_localized_screenshots}
	/>
	Create Localizaed Screenshots
	<button>Update preview</button>
</form>
