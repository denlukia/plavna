<script lang="ts">
	import { Column, Input, Label, Labeled, Spacer } from '@plavna/design/components';
	import { superForm } from 'sveltekit-superforms';
	import Errors from '$lib/errors/Errors.svelte';
	import Translation from '$lib/i18n/Translation.svelte';
	import LanguagedImageInput from '$lib/image/ImageInput/LanguagedImageInput.svelte';
	import { MAX_COLS_IN_SECTION, MAX_ROWS_IN_SECTION } from '$lib/styles/grid';

	import { PREVIEW_EDITOR_FORM_ATTRS } from '..';
	import type { CustomPreviewEditorProps } from '../types';

	let {
		mainSuperValidated,
		preview_image_1 = $bindable(),
		preview_image_2 = $bindable(),
		templateMeta
	}: CustomPreviewEditorProps = $props();

	let { form, enhance, errors } = superForm(mainSuperValidated, {
		resetForm: false
	});
</script>

<form use:enhance {...PREVIEW_EDITOR_FORM_ATTRS}>
	<input name="preview_family" type="hidden" value="custom" />
	<input name="preview_template_id" type="hidden" value={templateMeta.id} />
	<Column cols={2}>
		<Column cols={0.5}>
			<Labeled as="label">
				<Label>
					<Translation key="article_editor.previews.families.custom.prop_1" />
				</Label>
				<Input name="preview_prop_1" bind:value={$form.preview_prop_1} />
			</Labeled>
		</Column>
		<Column cols={0.5}>
			<Labeled as="label">
				<Label>
					<Translation key="article_editor.previews.families.custom.prop_2" />
				</Label>
				<Input name="preview_prop_2" bind:value={$form.preview_prop_2} />
			</Labeled>
		</Column>
		<Column cols={0.5}>
			<Labeled as="label">
				<Label>
					<Translation key="article_editor.previews.families.custom.prop_3" />
				</Label>
				<Input name="preview_prop_3" bind:value={$form.preview_prop_3} />
			</Labeled>
		</Column>
		<Column cols={0.5}>
			<Labeled as="label">
				<Label>
					<Translation key="article_editor.previews.families.custom.prop_4" />
				</Label>
				<Input name="preview_prop_4" bind:value={$form.preview_prop_4} />
			</Labeled>
		</Column>
		<Column cols={1}>
			<Labeled as="label">
				<Label>
					<Translation key="article_editor.previews.families.custom.cols" />
				</Label>
				<Input
					type="number"
					min="1"
					placeholder="1"
					max={MAX_COLS_IN_SECTION}
					name="preview_columns"
					bind:value={$form.preview_columns}
				/>
			</Labeled>
		</Column>
		<Column cols={1}>
			<Labeled as="label">
				<Label>
					<Translation key="article_editor.previews.families.custom.rows" />
				</Label>
				<Input
					type="number"
					min="1"
					placeholder="1"
					max={MAX_ROWS_IN_SECTION}
					name="preview_rows"
					bind:value={$form.preview_rows}
				/>
			</Labeled>
		</Column>
		<Column>
			<Labeled>
				<Label>
					<Translation key="article_editor.previews.families.custom.image_1" />
				</Label>
				<LanguagedImageInput name="preview_image_1" bind:image={preview_image_1} clientUpload />
			</Labeled>
		</Column>
		<Column>
			<Labeled>
				<Label>
					<Translation key="article_editor.previews.families.custom.image_2" />
				</Label>
				<LanguagedImageInput name="preview_image_2" bind:image={preview_image_2} clientUpload />
			</Labeled>
		</Column>
	</Column>

	<Spacer type="vertical" size="l" />
	<Errors errors={$errors} />
</form>
