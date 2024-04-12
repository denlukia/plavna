<script lang="ts">
	import { page } from '$app/stores';
	import Section from '$lib/(features)/page/Section.svelte';
	import SectionCreator from '$lib/(features)/page/SectionCreator.svelte';

	let { data } = $props();
</script>

{#each data.sections as section}
	<Section {section} formObj={data.translationForms[section.meta.title_translation_key]} />
{/each}
{#if $page.data.user && $page.data.user.username === $page.params.username}
	<SectionCreator formObj={data.sectionCreationForm} />
{/if}
