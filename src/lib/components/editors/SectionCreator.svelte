<script lang="ts">
	import TranslationInput from '../inputs/TranslationInput.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	import type { TranslationInsertZod } from '$lib/server/collections/types';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let formObj: SuperValidated<TranslationInsertZod>;

	$: superFormStores = superForm(formObj);
	$: ({ enhance } = superFormStores);
</script>

<form use:enhance action="?/create_section" method="POST">
	<TranslationInput {superFormStores} />
	<button type="submit">Create Section</button>
</form>
