<script lang="ts">
	import Checkbox from '$lib/design/components/Checkbox/Checkbox.svelte';
	import Labeled from '$lib/design/components/Label/Labeled.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';

	import Translation from '../../i18n/Translation.svelte';
	import DropZone from './DropZone.svelte';

	type Props = {
		name: string;
		isPathPresent: boolean;
	};

	let { name, isPathPresent }: Props = $props();
</script>

{#if isPathPresent}
	<div class="image-actions">
		<div class="checkbox-wrapper">
			<Labeled as="label" kind="for-checkbox" size="small">
				<Checkbox name="delete_{name}" checkboxSize="small" lighter />
				<Typography size="small">
					<Translation key="article_editor.images.mark_for_deletion" />
				</Typography>
			</Labeled>
		</div>
	</div>
{:else}
	<DropZone {name} />
{/if}

<style>
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

	@keyframes fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
