<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import type { PreviewTemplateCreationFormZod } from '$lib/server/collections/types';

	import LanguagedImagesInput from '../inputs/image/LanguagedImagesInput.svelte';
	import TranslationInput from '../inputs/TranslationInput.svelte';

	export let formObj: SuperValidated<PreviewTemplateCreationFormZod>;

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
