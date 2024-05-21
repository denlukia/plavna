<script lang="ts">
	import Button from '$lib/design/components/Button.svelte';
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
	<div class="section-creator">
		{#if creatorShown}
			<SectionEditor
				mainForm={creationForm}
				onCancel={closeCreator}
				onSuccessfullUpdate={closeCreator}
			/>
		{:else}
			<Button onclick={() => (creatorShown = true)}>
				<Translation key="page.section.create" />
			</Button>
		{/if}
	</div>
{/if}

<style>
	.section-creator {
		width: var(--size-section-width);
		max-width: var(--size-section-max-width);
	}
</style>
