<script lang="ts">
	import SectionEditor from '../editors/SectionEditor.svelte';

	import type { PageData } from '../../../routes/[[lang=lang]]/[username]/$types';

	export let data: PageData;
</script>

<pre>{JSON.stringify(data, null, '    ')}</pre>
<SectionEditor superFormObj={data.createSectionForm} />
