<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/design/components/Button/Button.svelte';
	import InfoBlock from '$lib/design/components/InfoBlock/InfoBlock.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';

	import { getRecordTranslation } from '../i18n/utils';
	import type { SectionProp } from './types';
	import { findTagsInText } from './utils';

	type Props = {
		section: SectionProp;
		onEditorOpen: () => void;
	};

	let { section, onEditorOpen }: Props = $props();

	let transitionKey = $derived(section.meta.title_translation_key);
	let descriptionTranslation = $derived(
		getRecordTranslation(transitionKey, $page.data.recordsTranslationsState?.value)
	);
	let disabled = $derived.by(getDisabled);

	function getDisabled() {
		if (!descriptionTranslation) return false;
		let tags = findTagsInText(descriptionTranslation);
		let activeTags = section.activeTags;
		return tags.length > 0 && activeTags.length === 0;
	}
</script>

<div class="description-viewer" class:disabled>
	{#if descriptionTranslation}
		<Translation recordKey={transitionKey} markdown />
	{:else}
		<div class="info-block-wrapper">
			<InfoBlock>
				<Translation key="page_actor.section.section_invisible" />
			</InfoBlock>
		</div>
	{/if}
</div>

<style>
	.description-viewer {
		position: relative;
		transition: opacity 250ms;
	}
	.info-block-wrapper {
		padding-top: var(--size-description-viewer-padding-top);
	}

	.disabled {
		opacity: 0.25;
	}
</style>
