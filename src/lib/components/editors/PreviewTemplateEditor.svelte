<script lang="ts">
	import type { PreviewTemplateEditingFormZod } from '$lib/server/collections/types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import TranslationInput from '../TranslationInput.svelte';

	export let formObj: SuperValidated<PreviewTemplateEditingFormZod>;

	$: superFormStores = superForm(formObj);
	$: ({ enhance, form, errors } = superFormStores);
</script>

<form use:enhance method="POST" action="?/update_preview_template">
	<TranslationInput {superFormStores} />
	<input name="template_id" type="hidden" bind:value={$form.template_id} />
	<input name="url" bind:value={$form.url} />
	<button>Update template</button>
</form>
<form use:enhance method="POST" action="?/delete_preview_template">
	<input name="id" type="hidden" bind:value={$form.template_id} />
	<button>Delete template</button>
</form>
