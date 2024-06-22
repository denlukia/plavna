<script lang="ts">
	import { page } from '$app/stores';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Input from '$lib/design/components/Input/Input.svelte';
	import Label from '$lib/design/components/Label/Label.svelte';
	import Popup from '$lib/design/components/Popup/Popup.svelte';
	import Spacer from '$lib/design/components/Spacer/Spacer.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';

	import TranslationsInput from '../i18n/Input/TranslationsInput.svelte';
	import { getSystemTranslation } from '../i18n/utils';
	import LanguagedImagesInput from '../image/LanguagedImagesInput.svelte';
	import type { ImageSelect } from '../image/parsers';
	import type { PreviewTemplateCreationForm, PreviewTemplateDeletionForm } from './parsers';

	type Props = {
		type: 'editing' | 'creating';
		superValidatedMain: SuperValidated<PreviewTemplateCreationForm>;
		superValidatedDeletion?: SuperValidated<PreviewTemplateDeletionForm>;
		image?: ImageSelect | undefined;
	};

	let {
		type,
		superValidatedMain,
		superValidatedDeletion: superValidateDeletion,
		image
	}: Props = $props();

	let { enhance, form, errors } = superForm(superValidatedMain);

	let { form: deletionForm = null, enhance: deletionEnhance = null } = superValidateDeletion
		? superForm(superValidateDeletion)
		: {};

	let active = $state(false);
</script>

<Popup triggerType="button" bind:active buttonProps={{ kind: 'secondary' }}>
	{#snippet label()}
		{#if type === 'creating'}
			<Translation key="article_editor.previews.add" />
		{:else}
			:
		{/if}
	{/snippet}
	{#snippet content()}
		<div class="global-form">
			<form
				class="global-display-contents"
				method="POST"
				action="?/{type === 'creating' ? 'create' : 'update'}_preview_template"
				enctype="multipart/form-data"
				use:enhance
			>
				<div class="global-text-align-center">
					<Typography size="heading-2">
						<Translation
							key="article_editor.previews.{type === 'creating' ? 'new' : 'editing'}_form_title"
						/>
					</Typography>
				</div>
				<div class="global-labeled-input-wrapper">
					<Label><Translation key="article_editor.previews.url" /></Label>
					<Input
						name="url"
						bind:value={$form.url}
						placeholder={getSystemTranslation(
							'article_editor.previews.url_placeholder',
							$page.data.systemTranslations
						)}
					/>
				</div>
				<div class="global-labeled-input-wrapper">
					<Label><Translation key="article_editor.previews.name" /></Label>
					<TranslationsInput superform={form} />
				</div>
				<div class="global-labeled-input-wrapper">
					<Label><Translation key="article_editor.previews.image" /></Label>
					<LanguagedImagesInput name="image" {errors} {image} />
				</div>
				<Spacer />
				<Button>
					<Translation key="article_editor.previews.{type === 'creating' ? 'create' : 'update'}" />
				</Button>
			</form>
			{#if $deletionForm && deletionEnhance}
				<div class="global-text-align-center">
					<Typography size="small">
						<Translation key="layout.or" />
					</Typography>
				</div>
				<form
					class="global-display-contents"
					use:deletionEnhance
					method="POST"
					action="?/delete_preview_template"
				>
					<input name="id" type="hidden" bind:value={$deletionForm.id} />
					<Button kind="destructive"><Translation key="article_editor.previews.delete" /></Button>
				</form>
			{/if}
		</div>
	{/snippet}
</Popup>
