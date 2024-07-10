<script lang="ts">
	import { IMG_VALIDATION_CONFIG } from '$lib/collections/constants';
	import Typography from '$lib/design/components/Typography/Typography.svelte';

	import Translation from '../../i18n/Translation.svelte';
	import ImageById from '../ImageById.svelte';
	import type { ImageSelect } from '../parsers';

	type Props = {
		name: string;
		imageId?: ImageSelect['id'] | null;
	};

	let { name, imageId }: Props = $props();
</script>

{#if imageId}
	<div class="image">
		<ImageById id={imageId} />
	</div>
	<div class="image-actions">
		<label class="deletion-checkbox">
			Mark for deletion
			<input type="checkbox" name="delete_{name}" />
		</label>
	</div>
{:else}
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
				{name}
			/>
		</Typography>
	</label>
{/if}

<style>
	.image > :global(*) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.image-actions {
		padding: var(--size-image-input-padding);
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.drop-zone {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		line-height: normal;
		padding: var(--size-image-input-padding);
		color: var(--color-imga-input);
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
