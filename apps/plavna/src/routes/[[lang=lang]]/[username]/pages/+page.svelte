<script lang="ts">
	import {
		AnimatedPage,
		Column,
		ColumnsContainer,
		Popup,
		Typography
	} from '@plavna/design/components';
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
	<ColumnsContainer style="align-items: center;">
		<Column cols={2}>
			<Typography size="heading-1"><Translation key="pages_list.title" /></Typography>
		</Column>
		<Column>
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
		</Column>
	</ColumnsContainer>

	<ColumnedCards>
		{#each data.pageItems as pageItem (pageItem.id)}
			<PageItem {pageItem} />
		{/each}
	</ColumnedCards>
</AnimatedPage>

<style>
	.new-page-wrapper {
		margin-left: var(--size-m);
		display: flex;
		align-items: center;
	}
</style>
