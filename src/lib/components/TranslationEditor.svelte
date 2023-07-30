<script lang="ts">
	import { page } from '$app/stores';
	import TranslationInput from './TranslationInput.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	import type { TranslationUpdateZod } from '$lib/server/domain/types';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let key: string | number;

	$: superFormObj = $page.data.translations[key] as SuperValidated<TranslationUpdateZod>;
	$: superFormStores = superForm(superFormObj);
	$: ({ enhance } = superFormStores);
</script>

<form use:enhance action="?/update_translation" method="POST">
	<TranslationInput {superFormStores} />
	<button type="submit">Save</button>
</form>
