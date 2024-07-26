<script lang="ts">
	import { page } from '$app/stores';
	import { untrack } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { PREVIEW_FAMILY_PARAM, PREVIEW_TEMPLATE_PARAM } from '$lib/collections/constants';
	import Button from '$lib/design/components/Button/Button.svelte';
	import GridCell from '$lib/design/components/Grid/GridCell.svelte';
	import IconWrapper from '$lib/design/components/IconWrapper/IconWrapper.svelte';
	import Popup from '$lib/design/components/Popup/Popup.svelte';
	import TabItem from '$lib/design/components/Tabs/TabItem.svelte';
	import Tabs from '$lib/design/components/Tabs/Tabs.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import Plus from '$lib/design/icons/Plus.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import { getPreviewComponent } from '$lib/features/preview/enricher';
	import type { PreviewFamilyId } from '$lib/features/preview/families/types';

	import type { PageData } from '../../../routes/[lang=lang]/[username]/[[pageslug=pageslug]]/[articleslug]/edit/$types';
	import type { SystemTranslationKey } from '../i18n/types';
	import PreviewTemplateEditor from './PreviewTemplateForm.svelte';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	let {
		previewFamilies,
		previewTemplates,
		previewTemplateCreationSuperValidated,
		previewEditorSuperValidated,
		translationForms,
		meta,
		images
	} = $derived(data);

	let mode = $state('edit');
	let currentPreviewObject = $state(getInitialCurrentPreview());
	let currentPreviewTemplateMeta = $derived.by(getCurrentPreviewTemplate);
	let currentEditorComponent = $derived.by(getCurrentEditorComponent);

	type PreviewObject = ReturnType<typeof getInitialCurrentPreview>;

	function getCurrentPreviewTemplate() {
		if (!currentPreviewObject.family || typeof currentPreviewObject.template !== 'number') {
			return;
		}
		const found = previewTemplates.find(
			(template) => template.meta.id === currentPreviewObject.template
		);
		if (!found) {
			return;
		}
		const { id, name_translation_key } = found.meta;
		return { id, name_translation_key };
	}

	function getInitialCurrentPreview() {
		let familyFromParam = $state($page.url.searchParams.get(PREVIEW_FAMILY_PARAM));
		if (!familyFromParam) {
			return {
				family: meta.preview_family,
				template: meta.preview_template_id
			};
		}
		let familyIsNumber = !isNaN(Number(familyFromParam));
		if (familyIsNumber) {
			return {
				family: 'custom' as const,
				template: Number(familyFromParam)
			};
		} else {
			// TODO: Validation of param
			return {
				family: familyFromParam as PreviewFamilyId,
				template: null
			};
		}
	}

	function getCurrentEditorComponent() {
		currentPreviewObject;
		return untrack(() => {
			if (!currentPreviewObject.family) {
				return null;
			}
			let component = previewFamilies[currentPreviewObject.family].components.editor;
			if (!component) {
				component = getPreviewComponent(currentPreviewObject.family, 'editor');
			}
			return (previewFamilies[currentPreviewObject.family].components.editor = component);
		});
	}

	function getPreviewSpecificLink(currentURL: URL, previewObject: PreviewObject) {
		let url = new URL(currentURL);
		if (previewObject.family) {
			url.searchParams.set(PREVIEW_FAMILY_PARAM, previewObject.family);
		}
		if (previewObject.template) {
			url.searchParams.set(PREVIEW_TEMPLATE_PARAM, previewObject.template.toString());
		}
		return url.pathname + url.search;
	}

	function onPreviewClick(e: Event, previewObject: PreviewObject) {
		e.preventDefault();
		if (!previewObject.family) {
			return;
		}
		currentPreviewObject = previewObject;
	}

	function onPreviewPreviewRequest() {
		// TODO
	}
</script>

{#snippet previewFamilyButton(
	previewObject: PreviewObject,
	translationKey: SystemTranslationKey | undefined,
	superValidated: SuperValidated<any> | undefined
)}
	<Button
		kind={currentPreviewObject.family === previewObject.family ? 'primary' : 'secondary'}
		customClass="preview-family-button {currentPreviewObject.family === previewObject.family
			? 'active'
			: 'inactive'}"
		contentCustomClass="preview-family-button-content {superValidated ? 'editor' : ''}"
		href={getPreviewSpecificLink($page.url, previewObject)}
		onclick={(e: MouseEvent) => onPreviewClick(e, previewObject)}
	>
		{#if translationKey}
			<Translation key={translationKey} />
		{:else if superValidated}
			<Translation {superValidated} />
		{/if}
	</Button>
{/snippet}

{#snippet leading()}
	<IconWrapper size="body-big">
		<Plus />
	</IconWrapper>
{/snippet}

<GridCell colspan={1}>
	<div class="preview-editors-scroller">
		<Popup
			triggerType="button"
			customClass="preview-family-popup"
			buttonProps={{
				kind: 'secondary',
				size: 'body',
				customClass: 'preview-family-button inactive',
				contentCustomClass: 'preview-family-button-content',
				leading: leading
			}}
		>
			{#snippet label()}
				<Translation key="article_editor.previews.add" />
			{/snippet}
			{#snippet content()}
				<PreviewTemplateEditor
					type="creating"
					superValidatedMain={previewTemplateCreationSuperValidated}
				/>
			{/snippet}
		</Popup>

		<ul class="previews-list">
			{#each Object.entries(previewFamilies) as [familyId, { name_translation_key }]}
				{#if familyId !== 'custom'}
					{@render previewFamilyButton(
						{ family: familyId as PreviewFamilyId, template: null },
						name_translation_key,
						undefined
					)}
				{/if}
			{/each}
			{#each previewTemplates as template}
				<div class="preview-family-wrapper">
					{@render previewFamilyButton(
						{ family: 'custom', template: template.meta.id },
						undefined,
						template.superValidatedMain
					)}

					<div class="editor-button-wrapper">
						<Popup
							triggerType="button"
							buttonProps={{
								kind: currentPreviewObject.template === template.meta.id ? 'secondary' : 'primary',
								size: 'small'
							}}
						>
							{#snippet label()}
								:
							{/snippet}
							{#snippet content()}
								<PreviewTemplateEditor
									type="editing"
									superValidatedMain={template.superValidatedMain}
									superValidatedDeletion={template.superValidatedDeletion}
									imageId={template.meta.image_id}
								/>
							{/snippet}
						</Popup>
					</div>
				</div>
			{/each}
		</ul>
	</div>
</GridCell>
<GridCell colspan={2}>
	<div class="preview-editor-wrapper">
		<header class="preview-editor-header">
			<Typography size="heading-2">
				<Translation key="article_editor.previews.editor_title" />
			</Typography>
			<Button size="small" kind="secondary">
				<Translation key="article_editor.previews.to_preview_the_preview" />
			</Button>
		</header>
		{#if currentEditorComponent}
			{#await currentEditorComponent}
				Loading...
			{:then currentEditorComponent}
				<svelte:component
					this={currentEditorComponent}
					mainSuperValidated={previewEditorSuperValidated}
					images={{
						preview_image_1_id: meta.preview_image_1_id,
						preview_image_2_id: meta.preview_image_2_id
					}}
					translationsSuperValidated={{
						translation_1: translationForms[meta.preview_translation_1_key],
						translation_2: translationForms[meta.preview_translation_2_key]
					}}
					templateMeta={currentPreviewTemplateMeta}
					{onPreviewPreviewRequest}
				/>
			{:catch}
				Couldn't load
			{/await}
		{/if}
	</div>
</GridCell>

<style>
	.preview-editors-scroller {
		display: flex;
		flex-direction: column;
		gap: var(--size-article-previewlist-gap);
		width: 100%;
	}
	.preview-editors-scroller :global {
		.preview-family-popup {
			width: 100%;
		}
		.preview-family-button {
			justify-content: flex-start;
			width: 100%;
			border-radius: var(--size-article-previewfam-border-radius);

			--layers-border-radius: var(--size-article-previewfam-border-radius);
		}

		.preview-family-button.inactive {
			background: var(--color-article-previewfam-bg);
		}
		.preview-family-button-content {
			padding-block: var(--size-article-previewfam-padding-block);
			padding-inline: var(--size-article-previewfam-padding-inline);

			width: 100%;
			text-align: start;
		}
		.preview-family-button-content.editor {
			padding-inline-end: calc(var(--size-article-previewfam-padding-inline) + var(--size-l));
		}
	}

	.previews-list {
		display: contents;
		list-style: none;
		padding: 0;
	}

	.preview-family-wrapper {
		position: relative;
	}

	.editor-button-wrapper {
		position: absolute;
		top: var(--size-l);
		right: var(--size-l);
	}

	.preview-editor-wrapper {
		width: 100%;
		background: var(--color-article-preview-editor-bg);
		border-radius: var(--size-article-preview-editor-border-radius);
		padding-inline: var(--size-article-preview-editor-padding-inline);
		padding-block-start: var(--size-article-preview-editor-padding-block-start);
		padding-block-end: var(--size-article-preview-editor-padding-block-end);
	}

	.preview-editor-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: var(--size-l);
	}
</style>
