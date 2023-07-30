<script lang="ts">
	import TranslationInput from './TranslationInput.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	import type { TranslationInsertZod } from '$lib/server/domain/types';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let superFormObj: SuperValidated<TranslationInsertZod>;

	$: superFormStores = superForm(superFormObj);
	$: ({ enhance, errors } = superFormStores);
</script>

<form use:enhance action="?/create_section" method="POST">
	<TranslationInput {superFormStores} />
	<button type="submit">Create Section</button>
</form>
