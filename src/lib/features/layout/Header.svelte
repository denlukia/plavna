<script lang="ts">
	import { supportedLangs } from '@denlukia/plavna-common/constants';
	import { page } from '$app/stores';
	import type { User } from 'lucia';
	import Button from '$lib/design-system/components/Button.svelte';
	import Box from '$lib/design-system/components/Dropdownable/Box.svelte';
	import Popup from '$lib/design-system/components/Dropdownable/Popup.svelte';
	import { generatePath } from '$lib/features/common/links.js';
	import Translation from '$lib/features/i18n/Translation.svelte';

	import { defaultLang } from '../i18n/utils';

	type Props = {
		user: User | null;
	};

	let { user }: Props = $props();

	const pages = $derived([
		{
			routeId: '/[lang=lang]/(with-header)/[username]/pages',
			href: `/${$page.params.lang}/${$page.params.username}/pages`,
			translation: 'layout.my_pages'
		} as const
	]);

	const currentPage = $derived(pages.find((page) => $page.route.id === page.routeId));

	function generateLangURL(currentURL: string, newLanguage: string): string {
		let destinationURL = currentURL.replace(`/${$page.params.lang}`, '');

		if (newLanguage !== defaultLang) {
			destinationURL = `/${newLanguage}${destinationURL}`;
		}
		if (destinationURL === '') return '/';

		return destinationURL;
	}

	function generateCreateArticleURL(lang: string, username: string) {
		return generatePath('/[lang]/[username]/create-article', {
			'[lang]': lang,
			'[username]': username
		});
	}
</script>

<header>
	{#if user}
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
	{/if}

	<Popup>
		{#snippet label()}
			{$page.params.lang.toUpperCase()}
		{/snippet}
		{#snippet content()}
			{#each supportedLangs as language}
				<Button
					href={generateLangURL($page.url.pathname, language)}
					type={language === $page.params.lang ? 'primary' : 'secondary'}
				>
					{language.toUpperCase()}
				</Button>
			{/each}
		{/snippet}
	</Popup>

	{#if user}
		<Button
			type="prominent"
			href={generateCreateArticleURL($page.params.lang, user.username)}
			dataSvelteKitPreloadData="off"
		>
			New article
		</Button>
	{/if}
</header>

<style>
	header {
		position: absolute;
		right: 0;
		display: flex;
		align-items: flex-start;
		gap: var(--size-m);
	}
</style>
