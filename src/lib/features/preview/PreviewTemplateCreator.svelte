<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';

	import TranslationInput from '../i18n/TranslationInput.svelte';
	import LanguagedImagesInput from '../image/LanguagedImagesInput.svelte';
	import type { PreviewTemplateCreationForm } from './parsers';

	export let formObj: SuperValidated<PreviewTemplateCreationForm>;

	$: superFormStores = superForm(formObj);
	$: ({ enhance, form, errors } = superFormStores);
</script>

<fieldset>
	<form use:enhance method="POST" action="?/create_preview_template" enctype="multipart/form-data">
		<TranslationInput {superFormStores} />
		<input name="url" bind:value={$form.url} placeholder="URL" />
		<LanguagedImagesInput name="image" {errors} />
		<button>Create template</button>
	</form>
</fieldset>
