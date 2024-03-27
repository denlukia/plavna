<script lang="ts">
	import { supportedLangs } from '@denlukia/plavna-common/constants';
	import { page } from '$app/stores';
	import type { User } from 'lucia';
	import Box from '$lib/design-system/components/Box.svelte';
	import Button from '$lib/design-system/components/Button.svelte';
	import Dropdown from '$lib/design-system/components/Dropdown.svelte';
	import { defaultLang } from '$lib/isomorphic/languages.js';
	import { generatePath } from '$lib/isomorphic/url.js';

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

	export let user: User | null;
</script>

<header>
	<Dropdown disclosure>
		{#snippet label()}
			{$page.params.lang.toUpperCase()}
		{/snippet}
		<Box>
			{#each supportedLangs as language}
				<Button href={generateLangURL($page.url.pathname, language)}>
					{language.toUpperCase()}
				</Button>
			{/each}
		</Box>
	</Dropdown>

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
		gap: var(--size-m);
	}
</style>
