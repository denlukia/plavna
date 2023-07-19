<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import PreviewEditorsList from '$lib/components/PreviewEditorsList.svelte';
	import TagCreator from '$lib/components/TagCreator.svelte';
	import TagEditor from '$lib/components/TagEditor.svelte';
	import TranslationEditor from '$lib/components/TranslationEditor.svelte';

	import type { PageData } from '../../routes/[[lang=lang]]/[username]/[slug]/edit/$types';

	export let data: PageData;

	const { form: slugFrom, errors: slugErrors, enhance: slugEnhance } = superForm(data.postSlugForm);
	const { form, errors, enhance } = superForm(data.postForm);

	$: ({ previews, previewComponent, postPreviewForm, post } = data);
</script>

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
<PreviewEditorsList {previews} {post} {postPreviewForm} {previewComponent} />
<fieldset>
	{#each data.tagForms as tag}
		<TagEditor {tag} />
	{/each}
	<TagCreator superFormObj={data.tagCreationForm} />
</fieldset>
<TranslationEditor key={post.content_translation_id} />
