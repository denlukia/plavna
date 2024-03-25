<script lang="ts">
	import PageEditForm from '$lib/(features)/user_pages_list/PageEditor.svelte';
	import Translation from '$lib/components/Translation.svelte';
	import Text from '$lib/design-system/components/Text.svelte';

	export let data;
</script>

<Text><Translation key="my_pages" /></Text>

{#each data.editForms as formObj}
	<PageEditForm {formObj} />
{/each}
<PageEditForm formObj={data.createForm} />
