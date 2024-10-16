<script lang="ts">
	import { page } from '$app/stores';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import Button from '$lib/design/components/Button/Button.svelte';
	import FormWrapper from '$lib/design/components/FormWrapper/FormWrapper.svelte';
	import Input from '$lib/design/components/Input/Input.svelte';
	import Label from '$lib/design/components/Label/Label.svelte';
	import Labeled from '$lib/design/components/Label/Labeled.svelte';
	import Spacer from '$lib/design/components/Spacer/Spacer.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';

	import LanguagedInput from '../i18n/Input/LanguagedInput.svelte';
	import { getSystemTranslation } from '../i18n/utils';
	import LanguagedImageInput from '../image/ImageInput/LanguagedImageInput.svelte';
	import type { ImageSelect } from '../image/parsers';
	import { getImageById } from '../image/utils';
	import type {
		PreviewTemplateCreationForm,
		PreviewTemplateDeletionForm,
		PreviewTemplateEditingForm
	} from './parsers';

	type Props = {
		type: 'creating' | 'editing';
		superValidatedMain: SuperValidated<PreviewTemplateCreationForm | PreviewTemplateEditingForm>;
		superValidatedDeletion?: SuperValidated<PreviewTemplateDeletionForm>;
		imageId?: ImageSelect['id'] | null;
	};

	let {
		superValidatedMain,
		superValidatedDeletion: superValidateDeletion,
		imageId,
		type
	}: Props = $props();

	let { enhance, form, errors } = superForm(superValidatedMain);

	let { form: deletionForm = null, enhance: deletionEnhance = null } = superValidateDeletion
		? superForm(superValidateDeletion)
		: {};

	let image = $state(getImageById(imageId, $page.data.imagesState?.value));
</script>

<FormWrapper>
	<form
		method="POST"
		action="?/{type === 'creating' ? 'create' : 'update'}_preview_template"
		enctype="multipart/form-data"
		use:enhance
	>
		{#if 'template_id' in $form}
			<input type="hidden" name="template_id" value={$form.template_id} />
		{/if}
		<div class="global-text-align-center">
			<Typography size="heading-2">
				<Translation
					key="article_editor.previews.template_{type === 'creating'
						? 'new'
						: 'editing'}_form_title"
				/>
			</Typography>
		</div>
		<Labeled as="label">
			<Label><Translation key="article_editor.previews.url" /></Label>
			<Input
				name="url"
				bind:value={$form.url}
				placeholder={getSystemTranslation(
					'article_editor.previews.url_placeholder',
					$page.data.systemTranslations
				)}
			/>
		</Labeled>
		<Labeled as="label">
			<Label><Translation key="article_editor.previews.name" /></Label>
			<LanguagedInput superform={form} />
		</Labeled>
		<Labeled as="label">
			<Label><Translation key="article_editor.previews.image" /></Label>
			<LanguagedImageInput name="image" bind:image />
		</Labeled>
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
		<form use:deletionEnhance method="POST" action="?/delete_preview_template">
			<input name="id" type="hidden" bind:value={$deletionForm.id} />
			<Button kind="destructive"><Translation key="article_editor.previews.delete" /></Button>
		</form>
	{/if}
</FormWrapper>
