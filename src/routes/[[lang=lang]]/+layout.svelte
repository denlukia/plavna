<script lang="ts">
	import { page } from '$app/stores';

	import { defaultLang } from '$lib/isomorphic/languages.js';
	import { generatePath } from '$lib/isomorphic/url.js';
	import { supportedLangs } from '@denlukia/plavna-common/constants';

	import '$lib/styles/index.css';

	// TODO: Dynamize based on server data
	import '$lib/design-system/themes/color/milk.css';
	import '$lib/design-system/themes/style/modern/index.css';
	import '$lib/design-system/themes/typography/plavna/index.css';

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
	{#each supportedLangs as language}
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

<style>
	:global(body) {
		--system-font-stack: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
			Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		font-family: var(--main-font-family, var(--system-font-stack));
		background-color: var(--color-body);
		color: var(--color-text);
	}
</style>
