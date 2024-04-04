<script lang="ts">
	import { superForm, type SuperForm, type SuperValidated } from 'sveltekit-superforms';
	import Button from '$lib/design-system/components/Button.svelte';
	import Input from '$lib/design-system/components/Input/Input.svelte';
	import type { PageCreateForm, PageUpdateForm } from '$lib/server/collections/types';

	type Props = {
		formObj: SuperValidated<PageCreateForm> | SuperValidated<PageUpdateForm>;
	};

	let { formObj }: Props = $props();

	const { form, errors, enhance } = superForm(formObj);
</script>

<form class="page-editor" use:enhance method="POST">
	{#if $form.id}
		<input type="hidden" name="id" bind:value={$form.id} />
	{/if}

	<Input type="text" name="slug" bind:value={$form.slug} />

	{#if $form.id}
		<Button formaction="?/update">Update</Button>
	{:else}
		<Button formaction="?/create">Create</Button>
	{/if}

	{JSON.stringify($errors)}
</form>

<style>
	.page-editor {
		display: flex;
	}
</style>
