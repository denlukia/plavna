<script lang="ts">
	import Popup from '$lib/design-system/components/Dropdownable/Popup.svelte';
	import Typography from '$lib/design-system/components/Typography.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import PageEditor from '$lib/features/page/PageEditor.svelte';
	import PageItem from '$lib/features/page/PageItem.svelte';

	let { data } = $props();

	let active = $state(false);

	function onSuccessfullUpdate() {
		active = false;
	}
</script>

<Typography size="heading-1"><Translation key="layout.my_pages" /></Typography>

<div class="pages">
	{#each data.pageItems as pageItem (pageItem.id)}
		<PageItem {pageItem} />
	{/each}
	<div class="new-page-wrapper">
		<Popup triggerType="button" bind:active>
			{#snippet label()}
				<Translation key="pages_list.create_new_page" />
			{/snippet}
			{#snippet content()}
				<PageEditor formObj={data.creationForm} {onSuccessfullUpdate} />
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
