<script lang="ts">
	import { page } from '$app/stores';
	import Section from '$lib/features/section/Section.svelte';
	import SectionCreator from '$lib/features/section/SectionCreator.svelte';

	let { data } = $props();
</script>

{#each data.sections.items as section}
	<Section {section} />
{/each}
{#if $page.data.user && $page.data.user.username === $page.params.username}
	<SectionCreator formData={data.sections.creationForm} />
{/if}
