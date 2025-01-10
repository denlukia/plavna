<script lang="ts">
	import { Checkbox, Input, Labeled, Typography } from '@plavna/design/components';
	import { superForm } from 'sveltekit-superforms';
	import AutosavedInput from '$lib/common/components/AutosavedInput.svelte';
	import Translation from '$lib/i18n/Translation.svelte';
	import LanguagedImageInput from '$lib/image/ImageInput/LanguagedImageInput.svelte';

	import { PREVIEW_EDITOR_FORM_ATTRS } from '..';
	import type { CustomPreviewEditorProps } from '../types';

	let {
		mainSuperValidated,
		preview_image_1 = $bindable(),
		preview_image_2 = $bindable(),
		translation_1,
		translation_2,
		templateMeta
	}: CustomPreviewEditorProps = $props();

	let { form, enhance, errors } = superForm(mainSuperValidated);
</script>

<AutosavedInput superValidated={translation_1} action="?/update_translation_allow_empty" />
<AutosavedInput superValidated={translation_2} action="?/update_translation_allow_empty" />
<form use:enhance {...PREVIEW_EDITOR_FORM_ATTRS}>
	<input name="preview_template_id" type="hidden" bind:value={templateMeta.id} />
	<Input name="preview_prop_1" type="text" bind:value={$form.preview_prop_1} />
	<Input name="preview_prop_2" type="text" bind:value={$form.preview_prop_2} />
	<LanguagedImageInput name="preview_image_1" bind:image={preview_image_1} clientUpload />
	<LanguagedImageInput name="preview_image_2" bind:image={preview_image_2} clientUpload />
	<Labeled as="label" kind="for-checkbox">
		<Checkbox
			name="preview_create_localized_screenshots"
			type="checkbox"
			bind:checked={$form.preview_create_localized_screenshots}
		/>
		<Typography size="body">
			<Translation key="article_editor.previews.create_localized_screenshots" />
		</Typography>
	</Labeled>
</form>
