<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';

	import type { TranslationInsert } from '../i18n/parsers';
	import TranslationInput from '../i18n/TranslationInput.svelte';

	export let formObj: SuperValidated<TranslationInsert>;

	$: superFormStores = superForm(formObj);
	$: ({ enhance } = superFormStores);
</script>

<form use:enhance action="?/create_section" method="POST">
	<TranslationInput {superFormStores} />
	<button type="submit">Create Section</button>
</form>
