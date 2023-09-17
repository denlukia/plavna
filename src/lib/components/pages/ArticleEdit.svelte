<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import PreviewEditorsList from '$lib/components/PreviewEditorsList.svelte';
	import TagCreator from '$lib/components/editors/TagCreator.svelte';
	import TagEditor from '$lib/components/editors/TagEditor.svelte';
	import TranslationEditor from '$lib/components/editors/TranslationEditor.svelte';

	import type { PageData } from '../../../routes/[[lang=lang]]/[username]/[slug]/edit/$types';
	import { enhance } from '$app/forms';
	import ArticleImageUploader from '../editors/ArticleImageUploader.svelte';

	export let data: PageData;

	const { form: slugFrom, errors: slugErrors, enhance: slugEnhance } = superForm(data.slugForm);

	$: ({ meta: article } = data);
</script>

Редагування тайтла:
<TranslationEditor key={article.title_translation_key} />
Редагування слага:
<form use:slugEnhance method="POST" action="?/update_slug">
	<input name="slug" type="text" bind:value={$slugFrom.slug} />
	<button>Save</button>
</form>
Публікація, ховання, видалення:
<form use:enhance method="POST">
	<button formaction="?/publish">Publish</button>
	<button formaction="?/hide">Hide</button>
	<button formaction="?/delete">Delete</button>
</form>
Прев'ю редактори:
<PreviewEditorsList {data} />
Теги:
<fieldset>
	{#each data.tagForms as editorForms}
		<TagEditor {editorForms} />
	{/each}
	<TagCreator superFormObj={data.tagCreationForm} />
</fieldset>
Додавання фото:
<ArticleImageUploader providerForm={data.imageProviderForm} />
Контент статті:
<TranslationEditor key={article.content_translation_key} />
