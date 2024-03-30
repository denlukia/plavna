<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { TranslationInsertZod } from '$lib/server/collections/types';

	import TranslationInput from '../inputs/TranslationInput.svelte';

	export let formObj: SuperValidated<TranslationInsertZod>;

	$: superFormStores = superForm(formObj);
	$: ({ enhance } = superFormStores);
</script>

<form use:enhance action="?/create_section" method="POST">
	<TranslationInput {superFormStores} />
	<button type="submit">Create Section</button>
</form>
