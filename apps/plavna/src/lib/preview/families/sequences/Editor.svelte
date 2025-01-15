<script lang="ts">
	import {
		Button,
		ColorInput,
		Column,
		FormWrapper,
		Input,
		Label,
		Labeled
	} from '@plavna/design/components';
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms';
	import { MAX_COLS_IN_SECTION, MAX_ROWS_IN_SECTION } from '$lib/common/config';
	import Translation from '$lib/i18n/Translation.svelte';
	import { uploadImage } from '$lib/image/client-uploader';

	import { PREVIEW_EDITOR_FORM_ATTRS } from '..';
	import type { PreviewEditorProps } from '../types';

	let {
		mainSuperValidated,
		preview_image_1 = $bindable(),
		preview_image_2 = $bindable()
	}: PreviewEditorProps = $props();

	let { form, enhance, errors } = superForm(mainSuperValidated);

	let processing = $state(false);

	function getEmojiSVG(
		emoji: string,
		size: number,
		cols: number,
		rows: number,
		blur: boolean = false
	) {
		const fontSize = size * 2;
		const width = fontSize * cols * 1.3;
		const height = fontSize * rows * 1.3;

		let pattern1 = splitEmoji(emoji).filter((e) => e !== ' ');
		let [first, ...other] = pattern1;
		let pattern2 = other.concat(first);

		let line1 = Array(cols)
			.fill(null)
			.map((_, i) => pattern1[i % pattern1.length])
			.join(' ');
		let line2 = Array(cols)
			.fill(null)
			.map((_, i) => pattern2[i % pattern2.length])
			.join(' ');

		function splitEmoji(string: string) {
			return [...new Intl.Segmenter().segment(string)].map((x) => x.segment);
		}

		function getText(index: number) {
			const line = index % 2 === 0 ? line1 : line2;

			return `<text x="0" y="${index * fontSize * 1.3 + fontSize}" font-size="${fontSize}">${line}</text>`;
		}

		const texts = new Array(rows).fill(null).map((_, i) => {
			return getText(i);
		});

		const style = blur ? 'filter: brightness(1.5) saturate(6) blur(6px);' : '';

		return {
			svg: `
				<svg xmlns="http://www.w3.org/2000/svg" style="${style}" width="${width}"  height="${height}">
						${texts.join('')}
				</svg>
			`,
			width,
			height
		};
	}

	async function updateEmojiImages() {
		processing = true;

		let gridSvg = getEmojiSVG($form.preview_prop_4 || '', 70, 10, 5);
		await covertToPngAndUpload({
			...gridSvg,
			imageId: preview_image_1.id
		});

		let blurredSvg = getEmojiSVG($form.preview_prop_4 || '', 10, 3, 1, true);
		await covertToPngAndUpload({
			...blurredSvg,
			imageId: preview_image_2.id
		});

		processing = false;
	}

	async function covertToPngAndUpload({
		svg,
		width,
		height,
		imageId
	}: {
		svg: string;
		width: number;
		height: number;
		imageId: number;
	}) {
		let svgDataUrl = `data:image/svg+xml;utf-8,${svg}`;

		try {
			let png = await convertSvgToPng(svgDataUrl, width, height);
			const blob = new Blob([png], { type: 'image/png' });
			const file = new File([blob], 'image.png', { type: 'image/png' });

			await uploadImage(file, {
				actor: $page.data.actor,
				imageId: imageId,
				lang: null
			});
		} catch (e) {
			console.error('Error converting to png or uploading', e);
			return;
		}
	}

	async function convertSvgToPng(svgDataUrl: string, width: number, height: number) {
		return new Promise<Blob>((resolve, reject) => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement('canvas');
				canvas.width = width || img.width;
				canvas.height = height || img.height;
				const ctx = canvas.getContext('2d');

				if (!ctx) {
					reject(new Error('Canvas 2D context is not supported'));
					return;
				}

				ctx.drawImage(img, 0, 0);

				canvas.toBlob(
					(blob) => {
						if (blob) {
							resolve(blob);
						} else {
							reject(new Error('Canvas toBlob failed'));
						}
					},
					'image/png',
					1.0
				);
			};

			img.onerror = reject;
			img.src = svgDataUrl;
		});
	}
</script>

<FormWrapper>
	<form use:enhance {...PREVIEW_EDITOR_FORM_ATTRS}>
		<input name="preview_family" type="hidden" value="sequences" />
		<Column cols={2}>
			<Column cols={0.66}>
				<Labeled as="label">
					<Label>
						<Translation key="article_editor.previews.families.sequences.text_bg_color" />
					</Label>
					<ColorInput name="preview_prop_1" bind:value={$form.preview_prop_1} />
				</Labeled>
			</Column>
			<Column cols={0.66}>
				<Labeled as="label">
					<Label>
						<Translation key="article_editor.previews.families.sequences.text_color" />
					</Label>
					<ColorInput name="preview_prop_2" bind:value={$form.preview_prop_2} />
				</Labeled>
			</Column>
			<Column cols={0.3}>
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
			</Column>
			<Column cols={0.3}>
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
			</Column>
			<Column cols={0.5}>
				<Labeled as="label">
					<Label>
						<Translation key="article_editor.previews.families.sequences.emoji_base_color" />
					</Label>
					<ColorInput name="preview_prop_3" bind:value={$form.preview_prop_3} />
				</Labeled>
			</Column>
			<Column cols={0.5}>
				<Labeled as="label">
					<Label>
						<Translation key="article_editor.previews.families.sequences.emoji" />
					</Label>
					<Input name="preview_prop_4" bind:value={$form.preview_prop_4} />
				</Labeled>
			</Column>
			<Column cols={0.99} style="display: flex; align-items: flex-end;">
				<Button kind="secondary" type="button" disabled={processing} onclick={updateEmojiImages}>
					<Translation key="article_editor.previews.families.sequences.generate_emoji_image" />
				</Button>
			</Column>
		</Column>
	</form>
</FormWrapper>
