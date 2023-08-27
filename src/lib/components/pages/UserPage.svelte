<script lang="ts">
	import Section from '../Section.svelte';
	import SectionCreator from '../editors/SectionCreator.svelte';

	import type { PageData } from '../../../routes/[[lang=lang]]/[username]/$types';

	export let data: PageData;
</script>

{#each data.sections as sectionData}
	<Section {sectionData} />
{/each}
<SectionCreator superFormObj={data.sectionCreationForm} />
