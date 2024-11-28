<script lang="ts">
	import Layout from '../pageslug-common/Layout.svelte';

	let { data, children } = $props();
</script>

<Layout {data}>
	{@render children()}
</Layout>
