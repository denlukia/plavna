<script lang="ts">
	import Section from '../Section.svelte';
	import SectionCreator from '../editors/SectionCreator.svelte';

	import type { PageData } from '../../../routes/[[lang=lang]]/[username]/$types';

	export let data: PageData;
</script>

<!-- <pre>{JSON.stringify(data, null, '  ')}</pre> -->
{#each data.sections as section}
	<Section {section} />
{/each}
<SectionCreator superFormObj={data.sectionCreationForm} />
