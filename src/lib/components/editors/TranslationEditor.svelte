<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { TranslationUpdateZod } from '$lib/server/collections/types';

	import TranslationInput from '../inputs/TranslationInput.svelte';

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
