<script lang="ts">
	import { page } from '$app/stores';
	import SvelteMarkdown from 'svelte-markdown';

	import { type SupportedLang, defaultLang } from '$lib/isomorphic/languages';

	import type { TranslationSelect, TranslationUpdateZod } from '$lib/server/collections/types';
	import type { TranslationKey } from '$lib/server/i18n/en';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let formObj: SuperValidated<TranslationUpdateZod> | null = null;
	export let key: TranslationKey | TranslationSelect['key'] | null = null;
	export let markdownMode: boolean = false;

	$: currentLang = ($page.params.lang || defaultLang) as SupportedLang;
	$: translation = key !== null ? $page.data.translations[key] : null;
</script>

{#if formObj}
	{formObj.data[currentLang]}
{:else if key}
	{#if markdownMode && translation}
		<SvelteMarkdown source={translation} />
	{:else}
		No translation
	{/if}
{:else}
	Translation error
{/if}
