<script lang="ts">
	import BlockAnimator from '$lib/design/components/BlockAnimator/BlockAnimator.svelte';
	import Popup from '$lib/design/components/Popup/Popup.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import CardsList from '$lib/features/common/components/CardsList.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import PageItem from '$lib/features/page/PageItem.svelte';
	import PageEditor from '$lib/features/page/PageItemEditor.svelte';

	let { data } = $props();

	let { routeId } = $derived(data);

	let active = $state(false);

	function onSuccessfullUpdate() {
		active = false;
	}
</script>

<BlockAnimator {routeId}>
	<Typography size="heading-1"><Translation key="pages_list.title" /></Typography>

	<CardsList>
		{#each data.pageItems as pageItem (pageItem.id)}
			<PageItem {pageItem} />
		{/each}
		<div class="new-page-wrapper">
			<Popup triggerType="button" bind:active>
				{#snippet label()}
					<Translation key="pages_list.new" />
				{/snippet}
				{#snippet content()}
					<PageEditor formObj={data.creationForm} {onSuccessfullUpdate} />
				{/snippet}
			</Popup>
		</div>
	</CardsList>
</BlockAnimator>

<style>
	.new-page-wrapper {
		margin-left: var(--size-m);
		display: flex;
		align-items: center;
	}
</style>
