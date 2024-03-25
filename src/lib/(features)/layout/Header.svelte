<script lang="ts">
	import { supportedLangs } from '@denlukia/plavna-common/constants';
	import { page } from '$app/stores';
	import type { User } from 'lucia';
	import Button from '$lib/design-system/components/Button.svelte';
	import { defaultLang } from '$lib/isomorphic/languages.js';
	import { generatePath } from '$lib/isomorphic/url.js';

	function generateLangURL(currentURL: string, newLanguage: string): string {
		const currentLanguage = $page.params.lang;
		let destinationURL = currentURL.replace(`/${currentLanguage}`, '');

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
	{#each supportedLangs as language}
		<a href={generateLangURL($page.url.pathname, language)}>
			{language.toUpperCase()}
		</a>{' '}
	{/each}
	{#if user}
		<Button
			href={generateCreateArticleURL($page.params.lang, user.username)}
			dataSvelteKitPreloadData="off"
		>
			Create article
		</Button>
	{/if}
</header>

<style>
	header {
		position: absolute;
		right: 0;
	}
</style>
