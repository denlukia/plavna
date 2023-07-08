<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import PreviewEditorsList from '$lib/components/PreviewEditorsList.svelte';
	import TagCreator from '$lib/components/TagCreator.svelte';
	import TagEditor from '$lib/components/TagEditor.svelte';
	import TranslationEditor from '$lib/components/TranslationEditor.svelte';

	import type { PageData } from './[slug]/edit/$types';

	export let data: PageData;

	const { form, errors, enhance } = superForm(data.postForm);

	$: ({ previews, currentPreviewValues, currentPreviewId, previewComponent } = data);
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
<PreviewEditorsList {previews} {currentPreviewValues} {currentPreviewId} {previewComponent} />
<TranslationEditor superFormObj={data.titleForm} />
<TranslationEditor superFormObj={data.contentForm} />

<fieldset>
	{#each data.tagForms as tag}
		<TagEditor {tag} />
	{/each}
	<TagCreator superFormObj={data.tagCreationForm} />
</fieldset>
