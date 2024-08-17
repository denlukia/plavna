<script lang="ts">
	import IconWrapper from '$lib/design/components/IconWrapper/IconWrapper.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import Plus from '$lib/design/icons/Plus.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import Section from '$lib/features/section/Section.svelte';
	import SectionEditor from '$lib/features/section/SectionEditor.svelte';

	let { data } = $props();

	let {
		sections: { items, creationForm }
	} = $derived(data);

	let creatorShown = $state(false);

	function closeCreator() {
		creatorShown = false;
	}
</script>

{#each items as section, index (section.meta.id)}
	<Section
		bind:section={items[index]}
		bind:recordsTranslations={data.recordsTranslations}
		bind:previewFamilies={data.previewFamilies}
	/>
{/each}

{#if creationForm}
	{#if creatorShown}
		<div class="section-editor-wrapper">
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
				<Translation key="page_actor.section.create" />
			</Typography>
		</button>
	{/if}
{/if}

<style>
	.section-editor-wrapper {
		max-width: var(--size-section-max-width);
	}
	.section-creation-button {
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
		padding: var(--size-l);
		gap: var(--size-m);
		padding-bottom: var(--size-4xl);
		/* color: var(--warm-300-transparent-500); */
		background: linear-gradient(to bottom, var(--warm-300-transparent-100), transparent);
		transition: all 400ms;
	}
	.section-creation-button:hover {
		/* color: var(--color-text); */
		background: linear-gradient(to bottom, var(--warm-300-transparent-200), transparent);
		transition: all 100ms;
	}
</style>
