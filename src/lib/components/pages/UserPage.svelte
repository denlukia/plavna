<script lang="ts">
	import SectionCreator from '../editors/SectionCreator.svelte';
	import SectionEditor from '../editors/SectionEditor.svelte';

	import type { PageData } from '../../../routes/[[lang=lang]]/[username]/$types';

	export let data: PageData;
</script>

<pre>{JSON.stringify(data, null, '    ')}</pre>
{#each data.sections as section}
	<SectionEditor {section} />
{/each}
<SectionCreator superFormObj={data.createSectionForm} />
