<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import Button from '$lib/design-system/components/Button.svelte';

	import TranslationInput from '../i18n/TranslationInput.svelte';
	import type { SectionPropWithAuthorship } from './types';

	type Props = {
		forms: SectionPropWithAuthorship['forms'];
		oncancel: () => void;
	};

	let { forms, oncancel }: Props = $props();

	let { updating: updatingFormData, deletion: deletionFormData } = forms;

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
<Button onclick={oncancel}>Cancel</Button>
