<script lang="ts">
	import { page } from '$app/stores';

	import { generatePath } from '$lib/isomorphic/url.js';
	import { supportedLangs } from '@denlukia/plavna-common/constants';

	import '$lib/styles/index.css';

	// TODO: Dynamize based on server data
	import '$lib/design-system/themes/color/milk.css';
	import '$lib/design-system/themes/style/modern/index.css';
	import '$lib/design-system/themes/typography/plavna/index.css';
	import { defaultLang } from '$lib/isomorphic/languages.js';
	import Layers from '$lib/design-system/components/Layers/Layers.svelte';

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

	export let data;
</script>

<Layers tag="div" --layers-flex-grow="1">
	<div class="bg" />
	<div class="fg">
		<div class="main-layout">
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
					</a>
				{/if}
			</header>
			<slot />
		</div>
	</div>
</Layers>

<style>
	.fg {
		display: flex;
		justify-content: center;
	}
	.main-layout {
		flex-grow: 1;
		max-width: var(--size-main-layout-max-width);
		background-color: var(--color-main-layout-bg);
		padding-inline: var(--size-main-layout-padding-inline);
	}
</style>
