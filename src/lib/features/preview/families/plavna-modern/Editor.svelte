<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ArticlePreviewUpdate } from '$lib/features/article/parsers';
	import type { TranslationUpdate } from '$lib/features/i18n/parsers';
	import TranslationEditor from '$lib/features/i18n/TranslationEditor.svelte';
	import LanguagedImagesInput from '$lib/features/image/LanguagedImagesInput.svelte';
	import type { ImageSelect } from '$lib/features/image/parsers';

	export let updateForm: SuperValidated<ArticlePreviewUpdate>;
	export let images: { preview_image_1: ImageSelect; preview_image_2: ImageSelect };
	export let translationForms: {
		preview_translation_1: SuperValidated<TranslationUpdate>;
		preview_translation_2: SuperValidated<TranslationUpdate>;
	};

	// export let article: ArticleSelect;

	$: ({ form, enhance, errors } = superForm(updateForm));
</script>

<h2>PLAVNA MODERN</h2>
<TranslationEditor formObj={translationForms.preview_translation_1} />
<TranslationEditor formObj={translationForms.preview_translation_1} />
<form use:enhance method="POST" action="?/update_preview">
	<input name="preview_family" type="hidden" value="plavna-modern" />
	<input name="preview_prop_1" type="text" bind:value={$form.preview_prop_1} />
	<input name="preview_prop_2" type="text" bind:value={$form.preview_prop_2} />
	<LanguagedImagesInput
		name="preview_image_1"
		image={images.preview_image_1}
		{errors}
		withLanguages
		clientUpload
	/>
	<LanguagedImagesInput
		name="preview_image_2"
		image={images.preview_image_2}
		{errors}
		withLanguages
		clientUpload
	/>
	<button>Update preview</button>
</form>
