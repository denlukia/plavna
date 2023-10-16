<script lang="ts">
	import type { ImageSelect, PreviewTemplateEditingFormZod } from '$lib/server/collections/types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import TranslationInput from '../inputs/TranslationInput.svelte';
	import Image from '../Image.svelte';
	import PreviewTemplateImageInput from '../inputs/image/PreviewTemplateImageInput.svelte';

	export let formObj: SuperValidated<PreviewTemplateEditingFormZod>;
	export let image: ImageSelect | undefined;

	$: superFormStores = superForm(formObj);
	$: ({ enhance, form, errors } = superFormStores);
</script>

<fieldset>
	{#if image}
		<Image {image} />
	{/if}
	<form use:enhance method="POST" action="?/update_preview_template" enctype="multipart/form-data">
		<TranslationInput {superFormStores} />
		<input name="template_id" type="hidden" bind:value={$form.template_id} />
		<input name="url" bind:value={$form.url} />

		<PreviewTemplateImageInput name="image" {errors} />
		<button>Update template</button>
	</form>
	<form use:enhance method="POST" action="?/delete_preview_template">
		<input name="id" type="hidden" bind:value={$form.template_id} />
		<button>Delete template</button>
	</form>
</fieldset>
