<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';

	import TranslationInputOld from '../i18n/TranslationInputOld.svelte';
	import LanguagedImagesInput from '../image/LanguagedImagesInput.svelte';
	import type { ImageSelect } from '../image/parsers';
	import type { PreviewTemplateEditingForm } from './parsers';

	export let formObj: SuperValidated<PreviewTemplateEditingForm>;
	export let image: ImageSelect | undefined;

	$: superFormStores = superForm(formObj);
	$: ({ enhance, form, errors } = superFormStores);
</script>

<fieldset>
	<form use:enhance method="POST" action="?/update_preview_template" enctype="multipart/form-data">
		<TranslationInputOld {form} />
		<input name="template_id" type="hidden" bind:value={$form.template_id} />
		<input name="url" bind:value={$form.url} />

		<LanguagedImagesInput name="image" {errors} {image} clientUpload />
		<button>Update template</button>
	</form>
	<form use:enhance method="POST" action="?/delete_preview_template">
		<input name="id" type="hidden" bind:value={$form.template_id} />
		<button>Delete template</button>
	</form>
</fieldset>
