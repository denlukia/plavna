<script lang="ts">
	import { AnimatedPage, IconWrapper, Typography } from '@plavna/design/components';
	import { Plus } from '@plavna/design/icons';
	import { ThemeContextProvider } from '@plavna/design/theming/components';
	import { PAGE_INRO_DELAY_MS, SECTIONS_PER_PAGE } from '$lib/common/config';
	import Translation from '$lib/i18n/Translation.svelte';
	import Section from '$lib/section/Section.svelte';
	import SectionEditor from '$lib/section/SectionEditor.svelte';

	import type { PageData } from '../$types';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	let { routeId, lang, themeComponentSets, themeSet } = $derived(data);

	let {
		sections: { items, creationForm }
	} = $state(data);

	$effect(() => {
		({ items, creationForm } = data.sections);
	});

	let creatorShown = $state(false);

	function closeCreator() {
		creatorShown = false;
	}
</script>

<ThemeContextProvider components={themeComponentSets} {themeSet}>
	<AnimatedPage key={routeId + lang} introDelay={PAGE_INRO_DELAY_MS}>
		{#each items as section, index (section.meta.id)}
			<Section bind:section={items[index]} />
		{/each}

		{#if creationForm && items.length < SECTIONS_PER_PAGE}
			{#if creatorShown}
				<div class="section-creator-wrapper">
					<SectionEditor
						mainForm={creationForm}
						onCancel={closeCreator}
						onSuccessfullUpdate={closeCreator}
					/>
				</div>
			{:else}
				<button
					class="global-reset-button section-creation-button"
					onclick={() => (creatorShown = true)}
				>
					<IconWrapper size="heading-2">
						<Plus />
					</IconWrapper>
					<Typography size="heading-2">
						<Translation key="page_actor.section.creator_title" />
					</Typography>
				</button>
			{/if}
		{/if}
	</AnimatedPage>
</ThemeContextProvider>

<style>
	.section-creator-wrapper,
	.section-creation-button {
		margin-bottom: var(--size-6xl);
	}
	.section-creator-wrapper {
		max-width: var(--size-section-description-max-width);
	}
	.section-creation-button {
		display: flex;
		width: 100%;
		justify-content: flex-start;
		align-items: center;
		padding: var(--size-l);
		gap: var(--size-m);
		padding-bottom: var(--size-4xl);

		--rotation: 179deg;
		background: radial-gradient(
			ellipse at top left,
			var(--warm-300-transparent-200) 0%,
			transparent 60%
		);
	}
	.section-creation-button:hover {
		background: radial-gradient(
			ellipse at top left,
			var(--warm-300-transparent-400) 0%,
			transparent 60%
		);
	}
</style>
