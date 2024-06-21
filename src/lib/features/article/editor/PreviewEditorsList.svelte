<script lang="ts">
	import { page } from '$app/stores';
	import { PREVIEW_FAMILY_PARAM } from '$lib/collections/constants';
	import { getPreviewComponent } from '$lib/features/preview/enricher';
	import type { PreviewFamilyId } from '$lib/features/preview/families/types';

	import type { PageData } from '../../../../routes/[lang=lang]/[username]/[[pageslug=pageslug]]/[articleslug]/edit/$types';
	import Translation from '../../i18n/Translation.svelte';
	import PreviewTemplateEditor from '../../preview/PreviewTemplateEditor.svelte';
	import type { ArticleSelect } from '../parsers';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	let {
		previewFamilies,
		previewTemplates,
		previewComponents,
		previewTemplateCreationForm,
		previewForms,
		translationForms,
		meta,
		images
	} = $derived(data);

	type PreviewForms = typeof previewForms;

	let currentPreview = $derived.by(getInitialCurrentPreview);
	let currentPreviewFamily = $derived(currentPreview.family);
	let currentEditorComponent = $derived.by(getCurrentEditorComponent);

	function getInitialCurrentPreview() {
		let familyFromParam = $state($page.url.searchParams.get(PREVIEW_FAMILY_PARAM));
		if (!familyFromParam) {
			return {
				family: meta.preview_family,
				templateId: meta.preview_template_id
			};
		}
		let familyIsNumber = !isNaN(Number(familyFromParam));
		if (familyIsNumber) {
			return {
				family: 'custom' as const,
				templateId: Number(familyFromParam)
			};
		} else {
			// TODO: Validation of param
			return {
				family: familyFromParam as PreviewFamilyId,
				templateId: null
			};
		}
	}

	function getCurrentEditorComponent() {
		if (!currentPreview.family) {
			return null;
		}
		return previewComponents[currentPreview.family].editor;
	}

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
		)?.propsForm;
	}

	function onPreviewClick(e: Event, familyId: PreviewFamilyId) {
		e.preventDefault();
		previewComponents[familyId].editor = getPreviewComponent(familyId, 'Editor');
	}
</script>

<ul class="previews-list">
	<li>
		<PreviewTemplateEditor type="creating" superValidatedMain={previewTemplateCreationForm} />
	</li>
	{#each previewFamilies as family}
		{#if family.id !== 'custom'}
			<li>
				<Translation key={family.name_translation_key} />
			</li>
		{/if}
	{/each}
	{#each previewTemplates as template}
		<li>
			<!-- <PreviewTemplateEditor
				formObj={template.form}
				image={images.find((image) => image.id === template.meta.image_id)}
			/> -->
		</li>
	{/each}
</ul>

{#if currentPreviewFamily}
	<!-- {#if currentEditorComponent}
		{#await currentEditorComponent}
			Loading...
		{:then currentEditorComponent}
			<svelte:component
				this={currentEditorComponent}
				updateForm={getFormForPreview(previewForms, currentPreviewFamily, null)}
				images={{
					preview_image_1: images.find((image) => image.id === meta.preview_image_1_id),
					preview_image_2: images.find((image) => image.id === meta.preview_image_2_id)
				}}
				translationForms={{
					preview_translation_1: translationForms[meta.preview_translation_1_key],
					preview_translation_2: translationForms[meta.preview_translation_2_key]
				}}
			/>
		{:catch}
			Couldn't load
		{/await}
	{:else}
		<a
			href={getPreviewSpecificLink(currentPreviewFamily, $page.url)}
			onclick={(e) => onPreviewClick(e, currentPreviewFamily)}>Load this editor</a
		>
	{/if} -->
{/if}

<style>
	.previews-list {
		list-style: none;
		padding: 0;
	}
</style>
