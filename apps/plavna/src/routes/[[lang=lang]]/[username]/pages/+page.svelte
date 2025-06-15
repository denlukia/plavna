<script lang="ts">
	import {
		AnimatedPage,
		Column,
		ColumnsContainer,
		IconWrapper,
		Popup,
		Typography
	} from '@plavna/design/components';
	import { Plus } from '@plavna/design/icons';
	import ColumnedCards from '$lib/common/components/ColumnedCards.svelte';
	import { PAGE_INRO_DELAY_MS } from '$lib/common/config.js';
	import Translation from '$lib/i18n/Translation.svelte';
	import PageItem from '$lib/page/PageItem.svelte';
	import PageEditor from '$lib/page/PageItemEditor.svelte';

	let { data } = $props();

	let { routeId, lang } = $derived(data);

	let active = $state(false);

	function onSuccessfullUpdate() {
		active = false;
	}
</script>

<AnimatedPage key={routeId + lang} introDelay={PAGE_INRO_DELAY_MS}>
	<div class="heading">
		<Typography size="heading-1"><Translation key="pages_list.title" /></Typography>

		<div class="new-page-wrapper">
			<Popup triggerType="button" bind:active buttonProps={{ contentCustomClass: 'with-icon' }}>
				{#snippet label()}
					<IconWrapper size="body"><Plus /></IconWrapper>
					<Translation key="pages_list.new" />
				{/snippet}
				{#snippet content()}
					<PageEditor formObj={data.creationForm} {onSuccessfullUpdate} />
				{/snippet}
			</Popup>
		</div>
	</div>

	<ColumnedCards>
		{#each data.pageItems as pageItem (pageItem.id)}
			<PageItem {pageItem} />
		{/each}
	</ColumnedCards>
</AnimatedPage>

<style>
	.heading {
		display: flex;
		align-items: center;
		gap: var(--size-l);
	}
	.new-page-wrapper {
		margin-left: var(--size-m);
		margin-top: var(--size-m);
		display: flex;
		align-items: center;
	}
	.new-page-wrapper :global(.with-icon > *) {
		display: inline-flex;
		gap: var(--size-m);
		align-items: center;
	}
</style>
