<script lang="ts">
	import { page } from '$app/stores';
	import type { User } from 'lucia';
	import Button from '$lib/design-system/components/Button.svelte';
	import Popup from '$lib/design-system/components/Popup/Popup.svelte';
	import { generatePath } from '$lib/features/common/links.js';
	import Translation from '$lib/features/i18n/Translation.svelte';

	type Props = {
		user: User;
	};

	let { user }: Props = $props();

	const pages = $derived([
		{
			routeId: '/[lang=lang]/[username]/pages',
			href: `/${$page.params.lang}/${user.username}/pages`,
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

<Popup>
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
			<Button {href} type={currentPage?.routeId === routeId ? 'primary' : 'secondary'}>
				<Translation key={translation} />
			</Button>
		{/each}
	{/snippet}
</Popup>

<Button
	type="prominent"
	href={generateCreateArticleURL($page.params.lang, user.username)}
	dataSvelteKitPreloadData="off"
>
	New article
</Button>
