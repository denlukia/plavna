<script lang="ts">
	import { IMG_VALIDATION_CONFIG } from '$lib/collections/config';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';

	type Props = {
		name: string;
		onImageChange?: (e: Event) => Promise<void>;
		onDrop?: (file: File) => Promise<void>;
		errors?: string | string[] | null;
	};

	let { name, onImageChange, onDrop, errors }: Props = $props();

	let id = $derived(`image-input-${name}`);

	function ondragover(e: DragEvent) {
		e.preventDefault();
	}

	function ondrop(e: DragEvent) {
		e.preventDefault();
		if (!e.dataTransfer) return;
		const file = e.dataTransfer.files[0];
		onDrop?.(file);
	}
</script>

<label class="drop-zone" for={id} {ondrop} {ondragover}>
	<Typography size="small" tone={errors ? 'danger' : 'default'} style="pointer-events: none">
		{#if errors}
			{errors}
		{:else}
			<Translation key="article_editor.previews.image_dropzone" />
		{/if}
		<br />
		<input
			{id}
			class="file-input"
			type="file"
			maxlength="1"
			accept={IMG_VALIDATION_CONFIG.formats.join(',')}
			onchange={onImageChange}
			{name}
		/>
	</Typography>
</label>

<style>
	.drop-zone {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-start;
		height: 100%;
		line-height: normal;
		padding: var(--size-image-input-padding);
		color: var(--color-image-input);
	}
	.file-input {
		pointer-events: all;
		margin-top: var(--size-s-to-m);
		width: 100%;
		margin-inline-start: -2px;
	}
	/* Better margin resets for Safari */
	@supports (font: -apple-system-body) and (-webkit-appearance: none) {
		.file-input {
			margin-inline-start: -8px;
		}
	}
	.file-input::file-selector-button {
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		opacity: 0;
	}
</style>
