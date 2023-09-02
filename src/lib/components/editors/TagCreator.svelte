<script lang="ts">
	import TranslationInput from '../TranslationInput.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	import type { TranslationInsertZod } from '$lib/server/collections/types';
	import type { SuperValidated } from 'sveltekit-superforms';

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
