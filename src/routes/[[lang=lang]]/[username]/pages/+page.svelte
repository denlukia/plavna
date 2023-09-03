<script lang="ts">
	import PageEditForm from '$lib/components/editors/PageEditor.svelte';

	export let data;
</script>

<h1>МОЇ СТОРІНКИ</h1>

{#each data.editForms as formObj}
	<PageEditForm {formObj} />
{/each}
<PageEditForm formObj={data.createForm} />
