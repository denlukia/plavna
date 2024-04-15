<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	import TranslationInput from '../i18n/TranslationInput.svelte';
	import type { SectionPropNonEmptyForms } from './types';

	type Props = {
		section: SectionPropNonEmptyForms;
	};

	let { section }: Props = $props();

	let {
		forms: { updating: updatingFormData, deletion: deletionFormData }
	} = section;

	let { form: updatingForm, enhance: updatingEnhance } = superForm(updatingFormData);
	let { form: deletionForm, enhance: deletionEnhance } = superForm(deletionFormData);
</script>

<form use:updatingEnhance action="?/update_section" method="POST">
	<input name="section_id" type="hidden" bind:value={$updatingForm.section_id} />
	<TranslationInput form={updatingForm} />
	<button type="submit">Update Section</button>
</form>
<form use:deletionEnhance action="?/delete_section" method="POST">
	<input name="section_id" type="hidden" bind:value={$deletionForm.section_id} />
	<button type="submit">Delete Section</button>
</form>
