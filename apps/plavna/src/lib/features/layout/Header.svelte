<script lang="ts">
	import { supportedLangs } from '@denlukia/plavna-common/constants';
	import { page } from '$app/stores';
	import type { User } from 'lucia';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Popup from '$lib/design/components/Popup/Popup.svelte';

	import { defaultLang, getLang } from '../i18n/utils';
	import AuthorBlock from './AuthorBlock.svelte';

	type Props = {
		actor: User | null;
	};

	let { actor }: Props = $props();

	function generateLangURL(currentURL: string, newLanguage: string): string {
		let destinationURL = currentURL.replace(`/${getLang($page.params.lang)}`, '');

		if (newLanguage !== defaultLang) {
			destinationURL = `/${newLanguage}${destinationURL}`;
		}
		if (destinationURL === '') return '/';

		return destinationURL;
	}
</script>

<header class="header">
	<Popup kind="list" position={{ x: 'left' }}>
		{#snippet label()}
			{getLang($page.params.lang).toUpperCase()}
		{/snippet}
		{#snippet content()}
			{#each supportedLangs as language}
				<Button
					href={generateLangURL($page.url.pathname, language)}
					kind={language === getLang($page.params.lang) ? 'primary' : 'secondary'}
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
		top: 0;
		right: 0;
		display: flex;
		align-items: flex-start;
		gap: var(--size-m);
		z-index: 1;

		animation: fly-in 800ms backwards cubic-bezier(0.19, 1, 0.22, 1);
	}
	@keyframes fly-in {
		0% {
			opacity: 0;
			transform: translate(0, 10px);
			filter: blur(6px);
		}
		100% {
			opacity: 1;
			transform: translate(0, 0);
			filter: blur(0);
		}
	}
</style>
