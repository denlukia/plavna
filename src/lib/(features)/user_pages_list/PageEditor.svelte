<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import type { PageCreateFormZod, PageUpdateFormZod } from '$lib/server/collections/types';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let formObj: SuperValidated<PageCreateFormZod> | SuperValidated<PageUpdateFormZod>;

	const { form, errors, enhance } = superForm(formObj);
</script>

<form use:enhance method="POST">
	{#if $form.id}
		<input type="hidden" name="id" bind:value={$form.id} />
	{/if}
	<input type="text" name="slug" bind:value={$form.slug} />

	{#if $form.id}
		<button formaction="?/update">Update</button>
		<button formaction="?/delete">Delete</button>
	{:else}
		<button formaction="?/create">Create</button>
	{/if}
</form>
