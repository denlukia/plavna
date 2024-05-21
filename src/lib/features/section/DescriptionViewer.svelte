<script lang="ts">
	import Button from '$lib/design/components/Button.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';

	import type { SectionProp } from './types';

	type Props = {
		section: SectionProp;
		onEditorOpen: () => void;
		showEditButton: boolean;
	};

	let { section, onEditorOpen, showEditButton }: Props = $props();
</script>

<div class="description-viewer">
	<Translation recordKey={section.meta.title_translation_key} markdown />
	{#if showEditButton}
		<div class="actions-wrapper">
			<Button size="small" type="secondary" onclick={onEditorOpen}>
				<Translation key="page.section.edit" />
			</Button>
		</div>
	{/if}
</div>

<style>
	.description-viewer {
		position: relative;
	}
	.actions-wrapper {
		position: absolute;
		left: 0;
		top: var(--size-s);
		transform: translateY(-100%);
	}
</style>
