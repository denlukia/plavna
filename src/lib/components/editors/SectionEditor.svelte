<script lang="ts">
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { SectionSelect, TranslationUpdateZod } from '$lib/server/collections/types';

	import TranslationInput from '../inputs/TranslationInput.svelte';

	export let section: SectionSelect;
	export let formObj: SuperValidated<TranslationUpdateZod>;

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
