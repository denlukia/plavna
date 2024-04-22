<script lang="ts">
	import Button from '$lib/design-system/components/Button.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import Section from '$lib/features/section/Section.svelte';
	import SectionEditor from '$lib/features/section/SectionEditor.svelte';

	let { data } = $props();

	let {
		sections: { items, creationForm }
	} = $derived(data);

	let creatorShown = $state(false);

	function oncancel() {
		creatorShown = false;
	}
</script>

{#each items as section (section.meta.id)}
	<Section {section} />
{/each}

{#if creationForm}
	{#if creatorShown}
		<SectionEditor form={creationForm} {oncancel} />
	{:else}
		<Button onclick={() => (creatorShown = true)}>
			<Translation key="page.section.create" />
		</Button>
	{/if}
{/if}
