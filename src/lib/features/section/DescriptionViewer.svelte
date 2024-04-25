<script lang="ts">
	import Button from '$lib/design-system/components/Button.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';

	import type { SectionProp } from './types';

	type Props = {
		section: SectionProp;
		onEditorOpen: () => void;
	};

	let { section, onEditorOpen }: Props = $props();
</script>

<div class="description-viewer">
	<Translation recordKey={section.meta.title_translation_key} markdown />
	<div class="actions-wrapper">
		<Button size="small" type="secondary" onclick={onEditorOpen}>
			<Translation key="page.section.edit" />
		</Button>
	</div>
</div>

<style>
	.description-viewer {
		position: relative;
		width: max-content;
		max-width: 100%;
	}
	.actions-wrapper {
		padding-left: var(--size-m);
		padding-top: var(--size-s);
		display: flex;
		gap: var(--size-m);
		align-items: flex-start;
		position: absolute;
		top: 0;
		right: 0;
		transform: translateX(100%);
	}
</style>
