<script lang="ts">
	import { page } from '$app/stores';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { SystemTranslationKey } from '$lib/i18n/types';
	import { getLang, getRecordTranslation, getSystemTranslation } from '$lib/i18n/utils';

	import BasicMarkdown from '../markdown/BasicMarkdown.svelte';
	import Markdown from '../markdown/Markdown.svelte';
	import type { TranslationSelect, TranslationUpdate } from './validators';

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
		markdown?: boolean | 'basic';
		markdownRemoveEmptyLinks?: boolean;
	} & (FormTranslation | RecordTranslation | SystemTranslation);

	let {
		superValidated,
		key,
		recordKey,
		markdown = false,
		markdownRemoveEmptyLinks = false
	}: Props = $props();

	let noTranslationText = $derived(
		getSystemTranslation('layout.no_translation', $page.data.systemTranslations) || '...'
	);

	function getTranslation() {
		if (superValidated) return superValidated.data[getLang($page.params.lang)];
		if (typeof key === 'string') return getSystemTranslation(key, $page.data.systemTranslations);
		if (typeof recordKey === 'number')
			return getRecordTranslation(recordKey, $page.data.recordsTranslationsState?.value);
	}

	let translation = $derived.by(getTranslation);

	let mdSource = $derived(finalizeSource(translation));

	function finalizeSource(source: string | null | undefined) {
		if (!source) return source;
		const emptyLinkRegex = /\[\]\((.*?)\)/g;
		const afterLinks = markdownRemoveEmptyLinks ? source.replace(emptyLinkRegex, '') : source;
		return afterLinks.trim();
	}
</script>

{#if (markdown && mdSource) || !markdown}
	{#if translation}
		{#if markdown === 'basic'}
			<BasicMarkdown source={translation} />
		{:else if markdown}
			<Markdown source={translation} />
		{:else}
			{@html translation}
		{/if}
	{:else}
		<span class="no-translation">{noTranslationText}</span>
	{/if}
{/if}

<style>
	.no-translation {
		opacity: 0.3;
	}
</style>
