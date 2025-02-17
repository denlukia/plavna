<script lang="ts">
	import {
		Checkbox,
		ColorInput,
		Column,
		Input,
		Label,
		Labeled,
		Typography
	} from '@plavna/design/components';
	import { superForm } from 'sveltekit-superforms';
	import AutosavedInput from '$lib/common/components/AutosavedInput.svelte';
	import { MAX_COLS_IN_SECTION, MAX_ROWS_IN_SECTION } from '$lib/common/config';
	import Translation from '$lib/i18n/Translation.svelte';
	import LanguagedImageInput from '$lib/image/ImageInput/LanguagedImageInput.svelte';

	import { PREVIEW_EDITOR_FORM_ATTRS } from '..';
	import type { CustomPreviewEditorProps } from '../types';

	let {
		mainSuperValidated,
		preview_image_1 = $bindable(),
		preview_image_2 = $bindable(),
		templateMeta
	}: CustomPreviewEditorProps = $props();

	let { form, enhance, errors } = superForm(mainSuperValidated);
</script>

<form use:enhance {...PREVIEW_EDITOR_FORM_ATTRS}>
	<input name="preview_template_id" type="hidden" value={templateMeta.id} />
	<Column cols={2}>
		<Column cols={0.6}>
			<Labeled as="label">
				<Label>
					<Translation key="article_editor.previews.families.modern.text_color" />
				</Label>
				<ColorInput name="preview_prop_2" bind:value={$form.preview_prop_2} />
			</Labeled>
		</Column>
		<Column cols={0.6}>
			<Labeled as="label">
				<Label>
					<Translation key="article_editor.previews.families.modern.text_bg_color" />
				</Label>
				<ColorInput name="preview_prop_1" bind:value={$form.preview_prop_1} />
			</Labeled>
		</Column>
		<Column cols={0.4}>
			<Labeled as="label">
				<Label>
					<Translation key="article_editor.previews.families.modern.cols" />
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
					<Translation key="article_editor.previews.families.modern.rows" />
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
					<Translation key="article_editor.previews.families.modern.image" />
				</Label>
				<LanguagedImageInput name="preview_image_1" bind:image={preview_image_1} clientUpload />
			</Labeled>
		</Column>
		<Column>
			<Labeled>
				<Label>
					<Translation key="article_editor.previews.families.modern.image_depth" />
				</Label>
				<LanguagedImageInput name="preview_image_2" bind:image={preview_image_2} clientUpload />
			</Labeled>
		</Column>
	</Column>
</form>
