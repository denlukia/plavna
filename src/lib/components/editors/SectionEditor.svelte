<script lang="ts">
	import { page } from '$app/stores';
	import TranslationInput from '../TranslationInput.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	import type { SectionSelect, TranslationUpdateZod } from '$lib/server/domain/types';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let section: SectionSelect;

	$: superFormObj = $page.data.translations[
		section.title_translation_id
	] as SuperValidated<TranslationUpdateZod>;
	$: superFormStores = superForm(superFormObj);
	$: ({ form, enhance } = superFormStores);
</script>

<form use:enhance action="?/update_section" method="POST">
	<input name="section_id" type="hidden" bind:value={section.id} />
	<TranslationInput {superFormStores} />
	<button type="submit">Update Section</button>
</form>
