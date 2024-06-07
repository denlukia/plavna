<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';

	import type { TranslationUpdate } from './parsers';
	import TranslationInputOld from './TranslationInputOld.svelte';

	export let formObj: SuperValidated<TranslationUpdate>;

	$: superFormStores = superForm(formObj);
	$: ({ form, enhance } = superFormStores);
</script>

<form use:enhance action="?/update_translation" class="translation-input" method="POST">
	<TranslationInputOld {form} />
	<button type="submit">Save</button>
</form>

<style>
	.translation-input {
		display: flex;
	}
</style>
