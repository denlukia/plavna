<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Checkbox from '$lib/design/components/Checkbox/Checkbox.svelte';
	import Input from '$lib/design/components/Input/Input.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import AutosavedInput from '$lib/features/common/components/AutosavedInput.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import LanguagedImageInput from '$lib/features/image/LanguagedImageInput.svelte';

	import { commonPreviewEditorFormAttributes } from '..';
	import type { CustomPreviewEditorProps } from '../types';

	let {
		mainSuperValidated,
		images,
		translationsSuperValidated,
		templateMeta,
		onPreviewPreviewRequest
	}: CustomPreviewEditorProps = $props();

	let { form, enhance, errors } = superForm(mainSuperValidated);
</script>

<AutosavedInput
	superValidated={translationsSuperValidated.translation_1}
	action="?/update_translation"
/>
<AutosavedInput
	superValidated={translationsSuperValidated.translation_2}
	action="?/update_translation"
/>
<form use:enhance {...commonPreviewEditorFormAttributes}>
	<input name="preview_template_id" type="hidden" bind:value={templateMeta.id} />
	<Input name="preview_prop_1" type="text" bind:value={$form.preview_prop_1} />
	<Input name="preview_prop_2" type="text" bind:value={$form.preview_prop_2} />
	<LanguagedImageInput
		name="preview_image_1"
		image={images.preview_image_1}
		{errors}
		withLanguages
		clientUpload
	/>
	<LanguagedImageInput
		name="preview_image_2"
		image={images.preview_image_2}
		{errors}
		withLanguages
		clientUpload
	/>
	<div class="global-labeled-input-wrapper checkbox">
		<Checkbox
			name="preview_create_localized_screenshots"
			type="checkbox"
			bind:checked={$form.preview_create_localized_screenshots}
		/>
		<Typography size="body">
			<Translation key="article_editor.previews.create_localized_screenshots" />
		</Typography>
	</div>

	<Button type="button" onclick={onPreviewPreviewRequest}>
		<Translation key="article_editor.previews.preview" />
	</Button>
	<Button><Translation key="article_editor.previews.update" /></Button>
</form>
