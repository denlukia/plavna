<script lang="ts">
	import PageCreateForm from '$lib/components/PageCreateForm.svelte';
	import PageEditForm from '$lib/components/PageEditForm.svelte';

	export let data;
</script>

{#each data.editForms as formObj}
	<PageEditForm {formObj} />
{/each}
<PageCreateForm formObj={data.createForm} />
