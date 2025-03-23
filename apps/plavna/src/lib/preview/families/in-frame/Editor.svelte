<script lang="ts">
	import {
		ColorInput,
		Column,
		FormWrapper,
		Input,
		Label,
		Labeled
	} from '@plavna/design/components';
	import { superForm } from 'sveltekit-superforms';
	import Translation from '$lib/i18n/Translation.svelte';
	import LanguagedImageInput from '$lib/image/ImageInput/LanguagedImageInput.svelte';
	import { MAX_COLS_IN_SECTION, MAX_ROWS_IN_SECTION } from '$lib/styles/grid';

	import { PREVIEW_EDITOR_FORM_ATTRS } from '..';
	import type { PreviewEditorProps } from '../types';

	let {
		mainSuperValidated,
		preview_image_1 = $bindable(),
		preview_image_2 = $bindable()
	}: PreviewEditorProps = $props();

	let { form, enhance, errors } = superForm(mainSuperValidated, {
		resetForm: false
	});
</script>

<FormWrapper>
	<form use:enhance {...PREVIEW_EDITOR_FORM_ATTRS}>
		<input name="preview_family" type="hidden" value="in-frame" />
		<Column cols={2}>
			<Column cols={0.6}>
				<Labeled as="label">
					<Label>
						<Translation key="article_editor.previews.families.in-frame.frame_color" />
					</Label>
					<ColorInput name="preview_prop_1" bind:value={$form.preview_prop_1} />
				</Labeled>
			</Column>
			<Column cols={0.6}>
				<Labeled as="label">
					<Label>
						<Translation key="article_editor.previews.families.in-frame.mat_color" />
					</Label>
					<ColorInput name="preview_prop_2" bind:value={$form.preview_prop_2} />
				</Labeled>
			</Column>
			<Column cols={0.4}>
				<Labeled as="label">
					<Label>
						<Translation key="article_editor.previews.families.in-frame.cols" />
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
			<Column cols={0.4}>
				<Labeled as="label">
					<Label>
						<Translation key="article_editor.previews.families.in-frame.rows" />
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
			<Column cols={2}>
				<Labeled>
					<Label>
						<Translation key="article_editor.previews.families.in-frame.image" />
					</Label>
					<LanguagedImageInput name="preview_image_1" bind:image={preview_image_1} clientUpload />
				</Labeled>
			</Column>
		</Column>
	</form>
</FormWrapper>
