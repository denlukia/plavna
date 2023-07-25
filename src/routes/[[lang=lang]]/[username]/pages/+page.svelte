<script lang="ts">
	import PageForm from '$lib/components/PageForm.svelte';

	export let data;
</script>

{#each data.pagesForms as formObj}
	<PageForm {formObj} />
{/each}
