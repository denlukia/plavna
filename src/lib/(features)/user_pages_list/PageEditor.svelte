<script lang="ts">
	import { page } from '$app/stores';
	import { superForm, type SuperForm, type SuperValidated } from 'sveltekit-superforms';
	import Translation from '$lib/components/Translation.svelte';
	import Button from '$lib/design-system/components/Button.svelte';
	import Input from '$lib/design-system/components/Input/Input.svelte';
	import Typography from '$lib/design-system/components/Typography.svelte';
	import type { PageCreateForm, PageUpdateForm } from '$lib/server/collections/types';

	import { getSystemTranslation } from '../common/translations/_index';
	import { type SystemTranslationKey } from '../common/translations/_types';

	type Props = {
		formObj: SuperValidated<PageCreateForm> | SuperValidated<PageUpdateForm>;
	};

	let { formObj }: Props = $props();

	const { form, errors, enhance } = superForm(formObj);

	$inspect($errors);

	const placeholder = getSystemTranslation('user_pages.main_page', $page.data.systemTranslations);
</script>

<form class="page-editor" use:enhance method="POST">
	{#if $form.id}
		<input type="hidden" name="id" bind:value={$form.id} />
	{/if}

	<Input type="text" name="slug" {placeholder} bind:value={$form.slug} />

	{#if $form.id}
		<Button formaction="?/update">Update</Button>
	{:else}
		<Button formaction="?/create">Create</Button>
	{/if}

	<div>
		{#if $errors.slug}
			{#each $errors.slug as error}
				<Typography><Translation key={error as SystemTranslationKey} /></Typography>
			{/each}
		{/if}
	</div>
</form>

<style>
	.page-editor {
		/* display: flex; */
	}
</style>
