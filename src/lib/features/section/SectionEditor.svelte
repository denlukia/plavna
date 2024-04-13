<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';

	import type { TranslationUpdate } from '../i18n/parsers';
	import TranslationInput from '../i18n/TranslationInput.svelte';
	import type { SectionSelect } from './parsers';

	export let section: SectionSelect;
	export let formObj: SuperValidated<TranslationUpdate>;

	$: superFormStores = superForm(formObj);
	$: ({ form, enhance } = superFormStores);
</script>

<form use:enhance action="?/update_section" method="POST">
	<input name="section_id" type="hidden" bind:value={section.id} />
	<TranslationInput {superFormStores} />
	<button type="submit">Update Section</button>
</form>
<form use:enhance action="?/delete_section" method="POST">
	<input name="id" type="hidden" bind:value={section.id} />
	<button type="submit">Delete Section</button>
</form>
