<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import Button from '$lib/design/components/Button.svelte';
	import Input from '$lib/design/components/Input/Input.svelte';
	import Label from '$lib/design/components/Label/Label.svelte';
	import LabeledInput from '$lib/design/components/Label/LabeledInput.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';

	import type { SectionDelete, SectionInsert, SectionUpdate } from './parsers';
	import SectionDeletion from './SectionDeletion.svelte';

	type Props = {
		mainForm: SuperValidated<SectionInsert | SectionUpdate>;
		deletionForm?: SuperValidated<SectionDelete>;
		onCancel: () => void;
		onSuccessfullUpdate?: () => void;
	};

	let {
		mainForm: mainFormData,
		deletionForm: deletionFormData,
		onCancel,
		onSuccessfullUpdate
	}: Props = $props();

	let { form, enhance } = superForm(mainFormData, {
		onUpdate: (e) => {
			if (e.result.type === 'success') {
				onSuccessfullUpdate?.();
			}
		}
	});
</script>

<div class="section-editor">
	<Typography size="heading-1">
		<Translation key="page_actor.section.editor_title" />
	</Typography>
	<form use:enhance action="?/{'section_id' in $form ? 'update' : 'create'}_section" method="POST">
		{#if 'section_id' in $form}
			<input name="section_id" type="hidden" bind:value={$form.section_id} />
		{/if}
		<div class="inputs">
			<LabeledInput style="width: 100%;">
				<Label><Translation key="page_actor.section.description" /></Label>
				<Input type="textarea" translations={form} style="width: 100%;" rows={3} />
			</LabeledInput>
		</div>

		<div class="actions">
			<Button type="secondary" onclick={onCancel}>
				<Translation key="page_actor.section.cancel" />
			</Button>
			<Button>
				<Translation key={`page_actor.section.${'section_id' in $form ? 'update' : 'create'}`} />
			</Button>
		</div>
	</form>
	{#if deletionFormData}
		<div class="deletion-form-wrapper">
			<SectionDeletion formData={deletionFormData} />
		</div>
	{/if}
</div>

<style>
	.section-editor {
		padding-inline: var(--size-section-editor-padding-inline);
		padding-top: var(--size-section-editor-padding-top);
		padding-bottom: var(--size-section-editor-padding-bottom);
		border-radius: var(--size-section-editor-border-radius);
		background: var(--color-section-editor-bg);
		position: relative;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		gap: var(--size-m);
		margin-top: var(--size-l);
	}
	.deletion-form-wrapper {
		position: absolute;
		bottom: var(--size-section-editor-padding-bottom);
		left: var(--size-section-editor-padding-inline);
	}

	.inputs {
		margin-top: var(--size-l);
	}
</style>
