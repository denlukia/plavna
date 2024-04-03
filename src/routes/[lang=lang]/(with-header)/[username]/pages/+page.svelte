<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import PageEditForm from '$lib/(features)/user_pages_list/PageEditor.svelte';
	import PageItem from '$lib/(features)/user_pages_list/PageItem.svelte';
	import Translation from '$lib/components/Translation.svelte';
	import Popup from '$lib/design-system/components/Dropdownable/Popup.svelte';
	import Typography from '$lib/design-system/components/Typography.svelte';

	let { data } = $props();

	let superFormObj = superForm(data.createForm);
</script>

<Typography size="heading-1"><Translation key="my_pages" /></Typography>

<div class="pages">
	{#each data.editForms as formObj}
		<PageItem {formObj} />
	{/each}
	<div class="new-page-wrapper">
		<Popup triggerType="button">
			{#snippet label()}
				<Translation key="create_new_page" />
			{/snippet}
			{#snippet content()}
				<PageEditForm {superFormObj} />
			{/snippet}
		</Popup>
	</div>
</div>

<style>
	.pages {
		margin-top: var(--size-3xl);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--size-column-gap);
	}
	.new-page-wrapper {
		margin-left: var(--size-m);
		display: flex;
		align-items: center;
	}
</style>
