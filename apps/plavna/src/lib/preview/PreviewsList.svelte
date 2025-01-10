<script lang="ts">
	import { Button, IconWrapper, Popup, Typography } from '@plavna/design/components';
	import { Plus } from '@plavna/design/icons';
	import { page } from '$app/stores';
	import { untrack } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { PREVIEW_FAMILY_PARAM, PREVIEW_TEMPLATE_PARAM } from '$lib/common/config';
	import Translation from '$lib/i18n/Translation.svelte';
	import { getPreviewComponent } from '$lib/preview/enricher';
	import type { PreviewFamilyId } from '$lib/preview/families/types';

	import type { PageData } from '../../routes/[[lang=lang]]/[username]/page:[pageslug]/[articleslug]/edit/$types';
	import SideBox from '../common/components/SideBox.svelte';
	import type { SystemTranslationKey } from '../i18n/types';
	import { getImageById } from '../image/utils';
	import { PREVIEW_EDITOR_FORM_ATTRS } from './families';
	import PreviewTemplateForm from './PreviewTemplateForm.svelte';

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

	let currentPreviewObject = $state(getInitialCurrentPreview());
	let currentPreviewTemplateMeta = $derived.by(getCurrentPreviewTemplate);
	let EditorComponent = $derived.by(getCurrentEditorComponent);

	let preview_image_1 = $state(getImageById(meta.preview_image_1_id, images));
	let preview_image_2 = $state(getImageById(meta.preview_image_2_id, images));

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
			let previewFamilyObj = previewFamilies[currentPreviewObject.family];
			if (!previewFamilyObj) {
				return null;
			}
			let component = previewFamilyObj.components.editor;
			if (!component) {
				component = getPreviewComponent(currentPreviewObject.family, 'editor');
			}
			return (previewFamilyObj.components.editor = component);
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

<SideBox>
	{#snippet headerLeading()}
		<Typography size="heading-2">
			<Translation key="article_editor.previews.section_label" />
		</Typography>
	{/snippet}
	{#snippet content()}
		<div class="scroller">
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
					<Translation key="article_editor.previews.new" />
				{/snippet}
				{#snippet content()}
					<PreviewTemplateForm
						type="creating"
						superValidatedMain={previewTemplateCreationSuperValidated}
					/>
				{/snippet}
			</Popup>

			<ul class="list">
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
									kind:
										currentPreviewObject.template === template.meta.id ? 'secondary' : 'primary',
									size: 'small'
								}}
							>
								{#snippet label()}
									:
								{/snippet}
								{#snippet content()}
									<PreviewTemplateForm
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
		{#if EditorComponent}
			{#await EditorComponent}
				Loading...
			{:then EditorComponent}
				<EditorComponent
					mainSuperValidated={previewEditorSuperValidated}
					bind:preview_image_1
					bind:preview_image_2
					translation_1={translationForms[meta.preview_translation_1_key]}
					translation_2={translationForms[meta.preview_translation_2_key]}
					templateMeta={currentPreviewTemplateMeta}
					{onPreviewPreviewRequest}
				/>
				<div class="actions-row">
					<!-- TODO -->
					<!-- <Button kind="secondary">
						<Translation key="article_editor.previews.to_preview_the_preview" />
					</Button> -->
					<Button form={PREVIEW_EDITOR_FORM_ATTRS.id}>
						<Translation key="article_editor.previews.set_and_update" />
					</Button>
				</div>
			{:catch}
				Couldn't load
			{/await}
		{/if}
	{/snippet}
</SideBox>

<style>
	.scroller {
		display: flex;
		gap: var(--size-article-previewlist-gap);
		width: 100%;
		padding-bottom: var(--size-l);
	}
	.scroller :global {
		* {
			flex-shrink: 1;
		}

		.preview-family-button {
			justify-content: flex-start;
			border-radius: var(--size-article-previewfam-border-radius);

			--layers-border-radius: var(--size-article-previewfam-border-radius);
		}

		.preview-family-button.inactive {
			background: var(--color-article-previewfam-bg);
		}
		.preview-family-button-content {
			padding-block: var(--size-article-previewfam-padding-block);
			padding-inline: var(--size-article-previewfam-padding-inline);

			text-align: start;
		}
		.preview-family-button-content.editor {
			padding-inline-end: calc(var(--size-article-previewfam-padding-inline) + var(--size-l));
		}
	}

	.list {
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

	.actions-row {
		margin-top: var(--size-l);
		gap: var(--size-m);
		display: flex;
		justify-content: flex-end;
	}
</style>
