<script lang="ts">
	import TranslationEditor from './TranslationEditor.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	import type { TagDeleteZod, TagUpdateZod, TranslationUpdate } from '$lib/server/domain/types';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let tag: {
		isCheckedForm: SuperValidated<TagUpdateZod>;
		name_translation_id: TranslationUpdate['_id'];
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
	<TranslationEditor key={tag.name_translation_id} />
	<form use:enhance method="POST" action="?/delete_tag">
		<input name="id" type="hidden" bind:value={$form.id} />
		<button>Delete</button>
	</form>
</fieldset>
