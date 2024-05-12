<script lang="ts">
	import { page } from '$app/stores';
	import { PREVIEW_FAMILY_PARAM } from '$lib/collections/constants';
	import type import type { PreviewFamilyId } from '$lib/features/preview/families/types';
tPreviewComponent } from '$lib/features/preview/get-component';
	import type { PreviewTemplateSelect } from '$lib/features/preview/parsers';

	import type { PageData } from '../../../../routes/[lang=lang]/(with-header)/[username]/[[pageslug=pageslug]]/[articleslug]/edit/$types';
	import Translation from '../../i18n/Translation.svelte';
	import PreviewTemplateCreator from '../../preview/PreviewTemplateCreator.svelte';
	import PreviewTemplateEditor from '../../preview/PreviewTemplateEditor.svelte';
	import type { ArticleSelect } from '../parsers';

	export let data: PageData;

	$: ({
		previewFamilies,
		previewTemplates,
		previewComponents,
		previewTemplateCreationForm,
		previewForms,
		translationForms,
		meta,
		images
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
		)?.propsForm;
	}

	function onPreviewClick(familyId: PreviewFamilyId) {
		previewComponents[familyId].editor = getPreviewComponent(familyId, 'Editor');
	}
</script>

<ul>
	{#each previewFamilies as family}
		{#if family.id !== 'custom'}
			{@const component = previewComponents[family.id].editor}
			<li>
				<b><Translation key={family.name_translation_key} /></b>
				{#if component}
					{#await component}
						Loading...
					{:then component}
						{#if component instanceof Error}
							Couldn't load
						{:else}
							<svelte:component
								this={component}
								updateForm={getFormForPreview(previewForms, family.id, null)}
								images={{
									preview_image_1: images.find((image) => image.id === meta.preview_image_1_id),
									preview_image_2: images.find((image) => image.id === meta.preview_image_2_id)
								}}
								translationForms={{
									preview_translation_1: translationForms[meta.preview_translation_1_key],
									preview_translation_2: translationForms[meta.preview_translation_2_key]
								}}
							/>
						{/if}
					{/await}
				{:else}
					<a
						href={getPreviewSpecificLink(family.id, $page.url)}
						on:click={(e) => {
							e.preventDefault();
							onPreviewClick(family.id);
						}}>Load this editor</a
					>
				{/if}
			</li>
		{/if}
	{/each}
	{#each previewTemplates as template}
		{@const component = previewComponents.custom.editor}
		<li>
			<PreviewTemplateEditor
				formObj={template.form}
				image={images.find((image) => image.id === template.meta.image_id)}
			/>
			{#if component}
				{#await component}
					Loading...
				{:then component}
					{#if component instanceof Error}
						Couldn't load
					{:else}
						<svelte:component
							this={component}
							updateForm={getFormForPreview(previewForms, 'custom', template.meta.id)}
							images={{
								preview_image_1: images.find((image) => image.id === meta.preview_image_1_id),
								preview_image_2: images.find((image) => image.id === meta.preview_image_2_id)
							}}
							translationForms={{
								preview_translation_1: translationForms[meta.preview_translation_1_key],
								preview_translation_2: translationForms[meta.preview_translation_2_key]
							}}
							templateId={template.meta.id}
						/>
					{/if}
				{/await}
			{:else}
				<a
					href={getPreviewSpecificLink('custom', $page.url)}
					on:click={(e) => {
						e.preventDefault();
						onPreviewClick('custom');
					}}>Load this editor</a
				>
			{/if}
		</li>
	{/each}
	<li>
		<PreviewTemplateCreator formObj={previewTemplateCreationForm} />
	</li>
</ul>
