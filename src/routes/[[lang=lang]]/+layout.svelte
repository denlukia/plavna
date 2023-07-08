<script lang="ts">
	import { page } from '$app/stores';

	import T from '$lib/components/Translation.svelte';
	import { defaultLang, supportedLanguages } from '$lib/isomorphic/languages.js';
	import { generatePath } from '$lib/isomorphic/url.js';

	function generateLangURL(currentURL: string, newLanguage: string): string {
		const currentLanguage = $page.params.lang || defaultLang;
		let destinationURL = currentURL.replace(`/${currentLanguage}`, '');

		if (newLanguage !== defaultLang) {
			destinationURL = `/${newLanguage}${destinationURL}`;
		}
		if (destinationURL === '') return '/';

		return destinationURL;
	}

	function generateCreateArticleURL(lang: string, username: string) {
		return generatePath('/[lang]/[username]/[draftId]/edit', {
			'[lang]': lang,
			'[username]': username,
			'[draftId]': (Math.random() + 1).toString(36).substring(7)
		});
	}

	export let data;
</script>

<header>
	{#each supportedLanguages as language}
		<a href={generateLangURL($page.url.pathname, language)}>
			{language.toUpperCase()}
		</a>{' '}
	{/each}
	{#if data.user}
		<a
			href={generateCreateArticleURL($page.params.lang, data.user.username)}
			data-sveltekit-preload-data="off"
			data-sveltekit-preload-code="hover"
		>
			Створити статтю
		</a>{/if}
</header>
<slot />
