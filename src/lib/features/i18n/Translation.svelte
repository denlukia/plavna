<script lang="ts">
	import type { SupportedLang } from '@denlukia/plavna-common/types';
	import { page } from '$app/stores';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { SystemTranslationKey } from '$lib/features/i18n/types';
	import { getLang, getRecordTranslation, getSystemTranslation } from '$lib/features/i18n/utils';

	import Markdown from '../markdown/Markdown.svelte';
	import type { TranslationSelect, TranslationUpdate } from './parsers';

	type FormTranslation = {
		superValidated: SuperValidated<Omit<TranslationUpdate, 'key'>> | undefined;
		recordKey?: null;
		key?: null;
	};
	type RecordTranslation = {
		recordKey: TranslationSelect['key'] | undefined;
		key?: null;
		superValidated?: null;
	};
	type SystemTranslation = {
		key: SystemTranslationKey | undefined;
		superValidated?: null;
		recordKey?: null;
	};
	type Props = {
		markdown?: boolean;
	} & (FormTranslation | RecordTranslation | SystemTranslation);

	let { superValidated, key, recordKey, markdown = false }: Props = $props();

	let noTranslationText = $derived(
		getSystemTranslation('layout.no_translation', $page.data.systemTranslations) || '...'
	);

	function getTranslation() {
		if (superValidated) return superValidated.data[getLang($page.params.lang)];
		if (typeof key === 'string') return getSystemTranslation(key, $page.data.systemTranslations);
		if (typeof recordKey === 'number')
			return getRecordTranslation(recordKey, $page.data.recordsTranslations);
	}

	// At new page loads translations for outroing page are erased
	// but are still needed while outroing transitons are played, so:

	// 1. We get the translation, whether present or null
	let translation = $derived.by(getTranslation);

	// 2. We create a state from that initial value...
	let nonUndefinedTranslation: typeof translation = $state(translation);

	// 3. ...and update it only when translation is not null
	$effect(() => {
		if (translation !== undefined) nonUndefinedTranslation = translation;
	});
</script>

<!-- TODO: add typography renderers for markdown  -->
{#if nonUndefinedTranslation}
	{#if markdown}
		<Markdown source={nonUndefinedTranslation} />
	{:else}
		{@html nonUndefinedTranslation}
	{/if}
{:else}
	<span class="no-translation">{noTranslationText}</span>
{/if}

<style>
	.no-translation {
		opacity: 0.4;
	}
</style>
