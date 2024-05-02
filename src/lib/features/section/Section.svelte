<script lang="ts">
	import { setContext } from 'svelte';

	import ArticlesList from './ArticlesList.svelte';
	import DescriptionViewer from './DescriptionViewer.svelte';
	import SectionEditor from './SectionEditor.svelte';
	import type { SectionContext, SectionProp, SectionPropWithAuthorship } from './types';

	type Props = {
		section: SectionProp;
	};

	let { section }: Props = $props();

	let editorOpened = $state(false);

	function sectionHasForms(section: SectionProp): section is SectionPropWithAuthorship {
		return Boolean(section.forms);
	}

	function onEditorOpen() {
		editorOpened = true;
	}

	const sectionContext: SectionContext = {
		activeTags: section.activeTags,
		onTagSwitch: (tagId, newState) => {
			console.log(`Tag switch: ${tagId} to ${newState}`);
		}
	};

	setContext('section', sectionContext);
</script>

<section class="section">
	<div class="description">
		{#if sectionHasForms(section) && editorOpened}
			<SectionEditor
				mainForm={section.forms.updating}
				deletionForm={section.forms.deletion}
				onCancel={() => (editorOpened = false)}
				onSuccessfullUpdate={() => (editorOpened = false)}
			/>
		{:else}
			<DescriptionViewer {section} {onEditorOpen} />
		{/if}
	</div>

	<ArticlesList {section} />
</section>

<style>
	.description {
		max-width: var(--size-section-max-width);
	}
	.section {
		position: relative;
		margin-bottom: var(--size-section-margin-bottom);
	}
</style>
