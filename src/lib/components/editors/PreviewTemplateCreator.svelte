<script lang="ts">
	import type { PreviewTemplateCreationFormZod } from '$lib/server/collections/types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import TranslationInput from '../inputs/TranslationInput.svelte';
	import ImageInput from '../inputs/ImageInput.svelte';

	export let formObj: SuperValidated<PreviewTemplateCreationFormZod>;

	$: superFormStores = superForm(formObj);
	$: ({ enhance, form, errors } = superFormStores);
</script>

<fieldset>
	<form use:enhance method="POST" action="?/create_preview_template" enctype="multipart/form-data">
		<TranslationInput {superFormStores} />
		<input name="url" bind:value={$form.url} placeholder="URL" />
		<ImageInput name="image" errors={$errors.image} />
		<button>Create template</button>
	</form>
</fieldset>
