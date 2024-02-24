<script lang="ts">
	import { page } from '$app/stores';

	import SvelteMarkdown from 'svelte-markdown';
	import Image from './markdown/Image.svelte';

	import type { TranslationSelect, TranslationUpdateZod } from '$lib/server/collections/types';
	import type { TranslationKey } from '$lib/server/i18n/en';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { SupportedLang } from '@denlukia/plavna-common/types';

	export let formObj: SuperValidated<TranslationUpdateZod> | null = null;
	export let key: TranslationKey | TranslationSelect['key'] | null = null;
	export let markdownMode: boolean = false;

	$: currentLang = $page.params.lang as SupportedLang;
	$: translation = key !== null ? $page.data.translations[key] : null;
</script>

{#if formObj}
	{formObj.data[currentLang]}
{:else if key}
	{#if translation}
		{#if markdownMode}
			<SvelteMarkdown source={translation} renderers={{ image: Image }} />
		{:else}
			{translation}
		{/if}
	{:else}
		No translation
	{/if}
{:else}
	Translation error
{/if}
