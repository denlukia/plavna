<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Checkbox from '$lib/design/components/Checkbox/Checkbox.svelte';
	import Input from '$lib/design/components/Input/Input.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import AutosavedInput from '$lib/features/common/components/AutosavedInput.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import LanguagedImagesInput from '$lib/features/image/LanguagedImagesInput.svelte';

	import { commonPreviewEditorFormAttributes } from '..';
	import type { PreviewEditorProps } from '../types';

	let { mainSuperValidated, images, translationsSuperValidated }: PreviewEditorProps = $props();

	let { form, enhance, errors } = superForm(mainSuperValidated);
</script>

<Typography size="heading-2">
	<Translation key="article_editor.previews.families.plavna_modern.name" />
</Typography>
<AutosavedInput
	superValidated={translationsSuperValidated.translation_1}
	action="?/update_translation"
/>
<AutosavedInput
	superValidated={translationsSuperValidated.translation_2}
	action="?/update_translation"
/>
<form use:enhance {...commonPreviewEditorFormAttributes}>
	<Input name="preview_prop_1" type="text" bind:value={$form.preview_prop_1} />
	<Input name="preview_prop_2" type="text" bind:value={$form.preview_prop_2} />
	<LanguagedImagesInput
		name="preview_image_1"
		image={images.preview_image_1}
		{errors}
		withLanguages
		clientUpload
	/>
	<LanguagedImagesInput
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

	<Button><Translation key="article_editor.previews.update" /></Button>
</form>
