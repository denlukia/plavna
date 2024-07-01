<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import Button from '$lib/design/components/Button/Button.svelte';
	import GridCell from '$lib/design/components/Grid/GridCell.svelte';
	import ColorInput from '$lib/design/components/Input/ColorInput.svelte';
	import Label from '$lib/design/components/Label/Label.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import LanguagedImageInput from '$lib/features/image/LanguagedImageInput.svelte';

	import { commonPreviewEditorFormAttributes } from '..';
	import type { PreviewEditorProps } from '../types';

	let { mainSuperValidated, images }: PreviewEditorProps = $props();

	let { form, enhance, errors } = superForm(mainSuperValidated);
</script>

<form class="global-form" use:enhance {...commonPreviewEditorFormAttributes}>
	<GridCell colspan={2}>
		<GridCell>
			<div class="global-labeled-input-wrapper">
				<Label>
					<Translation key="article_editor.previews.families.plavna_modern.text_color" />
				</Label>
				<ColorInput name="preview_prop_2" bind:value={$form.preview_prop_2} />
			</div>
		</GridCell>
		<GridCell>
			<div class="global-labeled-input-wrapper">
				<Label>
					<Translation key="article_editor.previews.families.plavna_modern.text_bg_color" />
				</Label>
				<ColorInput name="preview_prop_1" bind:value={$form.preview_prop_1} />
			</div>
		</GridCell>
		<GridCell>
			<div class="global-labeled-input-wrapper">
				<Label>
					<Translation key="article_editor.previews.families.plavna_modern.image" />
				</Label>
				<LanguagedImageInput
					name="preview_image_1"
					image={images.preview_image_1}
					withLanguages
					clientUpload
				/>
			</div>
		</GridCell>
		<GridCell>
			<div class="global-labeled-input-wrapper">
				<Label>
					<Translation key="article_editor.previews.families.plavna_modern.image_depth" />
				</Label>
				<LanguagedImageInput
					name="preview_image_2"
					image={images.preview_image_2}
					withLanguages
					clientUpload
				/>
			</div>
		</GridCell>
	</GridCell>
	<div class="actions-row">
		<Button><Translation key="article_editor.previews.update" /></Button>
	</div>
</form>

<style>
	.actions-row {
		display: flex;
		justify-content: flex-end;
	}
</style>
