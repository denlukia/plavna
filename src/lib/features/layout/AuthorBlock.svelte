<script lang="ts">
	import { page } from '$app/stores';
	import type { User } from 'lucia';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Popup from '$lib/design/components/Popup/Popup.svelte';
	import { generatePath } from '$lib/features/common/links.js';
	import Translation from '$lib/features/i18n/Translation.svelte';

	type Props = {
		actor: User;
	};

	let { actor }: Props = $props();

	const pages = $derived([
		{
			routeId: '/[lang=lang]/[username]/articles',
			href: `/${$page.params.lang}/${actor.username}/articles`,
			translation: 'layout.my_items.articles'
		} as const,
		{
			routeId: '/[lang=lang]/[username]/pages',
			href: `/${$page.params.lang}/${actor.username}/pages`,
			translation: 'layout.my_items.pages'
		} as const
	]);

	let currentPageRouteId = $derived($page.route.id);
	let currentPage = $derived(pages.find((page) => currentPageRouteId === page.routeId));
</script>

<Popup kind="list">
	{#snippet label()}
		<span class="label-wrapper">
			<Translation key="layout.my" />
		</span>
	{/snippet}
	{#snippet content()}
		{#each pages as { href, translation, routeId }}
			<Button {href} kind={currentPage?.routeId === routeId ? 'primary' : 'secondary'}>
				<Translation key={translation} />
			</Button>
		{/each}
	{/snippet}
</Popup>

<Button
	kind="prominent"
	href={generatePath('/[lang]/[username]/new', $page.params, { username: actor.username })}
	dataSvelteKitPreloadData="off"
>
	New article
</Button>
