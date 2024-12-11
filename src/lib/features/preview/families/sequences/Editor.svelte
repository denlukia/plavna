<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { MAX_COLS_IN_SECTION, MAX_ROWS_IN_SECTION } from '$lib/collections/config';
	import FormWrapper from '$lib/design/components/FormWrapper/FormWrapper.svelte';
	import GridCell from '$lib/design/components/Grid/Column.svelte';
	import ColorInput from '$lib/design/components/Input/ColorInput.svelte';
	import Input from '$lib/design/components/Input/Input.svelte';
	import Label from '$lib/design/components/Label/Label.svelte';
	import Labeled from '$lib/design/components/Label/Labeled.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import LanguagedImageInput from '$lib/features/image/ImageInput/LanguagedImageInput.svelte';

	import { PREVIEW_EDITOR_FORM_ATTRS } from '..';
	import type { PreviewEditorProps } from '../types';

	let {
		mainSuperValidated,
		preview_image_1 = $bindable(),
		preview_image_2 = $bindable()
	}: PreviewEditorProps = $props();

	let { form, enhance, errors } = superForm(mainSuperValidated);
</script>

<FormWrapper>
	<form use:enhance {...PREVIEW_EDITOR_FORM_ATTRS}>
		<input name="preview_family" type="hidden" value="sequences" />
		<GridCell cols={2}>
			<GridCell cols={0.6}>
				<Labeled as="label">
					<Label>
						<Translation key="article_editor.previews.families.sequences.text_color" />
					</Label>
					<ColorInput name="preview_prop_2" bind:value={$form.preview_prop_2} />
				</Labeled>
			</GridCell>
			<GridCell cols={0.6}>
				<Labeled as="label">
					<Label>
						<Translation key="article_editor.previews.families.sequences.text_bg_color" />
					</Label>
					<ColorInput name="preview_prop_1" bind:value={$form.preview_prop_1} />
				</Labeled>
			</GridCell>
			<GridCell cols={0.4}>
				<Labeled as="label">
					<Label>
						<Translation key="article_editor.previews.families.sequences.cols" />
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
			</GridCell>
			<GridCell cols={0.4}>
				<Labeled as="label">
					<Label>
						<Translation key="article_editor.previews.families.sequences.rows" />
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
			</GridCell>
			<GridCell cols={2}>
				<Labeled>
					<Label>
						<Translation key="article_editor.previews.families.sequences.image" />
					</Label>
					<LanguagedImageInput name="preview_image_1" bind:image={preview_image_1} clientUpload />
				</Labeled>
			</GridCell>
		</GridCell>
	</form>
</FormWrapper>
