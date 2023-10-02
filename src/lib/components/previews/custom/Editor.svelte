<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type {
		ArticlePreviewUpdateZod,
		ArticleSelect,
		PreviewTemplateSelect
	} from '$lib/server/collections/types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import TranslationEditor from '$lib/components/editors/TranslationEditor.svelte';

	export let formObj: SuperValidated<ArticlePreviewUpdateZod>;
	export let templateId: PreviewTemplateSelect['id'];
	export let article: ArticleSelect;

	$: ({ form, enhance } = superForm(formObj));
</script>

<h2>CUSTOM PREVIEW</h2>
<form use:enhance method="POST" action="?/update_preview">
	<input name="preview_template_id" type="hidden" bind:value={templateId} />
	<input name="preview_prop_1" type="text" bind:value={$form.preview_prop_1} />
	<input name="preview_prop_2" type="text" bind:value={$form.preview_prop_2} />
	<input
		name="preview_create_localized_screenshots"
		type="checkbox"
		bind:checked={$form.preview_create_localized_screenshots}
	/>
	Create Localizaed Screenshots
	<button>Update preview</button>
</form>
<TranslationEditor key={article.preview_translation_1_key} />
<TranslationEditor key={article.preview_translation_2_key} />
