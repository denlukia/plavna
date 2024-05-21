<script lang="ts">
	import { page } from '$app/stores';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { HOST } from '$lib/collections/constants';
	import Button from '$lib/design/components/Button.svelte';
	import Link from '$lib/design/components/Link.svelte';
	import Popup from '$lib/design/components/Popup/Popup.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import PageEditor from '$lib/features/page/PageEditor.svelte';

	import { generatePath } from '../common/links';
	import { defaultLang } from '../i18n/utils';
	import type { PageDeletionForm, PageSelect, PageUpdateForm } from './parsers';

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
			'[slug]': slug ? `page-${slug}` : ''
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

<div class="page-item">
	<div class="info">
		<Typography size="headline-short">
			{#if slug}
				{slugToTitle(slug)}
			{:else}
				<Translation key="pages_list.main_page" />
			{/if}
		</Typography>
		<div class="link-wrapper">
			<Typography size="small-short">
				<Link href={link}>{HOST}{link}</Link>
			</Typography>
		</div>
	</div>

	<div class="actions">
		<Popup triggerType="button" bind:active>
			{#snippet label()}
				<Translation key="pages_list.edit_page" />
			{/snippet}
			{#snippet content()}
				<PageEditor formObj={editingForm} {onSuccessfullUpdate} />
			{/snippet}
		</Popup>
		<form class="deletion-form" method="POST" action="?/delete" use:enhance>
			<input type="hidden" name="id" value={$form.id} />
			<Button type="destructive"><Translation key="pages_list.delete_page" /></Button>
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
		width: calc(var(--size-cell-width) * 2 + var(--size-cell-gap));
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
