<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/design/components/Button/Button.svelte';
	import InfoBlock from '$lib/design/components/InfoBlock/InfoBlock.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';

	import { getRecordTranslation } from '../i18n/utils';
	import type { SectionProp } from './types';

	type Props = {
		section: SectionProp;
		onEditorOpen: () => void;
		showEditButton: boolean;
	};

	let { section, onEditorOpen, showEditButton }: Props = $props();

	let transitionKey = $derived(section.meta.title_translation_key);
	let descriptionTranslation = $derived(
		getRecordTranslation(transitionKey, $page.data.recordsTranslations)
	);
</script>

<div class="description-viewer">
	{#if descriptionTranslation}
		<Translation recordKey={transitionKey} markdown />
	{:else}
		<div class="info-block-wrapper">
			<InfoBlock>
				<Translation key="page_actor.section.section_invisible" />
			</InfoBlock>
		</div>
	{/if}
	{#if showEditButton}
		<div class="actions-wrapper">
			<Button size="small" kind="secondary" onclick={onEditorOpen}>
				<Translation key="page_actor.section.edit" />
			</Button>
		</div>
	{/if}
</div>

<style>
	.description-viewer {
		position: relative;
	}
	.info-block-wrapper {
		padding-top: var(--size-m);
	}
	.actions-wrapper {
		position: absolute;
		left: 0;
		top: calc(var(--size-xl-to-2xl) * -1);
	}
</style>
