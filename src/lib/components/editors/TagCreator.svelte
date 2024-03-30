<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { TranslationInsertZod } from '$lib/server/collections/types';

	import TranslationInput from '../inputs/TranslationInput.svelte';

	export let superFormObj: SuperValidated<TranslationInsertZod>;

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
