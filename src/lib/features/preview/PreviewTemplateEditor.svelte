<script lang="ts">
	import type { superValidate, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import Popup from '$lib/design/components/Popup/Popup.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';

	import TranslationsInput from '../i18n/Input/TranslationsInput.svelte';
	import TranslationInputOld from '../i18n/TranslationInputOld.svelte';
	import LanguagedImagesInput from '../image/LanguagedImagesInput.svelte';
	import type { PreviewTemplateCreationForm, PreviewTemplateDeletionForm } from './parsers';

	type Props = {
		type: 'editing' | 'creating';
		superValidatedMain: SuperValidated<PreviewTemplateCreationForm>;
		superValidateDeletion?: SuperValidated<PreviewTemplateDeletionForm>;
	};

	let { type, superValidatedMain, superValidateDeletion }: Props = $props();

	let { enhance, form, errors } = superForm(superValidatedMain);

	let { form: deletionForm = null, enhance: deletionEnhance = null } = superValidateDeletion
		? superForm(superValidateDeletion)
		: {};

	let active = $state(false);
</script>

<Popup triggerType="button" bind:active>
	{#snippet label()}
		{#if type === 'creating'}
			<Translation key="article_editor.previews.create_new" />
		{:else}
			:
		{/if}
	{/snippet}
	{#snippet content()}
		<form
			use:enhance
			method="POST"
			action="?/create_preview_template"
			enctype="multipart/form-data"
		>
			<input name="url" bind:value={$form.url} placeholder="URL" />
			<TranslationsInput superform={form} />
			<LanguagedImagesInput name="image" {errors} />
			<button>Create template</button>
		</form>
		{#if deletionForm && $deletionForm && deletionEnhance}
			<form use:deletionEnhance method="POST" action="?/delete_preview_template">
				<input name="id" type="hidden" bind:value={$deletionForm.id} />
				<button>Delete template</button>
			</form>
		{/if}
	{/snippet}
</Popup>
