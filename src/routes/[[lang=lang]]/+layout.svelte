<script lang="ts">
	import { page } from '$app/stores';
	import { defaultLang, supportedLanguages } from '$lib/common/languages';
	import T from '$lib/components/T.svelte';

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
		const draftId = (Math.random() + 1).toString(36).substring(7);
		let template = `/lang/username/draft-${draftId}/edit`;
		template = template.replace('lang', lang || '');
		template = template.replace('username', username || '');
		template = template.replace('//', '/');
		return template;
	}
</script>

<header>
	<T key="language" />{':'}
	{#each supportedLanguages as language}
		<a href={generateLangURL($page.url.pathname, language)}>{language}</a>{' '}
	{/each}
	<a href={generateCreateArticleURL($page.params.lang, $page.data.user.username)}>
		Створити статтю
	</a>
</header>
<slot />
