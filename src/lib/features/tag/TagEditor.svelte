<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';

	import type { TranslationUpdate } from '../i18n/parsers';
	import TranslationEditor from '../i18n/TranslationEditor.svelte';
	import type { TagUpdate } from './parsers';

	export let checkedForm: SuperValidated<TagUpdate>;
	export let translationForm: SuperValidated<TranslationUpdate>;

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
