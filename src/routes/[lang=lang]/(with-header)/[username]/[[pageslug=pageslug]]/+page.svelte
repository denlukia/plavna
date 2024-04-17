<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/design-system/components/Button.svelte';
	import Section from '$lib/features/section/Section.svelte';
	import SectionCreator from '$lib/features/section/SectionCreator.svelte';

	let { data } = $props();

	let {
		sections: { items, creationForm }
	} = data;

	let creatorShown = $state(false);
</script>

{#each items as section}
	<Section {section} />
{/each}

{#if $page.data.user && $page.data.user.username === $page.params.username}
	{#if creatorShown}
		<SectionCreator {creationForm} oncancel={() => (creatorShown = false)} />
	{:else}
		<Button onclick={() => (creatorShown = true)}>Create new section</Button>
	{/if}
{/if}
