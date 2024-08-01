<script lang="ts">
	import { IMG_VALIDATION_CONFIG } from '$lib/collections/constants';
	import Checkbox from '$lib/design/components/Checkbox/Checkbox.svelte';
	import Labeled from '$lib/design/components/Label/Labeled.svelte';
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
		<div class="checkbox-wrapper">
			<Labeled as="label" kind="for-checkbox" size="small">
				<Checkbox name="delete_{name}" checkboxSize="small" lighter />
				<Typography size="small">
					<Translation key="article_editor.previews.mark_deletion" />
				</Typography>
			</Labeled>
		</div>
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
		justify-content: center;
		align-items: flex-end;
	}
	.checkbox-wrapper {
		padding-inline: var(--size-image-input-checkbox-wrapper-padding-inline);
		padding-block: var(--size-image-input-checkbox-wrapper-padding-block);
		background: var(--color-image-input-checkbox-wrapper-bg);
		backdrop-filter: var(--backdrop-filter-image-input-checkbox-wrapper);
		-webkit-backdrop-filter: var(--backdrop-filter-image-input-checkbox-wrapper);
		border-radius: var(--size-image-input-checkbox-wrapper-border-radius);
		color: var(--color-image-input-checkbox-wrapper-text);

		animation: fade-in 500ms 3s backwards;
	}
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

	@keyframes fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
