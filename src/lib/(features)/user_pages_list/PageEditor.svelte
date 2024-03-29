<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import Button from '$lib/design-system/components/Button.svelte';
	import Input from '$lib/design-system/components/Input/Input.svelte';
	import type { PageCreateForm, PageUpdateForm } from '$lib/server/collections/types';

	export let formObj: SuperValidated<PageCreateForm> | SuperValidated<PageUpdateForm>;

	const { form, errors, enhance } = superForm(formObj);
</script>

<form class="page-editor" use:enhance method="POST">
	{#if $form.id}
		<input type="hidden" name="id" bind:value={$form.id} />
	{/if}

	<Input type="text" name="slug" bind:value={$form.slug} />

	{#if $form.id}
		<Button formaction="?/update">Update</Button>
		<Button formaction="?/delete">Delete</Button>
	{:else}
		<Button formaction="?/create">Create</Button>
	{/if}
</form>

<style>
	.page-editor {
		display: flex;
	}
</style>
