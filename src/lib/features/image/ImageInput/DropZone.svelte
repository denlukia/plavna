<script lang="ts">
	import { IMG_VALIDATION_CONFIG } from '$lib/collections/constants';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';

	type Props = {
		name: string;
		onImageChange?: (e: Event) => Promise<void>;
		value?: File | null;
	};

	let { name, onImageChange, value = $bindable() }: Props = $props();
</script>

<label class="drop-zone">
	<Typography size="small">
		<Translation key="article_editor.previews.image_dropzone" />
		<br />
		<br />
		<input
			class="file-input"
			type="file"
			maxlength="1"
			accept={IMG_VALIDATION_CONFIG.formats.join(',')}
			onchange={onImageChange}
			bind:value
			{name}
		/>
	</Typography>
</label>

<style>
	.drop-zone {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		line-height: normal;
		padding: var(--size-image-input-padding);
		color: var(--color-image-input);
	}
	.file-input {
		width: 100%;
		margin-inline-start: -7px;
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
