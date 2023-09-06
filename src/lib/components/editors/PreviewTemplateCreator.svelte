<script lang="ts">
	import type { PreviewTemplateCreationFormZod } from '$lib/server/collections/types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import TranslationInput from '../TranslationInput.svelte';

	export let formObj: SuperValidated<PreviewTemplateCreationFormZod>;

	$: superFormStores = superForm(formObj);
	$: ({ enhance, form, errors } = superFormStores);
</script>

<form use:enhance method="POST" action="?/create_preview_template">
	<TranslationInput {superFormStores} />
	<input name="url" bind:value={$form.url} placeholder="URL" />
	<button>Create template</button>
</form>
