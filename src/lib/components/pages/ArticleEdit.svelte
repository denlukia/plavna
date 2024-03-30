<script lang="ts">
	import { enhance } from '$app/forms';
	import { superForm } from 'sveltekit-superforms';
	import TagCreator from '$lib/components/editors/TagCreator.svelte';
	import TagEditor from '$lib/components/editors/TagEditor.svelte';
	import TranslationEditor from '$lib/components/editors/TranslationEditor.svelte';
	import PreviewEditorsList from '$lib/components/PreviewEditorsList.svelte';

	import type { PageData } from '../../../routes/[[lang=lang]]/[username]/[slug]/edit/$types';
	import ImagesCollections from '../editors/ImagesCollections/index.svelte';

	export let data: PageData;

	const { form: slugFrom, errors: slugErrors, enhance: slugEnhance } = superForm(data.slugForm);

	$: ({ meta: article, translationForms } = data);
</script>

Редагування тайтла:
<TranslationEditor formObj={translationForms[article.title_translation_key]} />
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
	{#each data.tagInfos as { checkedForm, name_translation_key }}
		<TagEditor {checkedForm} translationForm={data.translationForms[name_translation_key]} />
	{/each}
	<TagCreator superFormObj={data.tagCreationForm} />
</fieldset>
Додавання фото:
<ImagesCollections
	providerForm={data.imageProviderForm}
	articleId={article.id}
	collections={{ common: data.commonImages, article: data.articleImages }}
/>
Контент статті:
<TranslationEditor formObj={translationForms[article.content_translation_key]} />
