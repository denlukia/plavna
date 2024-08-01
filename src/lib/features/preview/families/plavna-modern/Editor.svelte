<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import Button from '$lib/design/components/Button/Button.svelte';
	import FormWrapper from '$lib/design/components/FormWrapper/FormWrapper.svelte';
	import GridCell from '$lib/design/components/Grid/GridCell.svelte';
	import ColorInput from '$lib/design/components/Input/ColorInput.svelte';
	import Label from '$lib/design/components/Label/Label.svelte';
	import Labeled from '$lib/design/components/Label/Labeled.svelte';
	import Spacer from '$lib/design/components/Spacer/Spacer.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import LanguagedImageInput from '$lib/features/image/ImageInput/LanguagedImageInput.svelte';

	import { commonPreviewEditorFormAttributes } from '..';
	import type { PreviewEditorProps } from '../types';

	let { mainSuperValidated, images }: PreviewEditorProps = $props();

	let { form, enhance, errors } = superForm(mainSuperValidated);
</script>

<FormWrapper>
	<form use:enhance {...commonPreviewEditorFormAttributes}>
		<input name="preview_family" type="hidden" value="plavna-modern" />
		<GridCell colspan={2}>
			<GridCell>
				<Labeled as="label">
					<Label>
						<Translation key="article_editor.previews.families.plavna_modern.text_color" />
					</Label>
					<ColorInput name="preview_prop_2" bind:value={$form.preview_prop_2} />
				</Labeled>
			</GridCell>
			<GridCell>
				<Labeled as="label">
					<Label>
						<Translation key="article_editor.previews.families.plavna_modern.text_bg_color" />
					</Label>
					<ColorInput name="preview_prop_1" bind:value={$form.preview_prop_1} />
				</Labeled>
			</GridCell>
			<GridCell>
				<Labeled>
					<Label>
						<Translation key="article_editor.previews.families.plavna_modern.image" />
					</Label>
					<LanguagedImageInput
						name="preview_image_1"
						imageId={images.preview_image_1_id}
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
						imageId={images.preview_image_2_id}
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
