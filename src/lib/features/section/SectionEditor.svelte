<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import Button from '$lib/design-system/components/Button.svelte';
	import Input from '$lib/design-system/components/Input/Input.svelte';

	import Translation from '../i18n/Translation.svelte';
	import type { SectionInsert, SectionUpdate } from './parsers';

	type FormData = SuperValidated<SectionInsert | SectionUpdate>;

	type Props = {
		form: FormData;
		oncancel: () => void;
	};

	let { form: formData, oncancel }: Props = $props();

	let { form, enhance } = superForm(formData);
</script>

<form class="section-editor" use:enhance action="?/update_section" method="POST">
	{#if 'section_id' in $form}
		<input name="section_id" type="hidden" bind:value={$form.section_id} />
	{/if}
	<Input translationForm={form} />
	<Button onclick={oncancel}>
		<Translation key="page.section.cancel" />
	</Button>
	<Button>
		<Translation key={`page.section.${'section_id' in $form ? 'update' : 'create'}`} />
	</Button>
</form>

<style>
	.section-editor {
		padding-inline: var(--size-section-editor-padding-inline);
		padding-top: var(--size-section-editor-padding-top);
		padding-bottom: var(--size-section-editor-padding-bottom);
		border-radius: var(--size-section-editor-border-radius);
		background: var(--color-section-editor-bg);
	}
</style>
