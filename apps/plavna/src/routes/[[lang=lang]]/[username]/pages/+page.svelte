<script lang="ts">
	import { AnimatedPage, Popup, Typography } from '@plavna/design/components';
	import ColumnedCards from '$lib/features/common/components/ColumnedCards.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import PageItem from '$lib/features/page/PageItem.svelte';
	import PageEditor from '$lib/features/page/PageItemEditor.svelte';

	let { data } = $props();

	let { routeId, lang } = $derived(data);

	let active = $state(false);

	function onSuccessfullUpdate() {
		active = false;
	}
</script>

<AnimatedPage key={routeId + lang}>
	<Typography size="heading-1"><Translation key="pages_list.title" /></Typography>

	<ColumnedCards>
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
	</ColumnedCards>
</AnimatedPage>

<style>
	.new-page-wrapper {
		margin-left: var(--size-m);
		display: flex;
		align-items: center;
	}
</style>
