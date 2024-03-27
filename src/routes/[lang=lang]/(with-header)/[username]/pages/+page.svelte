<script lang="ts">
	import PageEditForm from '$lib/(features)/user_pages_list/PageEditor.svelte';
	import Translation from '$lib/components/Translation.svelte';
	import Typography from '$lib/design-system/components/Typography.svelte';

	export let data;
</script>

<Typography><Translation key="my_pages" /></Typography>

{#each data.editForms as formObj}
	<PageEditForm {formObj} />
{/each}
<PageEditForm formObj={data.createForm} />
