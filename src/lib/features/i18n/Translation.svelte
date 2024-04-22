<script lang="ts">
	import type { SupportedLang } from '@denlukia/plavna-common/types';
	import { page } from '$app/stores';
	import SvelteMarkdown from 'svelte-markdown';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { number } from 'zod';
	import type { SystemTranslationKey } from '$lib/features/i18n/types';
	import { getSystemTranslation } from '$lib/features/i18n/utils';

	import Image from '../article/markdown/Image.svelte';
	import type { TranslationSelect, TranslationUpdate } from './parsers';

	type FormTranslation = {
		formObj: SuperValidated<TranslationUpdate>;
		recordKey?: null;
		key?: null;
	};
	type RecordTranslation = {
		recordKey: TranslationSelect['key'];
		key?: null;
		formObj?: null;
	};
	type SystemTranslation = {
		key: SystemTranslationKey | undefined;
		formObj?: null;
		recordKey?: null;
	};
	type Props = {
		markdown?: boolean;
	} & (FormTranslation | RecordTranslation | SystemTranslation);

	let { formObj, key, recordKey, markdown = false }: Props = $props();

	function getTranslation() {
		if (formObj) return formObj.data[$page.params.lang as SupportedLang];
		if (typeof key === 'string') return getSystemTranslation(key, $page.data.systemTranslations);
		if (typeof recordKey === 'number') return $page.data.recordsTranslations?.[recordKey];
	}

	// At new page loads translations for outroing page are erased
	// but are still needed while outroing transitons are played, so:

	// 1. We get the translation, whether present or null
	let translation = $derived.by(getTranslation);

	// 2. We create a state from that initial value...
	let nonNullTranslation: typeof translation = $state(translation);

	// 3. ...and update it only when translation is not null
	$effect(() => {
		if (translation) nonNullTranslation = translation;
	});
</script>

<!-- TODO add typography renderers for markdown  -->
{#if nonNullTranslation}
	{#if markdown}
		<SvelteMarkdown source={nonNullTranslation} renderers={{ image: Image }} />
	{:else}
		{nonNullTranslation}
	{/if}
{:else}
	...
{/if}
