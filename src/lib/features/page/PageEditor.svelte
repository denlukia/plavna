<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import Button from '$lib/design-system/components/Button.svelte';
	import Input from '$lib/design-system/components/Input/Input.svelte';
	import Labeled from '$lib/design-system/components/Labeled.svelte';
	import Typography from '$lib/design-system/components/Typography/Typography.svelte';

	import Error from '../common/components/Error.svelte';
	import Translation from '../i18n/Translation.svelte';
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
		<Typography size="small-short"><Translation key="pages_list.slug" /></Typography>
		<Input name="slug" bind:value={$form.slug} aria-invalid={Boolean($errors.slug?.length)} />
		<Error errors={$errors.slug} />
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
