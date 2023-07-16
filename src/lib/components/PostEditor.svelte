<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import PreviewEditorsList from '$lib/components/PreviewEditorsList.svelte';
	import TagCreator from '$lib/components/TagCreator.svelte';
	import TagEditor from '$lib/components/TagEditor.svelte';
	import TranslationEditor from '$lib/components/TranslationEditor.svelte';

	import type { PageData } from '../../routes/[[lang=lang]]/[username]/[slug]/edit/$types';

	export let data: PageData;

	const { form, errors, enhance } = superForm(data.postForm);

	$: ({ previews, previewComponent, post } = data);
</script>

<fieldset>
	Редагування слага
	<form use:enhance method="POST">
		<input name="id" type="hidden" bind:value={$form.id} />
		<input name="slug" type="text" bind:value={$form.slug} />
		<button formaction="?/save">Save</button>
		<button formaction="?/publish">Publish</button>
		<button formaction="?/hide">Hide</button>
		<button formaction="?/delete">Delete</button>
	</form>
</fieldset>
<PreviewEditorsList {previews} {post} {previewComponent} />
<TranslationEditor key={post.title_translation_id} />
<TranslationEditor key={post.content_translation_id} />

<fieldset>
	{#each data.tagForms as tag}
		<TagEditor {tag} />
	{/each}
	<TagCreator superFormObj={data.tagCreationForm} />
</fieldset>
