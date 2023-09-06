<script lang="ts">
	import Translation from './Translation.svelte';

	import type {
		ArticlePreviewUpdateZod,
		ArticleSelect,
		PreviewTemplateSelect
	} from '$lib/server/collections/types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { page } from '$app/stores';
	import { PREVIEW_FAMILY_PARAM } from '$lib/isomorphic/constants';
	import EditorWrapper from './previews/EditorWrapper.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	import type { PageData } from '../../routes/[[lang=lang]]/[username]/[slug]/edit/$types';
	import type { PreviewFamilyId } from '$lib/server/collections/previews';
	import PreviewTemplateCreator from './editors/PreviewTemplateCreator.svelte';
	import PreviewTemplateEditor from './editors/PreviewTemplateEditor.svelte';

	export let data: PageData;

	$: ({
		previewFamilies,
		previewTemplates,
		previewComponents,
		previewTemplateCreationForm,
		previewForms,
		meta
	} = data);

	type PreviewForms = typeof previewForms;

	$: previewFamilyFromParam = $page.url.searchParams.get(PREVIEW_FAMILY_PARAM);
	$: initialPreviewFamily = previewFamilyFromParam
		? Number(previewFamilyFromParam)
		: meta.preview_family;

	let overridenPreviewFamily: null | PreviewTemplateSelect['id'] = null;
	$: finalPreviewFamily = overridenPreviewFamily ?? initialPreviewFamily;

	function getPreviewSpecificLink(previewFamilyId: PreviewFamilyId, currentURL: URL) {
		let url = new URL(currentURL);
		url.searchParams.set(PREVIEW_FAMILY_PARAM, previewFamilyId);
		return url.pathname + url.search;
	}

	function getFormForPreview(
		previewForms: PreviewForms,
		familyId: ArticleSelect['preview_family'],
		templateId: ArticleSelect['preview_template_id']
	) {
		return previewForms.find(
			(formObj) => formObj.familyId === familyId && formObj.templateId === templateId
		)?.form;
	}
</script>

Всі первью:
<ul>
	{#each previewFamilies as family}
		{#if family.id !== 'custom'}
			{@const component = previewComponents[family.id].editor}
			<li>
				<b><Translation key={family.name_translation_key} /></b>
				{#if component}
					<svelte:component
						this={component}
						formObj={getFormForPreview(previewForms, family.id, null)}
					/>
				{:else}
					<a href={getPreviewSpecificLink(family.id, $page.url)}>Load this editor</a>
				{/if}
			</li>
		{/if}
	{/each}
	{#each previewTemplates as template}
		{@const component = previewComponents.custom.editor}
		<li>
			<PreviewTemplateEditor formObj={template.form} />
			{#if component}
				<svelte:component
					this={component}
					formObj={getFormForPreview(previewForms, 'custom', template.meta.id)}
				/>
			{:else}
				<a href={getPreviewSpecificLink('custom', $page.url)}>Load this editor</a>
			{/if}
		</li>
	{/each}
	<li>
		<PreviewTemplateCreator formObj={previewTemplateCreationForm} />
	</li>
</ul>
