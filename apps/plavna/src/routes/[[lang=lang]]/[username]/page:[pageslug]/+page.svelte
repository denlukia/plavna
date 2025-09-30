<script lang="ts">
	import Page from '../pageslug-common/Page.svelte';

	let { data } = $props();

	let { themeSet, themeComponentLayers } = $derived(data);
</script>

<Page {data} />
