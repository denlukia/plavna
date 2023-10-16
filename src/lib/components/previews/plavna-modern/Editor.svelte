<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { ArticlePreviewUpdateZod, ArticleSelect } from '$lib/server/collections/types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import TranslationEditor from '$lib/components/editors/TranslationEditor.svelte';

	import ArticlePreviewImageInput from '$lib/components/inputs/image/ArticlePreviewImageInput.svelte';

	export let formObj: SuperValidated<ArticlePreviewUpdateZod>;
	export let article: ArticleSelect;

	$: ({ form, enhance, errors } = superForm(formObj));
</script>

<h2>PLAVNA MODERN</h2>
<TranslationEditor key={article.preview_translation_1_key} />
<TranslationEditor key={article.preview_translation_2_key} />
<form use:enhance method="POST" action="?/update_preview">
	<input name="preview_family" type="hidden" value="plavna-modern" />
	<input name="preview_prop_1" type="text" bind:value={$form.preview_prop_1} />
	<input name="preview_prop_2" type="text" bind:value={$form.preview_prop_2} />
	<ArticlePreviewImageInput name="preview_image_1" {errors} />
	<ArticlePreviewImageInput name="preview_image_2" {errors} />
	<button>Update preview</button>
</form>
