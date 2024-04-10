<script lang="ts">
	import { page } from '$app/stores';
	import { fly, slide } from 'svelte/transition';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import PageEditor from '$lib/(features)/pages-list/PageEditor.svelte';
	import Link from '$lib/components/Link.svelte';
	import Translation from '$lib/components/Translation.svelte';
	import Button from '$lib/design-system/components/Button.svelte';
	import Popup from '$lib/design-system/components/Dropdownable/Popup.svelte';
	import Typography from '$lib/design-system/components/Typography.svelte';
	import { defaultLang } from '$lib/isomorphic/languages';
	import type { PageDeletionForm, PageSelect, PageUpdateForm } from '$lib/server/collections/types';

	import { HOST } from '../common/constants';
	import { generatePath } from '../common/links';

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
		generatePath(`/[lang]/[username]/[slug]`, {
			'[lang]': $page.params.lang === defaultLang ? '' : $page.params.lang,
			'[username]': $page.params.username,
			'[slug]': slug
		})
	);

	let opened = $state(false);

	function onSuccessfullUpdate() {
		opened = false;
	}

	function slugToTitle(str: string) {
		const [first, ...rest] = str.split('');
		const joined = [first.toUpperCase(), ...rest].join('');
		return joined.replaceAll('-', ' ');
	}
</script>

<div class="page-item">
	<div class="info">
		<Typography size="headline-short">
			{#if slug}
				{slugToTitle(slug)}
			{:else}
				<Translation key="user_pages.main_page" />
			{/if}
		</Typography>
		<div class="link-wrapper">
			<Typography size="small-short">
				<Link href={link}>{HOST}{link}</Link>
			</Typography>
		</div>
	</div>

	<div class="actions">
		<Popup triggerType="button" bind:opened>
			{#snippet label()}
				<Translation key="user_pages.edit_page" />
			{/snippet}
			{#snippet content()}
				<PageEditor formObj={editingForm} {onSuccessfullUpdate} />
			{/snippet}
		</Popup>
		<form class="deletion-form" method="POST" action="?/delete" use:enhance>
			<input type="hidden" name="id" value={$form.id} />
			<Button type="destructive"><Translation key="user_pages.delete_page" /></Button>
		</form>
	</div>
</div>

<style>
	.page-item {
		display: flex;
		align-items: center;
		padding-inline: var(--size-l);
		padding-block-start: var(--size-m);
		padding-block-end: var(--size-m);
		background-color: var(--color-input-bg);
		border-radius: var(--size-m-to-l);
		width: calc(var(--size-column-width) * 2 + var(--size-column-gap));
	}

	.info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	.actions {
		display: flex;
		align-items: center;
		gap: var(--size-s);
	}
	.deletion-form {
		display: contents;
	}
	.link-wrapper {
		margin-top: calc(-1 * var(--size-m));
	}
</style>
