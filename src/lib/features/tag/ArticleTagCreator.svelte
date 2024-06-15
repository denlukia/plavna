<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';

	import type { TranslationInsert } from '../i18n/parsers';
	import TranslationInputOld from '../i18n/TranslationInputOld.svelte';

	export let superFormObj: SuperValidated<TranslationInsert>;

	$: superFormStores = superForm(superFormObj);
	$: ({ form, enhance } = superFormStores);
</script>

<fieldset>
	Створення тегу
	<form use:enhance action="?/create_tag" method="POST">
		<TranslationInputOld {form} />
		<button type="submit">Save</button>
	</form>
</fieldset>
