<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';

	import TranslationInput from '../../features/i18n/TranslationInput.svelte';
	import type { TranslationInsert } from '../i18n/parsers';

	export let superFormObj: SuperValidated<TranslationInsert>;

	$: superFormStores = superForm(superFormObj);
	$: ({ enhance } = superFormStores);
</script>

<fieldset>
	Створення тегу
	<form use:enhance action="?/create_tag" method="POST">
		<TranslationInput {superFormStores} />
		<button type="submit">Save</button>
	</form>
</fieldset>
