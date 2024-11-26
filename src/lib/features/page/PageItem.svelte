<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_HOST } from '$env/static/public';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { PAGE_SLUG_PREFIX } from '$lib/collections/config';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Popup from '$lib/design/components/Popup/Popup.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import PageItemEditor from '$lib/features/page/PageItemEditor.svelte';

	import Card from '../common/components/Card.svelte';
	import { generatePath } from '../common/links';
	import type { PageDeletionForm, PageSelect, PageUpdateForm } from './validators';

	type Props = {
		pageItem: {
			id: PageSelect['id'];
			slug: PageSelect['slug'];
			editingForm: SuperValidated<PageUpdateForm>;
			deletionForm: SuperValidated<PageDeletionForm>;
		};
	};
	let { pageItem }: Props = $props();

	let { slug, editingForm, deletionForm } = $derived(pageItem);

	let { form, enhance } = superForm(deletionForm);

	let link = $derived(
		generatePath('/[lang]/[username]/[pageslug]', $page.params, {
			pageslug: slug ? `${PAGE_SLUG_PREFIX}${slug}` : ''
		})
	);

	let active = $state(false);

	function onSuccessfullUpdate() {
		active = false;
	}

	function slugToTitle(str: string) {
		const [first, ...rest] = str.split('');
		const joined = [first.toUpperCase(), ...rest].join('');
		return joined.replaceAll('-', ' ');
	}
</script>

<Card {link} linkText="{PUBLIC_HOST}{link}">
	{#snippet title()}
		{#if slug}
			{slugToTitle(slug)}
		{:else}
			<Translation key="pages_list.main_page" />
		{/if}
	{/snippet}
	{#snippet actions()}
		<form class="global-display-contents" method="POST" action="?/delete" use:enhance>
			<input type="hidden" name="id" value={$form.id} />
			<Button kind="destructive"><Translation key="pages_list.delete_page" /></Button>
		</form>
		<Popup triggerType="button" bind:active>
			{#snippet label()}
				<Translation key="pages_list.edit_page" />
			{/snippet}
			{#snippet content()}
				<PageItemEditor formObj={editingForm} {onSuccessfullUpdate} />
			{/snippet}
		</Popup>
	{/snippet}
</Card>
