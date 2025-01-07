<script lang="ts">
	import Button from '@plavna/design/components/Button/Button.svelte';
	import Input from '@plavna/design/components/Input/Input.svelte';
	import Label from '@plavna/design/components/Label/Label.svelte';
	import Labeled from '@plavna/design/components/Label/Labeled.svelte';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';

	import Errors from '../common/components/Errors.svelte';
	import Translation from '../i18n/Translation.svelte';
	import type { PageCreateForm, PageUpdateForm } from './validators';

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

	<Labeled as="label">
		<Label><Translation key="pages_list.slug" /></Label>
		<Input name="slug" bind:value={$form.slug} aria-invalid={Boolean($errors.slug?.length)} />
		<Errors errors={$errors.slug} />
	</Labeled>

	{#if $form.id}
		<Button formaction="?/update">
			<Translation key="pages_list.update" />
		</Button>
	{:else}
		<Button formaction="?/create">
			<Translation key="pages_list.create" />
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
