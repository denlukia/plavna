<script lang="ts">
	import TranslationInput from '../inputs/TranslationInput.svelte';
	import TranslationEditor from './TranslationEditor.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	import type {
		TagDeleteZod,
		TagUpdateZod,
		TranslationUpdate,
		TranslationUpdateZod
	} from '$lib/server/collections/types';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let checkedForm: SuperValidated<TagUpdateZod>;
	export let translationForm: SuperValidated<TranslationUpdateZod>;

	$: superFormStores = superForm(checkedForm);
	$: ({ enhance, errors, form } = superFormStores);
</script>

Редагування Тега

<form use:enhance method="POST" action="?/switch_tag">
	<input name="id" type="hidden" bind:value={$form.id} />
	<input style="display: none" name="checked" type="checkbox" bind:checked={$form.checked} />
	<button>{$form.checked ? 'Uncheck' : 'Check'}</button>
</form>
<TranslationEditor formObj={translationForm} />
<form use:enhance method="POST" action="?/delete_tag">
	<input name="id" type="hidden" bind:value={$form.id} />
	<button>Delete</button>
</form>
