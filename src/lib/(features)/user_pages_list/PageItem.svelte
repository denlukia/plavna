<script lang="ts">
	import { page } from '$app/stores';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import PageEditForm from '$lib/(features)/user_pages_list/PageEditor.svelte';
	import Link from '$lib/components/Link.svelte';
	import Translation from '$lib/components/Translation.svelte';
	import Popup from '$lib/design-system/components/Dropdownable/Popup.svelte';
	import Typography from '$lib/design-system/components/Typography.svelte';
	import type { PageCreateForm, PageUpdateForm } from '$lib/server/collections/types';

	import { BASE_URL } from '../common/constants';
	import { generatePath } from '../common/links';

	type Props = {
		formObj: SuperValidated<PageCreateForm> | SuperValidated<PageUpdateForm>;
	};

	let { formObj }: Props = $props();

	let superFormObj = superForm(formObj);

	let { form } = superFormObj;

	let link = $derived(
		generatePath(`/[lang]/[username]/[slug]`, {
			'[lang]': $page.params.lang,
			'[username]': $page.params.username,
			'[slug]': $form.slug
		})
	);
</script>

<div class="page-item">
	<div class="leading">
		<Typography size="headline-short">
			{#if $form.slug}
				{$form.slug}
			{:else}
				<Translation key="main_page" />
			{/if}
		</Typography>
		<div class="link-wrapper">
			<Typography size="small-short">
				<Link href={link}>{BASE_URL}{link}</Link>
			</Typography>
		</div>
	</div>

	<Popup triggerType="button">
		{#snippet label()}
			<Translation key="edit_slug" />
		{/snippet}
		{#snippet content()}
			<PageEditForm {superFormObj} />
		{/snippet}
	</Popup>
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

	.leading {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	.link-wrapper {
		margin-top: calc(-1 * var(--size-m));
	}
</style>
