<script lang="ts">
	import { page } from '$app/stores';
	import { setContext } from 'svelte';

	import ArticlesList from './ArticlesList.svelte';
	import DescriptionViewer from './DescriptionViewer.svelte';
	import SectionEditor from './SectionEditor.svelte';
	import type {
		SectionContext,
		SectionProp,
		SectionPropWithAuthorship,
		SectionReconfigRequest
	} from './types';

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
		onTagSwitch: async (tagId, checked) => {
			const body: SectionReconfigRequest = { sectionId: section.meta.id, tagId, checked };
			try {
				const response = await fetch($page.url, {
					method: 'POST',
					body: JSON.stringify(body)
				});
				if (response.ok) {
					section = await response.json();
				}
			} catch (err) {
				console.error(err);
			}
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
			<DescriptionViewer {section} {onEditorOpen} showEditButton={sectionHasForms(section)} />
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
