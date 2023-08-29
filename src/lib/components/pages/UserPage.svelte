<script lang="ts">
	import Section from '../Section.svelte';
	import SectionCreator from '../editors/SectionCreator.svelte';

	import type { PageData } from '../../../routes/[[lang=lang]]/[username]/$types';
	import { page } from '$app/stores';

	export let data: PageData;
</script>

<!-- <pre>{JSON.stringify(data, null, '  ')}</pre> -->
{#each data.sections as section}
	<Section {section} />
{/each}
{#if $page.data.user && $page.data.user.username === $page.params.username}
	<SectionCreator superFormObj={data.sectionCreationForm} />
{/if}
