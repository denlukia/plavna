<script lang="ts">
	import { page } from '$app/stores';

	import { type SupportedLang, defaultLang } from '$lib/common/languages';

	import type { TranslationKey } from '$lib/server/i18n/system-translations/en';

	export let key: TranslationKey | null = null;
	export let translation:
		| {
				[key in SupportedLang | '_id']: key extends '_id' ? number : string | null;
		  }
		| null = null;

	$: currentLang = ($page.params.lang || defaultLang) as SupportedLang;
</script>

{#if translation}
	{translation?.[currentLang]}
{:else if key}
	{$page.data.translations[key]}
{:else}
	Translation error
{/if}
