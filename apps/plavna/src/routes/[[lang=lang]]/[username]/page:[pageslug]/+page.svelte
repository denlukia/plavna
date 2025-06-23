<script lang="ts">
	import Page from '../pageslug-common/Page.svelte';

	let { data } = $props();

	let { themeSet, themeComponentSets } = $derived(data);
</script>

<Page {data} />
