<script lang="ts">
	import Translation from './Translation.svelte';

	import type {
		ArticlePreviewUpdateZod,
		PreviewTemplateSelect
	} from '$lib/server/collections/types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { page } from '$app/stores';
	import { PREVIEW_FAMILY_PARAM } from '$lib/isomorphic/constants';
	import EditorWrapper from './previews/EditorWrapper.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	import type { PageData } from '../../routes/[[lang=lang]]/[username]/[slug]/edit/$types';
	import type { PreviewFamily } from '$lib/server/collections/previews';
	import PreviewTemplateCreator from './editors/PreviewTemplateCreator.svelte';
	import PreviewTemplateEditor from './editors/PreviewTemplateEditor.svelte';

	export let data: PageData;

	$: ({
		previewFamilies,
		previewTemplates,
		previewComponents,
		previewTemplateCreationForm,
		articlePreviewForm
	} = data);

	$: previewFamilyFromParam = $page.url.searchParams.get(PREVIEW_FAMILY_PARAM);
	$: initialPreviewFamily = previewFamilyFromParam
		? Number(previewFamilyFromParam)
		: articlePreviewForm.data.preview_family;

	let overridenPreviewFamily: null | PreviewTemplateSelect['id'] = null;
	$: finalPreviewFamily = overridenPreviewFamily ?? initialPreviewFamily;

	function getPreviewSpecificLink(preview: PreviewFamily, currentURL: URL) {
		let url = new URL(currentURL);
		url.searchParams.set(PREVIEW_FAMILY_PARAM, String(preview.id));
		return url.pathname + url.search;
	}
</script>

Всі первью:
<ul>
	{#each previewFamilies as family}
		{@const component = previewComponents[family.id].editor}
		<li>
			<b><Translation key={family.name_translation_key} /></b>
			{#if component}
				<svelte:component this={component} />
			{:else}
				<a href={getPreviewSpecificLink(family, $page.url)}>Load this editor</a>
			{/if}
		</li>
	{/each}
	{#each previewTemplates as template}
		<li>
			<PreviewTemplateEditor formObj={template.form} />
		</li>
	{/each}
	<li>
		<PreviewTemplateCreator formObj={previewTemplateCreationForm} />
	</li>
</ul>
