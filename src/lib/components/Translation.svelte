<script lang="ts">
	import { page } from '$app/stores';
	import SvelteMarkdown from 'svelte-markdown';

	import { type SupportedLang, defaultLang } from '$lib/isomorphic/languages';

	import type { TranslationSelect } from '$lib/server/domain/types';
	import type { TranslationKey } from '$lib/server/i18n/en';

	export let key: TranslationKey | TranslationSelect['_id'] | null = null;
	export let markdownMode: boolean = false;

	$: currentLang = ($page.params.lang || defaultLang) as SupportedLang;
	$: translation = key !== null ? $page.data.translations[key] : null;
</script>

{#if key}
	{#if typeof translation === 'string'}
		{#if markdownMode}
			<SvelteMarkdown source={translation} />
		{:else}
			{translation}
		{/if}
	{:else}
		<!-- If we're displaying translation that is form object right now -->
		{translation.data[currentLang]}
	{/if}
{:else}
	Translation error
{/if}
