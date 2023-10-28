<script lang="ts">
	import TranslationInput from '../inputs/TranslationInput.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	import type { TranslationUpdateZod } from '$lib/server/collections/types';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let formObj: SuperValidated<TranslationUpdateZod>;

	$: superFormStores = superForm(formObj);
	$: ({ enhance } = superFormStores);
</script>

<form use:enhance action="?/update_translation" class="translation-input" method="POST">
	<TranslationInput {superFormStores} />
	<button type="submit">Save</button>
</form>

<style>
	.translation-input {
		display: flex;
	}
</style>
