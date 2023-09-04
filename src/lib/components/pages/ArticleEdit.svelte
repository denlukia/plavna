<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import PreviewEditorsList from '$lib/components/PreviewEditorsList.svelte';
	import TagCreator from '$lib/components/editors/TagCreator.svelte';
	import TagEditor from '$lib/components/editors/TagEditor.svelte';
	import TranslationEditor from '$lib/components/editors/TranslationEditor.svelte';

	import type { PageData } from '../../../routes/[[lang=lang]]/[username]/[slug]/edit/$types';

	export let data: PageData;

	const {
		form: slugFrom,
		errors: slugErrors,
		enhance: slugEnhance
	} = superForm(data.articleSlugForm);
	const { form, errors, enhance } = superForm(data.articleForm);

	$: ({ article } = data);
</script>

Редагування тайтла:
<TranslationEditor key={article.title_translation_id} />
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
<PreviewEditorsList {data} />
<fieldset>
	{#each data.tagForms as editorForms}
		<TagEditor {editorForms} />
	{/each}
	<TagCreator superFormObj={data.tagCreationForm} />
</fieldset>
<TranslationEditor key={article.content_translation_id} />
