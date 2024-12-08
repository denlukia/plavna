<script lang="ts">
	import Animated from '$lib/design/components/Animated/Animated.svelte';
	import Popup from '$lib/design/components/Popup/Popup.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import ColumnedContent from '$lib/features/common/components/ColumnedContent.svelte';
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

<Animated key={routeId + lang}>
	<Typography size="heading-1"><Translation key="pages_list.title" /></Typography>

	<ColumnedContent>
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
	</ColumnedContent>
</Animated>

<style>
	.new-page-wrapper {
		margin-left: var(--size-m);
		display: flex;
		align-items: center;
	}
</style>
