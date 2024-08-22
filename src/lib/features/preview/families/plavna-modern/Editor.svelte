<script lang="ts">
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms';
	import { MAX_COLS_IN_SECTION, MAX_ROWS_IN_SECTION } from '$lib/collections/constants';
	import Button from '$lib/design/components/Button/Button.svelte';
	import FormWrapper from '$lib/design/components/FormWrapper/FormWrapper.svelte';
	import GridCell from '$lib/design/components/Grid/Column.svelte';
	import ColorInput from '$lib/design/components/Input/ColorInput.svelte';
	import Input from '$lib/design/components/Input/Input.svelte';
	import Label from '$lib/design/components/Label/Label.svelte';
	import Labeled from '$lib/design/components/Label/Labeled.svelte';
	import Spacer from '$lib/design/components/Spacer/Spacer.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import LanguagedImageInput from '$lib/features/image/ImageInput/LanguagedImageInput.svelte';
	import { getImageById } from '$lib/features/image/utils';

	import { commonPreviewEditorFormAttributes } from '..';
	import type { PreviewEditorProps } from '../types';

	let { mainSuperValidated, images }: PreviewEditorProps = $props();

	let { form, enhance, errors } = superForm(mainSuperValidated);
</script>

<FormWrapper>
	<form use:enhance {...commonPreviewEditorFormAttributes}>
		<input name="preview_family" type="hidden" value="plavna-modern" />
		<GridCell cols={2}>
			<GridCell cols={0.6}>
				<Labeled as="label">
					<Label>
						<Translation key="article_editor.previews.families.plavna_modern.text_color" />
					</Label>
					<ColorInput name="preview_prop_2" bind:value={$form.preview_prop_2} />
				</Labeled>
			</GridCell>
			<GridCell cols={0.6}>
				<Labeled as="label">
					<Label>
						<Translation key="article_editor.previews.families.plavna_modern.text_bg_color" />
					</Label>
					<ColorInput name="preview_prop_1" bind:value={$form.preview_prop_1} />
				</Labeled>
			</GridCell>
			<GridCell cols={0.4}>
				<Labeled as="label">
					<Label>
						<Translation key="article_editor.previews.families.plavna_modern.cols" />
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
						<Translation key="article_editor.previews.families.plavna_modern.rows" />
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
			<GridCell>
				<Labeled>
					<Label>
						<Translation key="article_editor.previews.families.plavna_modern.image" />
					</Label>
					<LanguagedImageInput
						name="preview_image_1"
						bind:image={images.preview_image_1}
						clientUpload
					/>
				</Labeled>
			</GridCell>
			<GridCell>
				<Labeled>
					<Label>
						<Translation key="article_editor.previews.families.plavna_modern.image_depth" />
					</Label>
					<LanguagedImageInput
						name="preview_image_2"
						bind:image={images.preview_image_2}
						clientUpload
					/>
				</Labeled>
			</GridCell>
		</GridCell>
		<Spacer />
		<div class="actions-row">
			<Button><Translation key="article_editor.previews.set_and_update" /></Button>
		</div>
	</form>
</FormWrapper>

<style>
	.actions-row {
		display: flex;
		justify-content: flex-end;
	}
</style>
