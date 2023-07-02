<script lang="ts">
	import TEditor from './TranslationEditor.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	import type { TagDeleteZod, TagUpdateZod, TranslationUpdateZod } from '$lib/server/schemas/types';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let tag: {
		isCheckedForm: SuperValidated<TagUpdateZod>;
		nameForm: SuperValidated<TranslationUpdateZod>;
		deletionForm: SuperValidated<TagDeleteZod>;
	};

	$: ({ form, errors, enhance } = superForm(tag.isCheckedForm));
</script>

<fieldset>
	Редагування тега
	<form use:enhance method="POST" action="?/switch_tag">
		<input name="id" type="hidden" bind:value={$form.id} />
		<input style="display: none" name="checked" type="checkbox" bind:checked={$form.checked} />
		<button>{$form.checked ? 'Uncheck' : 'Check'}</button>
	</form>
	<TEditor superFormObj={tag.nameForm} />
	<form use:enhance method="POST" action="?/delete_tag">
		<input name="id" type="hidden" bind:value={$form.id} />
		<button>Delete</button>
	</form>
</fieldset>
