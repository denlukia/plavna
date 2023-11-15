<script lang="ts">
	import type { ImageSelect, PreviewTemplateEditingFormZod } from '$lib/server/collections/types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import TranslationInput from '../inputs/TranslationInput.svelte';
	import LanguagedImagesInput from '../inputs/image/LanguagedImagesInput.svelte';

	export let formObj: SuperValidated<PreviewTemplateEditingFormZod>;
	export let image: ImageSelect | undefined;

	$: superFormStores = superForm(formObj);
	$: ({ enhance, form, errors } = superFormStores);
</script>

<fieldset>
	<form use:enhance method="POST" action="?/update_preview_template" enctype="multipart/form-data">
		<TranslationInput {superFormStores} />
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
