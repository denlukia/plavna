<script lang="ts">
	import type { SupportedLang } from '@denlukia/plavna-common/types';
	import { page } from '$app/stores';
	import SvelteMarkdown from 'svelte-markdown';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { TranslationSelect, TranslationUpdate } from '$lib/server/collections/types';
	import type { TranslationKey } from '$lib/server/i18n/en';

	import Image from './markdown/Image.svelte';

	type Props = {
		formObj?: SuperValidated<TranslationUpdate> | null;
		key?: TranslationKey | TranslationSelect['key'] | null;
		markdownMode?: boolean;
	};

	let { formObj = null, key = null, markdownMode = false }: Props = $props();

	// At new page loads translations for outroing page are erased
	// but are still needed while outroing transitons are played, so:
	// 1. We get the translation, wether present or null
	let translation = $derived(key !== null ? $page.data.translations?.[key] : null);
	// 2. We create a state that is updated only when translation is not null
	let nonNullTranslation: typeof translation = $state(translation);
	$effect(() => {
		if (translation) nonNullTranslation = translation;
	});
</script>

{#if formObj}
	{formObj.data[$page.params.lang as SupportedLang]}
{:else if key}
	{#if nonNullTranslation}
		{#if markdownMode}
			<SvelteMarkdown source={nonNullTranslation} renderers={{ image: Image }} />
		{:else}
			{nonNullTranslation}
		{/if}
	{:else}
		...
	{/if}
{/if}
