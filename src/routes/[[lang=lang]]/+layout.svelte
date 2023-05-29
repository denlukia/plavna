<script lang="ts">
	import { page } from '$app/stores';
	import { defaultLang, supportedLanguages } from '$lib/common/languages';
	import T from '$lib/components/T.svelte';

	function generateNewURL(currentURL: string, newLanguage: string): string {
		const currentLanguage = getCurrentLanguage(currentURL);
		let destinationURL = currentURL.replace(`/${currentLanguage}`, '');

		if (newLanguage !== defaultLang) {
			destinationURL = `/${newLanguage}${destinationURL}`;
		}
		if (destinationURL === '') return '/';

		return destinationURL;
	}

	function getCurrentLanguage(url: string): string {
		for (const language of supportedLanguages) {
			if (url.startsWith(`/${language}`)) {
				return language;
			}
		}
		return defaultLang;
	}
</script>

<header>
	<T key="language" />{':'}
	{#each supportedLanguages as language}
		<a href={generateNewURL($page.url.pathname, language)}>{language}</a>{' '}
	{/each}
</header>
<slot />
