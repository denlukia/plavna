<script lang="ts">
	import { page } from '$app/stores';

	import { type SupportedLang, defaultLang } from '$lib/isomorphic/languages';

	import type { TranslationSelect } from '$lib/server/domain/types';
	import type { TranslationKey } from '$lib/server/i18n/en';

	export let key: TranslationKey | TranslationSelect['_id'] | null = null;

	$: currentLang = ($page.params.lang || defaultLang) as SupportedLang;
</script>

{#if key}
	{#if typeof $page.data.translations[key] === 'string'}
		{$page.data.translations[key]}
	{:else}
		<!-- If we're displaying translation that is form object right now -->
		{$page.data.translations[key].data[currentLang]}
	{/if}
{:else}
	Translation error
{/if}
