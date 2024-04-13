<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';

	import TranslationInput from '../../features/i18n/TranslationInput.svelte';
	import type { TranslationUpdate } from './parsers';

	export let formObj: SuperValidated<TranslationUpdate>;

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
