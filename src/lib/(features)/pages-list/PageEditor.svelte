<script lang="ts">
	import { page } from '$app/stores';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import Error from '$lib/(features)/common/components/Error.svelte';
	import Translation from '$lib/components/Translation.svelte';
	import Button from '$lib/design-system/components/Button.svelte';
	import Input from '$lib/design-system/components/Input/Input.svelte';
	import Labeled from '$lib/design-system/components/Labeled.svelte';
	import Typography from '$lib/design-system/components/Typography.svelte';

	import type { PageCreateForm, PageUpdateForm } from './parsers';

	type Props = {
		formObj: SuperValidated<PageCreateForm> | SuperValidated<PageUpdateForm>;
		onSuccessfullUpdate?: () => void;
	};

	let { formObj, onSuccessfullUpdate }: Props = $props();

	const { form, errors, enhance } = superForm(formObj, {
		resetForm: false,
		onUpdate: (e) => {
			if (e.result.type === 'success') {
				onSuccessfullUpdate?.();
			}
		}
	});
</script>

<form class="page-editor" use:enhance method="POST">
	{#if $form.id}
		<input type="hidden" name="id" bind:value={$form.id} />
	{/if}

	<Labeled>
		<Typography size="small-short"><Translation key="user_pages.slug" /></Typography>
		<Input name="slug" bind:value={$form.slug} aria-invalid={Boolean($errors.slug?.length)} />
		<Error errors={$errors.slug} />
	</Labeled>

	{#if $form.id}
		<Button formaction="?/update">
			<Translation key="user_pages.update" />
		</Button>
	{:else}
		<Button formaction="?/create">
			<Translation key="user_pages.create" />
		</Button>
	{/if}
</form>

<style>
	.page-editor {
		display: flex;
		flex-direction: column;
		gap: var(--size-m);
	}
</style>
