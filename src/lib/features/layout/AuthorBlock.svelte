<script lang="ts">
	import { page } from '$app/stores';
	import type { User } from 'lucia';
	import Button from '$lib/design/components/Button.svelte';
	import Popup from '$lib/design/components/Popup/Popup.svelte';
	import { generatePath } from '$lib/features/common/links.js';
	import Translation from '$lib/features/i18n/Translation.svelte';

	type Props = {
		actor: User;
	};

	let { actor }: Props = $props();

	const pages = $derived([
		{
			routeId: '/[lang=lang]/[username]/pages',
			href: `/${$page.params.lang}/${actor.username}/pages`,
			translation: 'layout.my_pages'
		} as const
	]);

	const currentPage = $derived(pages.find((page) => $page.route.id === page.routeId));

	function generateCreateArticleURL(lang: string, username: string) {
		return generatePath('/[lang]/[username]/new', {
			'[lang]': lang,
			'[username]': username
		});
	}
</script>

<Popup list>
	{#snippet label()}
		<span class="label-wrapper">
			{#if currentPage}
				<Translation key={currentPage.translation} />
			{:else}
				<Translation key="layout.my" />
			{/if}
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
	href={generateCreateArticleURL($page.params.lang, actor.username)}
	dataSvelteKitPreloadData="off"
>
	New article
</Button>
