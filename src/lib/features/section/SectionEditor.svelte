<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import Button from '$lib/design-system/components/Button.svelte';
	import Input from '$lib/design-system/components/Input/Input.svelte';
	import Typography from '$lib/design-system/components/Typography.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';

	import type { SectionDelete, SectionInsert, SectionUpdate } from './parsers';
	import SectionDeletion from './SectionDeletion.svelte';

	type Props = {
		mainForm: SuperValidated<SectionInsert | SectionUpdate>;
		deletionForm?: SuperValidated<SectionDelete>;
		oncancel: () => void;
	};

	let { mainForm: mainFormData, deletionForm: deletionFormData, oncancel }: Props = $props();

	let { form, enhance } = superForm(mainFormData);
</script>

<div class="section-editor">
	<Typography size="heading-1">
		<Translation key="page.section.editor_title" />
	</Typography>
	<form use:enhance action="?/update_section" method="POST">
		{#if 'section_id' in $form}
			<input name="section_id" type="hidden" bind:value={$form.section_id} />
		{/if}
		<Input translationForm={form} />
		<div class="actions">
			<Button type="secondary" onclick={oncancel}>
				<Translation key="page.section.cancel" />
			</Button>
			<Button>
				<Translation key={`page.section.${'section_id' in $form ? 'update' : 'create'}`} />
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
</style>
