<script lang="ts">
	import { supportedLangs } from '@denlukia/plavna-common/constants';
	import { page } from '$app/stores';
	import type { User } from 'lucia';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Popup from '$lib/design/components/Popup/Popup.svelte';

	import { defaultLang } from '../i18n/utils';
	import AuthorBlock from './AuthorBlock.svelte';

	type Props = {
		actor: User | null;
	};

	let { actor }: Props = $props();

	function generateLangURL(currentURL: string, newLanguage: string): string {
		let destinationURL = currentURL.replace(`/${$page.params.lang}`, '');

		if (newLanguage !== defaultLang) {
			destinationURL = `/${newLanguage}${destinationURL}`;
		}
		if (destinationURL === '') return '/';

		return destinationURL;
	}
</script>

<header>
	<Popup list>
		{#snippet label()}
			{$page.params.lang.toUpperCase()}
		{/snippet}
		{#snippet content()}
			{#each supportedLangs as language}
				<Button
					href={generateLangURL($page.url.pathname, language)}
					kind={language === $page.params.lang ? 'primary' : 'secondary'}
				>
					{language.toUpperCase()}
				</Button>
			{/each}
		{/snippet}
	</Popup>

	{#if actor}
		<AuthorBlock {actor} />
	{/if}
</header>

<style>
	header {
		position: absolute;
		right: 0;
		display: flex;
		align-items: flex-start;
		gap: var(--size-m);
		z-index: 1;
	}
</style>
